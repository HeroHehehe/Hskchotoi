/**
 * ==============================================================================
 * TRUNG TÂM LUYỆN NHỚ & GAME HỌC TẬP HSK 1 (MEMORY TRAINING HUB)
 * ==============================================================================
 * 5 Chế độ luyện nhớ thông minh:
 *  1. 🎯 Trắc nghiệm nghĩa: Nhìn Hán tự -> Chọn nghĩa tiếng Việt
 *  2. 🎧 Nghe âm đoán từ: Nghe giọng đọc bản xứ -> Đoán nghĩa hoặc đoán chữ Hán
 *  3. ✍️ Luyện viết nhớ nét: Nhìn Pinyin & Nghĩa -> Tự nhớ và viết chữ Hán qua Canvas
 *  4. 🧩 Ghép cặp nối từ (Duolingo Style): Nối 5 thẻ Chữ Hán với 5 thẻ Tiếng Việt
 *  5. 🔍 Nhìn tiếng Việt đoán Chữ Hán: Nhớ chủ động mặt chữ Hán
 *  6. ⚡ Flashcard 3D Thông minh (SRS): Lật thẻ ghi nhớ & đánh giá Đã thuộc / Chưa thuộc
 *
 * Tính năng theo dõi tiến độ:
 *  - Bộ đếm X/Y từ bài học & % tổng quan 300 từ HSK 1
 *  - Lưu trữ từ đã ghi nhớ vào LocalStorage (hsk1_mastered_words)
 *  - Thống kê Đúng/Sai, Điểm số, Streak
 *  - Màn hình tổng kết cuối vòng: Danh sách từ sai & Nút "Ôn lại các từ sai"
 * ==============================================================================
 */

// Trạng thái chung của hệ thống Luyện Nhớ
window.MEMORY_HUB = {
  activeMode: 'meaning_quiz', // 'meaning_quiz', 'listening_quiz', 'hanzi_recall', 'match_cards', 'hanzi_quiz', 'flashcard'
  listeningSubMode: 'vi', // 'vi' (nghe -> đoán tiếng Việt) hoặc 'zh' (nghe -> đoán chữ Hán)
  currentWordList: [],
  currentIndex: 0,
  currentWord: null,
  
  // Điểm số & tiến trình lượt chơi
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  wrongWords: [], // Danh sách từ làm sai để luyện lại
  reviewMode: false, // Đang trong chế độ ôn lại từ sai
  
  // Trạng thái game Ghép Cặp (Match Cards)
  matchCards: {
    pairs: [],
    selectedZh: null,
    selectedVi: null,
    matchedCount: 0,
    totalPairs: 5
  },
  
  // Trạng thái game Luyện Viết
  writerInstance: null
};

// Khởi tạo Audio Context để phát âm thanh hiệu ứng (Ding / Buzz)
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
      // Âm thanh Ding trong trẻo vui tai (E5 -> B5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.15); // B5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      // Âm thanh Buzz trầm nhẹ
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(146.83, now + 0.2); // D3
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'match') {
      // Âm thanh Ghép cặp thành công
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
    // Cập nhật trạng thái huy hiệu ở danh sách từ bên ngoài
    if (window.renderVocabList) window.renderVocabList();
  } catch (e) {
    console.warn("Lỗi lưu từ đã thuộc:", e);
  }
}

function updateMasteredDisplay() {
  const masteredList = getMasteredWords();
  const allVocab = window.VOCAB_DATABASE || [];
  const currentLessonWords = window.getCurrentLessonWords ? window.getCurrentLessonWords() : allVocab;
  
  // Tính số từ đã thuộc trong bài hiện tại
  const masteredInLesson = currentLessonWords.filter(w => masteredList.includes(w.id)).length;
  const totalInLesson = currentLessonWords.length || 1;
  const percentLesson = Math.round((masteredInLesson / totalInLesson) * 100);

  // Cập nhật trên UI Hub
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
 * Mở Trung Tâm Luyện Nhớ (Memory Hub Modal)
 */
function openMemoryHub(initialMode = 'meaning_quiz', useWrongWordsOnly = false) {
  const modal = document.getElementById('memory-hub-modal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const hub = window.MEMORY_HUB;
  hub.activeMode = initialMode;
  hub.reviewMode = useWrongWordsOnly;

  if (useWrongWordsOnly && hub.wrongWords.length > 0) {
    hub.currentWordList = [...hub.wrongWords];
  } else {
    const lessonWords = window.getCurrentLessonWords ? window.getCurrentLessonWords() : (window.VOCAB_DATABASE || []);
    // Xáo trộn danh sách từ vựng bài hiện tại
    hub.currentWordList = [...lessonWords].sort(() => Math.random() - 0.5);
    hub.wrongWords = [];
  }

  hub.currentIndex = 0;
  hub.score = 0;
  hub.correctCount = 0;
  hub.wrongCount = 0;

  updateMasteredDisplay();
  setHubTab(initialMode);
}

function closeMemoryHub() {
  const modal = document.getElementById('memory-hub-modal');
  if (modal) modal.classList.add('hidden');
  // Dừng phát âm thanh nếu có
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

/**
 * Chuyển đổi qua lại giữa 5 chế độ chơi
 */
function setHubTab(mode) {
  const hub = window.MEMORY_HUB;
  hub.activeMode = mode;

  // Cập nhật giao diện tab bar
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

  // Ẩn màn hình tổng kết (nếu đang hiện)
  const summaryBox = document.getElementById('hub-summary-screen');
  const gameArea = document.getElementById('hub-game-area');
  if (summaryBox) summaryBox.classList.add('hidden');
  if (gameArea) gameArea.classList.remove('hidden');

  // Khởi động giao diện màn chơi tương ứng
  loadCurrentQuestion();
}

/**
 * Tải câu hỏi hiện tại cho chế độ đang chọn
 */
function loadCurrentQuestion() {
  const hub = window.MEMORY_HUB;
  const gameArea = document.getElementById('hub-game-area');
  if (!gameArea) return;

  // Kiểm tra nếu đã hoàn thành tất cả từ trong vòng
  if (hub.currentIndex >= hub.currentWordList.length && hub.activeMode !== 'match_cards') {
    renderSummaryScreen();
    return;
  }

  hub.currentWord = hub.currentWordList[hub.currentIndex];

  // Cập nhật thanh tiến độ (Progress Bar & Counter)
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
 * Cập nhật thanh tiến độ X/Y, Đúng/Sai, Điểm số
 */
function updateProgressBar() {
  const hub = window.MEMORY_HUB;
  const total = hub.currentWordList.length || 1;
  const current = Math.min(hub.currentIndex + 1, total);
  const percent = Math.round((current / total) * 100);

  const counterEl = document.getElementById('hub-progress-counter');
  if (counterEl) {
    counterEl.textContent = `Câu ${current}/${total}`;
  }

  const fillEl = document.getElementById('hub-progress-fill');
  if (fillEl) {
    fillEl.style.width = `${percent}%`;
  }

  const scoreEl = document.getElementById('hub-score-badge');
  if (scoreEl) {
    scoreEl.innerHTML = `
      <span class="text-emerald-400 font-bold">🟢 ${hub.correctCount}</span>
      <span class="text-slate-500">|</span>
      <span class="text-rose-400 font-bold">🔴 ${hub.wrongCount}</span>
      <span class="text-slate-500">|</span>
      <span class="text-amber-300 font-bold">⭐ ${hub.score} đ</span>
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
  const allWords = window.VOCAB_DATABASE || hub.currentWordList;

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
  const allWords = window.VOCAB_DATABASE || hub.currentWordList;
  const isViMode = hub.listeningSubMode === 'vi';

  // Tự động phát âm ngay khi mở câu hỏi
  setTimeout(() => speakChinese(word.hanzi, 1.0), 200);

  // Tạo lựa chọn
  let options = [];
  if (isViMode) {
    options = [word.meaning];
    while (options.length < Math.min(4, allWords.length)) {
      const r = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.includes(r.meaning)) options.push(r.meaning);
    }
  } else {
    // Chế độ chọn Chữ Hán
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
 * TRÒ 3: ✍️ NHÌN PINYIN/NGHĨA -> TỰ VIẾT CHỮ HÁN (Hanzi Recall)
 * ==============================================================================
 */
function renderHanziRecall(container) {
  const hub = window.MEMORY_HUB;
  const word = hub.currentWord;

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <!-- Đề bài: Cho Pinyin & Nghĩa tiếng Việt -->
      <div class="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <span class="text-xs text-blue-400 font-black uppercase tracking-wider block">Hãy nhớ và vẽ chữ Hán:</span>
          <p class="text-2xl font-black text-cyan-300 italic mt-0.5">${word.pinyin}</p>
          <p class="text-sm font-bold text-slate-200 mt-1">${word.meaning}</p>
        </div>

        <button onclick="speakChinese('${word.hanzi}')" class="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md flex-shrink-0" title="Nghe phát âm">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </button>
      </div>

      <!-- Khung vẽ chữ Hán HanziWriter -->
      <div class="flex flex-col items-center justify-center space-y-4">
        <div id="recall-writer-target" class="w-[260px] h-[260px] bg-slate-950 rounded-3xl border-2 border-indigo-500/50 shadow-2xl flex items-center justify-center relative overflow-hidden">
          <!-- HanziWriter Canvas mount ở đây -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div class="w-full h-[1px] bg-white"></div>
            <div class="h-full w-[1px] bg-white absolute"></div>
          </div>
        </div>

        <!-- Trạng thái nét vẽ -->
        <p id="recall-status-text" class="text-xs font-bold text-slate-400 animate-pulse">
          ✍️ Dùng chuột hoặc ngón tay để vẽ từng nét chữ Hán vào ô trên
        </p>

        <!-- Nút thao tác trợ giúp -->
        <div class="flex items-center gap-2 flex-wrap justify-center">
          <button onclick="hintRecallStroke()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 shadow-md">
            💡 Gợi ý nét
          </button>
          <button onclick="showRecallAnswer()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 shadow-md">
            👁️ Xem chữ mẫu (${word.hanzi})
          </button>
          <button onclick="skipRecallWord(false)" class="px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/60 transition-all flex items-center gap-1.5 shadow-md">
            Chưa nhớ (Bỏ qua)
          </button>
          <button onclick="skipRecallWord(true)" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md">
            Đã thuộc & Tiếp tục ➔
          </button>
        </div>
      </div>
    </div>
  `;

  // Khởi tạo HanziWriter cho chữ đầu tiên của từ
  initRecallWriter(word.hanzi[0] || '你');
}

function initRecallWriter(char) {
  const container = document.getElementById('recall-writer-target');
  if (!container || !window.HanziWriter) return;
  container.innerHTML = '';

  try {
    window.MEMORY_HUB.writerInstance = HanziWriter.create(container, char, {
      width: 250,
      height: 250,
      padding: 20,
      showOutline: false, // Ẩn viền chữ để người dùng tự nhớ nét
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 150,
      strokeColor: '#38bdf8', // Xanh cyan đẹp
      radicalColor: '#f43f5e',
      highlightColor: '#22c55e',
      drawingColor: '#38bdf8',
      drawingWidth: 16,
      showHintAfterMisses: 3
    });

    window.MEMORY_HUB.writerInstance.quiz({
      onMistake: function(strokeData) {
        playSoundEffect('wrong');
        const st = document.getElementById('recall-status-text');
        if (st) st.innerHTML = `<span class="text-rose-400 font-bold">⚠️ Sai nét rồi! Hãy thử vẽ lại nét này nhé.</span>`;
      },
      onCorrectStroke: function(strokeData) {
        playSoundEffect('correct');
        const st = document.getElementById('recall-status-text');
        if (st) st.innerHTML = `<span class="text-emerald-400 font-bold">🎉 Nét vẽ rất chuẩn! Tiếp tục nào.</span>`;
      },
      onComplete: function(summaryData) {
        playSoundEffect('match');
        const st = document.getElementById('recall-status-text');
        if (st) st.innerHTML = `<span class="text-emerald-400 font-black text-sm">🏆 Xuất sắc! Bạn đã viết xong chữ "${char}"!</span>`;
        
        // Tăng điểm
        window.MEMORY_HUB.score += 15;
        window.MEMORY_HUB.correctCount++;
        setWordMastered(window.MEMORY_HUB.currentWord.id, true);

        setTimeout(() => {
          window.MEMORY_HUB.currentIndex++;
          loadCurrentQuestion();
        }, 1200);
      }
    });
  } catch (e) {
    console.warn("Lỗi khởi tạo HanziWriter:", e);
  }
}

function hintRecallStroke() {
  if (window.MEMORY_HUB.writerInstance) {
    window.MEMORY_HUB.writerInstance.animateCharacter();
  }
}

function showRecallAnswer() {
  if (window.MEMORY_HUB.writerInstance) {
    window.MEMORY_HUB.writerInstance.showOutline();
  }
}

function skipRecallWord(isKnown) {
  const hub = window.MEMORY_HUB;
  if (isKnown) {
    hub.score += 10;
    hub.correctCount++;
    setWordMastered(hub.currentWord.id, true);
  } else {
    hub.wrongCount++;
    if (!hub.wrongWords.some(w => w.id === hub.currentWord.id)) {
      hub.wrongWords.push(hub.currentWord);
    }
  }
  hub.currentIndex++;
  loadCurrentQuestion();
}

/**
 * ==============================================================================
 * TRÒ 4: 🧩 GHÉP CẶP NỐI TỪ (Flash Match - Phong cách Duolingo)
 * ==============================================================================
 */
function renderMatchCards(container) {
  const hub = window.MEMORY_HUB;
  const allLessonWords = hub.currentWordList;

  // Lấy 5 từ ngẫu nhiên để tạo 5 cặp
  const selectedPairs = [...allLessonWords].sort(() => Math.random() - 0.5).slice(0, 5);
  hub.matchCards.pairs = selectedPairs;
  hub.matchCards.matchedCount = 0;
  hub.matchCards.totalPairs = selectedPairs.length;
  hub.matchCards.selectedZh = null;
  hub.matchCards.selectedVi = null;

  // Tạo mảng thẻ tiếng Trung và tiếng Việt xáo trộn
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

  if (type === 'zh') {
    // Bỏ chọn thẻ cũ nếu có
    if (mc.selectedZh) {
      const prevEl = document.getElementById(`card-zh-${mc.selectedZh}`);
      if (prevEl) prevEl.className = prevEl.className.replace('border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/30', 'border-slate-800 bg-slate-900');
    }
    mc.selectedZh = id;
    const curEl = document.getElementById(`card-zh-${id}`);
    if (curEl) curEl.className = curEl.className.replace('border-slate-800 bg-slate-900', 'border-blue-500 bg-blue-950/40 ring-4 ring-blue-500/30');
    
    // Phát âm chữ Hán vừa bấm
    const word = mc.pairs.find(p => p.id === id);
    if (word) speakChinese(word.hanzi);
  } else {
    // Chọn thẻ Tiếng Việt
    if (mc.selectedVi) {
      const prevEl = document.getElementById(`card-vi-${mc.selectedVi}`);
      if (prevEl) prevEl.className = prevEl.className.replace('border-indigo-500 bg-indigo-950/40 ring-4 ring-indigo-500/30', 'border-slate-800 bg-slate-900');
    }
    mc.selectedVi = id;
    const curEl = document.getElementById(`card-vi-${id}`);
    if (curEl) curEl.className = curEl.className.replace('border-slate-800 bg-slate-900', 'border-indigo-500 bg-indigo-950/40 ring-4 ring-indigo-500/30');
  }

  // Nếu đã chọn đủ 1 thẻ tiếng Trung và 1 thẻ tiếng Việt -> Kiểm tra
  if (mc.selectedZh && mc.selectedVi) {
    if (mc.selectedZh === mc.selectedVi) {
      // Đúng cặp!
      playSoundEffect('match');
      const zhBtn = document.getElementById(`card-zh-${mc.selectedZh}`);
      const viBtn = document.getElementById(`card-vi-${mc.selectedVi}`);

      if (zhBtn) zhBtn.className = "w-full p-4 rounded-2xl bg-emerald-600/30 border-2 border-emerald-500 text-center transition-all opacity-40 pointer-events-none scale-95";
      if (viBtn) viBtn.className = "w-full p-4 rounded-2xl bg-emerald-600/30 border-2 border-emerald-500 text-center transition-all opacity-40 pointer-events-none scale-95 flex items-center justify-center min-h-[72px]";

      mc.matchedCount++;
      window.MEMORY_HUB.score += 10;
      window.MEMORY_HUB.correctCount++;
      setWordMastered(mc.selectedZh, true);

      const counterBadge = document.getElementById('match-counter-badge');
      if (counterBadge) counterBadge.textContent = `${mc.matchedCount}/${mc.totalPairs} Cặp`;

      mc.selectedZh = null;
      mc.selectedVi = null;

      // Nếu đã ghép hết 5 cặp -> Hoàn thành vòng chơi ghép cặp
      if (mc.matchedCount >= mc.totalPairs) {
        setTimeout(() => {
          showToast("🎉 Xuất sắc! Bạn đã ghép thành công tất cả các cặp!");
          renderMatchCards(document.getElementById('hub-game-area'));
        }, 800);
      }
    } else {
      // Sai cặp! Rung lắc và bỏ chọn
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

      window.MEMORY_HUB.wrongCount++;
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
  const allWords = window.VOCAB_DATABASE || hub.currentWordList;

  // Tạo 4 lựa chọn chữ Hán
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
      <!-- Thẻ nghĩa tiếng Việt mục tiêu -->
      <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
        <span class="text-xs text-indigo-400 font-black uppercase tracking-wider block">Hãy chọn Chữ Hán mang nghĩa:</span>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">"${word.meaning}"</h3>
        <p class="text-xs text-slate-400">Rèn luyện phản xạ nhớ mặt chữ từ tiếng Việt</p>
      </div>

      <!-- 4 Ô Chữ Hán -->
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

  container.innerHTML = `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
      <!-- Thẻ Flashcard 3D có thể bấm lật -->
      <div id="flashcard-card" onclick="flipFlashcard()" class="w-full max-w-md h-72 rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-slate-700/80 shadow-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-500 relative group hover:border-blue-500">
        <!-- Huy hiệu mặt trước / mặt sau -->
        <span id="flashcard-badge" class="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
          Mặt trước (Chữ Hán)
        </span>

        <button onclick="event.stopPropagation(); speakChinese('${word.hanzi}')" class="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </button>

        <!-- Nội dung thẻ -->
        <div id="flashcard-content" class="space-y-3">
          <span class="text-6xl sm:text-7xl font-black text-white chinese-font block tracking-widest drop-shadow-lg">${word.hanzi}</span>
          <p class="text-xs text-slate-400 animate-pulse">👆 Chạm vào thẻ để lật xem Pinyin & Nghĩa</p>
        </div>
      </div>

      <!-- 2 Nút Đánh Giá Trí Nhớ -->
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
        ${word.example_zh ? `
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 mt-2">
            <p class="font-bold text-cyan-400 chinese-font">${word.example_zh}</p>
            <p class="text-slate-400 mt-0.5">${word.example_vi || ''}</p>
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
  flashcardFlipped = false;

  if (isKnown) {
    playSoundEffect('correct');
    hub.score += 10;
    hub.correctCount++;
    setWordMastered(hub.currentWord.id, true);
  } else {
    playSoundEffect('wrong');
    hub.wrongCount++;
    if (!hub.wrongWords.some(w => w.id === hub.currentWord.id)) {
      hub.wrongWords.push(hub.currentWord);
    }
  }

  hub.currentIndex++;
  loadCurrentQuestion();
}

/**
 * Xử lý khi người dùng bấm vào một lựa chọn trong trắc nghiệm
 */
function handleOptionSelect(btnEl, selectedVal, correctVal) {
  const hub = window.MEMORY_HUB;
  const isCorrect = selectedVal === correctVal;

  // Khóa tất cả các nút để tránh bấm nhiều lần
  const allBtns = btnEl.parentElement.querySelectorAll('button');
  allBtns.forEach(b => b.classList.add('pointer-events-none'));

  if (isCorrect) {
    playSoundEffect('correct');
    btnEl.className = btnEl.className.replace(/bg-slate-[0-9]+/, 'bg-emerald-600 border-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/30');
    hub.score += 10;
    hub.correctCount++;
    setWordMastered(hub.currentWord.id, true);

    // Phát âm từ đúng
    speakChinese(hub.currentWord.hanzi);
  } else {
    playSoundEffect('wrong');
    btnEl.className = btnEl.className.replace(/bg-slate-[0-9]+/, 'bg-rose-600 border-rose-500 text-white font-extrabold shadow-lg shadow-rose-600/30');
    hub.wrongCount++;

    // Thêm vào danh sách từ làm sai để ôn lại
    if (!hub.wrongWords.some(w => w.id === hub.currentWord.id)) {
      hub.wrongWords.push(hub.currentWord);
    }

    // Hiển thị đáp án đúng
    allBtns.forEach(b => {
      if (b.innerText.includes(correctVal) || b.textContent.includes(correctVal)) {
        b.className = b.className.replace(/bg-slate-[0-9]+/, 'bg-emerald-600/80 border-emerald-400 text-white');
      }
    });
  }

  // Chờ 800ms rồi chuyển câu tiếp theo
  setTimeout(() => {
    hub.currentIndex++;
    loadCurrentQuestion();
  }, 850);
}

/**
 * ==============================================================================
 * MÀN HÌNH TỔNG KẾT VÒNG CHƠI (SUMMARY REPORT)
 * ==============================================================================
 */
function renderSummaryScreen() {
  const hub = window.MEMORY_HUB;
  const gameArea = document.getElementById('hub-game-area');
  const summaryBox = document.getElementById('hub-summary-screen');
  if (!summaryBox || !gameArea) return;

  gameArea.classList.add('hidden');
  summaryBox.classList.remove('hidden');

  const total = hub.currentWordList.length;
  const correct = hub.correctCount;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  let title = "Hoàn Thành Vòng Luyện! 🎉";
  let badgeColor = "text-emerald-400";
  if (percent === 100) {
    title = "Tuyệt Đỉnh! Thuộc Lòng 100% 🏆";
    badgeColor = "text-amber-300";
  } else if (percent >= 80) {
    title = "Rất Xuất Sắc! Tiến Bộ Vượt Bậc 🌟";
    badgeColor = "text-emerald-400";
  } else {
    title = "Cần Cố Gắng Thêm Chút Nữa 💪";
    badgeColor = "text-rose-400";
  }

  summaryBox.innerHTML = `
    <div class="text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <!-- Tiêu đề & Điểm số lớn -->
      <div class="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
        <h3 class="text-2xl font-black ${badgeColor}">${title}</h3>
        <div class="flex items-center justify-center gap-6 pt-2">
          <div>
            <span class="text-4xl font-black text-white">${percent}%</span>
            <p class="text-xs text-slate-400 mt-1">Tỷ lệ chính xác</p>
          </div>
          <div class="h-10 w-[1px] bg-slate-800"></div>
          <div>
            <span class="text-4xl font-black text-amber-400">${hub.score}</span>
            <p class="text-xs text-slate-400 mt-1">Tổng điểm đạt được</p>
          </div>
          <div class="h-10 w-[1px] bg-slate-800"></div>
          <div>
            <span class="text-4xl font-black text-emerald-400">${correct}/${total}</span>
            <p class="text-xs text-slate-400 mt-1">Số từ ghi nhớ</p>
          </div>
        </div>
      </div>

      <!-- Danh sách từ cần ôn lại (nếu có từ sai) -->
      ${hub.wrongWords.length > 0 ? `
        <div class="text-left space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚠️</span> Các Từ Làm Sai Cần Ôn Lại (${hub.wrongWords.length} từ):
            </h4>
            <span class="text-[11px] text-slate-500">Bấm loa để nghe lại</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            ${hub.wrongWords.map(w => `
              <div class="p-3 rounded-2xl bg-slate-950 border border-rose-900/50 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl font-black text-white chinese-font">${w.hanzi}</span>
                    <span class="text-xs text-cyan-400 font-mono italic">${w.pinyin}</span>
                  </div>
                  <p class="text-xs text-slate-300 mt-0.5">${w.meaning}</p>
                </div>
                <button onclick="speakChinese('${w.hanzi}')" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          🎉 Chúc mừng! Bạn không làm sai bất kỳ từ nào trong vòng luyện này!
        </div>
      `}

      <!-- Nút Hành Động Cuối Vòng -->
      <div class="flex items-center gap-3 justify-center pt-2">
        ${hub.wrongWords.length > 0 ? `
          <button onclick="openMemoryHub('${hub.activeMode}', true)" class="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2">
            <span>🎯</span> Ôn Lại Riêng Các Từ Sai (${hub.wrongWords.length})
          </button>
        ` : ''}
        <button onclick="openMemoryHub('${hub.activeMode}', false)" class="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
          <span>🔄</span> Luyện Tiếp Vòng Mới
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
window.hintRecallStroke = hintRecallStroke;
window.showRecallAnswer = showRecallAnswer;
window.skipRecallWord = skipRecallWord;
window.getMasteredWords = getMasteredWords;
window.setWordMastered = setWordMastered;
window.updateMasteredDisplay = updateMasteredDisplay;

// Tương thích ngược với openVocabQuiz() cũ
window.openVocabQuiz = function() {
  openMemoryHub('meaning_quiz');
};
