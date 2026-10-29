/**
 * Hướng dẫn & Kiểm tra Viết Chữ Hán (Modal Tập Viết - Chuẩn Thư Pháp Khải Thư)
 * Tích hợp HanziWriter, Ô vuông Mễ Tự Cách, Chế độ Hoạt Họa, Quiz Tô Nét & Hệ Thống Chấm Điểm Thư Pháp
 */

window.WritingSettings = {
  nibWidth: parseFloat(localStorage.getItem('hihsk_writing_nib') || '3.5'), // Nét thanh mảnh chuẩn đẹp
  inkColor: '#2563eb' // Mực xanh lam cao cấp
};

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

// Web Audio API Synth cho âm thanh chấm điểm
let writingAudioCtx = null;
function playWritingSound(type) {
  try {
    if (!writingAudioCtx) {
      writingAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (writingAudioCtx.state === 'suspended') {
      writingAudioCtx.resume();
    }
    const now = writingAudioCtx.currentTime;
    const osc = writingAudioCtx.createOscillator();
    const gain = writingAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(writingAudioCtx.destination);

    if (type === 'fanfare') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'success' || type === 'good') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(330, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch(e) {}
}

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

  // Cập nhật trạng thái nút ngòi bút
  updateNibButtonsUI();

  loadCharacter(selectedChar);
}

/**
 * Đóng Modal tập viết
 */
function closeWritingModal() {
  if (currentWriter) {
    currentWriter.cancelQuiz();
  }
  closeGradeOverlay();
  const modal = document.getElementById('writing-modal');
  modal.classList.add('hidden');
}

/**
 * Đổi cỡ ngòi bút
 */
function setWritingNib(width) {
  window.WritingSettings.nibWidth = width;
  try {
    localStorage.setItem('hihsk_writing_nib', width.toString());
  } catch(e) {}
  
  updateNibButtonsUI();

  if (currentChar) {
    loadCharacter(currentChar);
  }
}

function updateNibButtonsUI() {
  const currentW = window.WritingSettings.nibWidth || 3.5;
  document.querySelectorAll('.nib-select-btn').forEach(btn => {
    btn.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
    btn.classList.add('bg-slate-800', 'text-slate-300');
  });

  const activeBtn = document.getElementById(`nib-btn-${currentW.toFixed(1)}`) || document.getElementById(`nib-btn-${currentW}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-slate-800', 'text-slate-300');
    activeBtn.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
  }
}

/**
 * Tải chữ Hán cụ thể vào HanziWriter
 */
function loadCharacter(char) {
  currentChar = char;
  window.currentChar = char;
  currentMode = 'idle';

  closeGradeOverlay();

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

  const nibW = window.WritingSettings.nibWidth || 3.5;

  // Khởi tạo HanziWriter với nét thanh mảnh và độ nhạy nét hất cao
  currentWriter = HanziWriter.create('hanzi-canvas', char, {
    width: 320,
    height: 320,
    padding: 20,
    showOutline: showOutline,
    strokeAnimationSpeed: speedVal,
    delayBetweenStrokes: delayVal,
    strokeColor: '#ef4444', // Màu đỏ nét mẫu
    outlineColor: '#334155', // Viền xám mờ
    drawingColor: window.WritingSettings.inkColor || '#2563eb', // Mực xanh lam cao cấp
    drawingWidth: nibW, // Ngòi nét thanh mảnh chuẩn thư pháp (3.5px)
    drawingFadeDuration: 280,
    strokeFadeDuration: 300,
    showCharacter: false,
    showHintAfterMisses: missVal,
    leniency: 1.45, // Tăng độ nhạy để hất và móc câu bắt dứt khoát
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
      updateLiveScore();
      highlightFilmstripStep(correctStrokes);
      if (isAudioEnabled) {
        speakChinese(`第${correctStrokes}笔`);
      }
    },
    onMistake: function(strokeData) {
      mistakeCount++;
      updateStats();
      updateLiveScore();
      const canvasEl = document.getElementById('hanzi-canvas');
      canvasEl.classList.add('ring-2', 'ring-red-500');
      setTimeout(() => canvasEl.classList.remove('ring-2', 'ring-red-500'), 400);
    },
    onComplete: function(summaryData) {
      updatePlayBtn(false);
      highlightFilmstripStep(totalStrokes);
      showGradingReport(summaryData);
    }
  });

  // Lấy dữ liệu nét và tạo filmstrip
  getStrokeData(char).then(strokeData => {
    if (strokeData && strokeData.strokes) {
      totalStrokes = strokeData.strokes.length;
      correctStrokes = 0;
      mistakeCount = 0;
      updateStats();
      updateLiveScore();
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
 * Tính điểm chữ viết hiện tại (0 - 100 điểm)
 */
function calculateWritingScore() {
  if (totalStrokes === 0) return 100;
  
  if (correctStrokes === totalStrokes) {
    if (mistakeCount === 0) return 100;
    const penaltyPerMistake = Math.max(5, Math.round(50 / totalStrokes));
    return Math.max(50, 100 - (mistakeCount * penaltyPerMistake));
  }

  const completionRatio = correctStrokes / totalStrokes;
  const baseScore = completionRatio * 100;
  const penalty = mistakeCount * 5;
  return Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
}

/**
 * Cập nhật điểm số thời gian thực
 */
function updateLiveScore() {
  const scoreEl = document.getElementById('stat-live-score');
  if (scoreEl) {
    const score = calculateWritingScore();
    scoreEl.textContent = score;
    if (score >= 80) {
      scoreEl.className = 'text-white text-xs';
    } else if (score >= 60) {
      scoreEl.className = 'text-amber-300 text-xs';
    } else {
      scoreEl.className = 'text-rose-400 text-xs';
    }
  }
}

/**
 * Người dùng bấm nút "Chấm điểm"
 */
function triggerWritingGrading() {
  if (correctStrokes === 0 && mistakeCount === 0) {
    if (typeof showToast === 'function') {
      showToast('💡 Bạn chưa viết nét nào! Hãy dùng ngòi bút tô theo các nét trong ô vuông rồi bấm Chấm điểm nhé!');
    }
    return;
  }
  showGradingReport();
}

/**
 * Hiển thị Bảng Chấm Điểm Thư Pháp
 */
function showGradingReport(summaryData = null) {
  const overlay = document.getElementById('writing-grade-overlay');
  if (!overlay) return;

  const score = calculateWritingScore();
  
  const scoreNumEl = document.getElementById('grade-score-num');
  const titleEl = document.getElementById('grade-title');
  const feedbackEl = document.getElementById('grade-feedback');
  const strokesEl = document.getElementById('grade-detail-strokes');
  const mistakesEl = document.getElementById('grade-detail-mistakes');
  const flickEl = document.getElementById('grade-detail-flick');
  const badgeCircle = document.getElementById('grade-badge-circle');
  const nextCharBtn = document.getElementById('btn-next-char-grade');

  if (scoreNumEl) scoreNumEl.textContent = score;
  if (strokesEl) strokesEl.textContent = `${correctStrokes}/${totalStrokes}`;
  if (mistakesEl) mistakesEl.textContent = `${mistakeCount} lần`;
  
  const flickRating = mistakeCount === 0 ? '100% Chuẩn' : (mistakeCount <= 2 ? '90% Rất tốt' : '75% Đạt');
  if (flickEl) flickEl.textContent = flickRating;

  if (score >= 90) {
    badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-emerald-500/80 bg-emerald-950/60 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/30 mb-2';
    scoreNumEl.className = 'text-2xl font-black text-emerald-400';
    titleEl.textContent = '🏆 Xuất Sắc - Thư Pháp Chuẩn Mực';
    titleEl.className = 'text-sm font-black text-emerald-300';
    feedbackEl.textContent = 'Nét bút thanh thoát, dứt khoát. Các nét hất và móc câu cực kỳ chuẩn xác, quy tắc thuận bút hoàn hảo!';
    playWritingSound('fanfare');
  } else if (score >= 75) {
    badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-cyan-500/80 bg-cyan-950/60 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/30 mb-2';
    scoreNumEl.className = 'text-2xl font-black text-cyan-400';
    titleEl.textContent = '🌟 Rất Tốt - Nét Bút Thanh Thoát';
    titleEl.className = 'text-sm font-black text-cyan-300';
    feedbackEl.textContent = 'Bạn viết đúng quy tắc thuận bút. Nét hất/móc khá dứt khoát, rèn luyện thêm chút nữa sẽ hoàn hảo!';
    playWritingSound('success');
  } else if (score >= 50) {
    badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-amber-500/80 bg-amber-950/60 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 mb-2';
    scoreNumEl.className = 'text-2xl font-black text-amber-400';
    titleEl.textContent = '👍 Đạt Yêu Cầu - Cần Rèn Thêm';
    titleEl.className = 'text-sm font-black text-amber-300';
    feedbackEl.textContent = 'Đã viết được cấu trúc chữ. Hãy chú ý nét hất và nét móc dứt khoát hơn để chữ cân đối hơn nhé!';
    playWritingSound('good');
  } else {
    badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-rose-500/80 bg-rose-950/60 flex flex-col items-center justify-center shadow-lg shadow-rose-500/30 mb-2';
    scoreNumEl.className = 'text-2xl font-black text-rose-400';
    titleEl.textContent = '✍️ Cần Luyện Thêm Thứ Tự Nét';
    titleEl.className = 'text-sm font-black text-rose-300';
    feedbackEl.textContent = 'Nét viết còn hơi chệch hoặc chưa đúng thứ tự. Hãy bấm "Xem mẫu" để xem lại các bước rồi thử lại nhé!';
    playWritingSound('try_again');
  }

  // Nút chữ tiếp theo nếu từ có nhiều chữ
  if (currentWord && currentWord.hanzi) {
    const chars = currentWord.chars || Array.from(currentWord.hanzi);
    const currIdx = chars.indexOf(currentChar);
    if (currIdx !== -1 && currIdx < chars.length - 1) {
      if (nextCharBtn) nextCharBtn.classList.remove('hidden');
    } else {
      if (nextCharBtn) nextCharBtn.classList.add('hidden');
    }
  }

  overlay.classList.remove('hidden');
}

function closeGradeOverlay() {
  const overlay = document.getElementById('writing-grade-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function retryWritingCurrentChar() {
  closeGradeOverlay();
  resetWriting();
}

function nextWritingChar() {
  closeGradeOverlay();
  if (currentWord && currentWord.hanzi) {
    const chars = currentWord.chars || Array.from(currentWord.hanzi);
    const currIdx = chars.indexOf(currentChar);
    if (currIdx !== -1 && currIdx < chars.length - 1) {
      loadCharacter(chars[currIdx + 1]);
    }
  }
}

/**
 * Vẽ filmstrip hiển thị từng bước nét tích lũy (Nét 1, Nét 2, Nét 3...)
 */
function renderFilmstrip(data) {
  const container = document.getElementById('writing-filmstrip');
  if (!container) return;
  container.innerHTML = '';

  const strokes = data.strokes;

  strokes.forEach((stroke, idx) => {
    const item = document.createElement('div');
    item.className = `filmstrip-item mizige-box ${idx === 0 ? 'active' : ''}`;
    item.id = `filmstrip-step-${idx + 1}`;
    item.title = `Nét ${idx + 1}/${strokes.length}`;

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
    
    const scale = 280 / 1024;
    const offsetX = 20;
    const offsetY = 20;

    const startPt = median[0];
    const endPt = median[median.length - 1];

    const startX = offsetX + startPt[0] * scale;
    const startY = 320 - (offsetY + startPt[1] * scale);

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
    closeGradeOverlay();
    currentMode = 'animating';
    updatePlayBtn(true);
    currentWriter.animateCharacter({
      onComplete: function() {
        currentMode = 'idle';
        updatePlayBtn(false);
        highlightFilmstripStep(totalStrokes);
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
  closeGradeOverlay();
  correctStrokes = 0;
  mistakeCount = 0;
  updateStats();
  updateLiveScore();
  highlightFilmstripStep(1);

  const nibW = window.WritingSettings.nibWidth || 3.5;

  currentWriter.quiz({
    showOutline: showOutline,
    leniency: 1.45, // Tăng độ nhạy cho nét hất và nét móc
    drawingWidth: nibW,
    drawingColor: window.WritingSettings.inkColor || '#2563eb',
    drawingFadeDuration: 280,
    onCorrectStroke: function(strokeData) {
      correctStrokes = strokeData.strokeNum + 1;
      updateStats();
      updateLiveScore();
      highlightFilmstripStep(correctStrokes + 1);
      if (isAudioEnabled) {
        speakChinese(`第${correctStrokes}笔`);
      }
    },
    onMistake: function(strokeData) {
      mistakeCount++;
      updateStats();
      updateLiveScore();
      const canvasEl = document.getElementById('hanzi-canvas');
      canvasEl.classList.add('ring-2', 'ring-red-500');
      setTimeout(() => canvasEl.classList.remove('ring-2', 'ring-red-500'), 400);
    },
    onComplete: function(summaryData) {
      updatePlayBtn(false);
      showGradingReport(summaryData);
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
  closeGradeOverlay();
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

window.openWritingModal = openWritingModal;
window.closeWritingModal = closeWritingModal;
window.setWritingNib = setWritingNib;
window.triggerWritingGrading = triggerWritingGrading;
window.showGradingReport = showGradingReport;
window.closeGradeOverlay = closeGradeOverlay;
window.retryWritingCurrentChar = retryWritingCurrentChar;
window.nextWritingChar = nextWritingChar;
window.toggleAnimate = toggleAnimate;
window.startQuizMode = startQuizMode;
window.resetWriting = resetWriting;
window.printPracticeSheet = printPracticeSheet;
