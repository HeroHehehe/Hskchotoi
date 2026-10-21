/**
 * Hướng dẫn & Kiểm tra Viết Chữ Hán (Modal Tập Viết - Chuẩn Ảnh 3)
 * Tích hợp HanziWriter, Ô vuông Mễ Tự Cách, Chế độ Hoạt Họa & Quiz Tô Nét
 */

let currentWriter = null;
let currentChar = null;
let currentWord = null;
let currentMode = 'idle'; // 'idle', 'animating', 'quiz'
let currentStep = 0;
let totalStrokes = 0;
let correctStrokes = 0;
let mistakeCount = 0;
let isAudioEnabled = false;
let showOutline = true;
let showNumbers = true;
let showArrows = true;

/**
 * Khởi động Modal tập viết chữ Hán
 */
function openWritingModal(wordId, targetChar = null) {
  const word = window.VOCAB_DATABASE.find(w => w.id === wordId);
  if (!word) return;
  currentWord = word;

  const modal = document.getElementById('writing-modal');
  modal.classList.remove('hidden');

  // Cập nhật Header
  document.getElementById('writing-modal-title').textContent = `Tập viết: ${word.hanzi}`;
  document.getElementById('writing-pinyin').textContent = word.pinyin;
  document.getElementById('writing-meaning').textContent = word.meaning;
  document.getElementById('writing-pos-badge').textContent = word.type_detail || word.type;

  // Tabs chọn chữ (nếu là từ ghép như 你好)
  const charTabsContainer = document.getElementById('writing-char-tabs');
  charTabsContainer.innerHTML = '';
  const chars = word.chars || Array.from(word.hanzi);
  
  const selectedChar = (targetChar && chars.includes(targetChar)) ? targetChar : chars[0];

  chars.forEach(c => {
    const btn = document.createElement('button');
    btn.className = `px-5 py-2 rounded-xl text-xl font-bold chinese-font border transition-all ${
      c === selectedChar 
        ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
    }`;
    btn.textContent = c;
    btn.onclick = () => loadCharacter(c);
    charTabsContainer.appendChild(btn);
  });

  loadCharacter(selectedChar);
}

/**
 * Đóng Modal tập viết
 */
function closeWritingModal() {
  if (currentWriter) {
    currentWriter.cancelQuiz();
  }
  const modal = document.getElementById('writing-modal');
  modal.classList.add('hidden');
}

/**
 * Tải chữ Hán cụ thể vào HanziWriter
 */
function loadCharacter(char) {
  currentChar = char;
  window.currentChar = char;
  currentMode = 'idle';

  // Highlight tab
  const tabs = document.querySelectorAll('#writing-char-tabs button');
  tabs.forEach(t => {
    if (t.textContent === char) {
      t.className = 'px-5 py-2 rounded-xl text-xl font-bold chinese-font border bg-blue-600/30 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
    } else {
      t.className = 'px-5 py-2 rounded-xl text-xl font-bold chinese-font border bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white';
    }
  });

  // Reset container
  const canvasContainer = document.getElementById('hanzi-canvas');
  canvasContainer.innerHTML = '';

  const speedVal = parseFloat(document.getElementById('opt-speed')?.value || '1.0');
  const delayVal = parseFloat(document.getElementById('opt-delay')?.value || '400');
  const missVal = parseInt(document.getElementById('opt-miss')?.value || '3');

  // Khởi tạo HanziWriter
  currentWriter = HanziWriter.create('hanzi-canvas', char, {
    width: 320,
    height: 320,
    padding: 20,
    showOutline: showOutline,
    strokeAnimationSpeed: speedVal,
    delayBetweenStrokes: delayVal,
    strokeColor: '#ef4444', // Màu đỏ rực rỡ như Ảnh 3
    outlineColor: '#334155', // Viền xám mờ
    drawingColor: '#38bdf8', // Nét vẽ màu cyan
    drawingWidth: 22,
    showCharacter: false,
    showHintAfterMisses: missVal,
    charDataLoader: function(c, onComplete) {
      // Ưu tiên tải dữ liệu offline đã nhúng sẵn
      if (window.HANZI_STROKE_DATA && window.HANZI_STROKE_DATA[c]) {
        onComplete(window.HANZI_STROKE_DATA[c]);
      } else {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(c)}.json`)
          .then(res => res.json())
          .then(data => onComplete(data))
          .catch(err => {
            console.error("Không thể tải stroke data:", c, err);
          });
      }
    },
    onCorrectStroke: function(strokeData) {
      correctStrokes = strokeData.strokeNum + 1;
      updateStats();
      highlightFilmstripStep(correctStrokes);
      if (isAudioEnabled) {
        speakChinese(`第${correctStrokes}笔`);
      }
    },
    onMistake: function(strokeData) {
      mistakeCount++;
      updateStats();
      const canvasEl = document.getElementById('hanzi-canvas');
      canvasEl.classList.add('ring-2', 'ring-red-500');
      setTimeout(() => canvasEl.classList.remove('ring-2', 'ring-red-500'), 400);
    },
    onComplete: function(summaryData) {
      updatePlayBtn(false);
      showToast(`🎉 Xuất sắc! Bạn đã viết đúng toàn bộ chữ "${currentChar}"!`);
      highlightFilmstripStep(totalStrokes);
    }
  });

  // Lấy dữ liệu nét và tạo filmstrip
  getStrokeData(char).then(strokeData => {
    if (strokeData && strokeData.strokes) {
      totalStrokes = strokeData.strokes.length;
      correctStrokes = 0;
      mistakeCount = 0;
      updateStats();
      renderFilmstrip(strokeData);
      renderStrokeGuides(strokeData);
    }
  });

  updatePlayBtn(false);

  // TỰ ĐỘNG BẬT CHẾ ĐỘ NHẬN BÚT / CHẠM TRỰC TIẾP TRÊN IPAD VÀ MÀN HÌNH CẢM ỨNG
  setTimeout(() => {
    startQuizMode();
  }, 100);
}

/**
 * Lấy stroke data từ bộ nhớ offline hoặc fetch
 */
function getStrokeData(char) {
  if (window.HANZI_STROKE_DATA && window.HANZI_STROKE_DATA[char]) {
    return Promise.resolve(window.HANZI_STROKE_DATA[char]);
  }
  return fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`)
    .then(r => r.json())
    .catch(() => null);
}

/**
 * Cập nhật số liệu thống kê (0/7, 0, còn 7)
 */
function updateStats() {
  const statCorrect = document.getElementById('stat-correct');
  const statMistakes = document.getElementById('stat-mistakes');
  const statRemaining = document.getElementById('stat-remaining');

  if (statCorrect) statCorrect.textContent = `${correctStrokes}/${totalStrokes}`;
  if (statMistakes) statMistakes.textContent = mistakeCount;
  if (statRemaining) statRemaining.textContent = Math.max(0, totalStrokes - correctStrokes);
}

/**
 * Vẽ filmstrip hiển thị từng bước nét tích lũy (Nét 1, Nét 2, Nét 3...)
 */
function renderFilmstrip(data) {
  const container = document.getElementById('writing-filmstrip');
  if (!container) return;
  container.innerHTML = '';

  const strokes = data.strokes;
  const medians = data.medians;

  strokes.forEach((stroke, idx) => {
    const item = document.createElement('div');
    item.className = `filmstrip-item mizige-box ${idx === 0 ? 'active' : ''}`;
    item.id = `filmstrip-step-${idx + 1}`;
    item.title = `Nét ${idx + 1}/${strokes.length}`;

    // Tạo SVG mini 52x52
    // Strokes 0..idx-1 là màu trắng xám, stroke idx là màu đỏ
    let pathElements = '';
    for (let i = 0; i <= idx; i++) {
      const isCurrent = (i === idx);
      const color = isCurrent ? '#ef4444' : '#cbd5e1';
      pathElements += `<path d="${strokes[i]}" fill="${color}" />`;
    }

    item.innerHTML = `
      <svg viewBox="0 0 1024 1024" class="w-10 h-10 transform scale-y-[-1] pointer-events-none">
        ${pathElements}
      </svg>
    `;

    item.onclick = () => {
      jumpToStroke(idx);
    };

    container.appendChild(item);
  });
}

/**
 * Highlight bước trên filmstrip
 */
function highlightFilmstripStep(stepNumber) {
  const items = document.querySelectorAll('.filmstrip-item');
  items.forEach((item, idx) => {
    if (idx + 1 === stepNumber) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * Hiển thị số thứ tự nét và mũi tên hướng nét trên canvas mễ tự cách
 */
function renderStrokeGuides(data) {
  const overlay = document.getElementById('stroke-guides-overlay');
  if (!overlay) return;
  overlay.innerHTML = '';

  if (!showNumbers && !showArrows) return;

  const medians = data.medians || [];
  medians.forEach((median, idx) => {
    if (!median || median.length < 2) return;
    
    // Tọa độ gốc: 1024x1024 (trục Y hướng lên trên trong dữ liệu MakeMeAHanzi)
    // Canvas: 320x320, padding 20px -> scale factor: 280 / 1024
    const scale = 280 / 1024;
    const offsetX = 20;
    const offsetY = 20;

    const startPt = median[0];
    const midPt = median[Math.floor(median.length / 2)];
    const endPt = median[median.length - 1];

    const startX = offsetX + startPt[0] * scale;
    const startY = 320 - (offsetY + startPt[1] * scale);

    const endX = offsetX + endPt[0] * scale;
    const endY = 320 - (offsetY + endPt[1] * scale);

    // Điểm hiển thị số thứ tự nét
    if (showNumbers) {
      const numBadge = document.createElement('div');
      numBadge.className = 'absolute flex items-center justify-center w-5 h-5 rounded-full bg-slate-900/90 border border-slate-600 text-white font-bold text-xs shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2';
      numBadge.style.left = `${startX}px`;
      numBadge.style.top = `${startY}px`;
      numBadge.textContent = idx + 1;
      overlay.appendChild(numBadge);
    }

    // Mũi tên chỉ hướng nét
    if (showArrows && median.length >= 2) {
      const arrowSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      arrowSvg.setAttribute("class", "absolute inset-0 w-full h-full pointer-events-none");
      
      let pathD = `M ${startX} ${startY}`;
      for (let p = 1; p < median.length; p++) {
        const px = offsetX + median[p][0] * scale;
        const py = 320 - (offsetY + median[p][1] * scale);
        pathD += ` L ${px} ${py}`;
      }

      arrowSvg.innerHTML = `
        <defs>
          <marker id="arrow-${idx}" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#ef4444" opacity="0.8"/>
          </marker>
        </defs>
        <path d="${pathD}" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3" opacity="0.65" marker-end="url(#arrow-${idx})" />
      `;
      overlay.appendChild(arrowSvg);
    }
  });
}

/**
 * Nhảy tới nét cụ thể
 */
function jumpToStroke(strokeIdx) {
  if (!currentWriter) return;
  highlightFilmstripStep(strokeIdx + 1);
  currentWriter.showCharacter();
}

/**
 * Toggle Chạy hoạt họa (Xem mẫu)
 */
function toggleAnimate() {
  if (!currentWriter) return;

  if (currentMode === 'animating') {
    currentWriter.pauseAnimation();
    currentMode = 'idle';
    updatePlayBtn(false);
  } else {
    currentWriter.cancelQuiz();
    currentMode = 'animating';
    updatePlayBtn(true);
    currentWriter.animateCharacter({
      onComplete: function() {
        currentMode = 'idle';
        updatePlayBtn(false);
        highlightFilmstripStep(totalStrokes);
        // Xem mẫu xong thì tự động bật lại chế độ sẵn sàng viết trên iPad / chuột
        setTimeout(() => {
          startQuizMode();
        }, 500);
      }
    });
  }
}

/**
 * Chuyển sang chế độ Viết (Quiz Tô Nét)
 */
function startQuizMode() {
  if (!currentWriter) return;
  currentMode = 'quiz';
  updatePlayBtn(false);
  correctStrokes = 0;
  mistakeCount = 0;
  updateStats();
  highlightFilmstripStep(1);

  currentWriter.quiz({
    showOutline: showOutline,
    onCorrectStroke: function(strokeData) {
      correctStrokes = strokeData.strokeNum + 1;
      updateStats();
      highlightFilmstripStep(correctStrokes + 1);
      if (isAudioEnabled) {
        speakChinese(`第${correctStrokes}笔`);
      }
    },
    onMistake: function(strokeData) {
      mistakeCount++;
      updateStats();
      const canvasEl = document.getElementById('hanzi-canvas');
      canvasEl.classList.add('ring-2', 'ring-red-500');
      setTimeout(() => canvasEl.classList.remove('ring-2', 'ring-red-500'), 400);
    },
    onComplete: function(summaryData) {
      showToast(`🎉 Chúc mừng! Bạn đã hoàn thành viết chữ "${currentChar}"!`);
    }
  });
}

/**
 * Reset Canvas
 */
function resetWriting() {
  if (currentWriter) {
    currentWriter.cancelQuiz();
  }
  loadCharacter(currentChar);
}

/**
 * Cập nhật nút Xem mẫu / Dừng
 */
function updatePlayBtn(isPlaying) {
  const btn = document.getElementById('btn-play-pause');
  if (!btn) return;
  if (isPlaying) {
    btn.innerHTML = `<span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Dừng</span>`;
    btn.className = "px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all flex items-center";
  } else {
    btn.innerHTML = `<span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Xem mẫu</span>`;
    btn.className = "px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all flex items-center";
  }
}

/**
 * In mẫu tập viết / Xuất PDF
 */
function printPracticeSheet() {
  if (!currentChar) return;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tập viết chữ Hán - ${currentChar}</title>
      <style>
        body { font-family: sans-serif; padding: 20px; text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(8, 60px); gap: 8px; justify-content: center; margin-top: 20px; }
        .cell { width: 60px; height: 60px; border: 1px solid #999; position: relative; font-size: 38px; line-height: 60px; font-family: 'Noto Sans SC', serif; }
        .cell::before { content:''; position: absolute; inset:0; border-top: 1px dashed #ddd; top: 30px; }
        .cell::after { content:''; position: absolute; inset:0; border-left: 1px dashed #ddd; left: 30px; }
        .header { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Phiếu luyện viết chữ Hán: ${currentChar} (${currentWord ? currentWord.pinyin : ''})</h2>
        <p>Ý nghĩa: ${currentWord ? currentWord.meaning : ''}</p>
      </div>
      <div class="grid">
        ${Array(40).fill(0).map((_, i) => `<div class="cell" style="color: ${i < 3 ? '#333' : '#ddd'};">${currentChar}</div>`).join('')}
      </div>
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Đăng ký sự kiện Toggles & Selects
 */
document.addEventListener('DOMContentLoaded', () => {
  // Toggle Nét mờ
  const toggleOutline = document.getElementById('toggle-outline');
  if (toggleOutline) {
    toggleOutline.addEventListener('change', (e) => {
      showOutline = e.target.checked;
      if (currentWriter) {
        if (showOutline) currentWriter.showOutline();
        else currentWriter.hideOutline();
      }
    });
  }

  // Toggle Hiện số
  const toggleNumbers = document.getElementById('toggle-numbers');
  if (toggleNumbers) {
    toggleNumbers.addEventListener('change', (e) => {
      showNumbers = e.target.checked;
      getStrokeData(currentChar).then(renderStrokeGuides);
    });
  }

  // Toggle Hiện hướng nét
  const toggleArrows = document.getElementById('toggle-arrows');
  if (toggleArrows) {
    toggleArrows.addEventListener('change', (e) => {
      showArrows = e.target.checked;
      getStrokeData(currentChar).then(renderStrokeGuides);
    });
  }

  // Toggle Âm thanh
  const toggleAudio = document.getElementById('toggle-audio');
  if (toggleAudio) {
    toggleAudio.addEventListener('change', (e) => {
      isAudioEnabled = e.target.checked;
    });
  }

  // Thay đổi Tốc độ
  const selSpeed = document.getElementById('opt-speed');
  if (selSpeed) {
    selSpeed.addEventListener('change', () => {
      if (currentChar) loadCharacter(currentChar);
    });
  }

  // Thay đổi Delay
  const selDelay = document.getElementById('opt-delay');
  if (selDelay) {
    selDelay.addEventListener('change', () => {
      if (currentChar) loadCharacter(currentChar);
    });
  }
});
