/**
 * Ứng dụng Học Từ Vựng Tiếng Trung HSK 3.0 Cá Nhân
 * Quản lý 30 Bài Học, Chuyển Bài Học, Phát Âm & Tiến Độ Học Tập
 */

let currentLessonId = 1;
let currentMainView = 'vocab'; // 'vocab' | 'dialogue'
let learnedWords = new Set();
let favoriteWords = new Set();
let isPlayingAll = false;
let playAllIndex = 0;
let playAllTimeout = null;

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  initLessonDropdown();
  switchLesson(currentLessonId || 1);
  initSearch();
  initVoiceVoices();
  if (typeof initDialogueModule === 'function') {
    initDialogueModule();
  }
});

/**
 * Tải trạng thái từ LocalStorage
 */
function loadSavedState() {
  try {
    const savedLearned = localStorage.getItem('hihsk_learned_words');
    if (savedLearned) learnedWords = new Set(JSON.parse(savedLearned));

    const savedFavs = localStorage.getItem('hihsk_favorite_words');
    if (savedFavs) favoriteWords = new Set(JSON.parse(savedFavs));

    const savedLesson = localStorage.getItem('hihsk_current_lesson');
    if (savedLesson) currentLessonId = parseInt(savedLesson);
  } catch (e) {
    console.warn("LocalStorage error:", e);
  }
}

/**
 * Lưu trạng thái vào LocalStorage
 */
function saveState() {
  try {
    localStorage.setItem('hihsk_learned_words', JSON.stringify(Array.from(learnedWords)));
    localStorage.setItem('hihsk_favorite_words', JSON.stringify(Array.from(favoriteWords)));
    localStorage.setItem('hihsk_current_lesson', currentLessonId.toString());
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }
}

/**
 * Lấy danh sách từ vựng của bài học hiện tại (10 từ mỗi bài)
 */
function getCurrentLessonWords() {
  return window.VOCAB_DATABASE.filter(w => w.lesson_id === currentLessonId);
}
window.getCurrentLessonWords = getCurrentLessonWords;

/**
 * Khởi tạo Dropdown danh sách 30 bài học
 */
function initLessonDropdown() {
  const select = document.getElementById('lesson-select');
  if (!select) return;
  select.innerHTML = '';

  window.HSK_LESSONS.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.lesson_no;
    opt.textContent = `Bài ${l.lesson_no}: ${l.title} (${l.title_vi})`;
    select.appendChild(opt);
  });

  select.value = currentLessonId;
  select.addEventListener('change', (e) => {
    switchLesson(parseInt(e.target.value));
  });
}

/**
 * Chuyển bài học (Từ Bài 1 tới Bài 30)
 * @param {number} lessonNo Số thứ tự bài học
 */
function switchLesson(lessonNo) {
  if (lessonNo < 1 || lessonNo > window.HSK_LESSONS.length) return;

  currentLessonId = lessonNo;
  saveState();

  const lessonInfo = window.HSK_LESSONS.find(l => l.lesson_no === currentLessonId) || {
    lesson_no: currentLessonId,
    title: `Bài ${currentLessonId}`,
    title_vi: `Bài ${currentLessonId}`
  };

  // Cập nhật UI Dropdown & Tiêu đề
  const select = document.getElementById('lesson-select');
  if (select) select.value = currentLessonId;

  // Cập nhật Header bài học
  const headerTitle = document.getElementById('lesson-header-title');
  if (headerTitle) {
    headerTitle.innerHTML = `<span class="text-blue-400 font-bold">Bài ${currentLessonId}:</span> ${lessonInfo.title} <span class="text-slate-400 font-normal text-sm">(${lessonInfo.title_vi})</span>`;
  }

  // Cập nhật Sidebar bài học
  const sidebarTitle = document.getElementById('sidebar-lesson-title');
  const sidebarDesc = document.getElementById('sidebar-lesson-desc');
  if (sidebarTitle) sidebarTitle.textContent = `Bài ${currentLessonId}: ${lessonInfo.title}`;
  if (sidebarDesc) sidebarDesc.textContent = lessonInfo.title_vi || lessonInfo.desc;

  // Render lại danh sách từ của bài này
  const words = getCurrentLessonWords();
  renderVocabList(words);
  updateSidebarProgress();

  // Cập nhật số từ hiển thị ở nút tab Từ vựng
  const vocabCountBadge = document.getElementById('vocab-view-count');
  if (vocabCountBadge) vocabCountBadge.textContent = `${words.length} từ`;

  // Nếu đang ở tab Bài khoá, cập nhật lại bài khoá của bài học này
  if (currentMainView === 'dialogue' && typeof renderDialogueView === 'function') {
    renderDialogueView(currentLessonId, 0);
  }

  showToast(`📖 Đã chuyển sang Bài ${currentLessonId}: ${lessonInfo.title_vi || lessonInfo.title}`);
}

/**
 * Chuyển đổi giữa chế độ xem Từ vựng và Bài khoá (课文)
 */
function switchMainView(viewName) {
  currentMainView = viewName;
  const vocabTab = document.getElementById('view-tab-vocab');
  const dialogueTab = document.getElementById('view-tab-dialogue');
  const vocabContainer = document.getElementById('vocab-view-container');
  const dialogueContainer = document.getElementById('dialogue-view-container');

  if (viewName === 'dialogue') {
    if (vocabContainer) vocabContainer.classList.add('hidden');
    if (dialogueContainer) dialogueContainer.classList.remove('hidden');

    if (vocabTab) {
      vocabTab.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all text-slate-400 hover:text-white hover:bg-slate-800";
    }
    if (dialogueTab) {
      dialogueTab.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/25";
    }

    if (typeof renderDialogueView === 'function') {
      renderDialogueView(currentLessonId, 0);
    }
  } else {
    if (dialogueContainer) dialogueContainer.classList.add('hidden');
    if (vocabContainer) vocabContainer.classList.remove('hidden');

    if (vocabTab) {
      vocabTab.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20";
    }
    if (dialogueTab) {
      dialogueTab.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all text-slate-400 hover:text-white hover:bg-slate-800";
    }

    if (typeof stopDialogueAudio === 'function') {
      stopDialogueAudio();
    }
  }
}
window.switchMainView = switchMainView;

function prevLesson() {
  if (currentLessonId > 1) {
    switchLesson(currentLessonId - 1);
  } else {
    showToast("Đây là bài đầu tiên.");
  }
}

function nextLesson() {
  if (currentLessonId < window.HSK_LESSONS.length) {
    switchLesson(currentLessonId + 1);
  } else {
    showToast("Đã là bài cuối cùng.");
  }
}

/**
 * Khởi tạo danh sách giọng nói tiếng Trung
 */
let zhVoices = [];
function initVoiceVoices() {
  if (typeof window.speechSynthesis === 'undefined') return;
  const updateVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    zhVoices = voices.filter(v => v.lang.startsWith('zh') || v.lang.includes('CN') || v.name.includes('Chinese') || v.name.includes('Mandarin'));
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

/**
 * Phát âm tiếng Trung chuẩn (Offline & Online qua Web Speech API)
 * @param {string} text Văn bản chữ Hán cần phát âm
 * @param {number} rate Tốc độ phát âm (1.0 = bình thường, 0.75 = chậm)
 * @param {string} gender 'male' hoặc 'female'
 */
function speakChinese(text, rate = 1.0, gender = 'female') {
  if (typeof window.speechSynthesis === 'undefined') {
    showToast("⚠️ Trình duyệt của bạn không hỗ trợ Web Speech API.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = rate;

  if (gender === 'male') {
    utterance.pitch = 0.8;
  } else {
    utterance.pitch = 1.1;
  }

  if (zhVoices.length > 0) {
    // Tìm giọng nam/nữ nếu có
    const targetVoice = zhVoices.find(v => gender === 'male' ? (v.name.includes('Kangkang') || v.name.includes('Male') || v.name.includes('Yunxi')) : (v.name.includes('Huihui') || v.name.includes('Female') || v.name.includes('Xiaoxiao')));
    utterance.voice = targetVoice || zhVoices[0];
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Render toàn bộ danh sách thẻ từ vựng (Chuẩn giao diện Ảnh 1)
 */
function renderVocabList(filteredList = null) {
  const container = document.getElementById('vocab-card-list');
  const countBadge = document.getElementById('vocab-total-badge');
  if (!container) return;

  const list = filteredList || getCurrentLessonWords();
  if (countBadge) countBadge.textContent = `${list.length} từ`;

  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-base font-medium">Không tìm thấy từ vựng phù hợp trong bài học này.</p>
      </div>
    `;
    return;
  }

  list.forEach((item, index) => {
    const isLearned = learnedWords.has(item.id);
    const isFav = favoriteWords.has(item.id);
    const isMastered = (typeof window.getMasteredWords === 'function') && window.getMasteredWords().includes(item.id);

    const card = document.createElement('div');
    card.id = `vocab-card-${item.id}`;
    card.className = `p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl transition-all duration-300 relative hover:border-slate-700/80 hover:bg-slate-900 ${
      isLearned ? 'border-emerald-500/40' : ''
    }`;

    // Render Ruby HTML cho câu ví dụ
    let rubyHtml = '';
    if (item.ex_tokens && item.ex_tokens.length > 0) {
      rubyHtml = item.ex_tokens.map(token => {
        if (!token.py) {
          return `<span class="chinese-font text-lg text-slate-300">${token.hz}</span>`;
        }
        const isHighlight = token.highlight;
        return `
          <ruby class="${isHighlight ? 'highlight-word' : ''}">
            <span class="chinese-font text-xl">${token.hz}</span>
            <rt>${token.py}</rt>
          </ruby>
        `;
      }).join(' ');
    } else {
      rubyHtml = `<span class="chinese-font text-xl text-white">${item.ex_hz}</span>`;
    }

    card.innerHTML = `
      <!-- Hàng trên: Số thứ tự, Ảnh minh họa, Chữ Hán, Nút hành động -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <!-- Bên trái: Badge số, Hình ảnh, Chữ Hán lớn & Pinyin -->
        <div class="flex items-center gap-4">
          <!-- Số thứ tự đỏ bo góc (Ảnh 1) -->
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center font-extrabold text-white text-lg shadow-md flex-shrink-0">
            ${index + 1}
          </div>

          <!-- Ảnh minh họa từ vựng -->
          <div class="w-14 h-14 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-800 flex-shrink-0 relative group">
            <img src="${item.image}" alt="${item.hanzi}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'56\\' height=\\'56\\' fill=\\'%231e293b\\'><rect width=\\'100%\\' height=\\'100%\\'/><text x=\\'50%\\' y=\\'55%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2364748b\\' font-size=\\'22\\' font-weight=\\'bold\\'>${item.hanzi[0]}</text></svg>';" />
          </div>

          <!-- Chữ Hán & Phiên âm Pinyin -->
          <div>
            <h3 class="text-3xl font-extrabold text-white tracking-wide chinese-font flex items-center gap-2">
              ${item.hanzi}
              ${isMastered ? `
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  ✓ Đã thuộc
                </span>
              ` : ''}
            </h3>
            <span class="text-sm text-cyan-400 font-medium italic">${item.pinyin}</span>
          </div>
        </div>

        <!-- Bên phải: 2 Nút pill (Phân tích bộ thủ, Tập viết) & Dãy icon tròn -->
        <div class="flex flex-col items-end gap-2.5">
          <!-- 2 Nút chính -->
          <div class="flex items-center gap-2">
            <button onclick="openRadicalModal(${item.id})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-950/70 border border-rose-800/80 text-rose-300 hover:bg-rose-900 hover:text-white transition-all flex items-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              Phân tích bộ thủ
            </button>
            <button onclick="openWritingModal(${item.id})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-950/70 border border-purple-800/80 text-purple-300 hover:bg-purple-900 hover:text-white transition-all flex items-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              Tập viết
            </button>
          </div>

          <!-- Dãy nút tròn công cụ trực quan (Ảnh 1) -->
          <div class="flex items-center gap-1.5">
            <!-- Loa đỏ: Phát âm chậm (0.75x) -->
            <button onclick="speakChinese('${item.hanzi}', 0.75)" title="Phát âm chậm (0.75x)" class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 flex items-center justify-center transition-all">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </button>

            <!-- Loa xanh: Phát âm chuẩn (1.0x) -->
            <button onclick="speakChinese('${item.hanzi}', 1.0)" title="Phát âm chuẩn (1.0x)" class="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 flex items-center justify-center transition-all">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </button>

            <!-- Mic: Mở Modal Luyện Phát Âm (Ảnh 1 & 2) -->
            <button onclick="openVoiceModal(${item.id})" title="Luyện phát âm & Ghi âm chấm điểm" class="w-8 h-8 rounded-full bg-red-600/30 text-rose-400 hover:text-white hover:bg-red-600 border border-red-500/50 flex items-center justify-center transition-all shadow-md">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
            </button>

            <!-- Bookmark / Lưu từ -->
            <button onclick="toggleFavorite(${item.id})" title="${isFav ? 'Bỏ lưu' : 'Lưu từ vựng'}" class="w-8 h-8 rounded-full ${isFav ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'} flex items-center justify-center transition-all">
              <svg class="w-4 h-4" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </button>

            <!-- Ghi chú cá nhân -->
            <button onclick="promptNote(${item.id})" title="Ghi chú" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>

            <!-- Đánh dấu đã học (Vòng tròn tích xanh) -->
            <button onclick="toggleLearned(${item.id})" title="${isLearned ? 'Đã thành thạo (Bấm để hoàn tác)' : 'Đánh dấu đã học'}" class="w-8 h-8 rounded-full ${isLearned ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-800 text-slate-500 hover:text-emerald-400 border border-slate-700'} flex items-center justify-center transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Hàng giữa: Loại từ & Nghĩa tiếng Việt -->
      <div class="py-3 flex items-center gap-3 flex-wrap">
        <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider border border-red-500/60 text-red-400 bg-red-950/30">
          ${item.type}
        </span>
        <span class="text-sm font-medium text-slate-200">
          ${item.meaning}
        </span>
      </div>

      <!-- Hàng dưới: Hộp câu ví dụ dark mode có pinyin và nút micro luyện nói câu -->
      <div class="mt-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-start gap-3.5 relative group/ex">
        <!-- Cột nút âm thanh & micro phát âm câu ví dụ -->
        <div class="flex flex-col gap-1.5 flex-shrink-0 mt-0.5">
          <!-- Loa phát âm cả câu ví dụ -->
          <button onclick="speakChinese('${item.ex_hz}')" title="Nghe phát âm câu ví dụ" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 text-cyan-400 hover:bg-cyan-500 hover:text-white flex items-center justify-center transition-all shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          </button>

          <!-- Micro luyện nói câu ví dụ (Mở AI Voice Modal) -->
          <button onclick="openVoiceModalForExample(${item.id})" title="Luyện nói câu ví dụ này (AI Chấm điểm)" class="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-rose-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
          </button>
        </div>

        <div class="flex-1 min-w-0">
          <!-- Câu Hán tự kèm Pinyin trên từng chữ (Ruby) hoặc chữ Hán rõ nét -->
          <div class="flex flex-wrap items-end gap-y-2 mb-1">
            ${rubyHtml}
          </div>

          <!-- Dòng Pinyin đầy đủ rõ ràng cho mọi câu ví dụ -->
          <div class="text-xs text-cyan-400 font-mono italic tracking-wide mb-1.5 flex items-center gap-1.5">
            <span class="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/70 text-cyan-300 font-bold border border-cyan-800/60 not-italic uppercase tracking-wider">Pinyin</span>
            <span>${item.ex_py || ''}</span>
          </div>

          <!-- Nghĩa tiếng Việt màu đỏ cam nổi bật -->
          <p class="text-sm font-semibold text-rose-400">
            ${item.ex_vi}
          </p>
        </div>

        <!-- Trái tim yêu thích câu ví dụ -->
        <button onclick="this.classList.toggle('text-rose-500');" title="Yêu thích câu này" class="text-slate-600 hover:text-rose-500 transition-colors p-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Đánh dấu Đã học / Chưa học
 */
function toggleLearned(wordId) {
  if (learnedWords.has(wordId)) {
    learnedWords.delete(wordId);
    showToast("Đã hoàn tác trạng thái từ vựng.");
  } else {
    learnedWords.add(wordId);
    showToast("✓ Đã đánh dấu thành thạo từ vựng!");
  }
  saveState();
  renderVocabList();
  updateSidebarProgress();
}

/**
 * Đặt lại (Reset) tiến độ chữ đã học cho bài hiện tại
 */
function resetLessonProgress(lessonNo) {
  const targetLesson = (lessonNo !== undefined && lessonNo !== null) ? Number(lessonNo) : (window.currentLesson || 1);
  const words = (window.VOCAB_DATABASE || []).filter(w => w.lesson_id === targetLesson);
  const wordIds = new Set(words.map(w => w.id));

  // 1. Xóa khỏi learnedWords
  wordIds.forEach(id => learnedWords.delete(id));
  saveState();

  // 2. Xóa khỏi danh sách từ đã thuộc (hsk1_mastered_words)
  try {
    const stored = localStorage.getItem('hsk1_mastered_words');
    if (stored) {
      let list = JSON.parse(stored);
      list = list.filter(id => !wordIds.has(id));
      localStorage.setItem('hsk1_mastered_words', JSON.stringify(list));
    }
  } catch (e) {
    console.warn("Lỗi reset mastered words:", e);
  }

  // 3. Reset các hàng đợi mini game trong Memory Hub
  if (window.MEMORY_HUB && typeof window.MEMORY_HUB.resetLessonQueues === 'function') {
    window.MEMORY_HUB.resetLessonQueues(targetLesson);
  }

  // 4. Cập nhật giao diện
  renderVocabList();
  updateSidebarProgress();
  if (typeof updateMasteredDisplay === 'function') {
    updateMasteredDisplay();
  }
  showToast(`✓ Đã đặt lại toàn bộ tiến độ của Bài ${targetLesson}!`);
}

function confirmResetLessonProgress() {
  const targetLesson = window.currentLesson || 1;
  const ok = confirm(`Bạn có chắc chắn muốn đặt lại (reset) toàn bộ tiến độ chữ đã học của Bài ${targetLesson} không?\n\n- Đánh dấu "Đã học" của bài này sẽ trở về 0.\n- Tiến trình các Mini Game của bài này sẽ bắt đầu lại từ đầu.`);
  if (ok) {
    resetLessonProgress(targetLesson);
  }
}

window.resetLessonProgress = resetLessonProgress;
window.confirmResetLessonProgress = confirmResetLessonProgress;

/**
 * Đánh dấu Yêu thích / Bỏ lưu
 */
function toggleFavorite(wordId) {
  if (favoriteWords.has(wordId)) {
    favoriteWords.delete(wordId);
    showToast("Đã bỏ lưu từ vựng.");
  } else {
    favoriteWords.add(wordId);
    showToast("⭐ Đã lưu từ vựng vào sổ tay!");
  }
  saveState();
  renderVocabList();
}

/**
 * Ghi chú cá nhân
 */
function promptNote(wordId) {
  const word = window.VOCAB_DATABASE.find(w => w.id === wordId);
  const currentNote = localStorage.getItem(`hihsk_note_${wordId}`) || '';
  const note = prompt(`Ghi chú cá nhân cho từ "${word.hanzi}":`, currentNote);
  if (note !== null) {
    localStorage.setItem(`hihsk_note_${wordId}`, note);
    showToast("Đã lưu ghi chú thành công!");
  }
}

/**
 * Cập nhật thanh tiến độ bên Sidebar (Donut chart & tỷ lệ %)
 */
function updateSidebarProgress() {
  const words = getCurrentLessonWords();
  const total = words.length || 10;
  const masteredList = typeof window.getMasteredWords === 'function' ? window.getMasteredWords() : [];
  const done = words.filter(w => learnedWords.has(w.id) || masteredList.includes(w.id)).length;
  const inProgress = Math.max(0, Math.min(1, total - done));
  const remaining = Math.max(0, total - done - inProgress);

  const donePercent = Math.round((done / total) * 100);
  const inProgressPercent = Math.round((inProgress / total) * 100);
  const remainingPercent = 100 - donePercent - inProgressPercent;

  // Cập nhật text số liệu
  const statDoneEl = document.getElementById('sidebar-stat-done');
  const statProgEl = document.getElementById('sidebar-stat-progress');
  const statRemEl = document.getElementById('sidebar-stat-remaining');
  const percentText = document.getElementById('sidebar-percent-text');
  const donutCircle = document.getElementById('sidebar-donut-circle');
  const lessonProgress = document.getElementById('lesson-mini-progress');

  if (statDoneEl) statDoneEl.textContent = `${done}/${total} (${donePercent}%)`;
  if (statProgEl) statProgEl.textContent = `${inProgress}/${total} (${inProgressPercent}%)`;
  if (statRemEl) statRemEl.textContent = `${remaining}/${total} (${remainingPercent}%)`;
  if (percentText) percentText.textContent = `${donePercent}%`;
  if (lessonProgress) lessonProgress.style.width = `${donePercent}%`;

  if (donutCircle) {
    const circumference = 238.76;
    const offset = circumference - (donePercent / 100) * circumference;
    donutCircle.style.strokeDashoffset = offset;
  }

  // Cập nhật số bài học đã hoàn thành trên tổng số 15 bài
  const totalCompletedBadge = document.getElementById('sidebar-total-completed-badge');
  if (totalCompletedBadge && window.HSK_LESSONS) {
    let completedLessons = 0;
    window.HSK_LESSONS.forEach(l => {
      const lWords = window.VOCAB_DATABASE.filter(w => w.lesson_id === l.lesson_no);
      if (lWords.length > 0 && lWords.every(w => learnedWords.has(w.id) || masteredList.includes(w.id))) {
        completedLessons++;
      }
    });
    totalCompletedBadge.textContent = `${completedLessons}/15 bài hoàn thành`;
  }
}

/**
 * Phát tất cả từ vựng lần lượt trong bài hiện tại
 */
function togglePlayAll() {
  const btn = document.getElementById('btn-play-all');
  if (isPlayingAll) {
    stopPlayAll();
    return;
  }

  isPlayingAll = true;
  playAllIndex = 0;
  if (btn) {
    btn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Dừng phát`;
    btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all flex items-center gap-2";
  }

  playNextVocab();
}

function playNextVocab() {
  if (!isPlayingAll) return;
  const words = getCurrentLessonWords();
  if (playAllIndex >= words.length) {
    stopPlayAll();
    showToast("Đã phát xong toàn bộ từ vựng trong bài!");
    return;
  }

  const word = words[playAllIndex];
  
  // Xóa class highlight cũ
  document.querySelectorAll('.playing-card').forEach(c => c.classList.remove('playing-card'));

  const card = document.getElementById(`vocab-card-${word.id}`);
  if (card) {
    card.classList.add('playing-card');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  speakChinese(word.hanzi, 1.0);

  playAllTimeout = setTimeout(() => {
    playAllIndex++;
    playNextVocab();
  }, 2200);
}

function stopPlayAll() {
  isPlayingAll = false;
  clearTimeout(playAllTimeout);
  if (typeof window.speechSynthesis !== 'undefined') {
    window.speechSynthesis.cancel();
  }
  document.querySelectorAll('.playing-card').forEach(c => c.classList.remove('playing-card'));
  const btn = document.getElementById('btn-play-all');
  if (btn) {
    btn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Phát tất cả`;
    btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all flex items-center gap-2";
  }
}

/**
 * Tìm kiếm từ vựng thời gian thực
 */
function initSearch() {
  const searchInput = document.getElementById('vocab-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const currentWords = getCurrentLessonWords();
    if (!query) {
      renderVocabList(currentWords);
      return;
    }

    const filtered = currentWords.filter(w => {
      return w.hanzi.includes(query) ||
             w.pinyin.toLowerCase().includes(query) ||
             w.meaning.toLowerCase().includes(query) ||
             (w.ex_hz && w.ex_hz.includes(query)) ||
             (w.ex_vi && w.ex_vi.toLowerCase().includes(query));
    });

    renderVocabList(filtered);
  });
}

/**
 * Toast thông báo nhỏ
 */
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-sm shadow-2xl flex items-center gap-2 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto';
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/**
 * Chế độ Luyện Kiểm Tra Nghĩa Từ & Mini Game (Chuyển tiếp đến Trung Tâm Luyện Nhớ)
 */
function openVocabQuiz(mode = 'meaning_quiz') {
  if (typeof window.openMemoryHub === 'function') {
    window.openMemoryHub(mode);
  } else {
    const modal = document.getElementById('memory-hub-modal') || document.getElementById('quiz-modal');
    if (modal) modal.classList.remove('hidden');
  }
}

function closeVocabQuiz() {
  if (typeof window.closeMemoryHub === 'function') {
    window.closeMemoryHub();
  } else {
    const modal = document.getElementById('memory-hub-modal') || document.getElementById('quiz-modal');
    if (modal) modal.classList.add('hidden');
  }
}

let currentQuizWord = null;
function loadRandomQuizQuestion() {
  const words = getCurrentLessonWords();
  const randomIdx = Math.floor(Math.random() * words.length);
  currentQuizWord = words[randomIdx];

  document.getElementById('quiz-hanzi').textContent = currentQuizWord.hanzi;
  document.getElementById('quiz-pinyin').textContent = currentQuizWord.pinyin;

  // Tạo 4 lựa chọn
  const options = [currentQuizWord.meaning];
  while (options.length < Math.min(4, words.length)) {
    const otherWord = words[Math.floor(Math.random() * words.length)];
    if (!options.includes(otherWord.meaning)) {
      options.push(otherWord.meaning);
    }
  }
  options.sort(() => Math.random() - 0.5);

  const container = document.getElementById('quiz-options');
  container.innerHTML = '';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'w-full p-4 rounded-xl text-left font-semibold text-slate-200 bg-slate-800/80 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all text-sm';
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === currentQuizWord.meaning) {
        btn.className = 'w-full p-4 rounded-xl text-left font-bold text-white bg-emerald-600 border border-emerald-500 transition-all text-sm';
        speakChinese(currentQuizWord.hanzi);
        setTimeout(() => {
          loadRandomQuizQuestion();
        }, 800);
      } else {
        btn.className = 'w-full p-4 rounded-xl text-left font-bold text-white bg-rose-600 border border-rose-500 transition-all text-sm';
      }
    };
    container.appendChild(btn);
  });
}
