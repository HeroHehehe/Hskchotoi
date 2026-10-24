/**
 * ==============================================================================
 * TRUNG TÂM LUYỆN NHỚ & GAME HỌC TẬP HSK 1 (MEMORY TRAINING HUB)
 * ==============================================================================
 * 6 Chế độ luyện nhớ thông minh - Mỗi mini game là 1 TIẾN TRÌNH ĐỘC LẬP:
 *  1. 🎯 Trắc nghiệm nghĩa: Nhìn Hán tự -> Chọn nghĩa tiếng Việt
 *  2. 🎧 Nghe âm đoán từ: Nghe giọng đọc bản xứ -> Đoán nghĩa hoặc đoán chữ Hán
 *  3. ✍️ Luyện viết tự do: Tự vẽ nét chữ Hán trên Canvas, đánh giá khi viết xong
 *  4. 🧩 Ghép cặp nối từ (Duolingo Style): Nối các thẻ Chữ Hán với Tiếng Việt
 *  5. 🔍 Nhìn tiếng Việt đoán Chữ Hán: Nhớ chủ động mặt chữ Hán
 *  6. ⚡ Flashcard 3D Thông minh (SRS): Lật thẻ ghi nhớ & đánh giá Đã thuộc / Chưa thuộc
 *
 * Tính năng nổi bật:
 *  - Mỗi mini game có hàng đợi (queue) riêng, từ trả lời đúng sẽ KHÔNG xuất hiện lại trong game đó
 *  - Luyện viết Hanzi tự do: vẽ tự nhiên trên Canvas, không ép thứ tự nét, chấm điểm khi hoàn thành
 *  - Nút Reset tiến độ cho từng game và cho toàn bài học
 *  - Hiệu ứng âm thanh chân thực (Web Audio API)
 * ==============================================================================
 */

// Trạng thái chung của hệ thống Luyện Nhớ
window.MEMORY_HUB = {
  activeMode: 'meaning_quiz', // 'meaning_quiz', 'listening_quiz', 'hanzi_recall', 'match_cards', 'hanzi_quiz', 'flashcard'
  listeningSubMode: 'vi', // 'vi' (nghe -> đoán tiếng Việt) hoặc 'zh' (nghe -> đoán chữ Hán)
  currentLessonId: null,

  // Tiến trình RIÊNG BIỆT của từng mini game
  // gameQueues[mode]: Danh sách từ còn lại cần học trong mini-game đó
  // gameCompleted[mode]: Danh sách ID các từ đã vượt qua thành công trong mini-game đó
  // gameStats[mode]: Thống kê Đúng/Sai/Điểm số riêng của từng mini-game
  gameQueues: {
    meaning_quiz: [],
    listening_quiz: [],
    hanzi_recall: [],
    match_cards: [],
    hanzi_quiz: [],
    flashcard: []
  },
  gameCompleted: {
    meaning_quiz: [],
    listening_quiz: [],
    hanzi_recall: [],
    match_cards: [],
    hanzi_quiz: [],
    flashcard: []
  },
  gameStats: {
    meaning_quiz: { correct: 0, wrong: 0, score: 0 },
    listening_quiz: { correct: 0, wrong: 0, score: 0 },
    hanzi_recall: { correct: 0, wrong: 0, score: 0 },
    match_cards: { correct: 0, wrong: 0, score: 0 },
    hanzi_quiz: { correct: 0, wrong: 0, score: 0 },
    flashcard: { correct: 0, wrong: 0, score: 0 }
  },

  currentWord: null,

  // Trạng thái game Ghép Cặp (Match Cards)
  matchCards: {
    pairs: [],
    selectedZh: null,
    selectedVi: null,
    matchedCount: 0,
    totalPairs: 5
  },

  // Trạng thái Luyện Viết Tự Do
  recall: {
    canvas: null,
    ctx: null,
    isDrawing: false,
    hasDrawn: false,
    outlineVisible: true,
    charIndex: 0,
    writerInstance: null
  }
};

// Khởi tạo Audio Context để phát âm thanh hiệu ứng (Ding / Buzz / Match)
let memoryAudioCtx = null;
function playSoundEffect(type) {
  try {
    if (!memoryAudioCtx) {
      memoryAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (memoryAudioCtx.state === 'suspended') {
      memoryAudioCtx.resume();
    }
    const osc = memoryAudioCtx.createOscillator();
    const gain = memoryAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(memoryAudioCtx.destination);

    const now = memoryAudioCtx.currentTime;
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.15); // B5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(146.83, now + 0.2); // D3
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'match') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    console.warn("Không phát được âm thanh hiệu ứng:", e);
  }
}

/**
 * Quản lý Kho Từ Đã Thuộc trong LocalStorage
 */
function getMasteredWords() {
  try {
    const data = localStorage.getItem('hsk1_mastered_words');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function setWordMastered(wordId, isMastered = true) {
  try {
    let list = getMasteredWords();
    if (isMastered) {
      if (!list.includes(wordId)) list.push(wordId);
    } else {
      list = list.filter(id => id !== wordId);
    }
    localStorage.setItem('hsk1_mastered_words', JSON.stringify(list));
    updateMasteredDisplay();
    if (window.renderVocabList) window.renderVocabList();
    if (window.updateSidebarProgress) window.updateSidebarProgress();
  } catch (e) {
    console.warn("Lỗi lưu từ đã thuộc:", e);
  }
}

function updateMasteredDisplay() {
  const masteredList = getMasteredWords();
  const allVocab = window.VOCAB_DATABASE || [];
  const currentLessonWords = window.getCurrentLessonWords ? window.getCurrentLessonWords() : allVocab;
  
  const masteredInLesson = currentLessonWords.filter(w => masteredList.includes(w.id)).length;
  const totalInLesson = currentLessonWords.length || 1;
  const percentLesson = Math.round((masteredInLesson / totalInLesson) * 100);

  const lessonStatEl = document.getElementById('hub-lesson-mastered-stat');
  if (lessonStatEl) {
    lessonStatEl.textContent = `Bài này: ${masteredInLesson}/${totalInLesson} từ (${percentLesson}%)`;
  }
  
  const totalStatEl = document.getElementById('hub-total-mastered-stat');
  if (totalStatEl) {
    const totalMastered = masteredList.length;
    const totalVocab = allVocab.length || 300;
    const totalPercent = Math.round((totalMastered / totalVocab) * 100);
    totalStatEl.textContent = `HSK 1: ${totalMastered}/${totalVocab} từ (${totalPercent}%)`;
  }
}

/**
 * Khởi tạo hàng đợi riêng biệt cho từng mini-game của bài học
 */
function initGameQueues(lessonId, forceReset = false) {
  const hub = window.MEMORY_HUB;
  const lessonChanged = hub.currentLessonId !== lessonId;
  hub.currentLessonId = lessonId;

  const lessonWords = window.getCurrentLessonWords ? window.getCurrentLessonWords() : (window.VOCAB_DATABASE || []);
  const modes = ['meaning_quiz', 'listening_quiz', 'hanzi_recall', 'match_cards', 'hanzi_quiz', 'flashcard'];

  modes.forEach(m => {
    if (forceReset || lessonChanged || !hub.gameQueues[m] || hub.gameQueues[m].length === 0 && hub.gameCompleted[m].length === 0) {
      hub.gameQueues[m] = [...lessonWords].sort(() => Math.random() - 0.5);
      hub.gameCompleted[m] = [];
      hub.gameStats[m] = { correct: 0, wrong: 0, score: 0 };
    }
  });
}

/**
 * Đặt lại hàng đợi cho mini-game hiện tại
 */
function resetCurrentModeQueue() {
  const hub = window.MEMORY_HUB;
  const m = hub.activeMode;
  const lessonWords = window.getCurrentLessonWords ? window.getCurrentLessonWords() : (window.VOCAB_DATABASE || []);
  hub.gameQueues[m] = [...lessonWords].sort(() => Math.random() - 0.5);
  hub.gameCompleted[m] = [];
  hub.gameStats[m] = { correct: 0, wrong: 0, score: 0 };

  const summaryBox = document.getElementById('hub-summary-screen');
  const gameArea = document.getElementById('hub-game-area');
  if (summaryBox) summaryBox.classList.add('hidden');
  if (gameArea) gameArea.classList.remove('hidden');

  loadCurrentQuestion();
}

/**
 * Đặt lại toàn bộ hàng đợi bài học cho tất cả mini-game
 */
function resetLessonQueues(lessonId) {
  initGameQueues(lessonId, true);
}
window.MEMORY_HUB.resetLessonQueues = resetLessonQueues;
window.MEMORY_HUB.resetCurrentModeQueue = resetCurrentModeQueue;

/**
 * Mở Trung Tâm Luyện Nhớ (Memory Hub Modal)
 */
function openMemoryHub(initialMode = 'meaning_quiz') {
  const modal = document.getElementById('memory-hub-modal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const currentLId = window.currentLesson || 1;
  initGameQueues(currentLId, false);

  const hub = window.MEMORY_HUB;
  hub.activeMode = initialMode;

  updateMasteredDisplay();
  setHubTab(initialMode);
}

function closeMemoryHub() {
  const modal = document.getElementById('memory-hub-modal');
  if (modal) modal.classList.add('hidden');
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

/**
 * Chuyển đổi qua lại giữa 6 chế độ chơi
 */
function setHubTab(mode) {
  const hub = window.MEMORY_HUB;
  hub.activeMode = mode;

  const tabs = ['meaning_quiz', 'listening_quiz', 'hanzi_recall', 'match_cards', 'hanzi_quiz', 'flashcard'];
  tabs.forEach(m => {
    const btn = document.getElementById(`hub-tab-${m}`);
    if (btn) {
      if (m === mode) {
        btn.className = "px-3 py-1.5 rounded-xl text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 whitespace-nowrap scale-105";
      } else {
        btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5 whitespace-nowrap";
      }
    }
  });

  const summaryBox = document.getElementById('hub-summary-screen');
  const gameArea = document.getElementById('hub-game-area');
  if (summaryBox) summaryBox.classList.add('hidden');
  if (gameArea) gameArea.classList.remove('hidden');

  loadCurrentQuestion();
}

/**
 * Tải câu hỏi hiện tại cho chế độ đang chọn
 */
function loadCurrentQuestion() {
  const hub = window.MEMORY_HUB;
  const gameArea = document.getElementById('hub-game-area');
  if (!gameArea) return;

  const currentQueue = hub.gameQueues[hub.activeMode] || [];

  // Nếu hàng đợi của chế độ này đã hết -> Đã hoàn thành trò chơi!
  if (currentQueue.length === 0 && hub.activeMode !== 'match_cards') {
    renderSummaryScreen();
    return;
  }

  hub.currentWord = currentQueue[0] || null;

  updateProgressBar();

  switch (hub.activeMode) {
    case 'meaning_quiz':
      renderMeaningQuiz(gameArea);
      break;
    case 'listening_quiz':
      renderListeningQuiz(gameArea);
      break;
    case 'hanzi_recall':
      renderHanziRecall(gameArea);
      break;
    case 'match_cards':
      renderMatchCards(gameArea);
      break;
    case 'hanzi_quiz':
      renderHanziQuiz(gameArea);
      break;
    case 'flashcard':
      renderFlashcard(gameArea);
      break;
    default:
      renderMeaningQuiz(gameArea);
  }
}

/**
 * Cập nhật thanh tiến độ X/Y, Đúng/Sai, Điểm số của RIÊNG chế độ này
 */
function updateProgressBar() {
  const hub = window.MEMORY_HUB;
  const mode = hub.activeMode;
  const queue = hub.gameQueues[mode] || [];
  const completed = hub.gameCompleted[mode] || [];
  const stats = hub.gameStats[mode] || { correct: 0, wrong: 0, score: 0 };
  
  const lessonWords = window.getCurrentLessonWords ? window.getCurrentLessonWords() : (window.VOCAB_DATABASE || []);
  const totalLessonWords = lessonWords.length || (queue.length + completed.length) || 1;
  const completedCount = completed.length;
  const percent = Math.min(100, Math.round((completedCount / totalLessonWords) * 100));

  const counterEl = document.getElementById('hub-progress-counter');
  if (counterEl) {
    counterEl.textContent = `Đã thuộc: ${completedCount}/${totalLessonWords} từ (Còn lại ${queue.length} từ)`;
  }

  const fillEl = document.getElementById('hub-progress-fill');
  if (fillEl) {
    fillEl.style.width = `${percent}%`;
  }

  const scoreEl = document.getElementById('hub-score-badge');
  if (scoreEl) {
    scoreEl.innerHTML = `
      <span class="text-emerald-400 font-bold">🟢 ${stats.correct}</span>
      <span class="text-slate-500">|</span>
      <span class="text-rose-400 font-bold">🔴 ${stats.wrong}</span>
      <span class="text-slate-500">|</span>
      <span class="text-amber-300 font-bold">⭐ ${stats.score} đ</span>
    `;
  }
}

/**
 * ==============================================================================
 * TRÒ 1: TRẮC NGHIỆM NGHĨA TỪ (Nhìn Chữ Hán & Pinyin -> Chọn Nghĩa Tiếng Việt)
 * ==============================================================================
 */
function renderMeaningQuiz(container) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) { renderSummaryScreen(); return; }
  const allWords = window.VOCAB_DATABASE || [];

  // Tạo 4 lựa chọn (1 đúng + 3 ngẫu nhiên)
  const options = [word.meaning];
  while (options.length < Math.min(4, allWords.length)) {
    const randomW = allWords[Math.floor(Math.random() * allWords.length)];
    if (!options.includes(randomW.meaning)) {
      options.push(randomW.meaning);
    }
  }
  options.sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <!-- Thẻ từ vựng mục tiêu -->
      <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 text-center relative overflow-hidden group">
        <button onclick="speakChinese('${word.hanzi}')" class="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md" title="Nghe phát âm">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </button>

        <span class="text-6xl sm:text-7xl font-black text-white chinese-font drop-shadow-lg tracking-wider">${word.hanzi}</span>
        <p class="text-xl font-bold text-cyan-400 italic mt-3">${word.pinyin}</p>
        <p class="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mt-1">Chọn nghĩa tiếng Việt tương ứng</p>
      </div>

      <!-- 4 Lựa chọn -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="quiz-options-box">
        ${options.map(opt => `
          <button onclick="handleOptionSelect(this, '${escapeHtml(opt)}', '${escapeHtml(word.meaning)}')" class="p-4 rounded-2xl text-left font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:border-blue-500/80 hover:bg-slate-850 hover:text-white transition-all text-sm leading-snug shadow-md flex items-center justify-between group">
            <span>${opt}</span>
            <span class="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-xs text-slate-500 group-hover:border-blue-400 group-hover:text-blue-300 transition-colors">👉</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * ==============================================================================
 * TRÒ 2: 🎧 NGHE ÂM ĐOÁN TỪ (Listening Challenge)
 * ==============================================================================
 */
function renderListeningQuiz(container) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) { renderSummaryScreen(); return; }
  const allWords = window.VOCAB_DATABASE || [];
  const isViMode = hub.listeningSubMode === 'vi';

  setTimeout(() => speakChinese(word.hanzi, 1.0), 250);

  let options = [];
  if (isViMode) {
    options = [word.meaning];
    while (options.length < Math.min(4, allWords.length)) {
      const r = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.includes(r.meaning)) options.push(r.meaning);
    }
  } else {
    options = [{ hanzi: word.hanzi, pinyin: word.pinyin, correct: true }];
    while (options.length < Math.min(4, allWords.length)) {
      const r = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.some(o => o.hanzi === r.hanzi)) {
        options.push({ hanzi: r.hanzi, pinyin: r.pinyin, correct: false });
      }
    }
  }
  options.sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <!-- Switch Chế độ: Đoán Tiếng Việt vs Đoán Chữ Hán -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <span class="text-xs text-slate-400 font-bold flex items-center gap-1.5">
          <span>🎧</span> Thử Thách Phản Xạ Nghe Bản Xứ
        </span>
        <div class="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button onclick="toggleListeningSubMode('vi')" class="px-2.5 py-1 rounded-lg text-xs font-bold ${isViMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'} transition-all">
            Đoán Tiếng Việt
          </button>
          <button onclick="toggleListeningSubMode('zh')" class="px-2.5 py-1 rounded-lg text-xs font-bold ${!isViMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'} transition-all">
            Đoán Chữ Hán
          </button>
        </div>
      </div>

      <!-- Hộp Loa Phát Âm Trung Tâm -->
      <div class="p-8 rounded-3xl bg-slate-950/70 border border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
        <button onclick="speakChinese('${word.hanzi}', 1.0)" class="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all ring-8 ring-blue-500/20 group">
          <svg class="w-12 h-12 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        </button>

        <div class="flex items-center gap-2">
          <button onclick="speakChinese('${word.hanzi}', 1.0)" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1">
            ▶️ Tốc độ chuẩn 1.0x
          </button>
          <button onclick="speakChinese('${word.hanzi}', 0.75)" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1">
            🐢 Tốc độ chậm 0.75x
          </button>
        </div>

        <p class="text-xs text-slate-400">Bấm loa để nghe lại âm thanh mẫu chuẩn Bắc Kinh</p>
      </div>

      <!-- Danh sách lựa chọn -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${isViMode ? options.map(opt => `
          <button onclick="handleOptionSelect(this, '${escapeHtml(opt)}', '${escapeHtml(word.meaning)}')" class="p-4 rounded-2xl text-left font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:border-blue-500/80 hover:bg-slate-850 hover:text-white transition-all text-sm leading-snug shadow-md flex items-center justify-between">
            <span>${opt}</span>
            <span class="text-slate-500 text-xs">👉</span>
          </button>
        `).join('') : options.map(opt => `
          <button onclick="handleOptionSelect(this, '${opt.hanzi}', '${word.hanzi}')" class="p-4 rounded-2xl text-center font-bold text-white bg-slate-900 border border-slate-800 hover:border-blue-500/80 hover:bg-slate-850 transition-all shadow-md space-y-1">
            <span class="text-3xl font-black chinese-font block">${opt.hanzi}</span>
            <span class="text-xs text-cyan-400 font-mono italic block">${opt.pinyin}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleListeningSubMode(subMode) {
  window.MEMORY_HUB.listeningSubMode = subMode;
  loadCurrentQuestion();
}

/**
 * ==============================================================================
 * TRÒ 3: ✍️ LUYỆN VIẾT CHỮ HÁN TỰ DO (Đánh giá hoàn thành, không ép thứ tự nét)
 * ==============================================================================
 */
function renderHanziRecall(container) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) { renderSummaryScreen(); return; }

  const chars = Array.from(word.hanzi);
  const targetChar = chars[hub.recall.charIndex] || chars[0] || '你';

  container.innerHTML = `
    <div class="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <!-- Đề bài: Cho Pinyin & Nghĩa tiếng Việt -->
      <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <span class="text-xs text-blue-400 font-black uppercase tracking-wider block">Hãy viết chữ Hán:</span>
          <p class="text-2xl font-black text-cyan-300 italic mt-0.5">${word.pinyin}</p>
          <p class="text-sm font-bold text-slate-200 mt-0.5">${word.meaning}</p>
        </div>

        <div class="flex items-center gap-2">
          ${chars.length > 1 ? `
            <div class="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              ${chars.map((c, idx) => `
                <button onclick="selectRecallChar(${idx})" class="px-2.5 py-1 rounded-lg text-xs font-bold ${idx === hub.recall.charIndex ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}">
                  Chữ ${idx + 1} (${c})
                </button>
              `).join('')}
            </div>
          ` : ''}
          <button onclick="speakChinese('${word.hanzi}')" class="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md" title="Nghe phát âm">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          </button>
        </div>
      </div>

      <!-- Khung vẽ chữ Hán Canvas tự do -->
      <div class="flex flex-col items-center justify-center space-y-3">
        <!-- Vùng vẽ kích thước chuẩn 260x260 với lưới 米 tự (Tianzige) -->
        <div id="recall-draw-container" class="w-[260px] h-[260px] bg-slate-950 rounded-3xl border-2 border-slate-700 shadow-2xl relative overflow-hidden flex items-center justify-center select-none touch-none">
          
          <!-- Lưới ô chữ điền 米 tự mờ -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 260 260">
            <line x1="0" y1="130" x2="260" y2="130" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 5"/>
            <line x1="130" y1="0" x2="130" y2="260" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 5"/>
            <line x1="0" y1="0" x2="260" y2="260" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/>
            <line x1="260" y1="0" x2="0" y2="260" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/>
          </svg>

          <!-- Nét mờ chữ mẫu trong nền (HanziWriter Outline hoặc Font mờ) -->
          <div id="recall-outline-target" class="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300">
            <span id="recall-outline-char" class="text-[170px] font-black text-slate-700/60 chinese-font leading-none select-none">${targetChar}</span>
          </div>

          <!-- HTML5 Canvas để người dùng tự do vẽ mọi nét theo ý muốn -->
          <canvas id="recall-canvas" width="260" height="260" class="absolute inset-0 w-full h-full cursor-crosshair z-10"></canvas>
        </div>

        <!-- Trạng thái nét vẽ -->
        <p id="recall-status-text" class="text-xs font-bold text-slate-400 text-center min-h-[20px]">
          ✍️ Vẽ tự do bằng chuột hoặc chạm tay vào ô trên
        </p>

        <!-- Dãy nút công cụ: Xóa, Ẩn/Hiện nét mờ, Xem nét mẫu, ĐÃ VIẾT XONG -->
        <div class="flex items-center gap-2 flex-wrap justify-center pt-1">
          <!-- Xóa viết lại -->
          <button onclick="clearRecallCanvas()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 shadow-md">
            🗑️ Xóa nét
          </button>

          <!-- Ẩn/Hiện nét mờ -->
          <button onclick="toggleRecallOutline()" id="btn-toggle-outline" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 shadow-md">
            👁️ Nét mờ: Bật
          </button>

          <!-- Xem chữ mẫu phát động -->
          <button onclick="animateRecallChar('${targetChar}')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 shadow-md">
            ▶️ Xem mẫu viết
          </button>

          <!-- Nút ĐÃ VIẾT XONG / KIỂM TRA (Người dùng đánh giá thành phẩm) -->
          <button onclick="submitRecallWord()" class="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 transform active:scale-95">
            ✓ Đã viết xong (Chấm điểm)
          </button>

          <!-- Nút Chưa nhớ / Bỏ qua -->
          <button onclick="skipRecallWord()" class="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-rose-300 text-xs font-bold border border-slate-700 hover:border-rose-800/60 transition-all">
            Chưa nhớ (Bỏ qua)
          </button>
        </div>
      </div>
    </div>
  `;

  initRecallCanvas();
}

function selectRecallChar(idx) {
  window.MEMORY_HUB.recall.charIndex = idx;
  renderHanziRecall(document.getElementById('hub-game-area'));
}

/**
 * Khởi tạo bảng vẽ Canvas tự do (hỗ trợ cả Chuột và Cảm ứng Mobile mượt mà)
 */
function initRecallCanvas() {
  const canvas = document.getElementById('recall-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const hub = window.MEMORY_HUB;
  hub.recall.canvas = canvas;
  hub.recall.ctx = ctx;
  hub.recall.isDrawing = false;
  hub.recall.hasDrawn = false;

  ctx.strokeStyle = '#38bdf8'; // Màu xanh cyan đẹp mắt
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDrawing(e) {
    e.preventDefault();
    hub.recall.isDrawing = true;
    hub.recall.hasDrawn = true;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!hub.recall.isDrawing) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDrawing(e) {
    if (hub.recall.isDrawing) {
      hub.recall.isDrawing = false;
      ctx.closePath();
    }
  }

  // Sự kiện chuột máy tính
  canvas.onmousedown = startDrawing;
  canvas.onmousemove = draw;
  canvas.onmouseup = stopDrawing;
  canvas.onmouseleave = stopDrawing;

  // Sự kiện cảm ứng điện thoại / máy tính bảng
  canvas.ontouchstart = startDrawing;
  canvas.ontouchmove = draw;
  canvas.ontouchend = stopDrawing;
  canvas.ontouchcancel = stopDrawing;
}

function clearRecallCanvas() {
  const hub = window.MEMORY_HUB;
  if (hub.recall.ctx && hub.recall.canvas) {
    hub.recall.ctx.clearRect(0, 0, hub.recall.canvas.width, hub.recall.canvas.height);
    hub.recall.hasDrawn = false;
    const st = document.getElementById('recall-status-text');
    if (st) st.innerHTML = "✍️ Vẽ tự do bằng chuột hoặc chạm tay vào ô trên";
  }
}

function toggleRecallOutline() {
  const hub = window.MEMORY_HUB;
  hub.recall.outlineVisible = !hub.recall.outlineVisible;
  const target = document.getElementById('recall-outline-target');
  const btn = document.getElementById('btn-toggle-outline');
  if (target) {
    target.style.opacity = hub.recall.outlineVisible ? '1' : '0';
  }
  if (btn) {
    btn.innerHTML = hub.recall.outlineVisible ? '👁️ Nét mờ: Bật' : '👁️ Nét mờ: Tắt';
    btn.className = btn.className.replace(
      hub.recall.outlineVisible ? 'text-slate-400' : 'text-cyan-300',
      hub.recall.outlineVisible ? 'text-cyan-300' : 'text-slate-400'
    );
  }
}

function animateRecallChar(char) {
  const container = document.getElementById('recall-outline-target');
  if (!container || !window.HanziWriter) return;
  container.innerHTML = '';

  try {
    const writer = HanziWriter.create(container, char, {
      width: 260,
      height: 260,
      padding: 20,
      showOutline: true,
      strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 120,
      strokeColor: '#38bdf8',
      radicalColor: '#f43f5e',
      outlineColor: '#475569'
    });
    writer.animateCharacter();
  } catch (e) {
    console.warn("Lỗi animation chữ mẫu:", e);
  }
}

/**
 * Đánh giá chữ Hán người dùng đã vẽ trên Canvas:
 * - So sánh giữa nét vẽ của người dùng và hình mẫu chữ Hán mục tiêu
 * - KHÔNG ép thứ tự từng nét
 * - Kiểm tra độ phủ (Coverage >= 42%) và độ chính xác (Precision >= 42%)
 * - Tránh việc vẽ 1 nét gạch, vẽ bậy bạ, hoặc vẽ thiếu nét
 */
function evaluateDrawnCharacter(userCanvas, targetChar) {
  if (!userCanvas) return { isPassed: false, score: 0, reason: "Không tìm thấy bảng vẽ." };

  const W = userCanvas.width || 260;
  const H = userCanvas.height || 260;
  const userCtx = userCanvas.getContext('2d');
  const userImgData = userCtx.getImageData(0, 0, W, H);
  const userPixels = userImgData.data;

  // 1. Tạo Canvas đối chiếu vẽ chữ Hán mẫu
  const refCanvas = document.createElement('canvas');
  refCanvas.width = W;
  refCanvas.height = H;
  const refCtx = refCanvas.getContext('2d');
  refCtx.fillStyle = '#ffffff';
  refCtx.font = 'bold 165px "Ma Shan Zheng", "STKaiti", "KaiTi", "SimSun", "Noto Serif SC", "Microsoft YaHei", sans-serif';
  refCtx.textAlign = 'center';
  refCtx.textBaseline = 'middle';
  refCtx.fillText(targetChar, W / 2, H / 2);

  const refImgData = refCtx.getImageData(0, 0, W, H);
  const refPixels = refImgData.data;

  // 2. Thu thập các điểm người dùng đã vẽ (lấy mẫu step = 4)
  const step = 4;
  const drawnPoints = [];
  let userPointCount = 0;

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const idx = (y * W + x) * 4;
      if (userPixels[idx + 3] > 50) {
        drawnPoints.push({ x, y });
        userPointCount++;
      }
    }
  }

  // Nếu vẽ quá ít (dưới 45 điểm lấy mẫu, tương đương chưa viết nổi 1 nét tử tế)
  if (userPointCount < 45) {
    return {
      isPassed: false,
      score: 10,
      coverage: 10,
      precision: 10,
      reason: `Bạn vẽ quá ít nét. Hãy vẽ trọn vẹn chữ "${targetChar}" vào ô nhé!`
    };
  }

  // 3. Tính độ phủ (Coverage): Bao nhiêu % của chữ mẫu đã được tô trúng?
  // Bán kính dung sai cho nét cọ vẽ tay: 16px
  const hitRadiusSq = 16 * 16;
  let targetTotal = 0;
  let targetHit = 0;
  const targetMap = new Uint8Array(W * H);

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const idx = (y * W + x) * 4;
      if (refPixels[idx + 3] > 50) {
        targetTotal++;
        targetMap[y * W + x] = 1;

        let hit = false;
        for (let i = 0; i < drawnPoints.length; i++) {
          const dx = drawnPoints[i].x - x;
          const dy = drawnPoints[i].y - y;
          if (dx * dx + dy * dy <= hitRadiusSq) {
            hit = true;
            break;
          }
        }
        if (hit) {
          targetHit++;
        }
      }
    }
  }

  if (targetTotal === 0) targetTotal = 1;

  // 4. Tính độ chính xác (Precision): Bao nhiêu % nét vẽ nằm trên hoặc sát chữ mẫu?
  let userValidPoints = 0;
  for (let i = 0; i < drawnPoints.length; i++) {
    const px = drawnPoints[i].x;
    const py = drawnPoints[i].y;
    let nearTarget = false;

    for (let dy = -16; dy <= 16; dy += step) {
      const ny = py + dy;
      if (ny < 0 || ny >= H) continue;
      for (let dx = -16; dx <= 16; dx += step) {
        const nx = px + dx;
        if (nx < 0 || nx >= W) continue;
        if (targetMap[ny * W + nx] === 1) {
          nearTarget = true;
          break;
        }
      }
      if (nearTarget) break;
    }

    if (nearTarget) userValidPoints++;
  }

  const coverage = Math.round((targetHit / targetTotal) * 100);
  const precision = userPointCount > 0 ? Math.round((userValidPoints / userPointCount) * 100) : 0;
  const finalScore = Math.min(100, Math.round(coverage * 0.65 + precision * 0.35));

  // TIÊU CHÍ ĐÁNH GIÁ CHỮ CUỐI CÙNG:
  // - Độ phủ hình dáng chữ >= 42% (phải vẽ đủ các nét cấu thành chữ)
  // - Độ chính xác bám nét >= 42% (không vẽ bậy bạ ngoài khung)
  // - Điểm tổng hợp >= 45%
  const isPassed = coverage >= 42 && precision >= 42 && userPointCount >= 45;

  let reason = "";
  if (isPassed) {
    reason = `🎉 Xuất sắc! Nét viết chữ "${targetChar}" đạt ${finalScore}% độ chuẩn xác!`;
  } else if (coverage < 42) {
    reason = `⚠️ Chữ viết chưa hoàn thiện (độ phủ mới đạt ${coverage}%). Bạn vẽ thiếu nét rồi, hãy xem chữ mẫu và vẽ đủ các nét của chữ "${targetChar}" nhé!`;
  } else {
    reason = `⚠️ Nét vẽ bị lệch ra ngoài quá nhiều (độ chuẩn ${precision}%). Hãy bấm "Xóa nét" và vẽ lại bám theo chữ mẫu nhé!`;
  }

  return {
    isPassed,
    score: finalScore,
    coverage,
    precision,
    reason
  };
}

/**
 * Người dùng hoàn thành việc viết và bấm Chấm điểm
 */
function submitRecallWord() {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) return;

  const st = document.getElementById('recall-status-text');
  const drawContainer = document.getElementById('recall-draw-container');

  // Kiểm tra nếu người dùng chưa viết gì
  if (!hub.recall.hasDrawn) {
    if (st) st.innerHTML = `<span class="text-amber-400 font-bold">⚠️ Hãy dùng chuột hoặc ngón tay để vẽ chữ trước khi chấm điểm nhé!</span>`;
    return;
  }

  const chars = Array.from(word.hanzi);
  const targetChar = chars[hub.recall.charIndex] || chars[0] || '你';

  // Đánh giá thực chất nét vẽ của người dùng so với chữ mẫu
  const evalResult = evaluateDrawnCharacter(hub.recall.canvas, targetChar);

  if (!evalResult.isPassed) {
    // CHƯA ĐẠT: Báo lỗi cụ thể (thiếu nét hoặc vẽ lệch), rung viền đỏ, KHÔNG cho qua
    playSoundEffect('wrong');
    if (st) st.innerHTML = `<span class="text-rose-400 font-bold text-xs">${evalResult.reason}</span>`;
    if (drawContainer) {
      drawContainer.classList.remove('ring-4', 'ring-emerald-500/70', 'border-emerald-500');
      drawContainer.classList.add('ring-4', 'ring-rose-500/70', 'border-rose-500');
      setTimeout(() => {
        if (drawContainer) drawContainer.classList.remove('ring-4', 'ring-rose-500/70', 'border-rose-500');
      }, 900);
    }
    return;
  }

  // ĐẠT CHUẨN: Viết trọn vẹn chữ Hán!
  playSoundEffect('match');
  if (st) st.innerHTML = `<span class="text-emerald-400 font-black text-sm">${evalResult.reason}</span>`;
  if (drawContainer) {
    drawContainer.classList.remove('ring-4', 'ring-rose-500/70', 'border-rose-500');
    drawContainer.classList.add('ring-4', 'ring-emerald-500/70', 'border-emerald-500');
  }

  const mode = 'hanzi_recall';
  hub.gameStats[mode].score += 15;
  hub.gameStats[mode].correct++;

  // Nếu từ ghép có nhiều chữ (ví dụ: 你好 có 2 chữ)
  if (chars.length > 1 && hub.recall.charIndex < chars.length - 1) {
    setTimeout(() => {
      hub.recall.charIndex++;
      renderHanziRecall(document.getElementById('hub-game-area'));
    }, 1000);
    return;
  }

  // Đã viết xong tất cả chữ trong từ này
  if (!hub.gameCompleted[mode].includes(word.id)) {
    hub.gameCompleted[mode].push(word.id);
  }

  // Loại bỏ từ này khỏi hàng đợi hanzi_recall
  hub.gameQueues[mode] = hub.gameQueues[mode].filter(w => w.id !== word.id);
  setWordMastered(word.id, true);

  hub.recall.charIndex = 0;

  setTimeout(() => {
    loadCurrentQuestion();
  }, 1100);
}

function skipRecallWord() {
  const hub = window.MEMORY_HUB;
  const mode = 'hanzi_recall';
  hub.gameStats[mode].wrong++;

  // Đưa từ này về cuối hàng đợi để người dùng luyện lại sau
  if (hub.gameQueues[mode].length > 1) {
    const wrongW = hub.gameQueues[mode].shift();
    hub.gameQueues[mode].push(wrongW);
  }

  hub.recall.charIndex = 0;
  loadCurrentQuestion();
}

/**
 * ==============================================================================
 * TRÒ 4: 🧩 GHÉP CẶP NỐI TỪ (Flash Match - Phong cách Duolingo)
 * ==============================================================================
 */
function renderMatchCards(container) {
  const hub = window.MEMORY_HUB;
  const queue = hub.gameQueues['match_cards'] || [];

  if (queue.length === 0) {
    renderSummaryScreen();
    return;
  }

  // Lấy tối đa 5 từ trong hàng đợi của game này
  const selectedPairs = queue.slice(0, 5);
  hub.matchCards.pairs = selectedPairs;
  hub.matchCards.matchedCount = 0;
  hub.matchCards.totalPairs = selectedPairs.length;
  hub.matchCards.selectedZh = null;
  hub.matchCards.selectedVi = null;

  const zhCards = selectedPairs.map(w => ({ id: w.id, text: w.hanzi, sub: w.pinyin, type: 'zh' })).sort(() => Math.random() - 0.5);
  const viCards = selectedPairs.map(w => ({ id: w.id, text: w.meaning, type: 'vi' })).sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <span class="text-xs text-slate-400 font-bold flex items-center gap-1.5">
          <span>🧩</span> Bấm 1 thẻ Chữ Hán và 1 thẻ Tiếng Việt để ghép cặp
        </span>
        <span id="match-counter-badge" class="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/40 text-blue-300 font-black text-xs">
          0/${hub.matchCards.totalPairs} Cặp
        </span>
      </div>

      <!-- 2 Cột thẻ Ghép Cặp -->
      <div class="grid grid-cols-2 gap-3.5">
        <!-- Cột Trái: Chữ Hán -->
        <div class="space-y-2.5">
          <p class="text-[11px] text-slate-400 uppercase font-black tracking-wider text-center">Chữ Hán</p>
          ${zhCards.map(c => `
            <button id="card-zh-${c.id}" onclick="selectMatchCard('${c.id}', 'zh')" class="w-full p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-blue-500 text-center transition-all shadow-md active:scale-95 group">
              <span class="text-2xl sm:text-3xl font-black text-white chinese-font block group-hover:scale-105 transition-transform">${c.text}</span>
              <span class="text-[11px] text-cyan-400 font-mono italic block mt-0.5">${c.sub}</span>
            </button>
          `).join('')}
        </div>

        <!-- Cột Phải: Nghĩa Tiếng Việt -->
        <div class="space-y-2.5">
          <p class="text-[11px] text-slate-400 uppercase font-black tracking-wider text-center">Tiếng Việt</p>
          ${viCards.map(c => `
            <button id="card-vi-${c.id}" onclick="selectMatchCard('${c.id}', 'vi')" class="w-full p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-indigo-500 text-center transition-all shadow-md active:scale-95 flex items-center justify-center min-h-[72px]">
              <span class="text-xs sm:text-sm font-bold text-slate-200 leading-snug">${c.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function selectMatchCard(id, type) {
  const mc = window.MEMORY_HUB.matchCards;
  const wordId = Number(id);

  if (type === 'zh') {
    if (mc.selectedZh) {
      const prevEl = document.getElementById(`card-zh-${mc.selectedZh}`);
      if (prevEl) prevEl.className = prevEl.className.replace('border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/30', 'border-slate-800 bg-slate-900');
    }
    mc.selectedZh = wordId;
    const curEl = document.getElementById(`card-zh-${wordId}`);
    if (curEl) curEl.className = curEl.className.replace('border-slate-800 bg-slate-900', 'border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/30');
    
    const word = mc.pairs.find(p => p.id === wordId);
    if (word) speakChinese(word.hanzi);
  } else {
    if (mc.selectedVi) {
      const prevEl = document.getElementById(`card-vi-${mc.selectedVi}`);
      if (prevEl) prevEl.className = prevEl.className.replace('border-indigo-500 bg-indigo-950/40 ring-4 ring-indigo-500/30', 'border-slate-800 bg-slate-900');
    }
    mc.selectedVi = wordId;
    const curEl = document.getElementById(`card-vi-${wordId}`);
    if (curEl) curEl.className = curEl.className.replace('border-slate-800 bg-slate-900', 'border-indigo-500 bg-indigo-950/40 ring-4 ring-indigo-500/30');
  }

  if (mc.selectedZh && mc.selectedVi) {
    if (mc.selectedZh === mc.selectedVi) {
      // Đúng cặp!
      playSoundEffect('match');
      const matchedId = mc.selectedZh;
      const zhBtn = document.getElementById(`card-zh-${matchedId}`);
      const viBtn = document.getElementById(`card-vi-${matchedId}`);

      if (zhBtn) zhBtn.className = "w-full p-4 rounded-2xl bg-emerald-600/30 border-2 border-emerald-500 text-center transition-all opacity-40 pointer-events-none scale-95";
      if (viBtn) viBtn.className = "w-full p-4 rounded-2xl bg-emerald-600/30 border-2 border-emerald-500 text-center transition-all opacity-40 pointer-events-none scale-95 flex items-center justify-center min-h-[72px]";

      mc.matchedCount++;
      const mode = 'match_cards';
      window.MEMORY_HUB.gameStats[mode].score += 10;
      window.MEMORY_HUB.gameStats[mode].correct++;

      // 1. Thêm vào danh sách đã hoàn thành của game này
      if (!window.MEMORY_HUB.gameCompleted[mode].includes(matchedId)) {
        window.MEMORY_HUB.gameCompleted[mode].push(matchedId);
      }

      // 2. LOẠI BỎ TỪ NÀY KHỎI HÀNG ĐỢI MATCH_CARDS -> KHÔNG HIỆN LẠI NỮA
      window.MEMORY_HUB.gameQueues[mode] = window.MEMORY_HUB.gameQueues[mode].filter(w => w.id !== matchedId);

      // 3. Đánh dấu đã thuộc chung
      setWordMastered(matchedId, true);

      const counterBadge = document.getElementById('match-counter-badge');
      if (counterBadge) counterBadge.textContent = `${mc.matchedCount}/${mc.totalPairs} Cặp`;

      mc.selectedZh = null;
      mc.selectedVi = null;

      // Nếu đã ghép hết 5 cặp của lượt này
      if (mc.matchedCount >= mc.totalPairs) {
        setTimeout(() => {
          if (window.MEMORY_HUB.gameQueues[mode].length === 0) {
            renderSummaryScreen();
          } else {
            showToast("🎉 Xuất sắc! Bạn đã ghép thành công lượt này!");
            renderMatchCards(document.getElementById('hub-game-area'));
          }
        }, 800);
      }
    } else {
      // Sai cặp!
      playSoundEffect('wrong');
      const zhBtn = document.getElementById(`card-zh-${mc.selectedZh}`);
      const viBtn = document.getElementById(`card-vi-${mc.selectedVi}`);

      if (zhBtn) zhBtn.classList.add('border-rose-500', 'bg-rose-950/50');
      if (viBtn) viBtn.classList.add('border-rose-500', 'bg-rose-950/50');

      setTimeout(() => {
        if (zhBtn) {
          zhBtn.className = zhBtn.className.replace('border-rose-500 bg-rose-950/50 border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/30', 'border-slate-800 bg-slate-900');
        }
        if (viBtn) {
          viBtn.className = viBtn.className.replace('border-rose-500 bg-rose-950/50 border-indigo-500 bg-indigo-950/40 ring-4 ring-indigo-500/30', 'border-slate-800 bg-slate-900');
        }
        mc.selectedZh = null;
        mc.selectedVi = null;
      }, 500);

      window.MEMORY_HUB.gameStats['match_cards'].wrong++;
    }
  }
}

/**
 * ==============================================================================
 * TRÒ 5: 🔍 NHÌN TIẾNG VIỆT -> ĐOÁN CHỮ HÁN (Active Hanzi Pick)
 * ==============================================================================
 */
function renderHanziQuiz(container) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) { renderSummaryScreen(); return; }
  const allWords = window.VOCAB_DATABASE || [];

  const options = [{ hanzi: word.hanzi, pinyin: word.pinyin, correct: true }];
  while (options.length < Math.min(4, allWords.length)) {
    const r = allWords[Math.floor(Math.random() * allWords.length)];
    if (!options.some(o => o.hanzi === r.hanzi)) {
      options.push({ hanzi: r.hanzi, pinyin: r.pinyin, correct: false });
    }
  }
  options.sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
        <span class="text-xs text-indigo-400 font-black uppercase tracking-wider block">Hãy chọn Chữ Hán mang nghĩa:</span>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">"${word.meaning}"</h3>
        <p class="text-xs text-slate-400">Rèn luyện phản xạ nhớ mặt chữ từ tiếng Việt</p>
      </div>

      <div class="grid grid-cols-2 gap-3.5">
        ${options.map(opt => `
          <button onclick="handleOptionSelect(this, '${opt.hanzi}', '${word.hanzi}')" class="p-5 rounded-2xl text-center bg-slate-900 border-2 border-slate-800 hover:border-blue-500 hover:bg-slate-850 transition-all shadow-md active:scale-95 group">
            <span class="text-3xl sm:text-4xl font-black text-white chinese-font block group-hover:scale-105 transition-transform">${opt.hanzi}</span>
            <span class="text-xs text-cyan-400 font-mono italic block mt-1">${opt.pinyin}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * ==============================================================================
 * TRÒ 6: ⚡ FLASHCARD 3D THÔNG MINH (Spaced Repetition)
 * ==============================================================================
 */
function renderFlashcard(container) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) { renderSummaryScreen(); return; }

  container.innerHTML = `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
      <div id="flashcard-card" onclick="flipFlashcard()" class="w-full max-w-md h-72 rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-slate-700/80 shadow-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-500 relative group hover:border-blue-500">
        <span id="flashcard-badge" class="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
          Mặt trước (Chữ Hán)
        </span>

        <button onclick="event.stopPropagation(); speakChinese('${word.hanzi}')" class="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </button>

        <div id="flashcard-content" class="space-y-3">
          <span class="text-6xl sm:text-7xl font-black text-white chinese-font block tracking-widest drop-shadow-lg">${word.hanzi}</span>
          <p class="text-xs text-slate-400 animate-pulse">👆 Chạm vào thẻ để lật xem Pinyin & Nghĩa</p>
        </div>
      </div>

      <div class="flex items-center gap-4 w-full max-w-md justify-between">
        <button onclick="handleFlashcardRating(false)" class="flex-1 py-3 px-4 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/80 text-rose-200 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all">
          <span class="text-base">❌</span> Chưa Nhớ (Ôn lại)
        </button>
        <button onclick="handleFlashcardRating(true)" class="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all">
          <span class="text-base">✅</span> Đã Thuộc Lòng
        </button>
      </div>
    </div>
  `;
}

let flashcardFlipped = false;
function flipFlashcard() {
  const card = document.getElementById('flashcard-card');
  const content = document.getElementById('flashcard-content');
  const badge = document.getElementById('flashcard-badge');
  const word = window.MEMORY_HUB.currentWord;
  if (!card || !content || !word) return;

  flashcardFlipped = !flashcardFlipped;

  if (flashcardFlipped) {
    badge.textContent = "Mặt sau (Chi tiết)";
    badge.className = "absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-500/50";
    content.innerHTML = `
      <div class="space-y-2 animate-in fade-in zoom-in-95 duration-200">
        <span class="text-3xl font-black text-white chinese-font block">${word.hanzi}</span>
        <p class="text-2xl font-black text-cyan-300 italic">${word.pinyin}</p>
        <p class="text-base font-bold text-slate-100 mt-2">${word.meaning}</p>
        ${word.ex_hz ? `
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 mt-2">
            <p class="font-bold text-cyan-400 chinese-font">${word.ex_hz}</p>
            <p class="text-slate-400 mt-0.5">${word.ex_vi || ''}</p>
          </div>
        ` : ''}
      </div>
    `;
    speakChinese(word.hanzi);
  } else {
    badge.textContent = "Mặt trước (Chữ Hán)";
    badge.className = "absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700";
    content.innerHTML = `
      <div class="space-y-3 animate-in fade-in zoom-in-95 duration-200">
        <span class="text-6xl sm:text-7xl font-black text-white chinese-font block tracking-widest drop-shadow-lg">${word.hanzi}</span>
        <p class="text-xs text-slate-400 animate-pulse">👆 Chạm vào thẻ để lật xem Pinyin & Nghĩa</p>
      </div>
    `;
  }
}

function handleFlashcardRating(isKnown) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) return;
  const mode = 'flashcard';
  flashcardFlipped = false;

  if (isKnown) {
    playSoundEffect('correct');
    hub.gameStats[mode].score += 10;
    hub.gameStats[mode].correct++;

    // Thêm vào hoàn thành của game này
    if (!hub.gameCompleted[mode].includes(word.id)) {
      hub.gameCompleted[mode].push(word.id);
    }
    // XÓA TỪ NÀY KHỎI HÀNG ĐỢI FLASHCARD -> KHÔNG HIỆN LẠI TRONG FLASHCARD NỮA
    hub.gameQueues[mode] = hub.gameQueues[mode].filter(w => w.id !== word.id);
    setWordMastered(word.id, true);
  } else {
    playSoundEffect('wrong');
    hub.gameStats[mode].wrong++;
    // Đưa về cuối hàng đợi flashcard để hỏi lại
    if (hub.gameQueues[mode].length > 1) {
      const wrongW = hub.gameQueues[mode].shift();
      hub.gameQueues[mode].push(wrongW);
    }
  }

  loadCurrentQuestion();
}

/**
 * Xử lý khi người dùng chọn đáp án trong trắc nghiệm
 */
function handleOptionSelect(btnEl, selectedVal, correctVal) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;
  if (!word) return;
  const mode = hub.activeMode;
  const isCorrect = selectedVal === correctVal;

  const allBtns = btnEl.parentElement.querySelectorAll('button');
  allBtns.forEach(b => b.classList.add('pointer-events-none'));

  if (isCorrect) {
    playSoundEffect('correct');
    btnEl.className = btnEl.className.replace(/bg-slate-[0-9]+/, 'bg-emerald-600 border-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/30');
    hub.gameStats[mode].score += 10;
    hub.gameStats[mode].correct++;

    // 1. Thêm vào danh sách hoàn thành của mode này
    if (!hub.gameCompleted[mode].includes(word.id)) {
      hub.gameCompleted[mode].push(word.id);
    }

    // 2. LOẠI BỎ TỪ NÀY KHỎI HÀNG ĐỢI CỦA MODE NÀY -> SẼ KHÔNG BAO GIỜ HIỆN LẠI TRONG MODE NÀY NỮA
    hub.gameQueues[mode] = hub.gameQueues[mode].filter(w => w.id !== word.id);

    // 3. Đánh dấu đã thuộc chung
    setWordMastered(word.id, true);

    speakChinese(word.hanzi);
  } else {
    playSoundEffect('wrong');
    btnEl.className = btnEl.className.replace(/bg-slate-[0-9]+/, 'bg-rose-600 border-rose-500 text-white font-extrabold shadow-lg shadow-rose-600/30');
    hub.gameStats[mode].wrong++;

    // Đưa từ sai về cuối hàng đợi của mode này để người dùng gặp lại và làm lại
    if (hub.gameQueues[mode].length > 1) {
      const wrongW = hub.gameQueues[mode].shift();
      hub.gameQueues[mode].push(wrongW);
    }

    allBtns.forEach(b => {
      if (b.innerText.includes(correctVal) || b.textContent.includes(correctVal)) {
        b.className = b.className.replace(/bg-slate-[0-9]+/, 'bg-emerald-600/80 border-emerald-400 text-white');
      }
    });
  }

  setTimeout(() => {
    loadCurrentQuestion();
  }, 850);
}

/**
 * ==============================================================================
 * MÀN HÌNH TỔNG KẾT VÒNG CHƠI (RIÊNG BIỆT CHO TỪNG MINI GAME)
 * ==============================================================================
 */
function renderSummaryScreen() {
  const hub = window.MEMORY_HUB;
  const gameArea = document.getElementById('hub-game-area');
  const summaryBox = document.getElementById('hub-summary-screen');
  if (!summaryBox || !gameArea) return;

  gameArea.classList.add('hidden');
  summaryBox.classList.remove('hidden');

  const mode = hub.activeMode;
  const modeNames = {
    meaning_quiz: '🎯 Trắc nghiệm nghĩa',
    listening_quiz: '🎧 Nghe đoán từ',
    hanzi_recall: '✍️ Luyện viết tự do',
    match_cards: '🧩 Ghép cặp nối từ',
    hanzi_quiz: '🔍 Nhìn tiếng Việt đoán chữ Hán',
    flashcard: '⚡ Flashcard 3D'
  };

  const stats = hub.gameStats[mode] || { correct: 0, wrong: 0, score: 0 };
  const completedList = hub.gameCompleted[mode] || [];
  const totalMasteredInMode = completedList.length;

  summaryBox.innerHTML = `
    <div class="text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <!-- Tiêu đề & Huy hiệu chiến thắng -->
      <div class="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
        <span class="text-4xl">🏆</span>
        <h3 class="text-2xl font-black text-amber-300">
          Chúc Mừng! Hoàn Thành Toàn Bộ Từ!
        </h3>
        <p class="text-xs text-slate-400">
          Bạn đã xuất sắc chinh phục tất cả từ vựng trong chế độ: <span class="font-bold text-white">${modeNames[mode] || mode}</span>
        </p>

        <!-- Thống kê điểm số -->
        <div class="flex items-center justify-center gap-6 pt-3">
          <div>
            <span class="text-4xl font-black text-white">${totalMasteredInMode}</span>
            <p class="text-xs text-slate-400 mt-1">Từ đã vượt qua</p>
          </div>
          <div class="h-10 w-[1px] bg-slate-800"></div>
          <div>
            <span class="text-4xl font-black text-amber-400">${stats.score}</span>
            <p class="text-xs text-slate-400 mt-1">Điểm đạt được</p>
          </div>
          <div class="h-10 w-[1px] bg-slate-800"></div>
          <div>
            <span class="text-4xl font-black text-emerald-400">${stats.correct}</span>
            <p class="text-xs text-slate-400 mt-1">Lần trả lời đúng</p>
          </div>
        </div>
      </div>

      <!-- Danh sách từ đã chinh phục trong game này -->
      <div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
        <span>✓</span> Toàn bộ từ của bài học đã được làm đúng trong chế độ này!
      </div>

      <!-- Nút Hành Động -->
      <div class="flex items-center gap-3 justify-center pt-2 flex-wrap">
        <button onclick="resetCurrentModeQueue()" class="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
          <span>🔄</span> Chơi Lại Chế Độ Này (Reset lượt chơi)
        </button>
        <button onclick="confirmResetLessonProgress()" class="px-5 py-3 rounded-2xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/40 transition-all flex items-center gap-1.5">
          <span>⚠️</span> Đặt lại cả bài học
        </button>
        <button onclick="closeMemoryHub()" class="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all">
          Đóng
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Export các hàm ra window để truy cập toàn cục
window.openMemoryHub = openMemoryHub;
window.closeMemoryHub = closeMemoryHub;
window.setHubTab = setHubTab;
window.handleOptionSelect = handleOptionSelect;
window.selectMatchCard = selectMatchCard;
window.flipFlashcard = flipFlashcard;
window.handleFlashcardRating = handleFlashcardRating;
window.toggleListeningSubMode = toggleListeningSubMode;
window.clearRecallCanvas = clearRecallCanvas;
window.toggleRecallOutline = toggleRecallOutline;
window.animateRecallChar = animateRecallChar;
window.submitRecallWord = submitRecallWord;
window.skipRecallWord = skipRecallWord;
window.selectRecallChar = selectRecallChar;
window.resetCurrentModeQueue = resetCurrentModeQueue;
window.getMasteredWords = getMasteredWords;
window.setWordMastered = setWordMastered;
window.updateMasteredDisplay = updateMasteredDisplay;

// Tương thích ngược với openVocabQuiz() cũ
window.openVocabQuiz = function() {
  openMemoryHub('meaning_quiz');
};
