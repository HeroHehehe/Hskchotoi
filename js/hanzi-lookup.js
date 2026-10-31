/**
 * MODULE TRA TỪ CHỮ HÁN THÔNG MINH (HOVER DWELL & TOUCH LOOKUP)
 * Tính năng theo yêu cầu:
 *  - Di chuyển chuột vào chữ Hán -> Highlight sáng ngay lập tức
 *  - Giữ chuột khoảng 1 giây -> Hiện Tooltip nghĩa tiếng Việt & Pinyin ngay trên đầu chữ
 *  - Trên iPad / Màn hình cảm ứng -> Chạm (tap) vào chữ sẽ hiện ngay Tooltip
 *  - Tích hợp phát âm từ vựng (TTS)
 */

window.HanziLookup = {
  hoverTimer: null,
  hideTimer: null,
  currentTarget: null,
  tooltipEl: null,
  isTouch: false,
  sortedDictKeys: [],

  init() {
    this.createTooltipElement();
    this.prepareSortedKeys();
    this.bindGlobalEvents();
    this.initObserver();
    this.processAllHanziContainers();
  },

  /**
   * Chuẩn bị danh sách từ khóa sắp xếp theo độ dài giảm dần (để khớp từ ghép trước từ đơn)
   */
  prepareSortedKeys() {
    if (!window.HANZI_HOVER_DICT) return;
    this.sortedDictKeys = Object.keys(window.HANZI_HOVER_DICT).sort((a, b) => b.length - a.length);
  },

  /**
   * Tạo phần tử Tooltip nổi trên giao diện
   */
  createTooltipElement() {
    if (document.getElementById('hanzi-lookup-tooltip')) {
      this.tooltipEl = document.getElementById('hanzi-lookup-tooltip');
      return;
    }

    const tip = document.createElement('div');
    tip.id = 'hanzi-lookup-tooltip';
    tip.className = 'fixed z-[999999] pointer-events-auto bg-slate-950/95 border-2 border-cyan-400 shadow-2xl shadow-cyan-950/80 backdrop-blur-md rounded-2xl p-3 max-w-[280px] sm:max-w-[320px] text-left transition-all duration-200 hidden opacity-0 scale-95';
    tip.innerHTML = `
      <div class="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-1.5 mb-1.5">
        <div class="flex items-baseline gap-2">
          <span id="hz-tip-hanzi" class="text-2xl font-black text-cyan-300 font-kaiti tracking-wide"></span>
          <span id="hz-tip-pinyin" class="text-xs font-bold text-cyan-400 font-mono"></span>
        </div>
        <div class="flex items-center gap-1">
          <button id="hz-tip-audio-btn" type="button" class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all text-xs" title="Phát âm từ này">
            🔊
          </button>
          <button id="hz-tip-close-btn" type="button" class="w-6 h-6 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-all text-xs" title="Đóng">
            ✕
          </button>
        </div>
      </div>
      <div class="space-y-1">
        <p id="hz-tip-meaning" class="text-xs text-slate-200 font-semibold leading-relaxed"></p>
        <div id="hz-tip-type-badge" class="inline-block text-[9px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-700/60 px-1.5 py-0.2 rounded mt-0.5"></div>
      </div>
    `;

    document.body.appendChild(tip);
    this.tooltipEl = tip;

    // Bắt sự kiện nút phát âm & đóng
    const audioBtn = tip.querySelector('#hz-tip-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hz = tip.getAttribute('data-active-hz');
        if (hz && typeof speakChineseText === 'function') {
          speakChineseText(hz);
        }
      });
    }

    const closeBtn = tip.querySelector('#hz-tip-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideTooltip();
      });
    }

    // Giữ tooltip khi chuột hover vào chính tooltip
    tip.addEventListener('mouseenter', () => {
      clearTimeout(this.hideTimer);
    });
    tip.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  },

  /**
   * Phân tích câu tiếng Trung thành các thẻ <span class="hz-interactive"> có thể tra cứu
   */
  wrapText(text) {
    if (!text || typeof text !== 'string') return text;
    if (!this.sortedDictKeys || !this.sortedDictKeys.length) this.prepareSortedKeys();

    const dict = window.HANZI_HOVER_DICT || {};
    let result = '';
    let i = 0;
    const len = text.length;

    while (i < len) {
      let matched = false;

      // Tìm từ ghép dài nhất khớp từ vị trí i
      for (let k = 0; k < this.sortedDictKeys.length; k++) {
        const word = this.sortedDictKeys[k];
        if (text.startsWith(word, i)) {
          const info = dict[word];
          const py = (info && info.py) ? info.py.replace(/"/g, '&quot;') : '';
          const vi = (info && info.vi) ? info.vi.replace(/"/g, '&quot;') : '';
          const type = (info && info.type) ? info.type.replace(/"/g, '&quot;') : '';

          result += `<span class="hz-interactive" data-hz="${word}" data-py="${py}" data-vi="${vi}" data-type="${type}">${word}</span>`;
          i += word.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        const ch = text[i];
        // Nếu là chữ Hán đơn chưa có trong danh sách từ ghép
        if (ch >= '\u4e00' && ch <= '\u9fff') {
          const info = dict[ch] || {};
          const py = info.py || (window.PINYIN_MAP ? window.PINYIN_MAP[ch] : '') || '';
          const vi = info.vi || 'Từ tiếng Trung HSK 1';
          const type = info.type || '';
          result += `<span class="hz-interactive" data-hz="${ch}" data-py="${py}" data-vi="${vi}" data-type="${type}">${ch}</span>`;
        } else {
          result += ch;
        }
        i++;
      }
    }

    return result;
  },

  /**
   * Xử lý quét và đóng gói các phần tử chứa chữ Hán trên trang
   */
  processAllHanziContainers() {
    // 1. Toàn văn bài nói hoàn chỉnh
    const fullSpeechEl = document.getElementById('full-speech-hanzi');
    if (fullSpeechEl && !fullSpeechEl.hasAttribute('data-hz-processed')) {
      fullSpeechEl.innerHTML = this.wrapText(fullSpeechEl.textContent);
      fullSpeechEl.setAttribute('data-hz-processed', 'true');
    }

    // 2. Từng câu trong bài nói
    const speechSentences = document.querySelectorAll('.family-speech-hanzi, [id^="family-sent-card-"] p.font-kaiti');
    speechSentences.forEach(el => {
      if (!el.hasAttribute('data-hz-processed') && !el.querySelector('.hz-interactive')) {
        el.innerHTML = this.wrapText(el.textContent);
        el.setAttribute('data-hz-processed', 'true');
      }
    });

    // 3. Toàn bộ các dòng bài khoá hội thoại
    const dialogueLines = document.querySelectorAll('.dialogue-line-hanzi');
    dialogueLines.forEach(el => {
      if (!el.hasAttribute('data-hz-processed') && !el.querySelector('.hz-interactive')) {
        el.innerHTML = this.wrapText(el.textContent);
        el.setAttribute('data-hz-processed', 'true');
      }
    });
  },

  /**
   * Lắng nghe biến động DOM (khi mở modal hoặc chuyển tab hội thoại mới)
   */
  initObserver() {
    const observer = new MutationObserver(() => {
      this.processAllHanziContainers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  /**
   * Gắn sự kiện toàn cục: Di chuột & Chạm cảm ứng iPad
   */
  bindGlobalEvents() {
    // Phát hiện thiết bị cảm ứng
    window.addEventListener('touchstart', () => {
      this.isTouch = true;
    }, { passive: true });

    // 1. HOVER MOUSE EVENTS (Khi rê chuột)
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('.hz-interactive');
      if (!target) return;

      // Highlight ngay lập tức khi chuột vừa chạm vào chữ Hán
      this.highlightElement(target);

      // Đặt hẹn giờ khoảng 1 giây (900ms) để mở Tooltip nghĩa tiếng Việt
      clearTimeout(this.hoverTimer);
      this.currentTarget = target;

      this.hoverTimer = setTimeout(() => {
        if (this.currentTarget === target) {
          this.showTooltip(target);
        }
      }, 900);
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('.hz-interactive');
      if (!target) return;

      clearTimeout(this.hoverTimer);
      this.unhighlightElement(target);

      // Cho một khoảng trễ ngắn để chuột có thể di chuyển vào tooltip mà không bị tắt
      this.hideTimer = setTimeout(() => {
        if (!this.tooltipEl || !this.tooltipEl.matches(':hover')) {
          this.hideTooltip();
        }
      }, 250);
    });

    // 2. TOUCH / IPAD EVENTS (Khi chạm cảm ứng)
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.hz-interactive');
      if (target) {
        // Trên iPad / cảm ứng hoặc click chuột trực tiếp: Hiển thị ngay tooltip không cần chờ 1s!
        clearTimeout(this.hoverTimer);
        this.highlightElement(target);
        this.showTooltip(target);
        return;
      }

      // Nếu bấm ra ngoài vùng chữ và ngoài tooltip -> Đóng tooltip
      if (this.tooltipEl && !this.tooltipEl.contains(e.target)) {
        this.hideTooltip();
      }
    });

    // Cuộn trang hoặc đổi kích thước -> Cập nhật hoặc ẩn tooltip
    window.addEventListener('scroll', () => {
      if (this.tooltipEl && !this.tooltipEl.classList.contains('hidden')) {
        this.repositionTooltip();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.hideTooltip();
    });
  },

  /**
   * Làm nổi bật (Highlight) chữ Hán ngay lập tức
   */
  highlightElement(el) {
    document.querySelectorAll('.hz-interactive.hz-active').forEach(item => {
      if (item !== el) item.classList.remove('hz-active');
    });
    el.classList.add('hz-active');
  },

  unhighlightElement(el) {
    if (this.currentTarget !== el || !this.tooltipEl || this.tooltipEl.classList.contains('hidden')) {
      el.classList.remove('hz-active');
    }
  },

  /**
   * Hiển thị Tooltip tra từ ngay phía trên chữ Hán
   */
  showTooltip(target) {
    if (!this.tooltipEl) this.createTooltipElement();

    const hz = target.getAttribute('data-hz') || target.textContent.trim();
    const py = target.getAttribute('data-py') || '';
    const vi = target.getAttribute('data-vi') || '';
    const type = target.getAttribute('data-type') || '';

    // Cập nhật nội dung Tooltip
    const hzEl = this.tooltipEl.querySelector('#hz-tip-hanzi');
    const pyEl = this.tooltipEl.querySelector('#hz-tip-pinyin');
    const viEl = this.tooltipEl.querySelector('#hz-tip-meaning');
    const typeEl = this.tooltipEl.querySelector('#hz-tip-type-badge');

    if (hzEl) hzEl.textContent = hz;
    if (pyEl) pyEl.textContent = py;
    if (viEl) viEl.textContent = vi || 'Chữ Hán HSK 1';
    if (typeEl) {
      if (type) {
        typeEl.textContent = type;
        typeEl.classList.remove('hidden');
      } else {
        typeEl.classList.add('hidden');
      }
    }

    this.tooltipEl.setAttribute('data-active-hz', hz);
    this.currentTarget = target;

    // Định vị trí Tooltip trên đầu chữ Hán
    this.repositionTooltip();

    // Hiệu ứng hiện
    this.tooltipEl.classList.remove('hidden');
    requestAnimationFrame(() => {
      this.tooltipEl.classList.remove('opacity-0', 'scale-95');
      this.tooltipEl.classList.add('opacity-100', 'scale-100');
    });
  },

  /**
   * Tính toán vị trí hiển thị chuẩn xác phía trên chữ Hán
   */
  repositionTooltip() {
    if (!this.currentTarget || !this.tooltipEl) return;

    const rect = this.currentTarget.getBoundingClientRect();
    const tipRect = this.tooltipEl.getBoundingClientRect();

    const tipWidth = tipRect.width || 240;
    const tipHeight = tipRect.height || 100;

    // Canh giữa theo chiều ngang của từ
    let left = rect.left + (rect.width / 2) - (tipWidth / 2);

    // Không để tràn ra ngoài viền trái/phải màn hình
    const margin = 12;
    if (left < margin) left = margin;
    if (left + tipWidth > window.innerWidth - margin) {
      left = window.innerWidth - margin - tipWidth;
    }

    // Canh phía trên từ chữ Hán (khoảng cách 10px)
    let top = rect.top - tipHeight - 10;
    let flipBottom = false;

    // Nếu sát mép trên màn hình (< 10px), tự động lật xuống phía dưới chữ
    if (top < 10) {
      top = rect.bottom + 10;
      flipBottom = true;
    }

    this.tooltipEl.style.left = `${Math.round(left)}px`;
    this.tooltipEl.style.top = `${Math.round(top)}px`;

    if (flipBottom) {
      this.tooltipEl.classList.add('flip-bottom');
    } else {
      this.tooltipEl.classList.remove('flip-bottom');
    }
  },

  /**
   * Đóng Tooltip
   */
  hideTooltip() {
    clearTimeout(this.hoverTimer);
    clearTimeout(this.hideTimer);

    if (this.tooltipEl) {
      this.tooltipEl.classList.remove('opacity-100', 'scale-100');
      this.tooltipEl.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        if (this.tooltipEl.classList.contains('opacity-0')) {
          this.tooltipEl.classList.add('hidden');
        }
      }, 180);
    }

    if (this.currentTarget) {
      this.currentTarget.classList.remove('hz-active');
      this.currentTarget = null;
    }
  }
};

// Khởi chạy khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.HanziLookup.init());
} else {
  window.HanziLookup.init();
}
