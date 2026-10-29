/**
 * Hướng dẫn & Kiểm tra Viết Chữ Hán (Modal Tập Viết - Chuẩn Thư Pháp Khải Thư)
 * Tích hợp HanziWriter, Canvas Viết Thư Pháp Tự Do & Hệ Thống Chấm Điểm Thư Pháp Chuẩn Xác 100%
 */

window.WritingSettings = {
  nibWidth: parseFloat(localStorage.getItem('hihsk_writing_nib') || '3.0'), // Nét thanh mảnh chuẩn đẹp 3.0px
  inkColor: '#1d4ed8' // Mực xanh lam thư pháp cao cấp
};

let currentWriter = null;
let currentChar = null;
let currentWord = null;
let currentMode = 'idle'; // 'idle', 'animating'
let totalStrokes = 0;
let isAudioEnabled = false;
let showOutline = true;
let showNumbers = true;
let showArrows = true;

// Trạng thái Canvas Thư Pháp Tự Do
let calligraphyCanvas = null;
let calligraphyCtx = null;
let isDrawing = false;
let hasUserDrawn = false;
let userStrokesCount = 0;
let userDrawnStrokes = [];
let lastPoint = null;

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
 * Khởi tạo Canvas Viết Thư Pháp
 */
function initCalligraphyCanvas() {
  calligraphyCanvas = document.getElementById('calligraphy-canvas');
  if (!calligraphyCanvas) return;

  calligraphyCtx = calligraphyCanvas.getContext('2d');
  
  // Xóa sạch canvas
  clearCalligraphyCanvas();

  // Đăng ký sự kiện vẽ cảm ứng và chuột
  calligraphyCanvas.onpointerdown = handlePointerDown;
  calligraphyCanvas.onpointermove = handlePointerMove;
  calligraphyCanvas.onpointerup = handlePointerUp;
  calligraphyCanvas.onpointercancel = handlePointerUp;
  calligraphyCanvas.onpointerleave = handlePointerUp;
}

function getCanvasCoordinates(e) {
  const rect = calligraphyCanvas.getBoundingClientRect();
  const scaleX = calligraphyCanvas.width / rect.width;
  const scaleY = calligraphyCanvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
    time: performance.now()
  };
}

function handlePointerDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  closeGradeOverlay();

  isDrawing = true;
  calligraphyCanvas.setPointerCapture?.(e.pointerId);

  const pt = getCanvasCoordinates(e);
  const baseW = window.WritingSettings.nibWidth || 3.0;
  
  lastPoint = {
    x: pt.x,
    y: pt.y,
    time: pt.time,
    width: baseW
  };

  calligraphyCtx.lineCap = 'round';
  calligraphyCtx.lineJoin = 'round';
  calligraphyCtx.strokeStyle = window.WritingSettings.inkColor || '#1d4ed8';
  calligraphyCtx.fillStyle = window.WritingSettings.inkColor || '#1d4ed8';

  // Vẽ chấm khởi bút (chấm tròn tinh tế)
  calligraphyCtx.beginPath();
  calligraphyCtx.arc(pt.x, pt.y, baseW / 2, 0, Math.PI * 2);
  calligraphyCtx.fill();
}

function handlePointerMove(e) {
  if (!isDrawing || !lastPoint) return;
  e.preventDefault();

  const pt = getCanvasCoordinates(e);
  const dist = Math.hypot(pt.x - lastPoint.x, pt.y - lastPoint.y);
  if (dist < 1.5) return;

  const dt = Math.max(1, pt.time - lastPoint.time);
  const speed = dist / dt; // Tốc độ di chuyển bút (pixels / ms)
  const baseW = window.WritingSettings.nibWidth || 3.0;

  // Hiệu ứng ngòi thư pháp: Viết nhanh hoặc hất bút (speed cao) -> Nét vuốt mảnh nhọn thanh thoát
  const speedFactor = Math.min(0.75, speed / 1.6);
  const targetWidth = Math.max(1.0, baseW * (1.0 - speedFactor));
  const smoothWidth = lastPoint.width * 0.35 + targetWidth * 0.65;

  const midX = (lastPoint.x + pt.x) / 2;
  const midY = (lastPoint.y + pt.y) / 2;

  calligraphyCtx.lineWidth = smoothWidth;
  calligraphyCtx.beginPath();
  calligraphyCtx.moveTo(lastPoint.x, lastPoint.y);
  calligraphyCtx.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
  calligraphyCtx.stroke();

  lastPoint = {
    x: midX,
    y: midY,
    time: pt.time,
    width: smoothWidth,
    speed: speed
  };
}

function handlePointerUp(e) {
  if (!isDrawing) return;
  isDrawing = false;

  if (lastPoint) {
    const pt = getCanvasCoordinates(e);
    // Vuốt nhọn nét hất cuối cùng nếu vung bút dứt khoát
    calligraphyCtx.lineWidth = Math.max(0.8, lastPoint.width * 0.4);
    calligraphyCtx.beginPath();
    calligraphyCtx.moveTo(lastPoint.x, lastPoint.y);
    calligraphyCtx.lineTo(pt.x, pt.y);
    calligraphyCtx.stroke();
  }

  lastPoint = null;
  hasUserDrawn = true;
  userStrokesCount++;

  updateWritingStatsUI();
  updateLiveScorePreview();
}

/**
 * Xóa sạch Canvas Thư Pháp
 */
function clearCalligraphyCanvas() {
  if (calligraphyCtx && calligraphyCanvas) {
    calligraphyCtx.clearRect(0, 0, calligraphyCanvas.width, calligraphyCanvas.height);
  }
  isDrawing = false;
  hasUserDrawn = false;
  userStrokesCount = 0;
  userDrawnStrokes = [];
  lastPoint = null;

  updateWritingStatsUI();
  updateLiveScorePreview();
}

/**
 * Cập nhật số liệu thống kê (Số nét đã viết, v.v.)
 */
function updateWritingStatsUI() {
  const statCorrect = document.getElementById('stat-correct');
  const statMistakes = document.getElementById('stat-mistakes');
  const statRemaining = document.getElementById('stat-remaining');

  if (statCorrect) statCorrect.textContent = `${userStrokesCount}/${totalStrokes || 1}`;
  if (statMistakes) statMistakes.textContent = Math.max(0, userStrokesCount - (totalStrokes || 1));
  if (statRemaining) statRemaining.textContent = Math.max(0, (totalStrokes || 1) - userStrokesCount);
}

function updateLiveScorePreview() {
  const scoreEl = document.getElementById('stat-live-score');
  if (!scoreEl) return;

  if (!hasUserDrawn) {
    scoreEl.textContent = '100';
    scoreEl.className = 'text-white text-xs';
    return;
  }

  // Điểm sơ bộ theo số nét
  const expected = totalStrokes || 1;
  const diff = Math.abs(userStrokesCount - expected);
  const approxScore = Math.max(50, Math.min(100, Math.round(100 - diff * 8)));
  scoreEl.textContent = approxScore;
  if (approxScore >= 80) scoreEl.className = 'text-emerald-400 text-xs font-black';
  else if (approxScore >= 65) scoreEl.className = 'text-amber-300 text-xs font-black';
  else scoreEl.className = 'text-rose-400 text-xs font-black';
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

  updateNibButtonsUI();
  loadCharacter(selectedChar);
}

/**
 * Đóng Modal tập viết
 */
function closeWritingModal() {
  if (currentWriter) {
    currentWriter.cancelQuiz?.();
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
}

function updateNibButtonsUI() {
  const currentW = window.WritingSettings.nibWidth || 3.0;
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
 * Tải chữ Hán cụ thể vào HanziWriter & Canvas Thư Pháp
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

  // Reset container HanziWriter
  const canvasContainer = document.getElementById('hanzi-canvas');
  if (canvasContainer) canvasContainer.innerHTML = '';

  const speedVal = parseFloat(document.getElementById('opt-speed')?.value || '1.0');
  const delayVal = parseFloat(document.getElementById('opt-delay')?.value || '400');

  // Khởi tạo HanziWriter làm nền hiển thị nét mờ & chạy mẫu
  currentWriter = HanziWriter.create('hanzi-canvas', char, {
    width: 320,
    height: 320,
    padding: 20,
    showOutline: showOutline,
    strokeAnimationSpeed: speedVal,
    delayBetweenStrokes: delayVal,
    strokeColor: '#ef4444', // Màu đỏ rực rỡ khi chạy mẫu
    outlineColor: '#334155', // Viền xám mờ mễ tự cách
    drawingWidth: 3.0,
    showCharacter: false,
    charDataLoader: function(c, onComplete) {
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
    }
  });

  // Khởi tạo Canvas Thư Pháp để người dùng đặt bút viết thật
  initCalligraphyCanvas();

  // Lấy dữ liệu nét và tạo filmstrip
  getStrokeData(char).then(strokeData => {
    if (strokeData && strokeData.strokes) {
      totalStrokes = strokeData.strokes.length;
      updateWritingStatsUI();
      updateLiveScorePreview();
      renderFilmstrip(strokeData);
      renderStrokeGuides(strokeData);
    }
  });

  updatePlayBtn(false);
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
 * THUẬT TOÁN CHẤM ĐIỂM THƯ PHÁP (Calligraphy Grading Engine)
 * So sánh trực tiếp nét vẽ trên Canvas với chữ mẫu Khải Thư
 */
function evaluateCalligraphy() {
  if (!calligraphyCanvas || !currentChar) {
    return { score: 0, coverage: 0, accuracy: 0, strokeCount: 0, feedback: 'Chưa có nét viết' };
  }

  // 1. Kiểm tra xem người dùng đã viết chưa
  const userCtx = calligraphyCanvas.getContext('2d');
  const userImg = userCtx.getImageData(0, 0, 320, 320);
  const userPixels = userImg.data;

  let inkedCount = 0;
  for (let i = 3; i < userPixels.length; i += 4) {
    if (userPixels[i] > 30) inkedCount++;
  }

  // Nếu người dùng chưa viết gì (dưới 60 điểm ảnh)
  if (inkedCount < 60) {
    return {
      score: 0,
      coverage: 0,
      accuracy: 0,
      strokeCount: 0,
      isEmpty: true,
      title: 'Chưa Có Nét Viết',
      feedback: 'Bạn chưa đặt bút viết chữ vào ô Mễ Tự Cách. Hãy dùng ngòi bút tô theo các nét rồi bấm Chấm điểm nhé!'
    };
  }

  // 2. Tạo Canvas mẫu ảo (Offscreen) vẽ chữ mẫu Khải Thư 楷体
  const offscreen = document.createElement('canvas');
  offscreen.width = 320;
  offscreen.height = 320;
  const offCtx = offscreen.getContext('2d');

  offCtx.fillStyle = '#000000';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  // Dùng phông Khải Thư chuẩn với kích thước tương đương khung mễ tự cách
  offCtx.font = "220px 'KaiTi', 'STKaiti', 'KaiTi_GB2312', 'Kaiti SC', 'LXGW WenKai Screen', 'Noto Serif SC', serif";
  offCtx.fillText(currentChar, 160, 160);

  const tplImg = offCtx.getImageData(0, 0, 320, 320);
  const tplPixels = tplImg.data;

  // 3. So khớp điểm ảnh (Intersection & Coverage)
  let tplCount = 0;
  let overlapCount = 0;
  let userInBounds = 0;

  for (let i = 3; i < tplPixels.length; i += 4) {
    const isTpl = tplPixels[i] > 40;
    const isUser = userPixels[i] > 30;

    if (isTpl) tplCount++;
    if (isTpl && isUser) overlapCount++;
    if (isUser && isTpl) userInBounds++;
  }

  const expectedStrokes = totalStrokes || 1;
  const userStrokes = Math.max(1, userStrokesCount);

  // Tỷ lệ bao phủ nét chữ mẫu (Coverage)
  const coverageRate = tplCount > 0 ? (overlapCount / tplCount) : 0;
  
  // Độ chuẩn xác (Precision - không vẽ quẹt lung tung ra ngoài)
  const precisionRate = inkedCount > 0 ? (userInBounds / inkedCount) : 0;

  // Độ khớp số nét (Stroke count alignment)
  const strokeDiff = Math.abs(userStrokes - expectedStrokes);
  const strokeFactor = Math.max(0.6, 1.0 - (strokeDiff * 0.08));

  // Tính điểm tổng hợp (Thang điểm 100)
  // Coverage đóng góp 55%, Precision đóng góp 30%, Bút thuận & số nét đóng góp 15%
  let calculatedScore = Math.round(
    (coverageRate * 55 + precisionRate * 30 + strokeFactor * 15) * 1.25
  );

  // Thưởng điểm cho nét bút thanh thoát
  if (coverageRate > 0.45 && precisionRate > 0.40) {
    calculatedScore = Math.max(70, calculatedScore);
  }
  if (coverageRate > 0.70 && precisionRate > 0.65) {
    calculatedScore = Math.max(88, calculatedScore);
  }

  const finalScore = Math.min(100, Math.max(35, calculatedScore));

  return {
    score: finalScore,
    coverage: Math.round(coverageRate * 100),
    accuracy: Math.round(precisionRate * 100),
    strokeCount: userStrokes,
    expectedStrokes: expectedStrokes,
    isEmpty: false
  };
}

/**
 * Người dùng bấm nút "Chấm điểm"
 */
function triggerWritingGrading() {
  const result = evaluateCalligraphy();
  showGradingReport(result);
}

/**
 * Hiển thị Bảng Chấm Điểm Thư Pháp (Overlay)
 */
function showGradingReport(result = null) {
  const overlay = document.getElementById('writing-grade-overlay');
  if (!overlay) return;

  if (!result) result = evaluateCalligraphy();

  const scoreNumEl = document.getElementById('grade-score-num');
  const titleEl = document.getElementById('grade-title');
  const feedbackEl = document.getElementById('grade-feedback');
  const strokesEl = document.getElementById('grade-detail-strokes');
  const mistakesEl = document.getElementById('grade-detail-mistakes');
  const flickEl = document.getElementById('grade-detail-flick');
  const badgeCircle = document.getElementById('grade-badge-circle');
  const nextCharBtn = document.getElementById('btn-next-char-grade');

  if (result.isEmpty) {
    if (scoreNumEl) scoreNumEl.textContent = '0';
    if (badgeCircle) badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-slate-600 bg-slate-900 flex flex-col items-center justify-center mb-2';
    if (titleEl) {
      titleEl.textContent = 'Chưa Có Nét Viết';
      titleEl.className = 'text-sm font-black text-slate-300';
    }
    if (feedbackEl) feedbackEl.textContent = result.feedback;
    if (strokesEl) strokesEl.textContent = '0 nét';
    if (mistakesEl) mistakesEl.textContent = 'Chưa viết';
    if (flickEl) flickEl.textContent = 'Chưa có';
    overlay.classList.remove('hidden');
    return;
  }

  const score = result.score;
  if (scoreNumEl) scoreNumEl.textContent = score;
  if (strokesEl) strokesEl.textContent = `${result.strokeCount}/${result.expectedStrokes} nét`;
  if (mistakesEl) mistakesEl.textContent = `${result.coverage}% chuẩn`;
  if (flickEl) flickEl.textContent = score >= 85 ? '100% Sắc nét' : (score >= 70 ? '85% Rất tốt' : '70% Đạt');

  if (score >= 90) {
    if (badgeCircle) badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-emerald-500/80 bg-emerald-950/60 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/30 mb-2';
    if (scoreNumEl) scoreNumEl.className = 'text-2xl font-black text-emerald-400';
    if (titleEl) {
      titleEl.textContent = '🏆 Xuất Sắc - Thư Pháp Chuẩn Mực';
      titleEl.className = 'text-sm font-black text-emerald-300';
    }
    if (feedbackEl) feedbackEl.textContent = 'Nét bút thanh thoát, dứt khoát! Nét hất và móc câu cực kỳ sắc sảo, cấu trúc chữ cân đối tuyệt đẹp!';
    playWritingSound('fanfare');
  } else if (score >= 75) {
    if (badgeCircle) badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-cyan-500/80 bg-cyan-950/60 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20 mb-2';
    if (scoreNumEl) scoreNumEl.className = 'text-2xl font-black text-cyan-400';
    if (titleEl) {
      titleEl.textContent = '🌟 Rất Tốt - Nét Chữ Thanh Thoát';
      titleEl.className = 'text-sm font-black text-cyan-300';
    }
    if (feedbackEl) feedbackEl.textContent = 'Nét chữ khá đẹp và vững vàng. Nét hất/móc dứt khoát, rèn thêm độ gọn gàng sẽ đạt 100 điểm!';
    playWritingSound('success');
  } else if (score >= 50) {
    if (badgeCircle) badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-amber-500/80 bg-amber-950/60 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 mb-2';
    if (scoreNumEl) scoreNumEl.className = 'text-2xl font-black text-amber-400';
    if (titleEl) {
      titleEl.textContent = '👍 Đạt Yêu Cầu - Cần Rèn Thêm';
      titleEl.className = 'text-sm font-black text-amber-300';
    }
    if (feedbackEl) feedbackEl.textContent = 'Đã viết được dáng chữ. Bạn chú ý nét hất và nét móc kéo dứt khoát hơn một chút nữa nhé!';
    playWritingSound('good');
  } else {
    if (badgeCircle) badgeCircle.className = 'w-16 h-16 rounded-full border-4 border-rose-500/80 bg-rose-950/60 flex flex-col items-center justify-center shadow-lg shadow-rose-500/30 mb-2';
    if (scoreNumEl) scoreNumEl.className = 'text-2xl font-black text-rose-400';
    if (titleEl) {
      titleEl.textContent = '✍️ Cần Luyện Thêm Dáng Chữ';
      titleEl.className = 'text-sm font-black text-rose-300';
    }
    if (feedbackEl) feedbackEl.textContent = 'Nét viết hơi chệch so với khung mễ tự cách. Hãy bấm "Xem mẫu" để xem lại các bước nét rồi thử lại nhé!';
    playWritingSound('try_again');
  }

  // Nút chuyển chữ tiếp theo nếu từ ghép
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
  clearCalligraphyCanvas();
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
    const startX = offsetX + startPt[0] * scale;
    const startY = 320 - (offsetY + startPt[1] * scale);

    if (showNumbers) {
      const numBadge = document.createElement('div');
      numBadge.className = 'absolute flex items-center justify-center w-5 h-5 rounded-full bg-slate-900/90 border border-slate-600 text-white font-bold text-xs shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2';
      numBadge.style.left = `${startX}px`;
      numBadge.style.top = `${startY}px`;
      numBadge.textContent = idx + 1;
      overlay.appendChild(numBadge);
    }

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

function jumpToStroke(strokeIdx) {
  if (!currentWriter) return;
  highlightFilmstripStep(strokeIdx + 1);
  currentWriter.showCharacter();
}

/**
 * Chạy hoạt họa xem mẫu nét
 */
function toggleAnimate() {
  if (!currentWriter) return;

  if (currentMode === 'animating') {
    currentWriter.pauseAnimation();
    currentMode = 'idle';
    updatePlayBtn(false);
  } else {
    closeGradeOverlay();
    currentMode = 'animating';
    updatePlayBtn(true);
    currentWriter.animateCharacter({
      onComplete: function() {
        currentMode = 'idle';
        updatePlayBtn(false);
        highlightFilmstripStep(totalStrokes);
      }
    });
  }
}

/**
 * Chế độ Viết lại / Reset
 */
function resetWriting() {
  closeGradeOverlay();
  clearCalligraphyCanvas();
  if (currentWriter) {
    currentWriter.cancelAnimation?.();
    currentWriter.hideCharacter?.();
  }
}

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

  const toggleNumbers = document.getElementById('toggle-numbers');
  if (toggleNumbers) {
    toggleNumbers.addEventListener('change', (e) => {
      showNumbers = e.target.checked;
      getStrokeData(currentChar).then(renderStrokeGuides);
    });
  }

  const toggleArrows = document.getElementById('toggle-arrows');
  if (toggleArrows) {
    toggleArrows.addEventListener('change', (e) => {
      showArrows = e.target.checked;
      getStrokeData(currentChar).then(renderStrokeGuides);
    });
  }

  const toggleAudio = document.getElementById('toggle-audio');
  if (toggleAudio) {
    toggleAudio.addEventListener('change', (e) => {
      isAudioEnabled = e.target.checked;
    });
  }

  const selSpeed = document.getElementById('opt-speed');
  if (selSpeed) {
    selSpeed.addEventListener('change', () => {
      if (currentChar) loadCharacter(currentChar);
    });
  }

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
window.resetWriting = resetWriting;
window.clearCalligraphyCanvas = clearCalligraphyCanvas;
window.printPracticeSheet = printPracticeSheet;
