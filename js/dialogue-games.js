/**
 * ==============================================================================
 * TRUNG TÂM MINI GAME BÀI KHOÁ & HỘI THOẠI HSK 1 (DIALOGUE GAMES HUB)
 * ==============================================================================
 * 6 Chế độ mini game thông minh thiết kế riêng cho Câu Thoại & Hội Thoại SGK:
 *  1. 🧩 Ghép câu Duolingo (Sentence Builder): Bấm các khối từ để ghép thành câu thoại hoàn chỉnh
 *  2. 🎭 Đoán câu đối đáp (Dialogue Response): Nghe/đọc câu trước, đoán phản hồi của nhân vật tiếp theo
 *  3. 🎧 Nghe đoán câu (Listening Quiz): Nghe audio câu thoại, chọn bản dịch tiếng Việt chính xác
 *  4. 🔍 Nhìn nghĩa chọn Chữ Hán (Hanzi Sentence Quiz): Chọn câu chữ Hán tương ứng với câu tiếng Việt
 *  5. ⚡ Flashcard 3D Câu Thoại: Lật thẻ ghi nhớ câu, nhân vật, pinyin và ngữ cảnh
 *  6. ⌨️ Đánh máy & Luyện dịch (Dialogue Typing Master): Gõ pinyin hoặc chữ Hán của câu thoại
 * ==============================================================================
 */

window.DIALOGUE_GAMES_HUB = {
  activeMode: 'sentence_builder', // 'sentence_builder', 'dialogue_response', 'dialogue_listening', 'dialogue_hanzi', 'dialogue_flashcard', 'dialogue_typing'
  currentLessonId: 1,
  dialogueScope: 'all', // 'all' (cả 3 bài khoá) hoặc 0, 1, 2 (từng bài khoá cụ thể)
  
  // Hàng đợi và tiến trình riêng cho từng game
  gameQueues: {
    sentence_builder: [],
    dialogue_response: [],
    dialogue_listening: [],
    dialogue_hanzi: [],
    dialogue_flashcard: [],
    dialogue_typing: []
  },
  gameCompleted: {
    sentence_builder: [],
    dialogue_response: [],
    dialogue_listening: [],
    dialogue_hanzi: [],
    dialogue_flashcard: [],
    dialogue_typing: []
  },
  gameStats: {
    sentence_builder: { correct: 0, wrong: 0, score: 0 },
    dialogue_response: { correct: 0, wrong: 0, score: 0 },
    dialogue_listening: { correct: 0, wrong: 0, score: 0 },
    dialogue_hanzi: { correct: 0, wrong: 0, score: 0 },
    dialogue_flashcard: { correct: 0, wrong: 0, score: 0 },
    dialogue_typing: { correct: 0, wrong: 0, score: 0 }
  },

  // State cục bộ của trò chơi hiện tại
  currentQuestion: null,
  selectedSentenceBlocks: [],
  availableSentenceBlocks: [],
  flashcardFlipped: false
};

// Web Audio API Synth cho âm thanh
let dlgAudioCtx = null;
function playDlgSound(type) {
  try {
    if (!dlgAudioCtx) {
      dlgAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (dlgAudioCtx.state === 'suspended') {
      dlgAudioCtx.resume();
    }
    const osc = dlgAudioCtx.createOscillator();
    const gain = dlgAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(dlgAudioCtx.destination);

    const now = dlgAudioCtx.currentTime;
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    // Audio context not allowed or failed
  }
}

/**
 * Lấy toàn bộ danh sách các câu thoại hợp lệ của bài học hiện tại
 */
function getDialogueLinesPool(lessonId, scope = 'all') {
  if (!window.HSK_DIALOGUES) return [];
  const lessonData = window.HSK_DIALOGUES.find(d => d.lesson_id === lessonId);
  if (!lessonData || !lessonData.dialogues) return [];

  const pool = [];
  lessonData.dialogues.forEach((dlg, dIdx) => {
    if (scope !== 'all' && scope !== dIdx) return;
    (dlg.lines || []).forEach((line, lIdx) => {
      // Chỉ lấy câu có độ dài > 0
      if (line.hanzi && line.hanzi.trim()) {
        pool.push({
          uid: `${lessonId}-${dIdx}-${lIdx}`,
          lesson_id: lessonId,
          dialogue_idx: dIdx,
          dialogue_title: dlg.title,
          dialogue_title_vi: dlg.title_vi,
          context_zh: dlg.context_zh,
          context_vi: dlg.context_vi,
          line_idx: lIdx,
          speaker: line.speaker,
          speaker_vi: line.speaker_vi || '',
          avatar: line.avatar || '👤',
          hanzi: line.hanzi,
          pinyin: line.pinyin,
          vi: line.vi,
          // Next line nếu có (dành cho dialogue response)
          nextLine: (lIdx + 1 < dlg.lines.length) ? dlg.lines[lIdx + 1] : null
        });
      }
    });
  });

  return pool;
}

/**
 * Mở Modal Trung Tâm Mini Game Bài Khoá
 */
function openDialogueGamesHub(preferredMode = 'sentence_builder', lessonId = null) {
  const hub = window.DIALOGUE_GAMES_HUB;
  if (lessonId !== null && lessonId !== undefined) {
    hub.currentLessonId = lessonId;
  } else {
    hub.currentLessonId = (window.DialogueState && window.DialogueState.currentLessonId) || window.currentLessonId || 1;
  }
  hub.activeMode = preferredMode;

  const modal = document.getElementById('dialogue-games-modal');
  if (!modal) {
    createDialogueGamesModalHTML();
  }

  const modalEl = document.getElementById('dialogue-games-modal');
  if (modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  initDialogueModeQueue(hub.activeMode);
  updateDlgHubUI();
  loadNextDialogueGameTurn();
}

/**
 * Đóng Modal
 */
function closeDialogueGamesHub() {
  const modal = document.getElementById('dialogue-games-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  if (typeof window.speechSynthesis !== 'undefined') {
    window.speechSynthesis.cancel();
  }
}

/**
 * Đổi Tab chế độ game
 */
function setDialogueGameTab(mode) {
  const hub = window.DIALOGUE_GAMES_HUB;
  hub.activeMode = mode;
  playDlgSound('click');

  initDialogueModeQueue(mode);
  updateDlgHubUI();
  loadNextDialogueGameTurn();
}

/**
 * Khởi tạo hàng đợi cho một chế độ
 */
function initDialogueModeQueue(mode) {
  const hub = window.DIALOGUE_GAMES_HUB;
  const pool = getDialogueLinesPool(hub.currentLessonId, hub.dialogueScope);
  
  if (!hub.gameQueues[mode] || hub.gameQueues[mode].length === 0) {
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    hub.gameQueues[mode] = shuffled;
    hub.gameCompleted[mode] = [];
    hub.gameStats[mode] = { correct: 0, wrong: 0, score: 0 };
  }
}

/**
 * Cập nhật thanh Tabs & Điểm số trên Modal
 */
function updateDlgHubUI() {
  const hub = window.DIALOGUE_GAMES_HUB;
  const modes = [
    { id: 'sentence_builder', icon: '🧩', name: 'Ghép câu Duolingo' },
    { id: 'dialogue_response', icon: '🎭', name: 'Đoán câu đối đáp' },
    { id: 'dialogue_listening', icon: '🎧', name: 'Nghe đoán câu' },
    { id: 'dialogue_hanzi', icon: '🔍', name: 'Nhìn nghĩa chọn Chữ' },
    { id: 'dialogue_flashcard', icon: '⚡', name: 'Flashcard 3D' },
    { id: 'dialogue_typing', icon: '⌨️', name: 'Đánh máy & Dịch' }
  ];

  // Render Tabs
  const tabsContainer = document.getElementById('dlg-hub-tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = modes.map(m => {
      const isActive = m.id === hub.activeMode;
      let btnClass = "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white font-bold";
      if (isActive) {
        btnClass = "bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-black shadow-lg shadow-purple-600/30 scale-105";
      }
      return `
        <button onclick="setDialogueGameTab('${m.id}')" class="px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${btnClass}">
          <span>${m.icon}</span>
          <span>${m.name}</span>
        </button>
      `;
    }).join('');
  }

  // Cập nhật Selector bài học
  const lessonSelect = document.getElementById('dlg-hub-lesson-select');
  if (lessonSelect && window.HSK_LESSONS) {
    lessonSelect.innerHTML = window.HSK_LESSONS.map(l => `
      <option value="${l.id}" ${l.id === hub.currentLessonId ? 'selected' : ''}>Bài ${l.id}: ${l.title}</option>
    `).join('');
  }

  // Cập nhật Điểm số & Tiến trình
  updateDlgScoreDisplay();
}

function updateDlgScoreDisplay() {
  const hub = window.DIALOGUE_GAMES_HUB;
  const mode = hub.activeMode;
  const pool = getDialogueLinesPool(hub.currentLessonId, hub.dialogueScope);
  const total = pool.length;
  const completed = (hub.gameCompleted[mode] || []).length;
  const stats = hub.gameStats[mode] || { correct: 0, wrong: 0, score: 0 };

  const counterEl = document.getElementById('dlg-progress-counter');
  const fillEl = document.getElementById('dlg-progress-fill');
  const scoreBadge = document.getElementById('dlg-score-badge');

  if (counterEl) {
    counterEl.textContent = `Câu ${Math.min(completed + 1, total)}/${total}`;
  }
  if (fillEl) {
    const percent = total > 0 ? (completed / total) * 100 : 0;
    fillEl.style.width = `${Math.max(percent, 5)}%`;
  }
  if (scoreBadge) {
    scoreBadge.innerHTML = `
      <span class="text-emerald-400 font-bold">🟢 ${stats.correct}</span>
      <span class="text-slate-600">|</span>
      <span class="text-rose-400 font-bold">🔴 ${stats.wrong}</span>
      <span class="text-slate-600">|</span>
      <span class="text-amber-300 font-bold">⭐ ${stats.score} đ</span>
    `;
  }
}

/**
 * Tải lượt chơi tiếp theo
 */
function loadNextDialogueGameTurn() {
  const hub = window.DIALOGUE_GAMES_HUB;
  const mode = hub.activeMode;
  const queue = hub.gameQueues[mode] || [];

  const gameArea = document.getElementById('dlg-game-area');
  const summaryBox = document.getElementById('dlg-summary-screen');
  if (!gameArea) return;

  // Nếu đã làm xong hết câu trong hàng đợi
  if (queue.length === 0) {
    renderDialogueSummaryScreen();
    return;
  }

  if (summaryBox) summaryBox.classList.add('hidden');
  gameArea.classList.remove('hidden');

  hub.currentQuestion = queue[0];
  const item = hub.currentQuestion;

  updateDlgScoreDisplay();

  // Render theo chế độ
  if (mode === 'sentence_builder') {
    renderSentenceBuilderGame(gameArea, item);
  } else if (mode === 'dialogue_response') {
    renderDialogueResponseGame(gameArea, item);
  } else if (mode === 'dialogue_listening') {
    renderDialogueListeningGame(gameArea, item);
  } else if (mode === 'dialogue_hanzi') {
    renderDialogueHanziGame(gameArea, item);
  } else if (mode === 'dialogue_flashcard') {
    renderDialogueFlashcardGame(gameArea, item);
  } else if (mode === 'dialogue_typing') {
    renderDialogueTypingGame(gameArea, item);
  }
}

/**
 * 1. GAME 1: Ghép câu Duolingo (Sentence Builder)
 */
function renderSentenceBuilderGame(container, item) {
  const hub = window.DIALOGUE_GAMES_HUB;

  // Tách câu thành các khối từ
  const cleanHanzi = item.hanzi.replace(/[，。？！,?!]/g, ' ').trim();
  let tokens = cleanHanzi.split(/\s+/).filter(Boolean);
  
  // Nếu câu ngắn chỉ có 1 từ ghép, tách theo từng chữ
  if (tokens.length <= 1) {
    tokens = Array.from(cleanHanzi);
  }

  // Thêm 1-2 khối từ nhiễu (distractor) từ các câu khác
  const pool = getDialogueLinesPool(hub.currentLessonId);
  const otherWords = [];
  pool.forEach(p => {
    if (p.uid !== item.uid) {
      p.hanzi.replace(/[，。？！,?!]/g, ' ').split(/\s+/).forEach(w => {
        if (w && !tokens.includes(w) && otherWords.length < 2) otherWords.push(w);
      });
    }
  });

  const allBlocks = [...tokens, ...otherWords].sort(() => Math.random() - 0.5).map((w, idx) => ({
    id: `blk-${idx}-${w}`,
    word: w
  }));

  hub.availableSentenceBlocks = allBlocks;
  hub.selectedSentenceBlocks = [];

  container.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      <!-- Đề bài câu thoại -->
      <div class="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 text-center space-y-3 shadow-lg">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <span>${item.avatar}</span>
          <span>${item.speaker} (${item.speaker_vi || 'Nhân vật'})</span>
        </div>
        <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sắp xếp các khối từ để tạo thành câu thoại:</p>
        <h3 class="text-xl sm:text-2xl font-black text-white leading-relaxed">
          "${item.vi}"
        </h3>
        <p class="text-xs text-slate-500 italic">Ngữ cảnh: ${item.context_vi}</p>
      </div>

      <!-- Khay câu trả lời của người học -->
      <div class="p-4 rounded-2xl bg-slate-900/90 border-2 border-dashed border-slate-700 min-h-[70px] flex flex-wrap items-center justify-center gap-2" id="dlg-answer-tray">
        <span class="text-xs text-slate-500 font-medium select-none" id="tray-empty-hint">Bấm các khối từ bên dưới để đưa vào câu</span>
      </div>

      <!-- Kho từ có sẵn để chọn -->
      <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-center gap-2.5" id="dlg-blocks-pool">
        ${allBlocks.map(b => `
          <button id="${b.id}" onclick="selectSentenceBlock('${b.id}')" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-100 font-black text-base sm:text-lg border border-slate-700 hover:border-blue-500 shadow-md transition-all">
            ${b.word}
          </button>
        `).join('')}
      </div>

      <!-- Nút hành động -->
      <div class="flex items-center justify-center gap-3 pt-2">
        <button onclick="clearSelectedBlocks()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5">
          <span>🔄</span> Đặt lại
        </button>
        <button onclick="submitSentenceBuilder()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2">
          <span>✓</span> Kiểm tra câu
        </button>
      </div>

    </div>
  `;
}

function selectSentenceBlock(blockId) {
  const hub = window.DIALOGUE_GAMES_HUB;
  const blockBtn = document.getElementById(blockId);
  if (!blockBtn) return;

  playDlgSound('click');

  const blockObj = hub.availableSentenceBlocks.find(b => b.id === blockId);
  if (!blockObj) return;

  // Ẩn ở kho từ
  blockBtn.classList.add('opacity-30', 'pointer-events-none');

  // Đưa vào khay câu trả lời
  hub.selectedSentenceBlocks.push(blockObj);

  renderAnswerTray();
}

function removeSelectedBlock(blockId) {
  const hub = window.DIALOGUE_GAMES_HUB;
  playDlgSound('click');

  hub.selectedSentenceBlocks = hub.selectedSentenceBlocks.filter(b => b.id !== blockId);

  // Mở lại ở kho từ
  const blockBtn = document.getElementById(blockId);
  if (blockBtn) {
    blockBtn.classList.remove('opacity-30', 'pointer-events-none');
  }

  renderAnswerTray();
}

function renderAnswerTray() {
  const hub = window.DIALOGUE_GAMES_HUB;
  const tray = document.getElementById('dlg-answer-tray');
  if (!tray) return;

  if (hub.selectedSentenceBlocks.length === 0) {
    tray.innerHTML = `<span class="text-xs text-slate-500 font-medium select-none" id="tray-empty-hint">Bấm các khối từ bên dưới để đưa vào câu</span>`;
    return;
  }

  tray.innerHTML = hub.selectedSentenceBlocks.map(b => `
    <button onclick="removeSelectedBlock('${b.id}')" class="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-base border border-blue-400 shadow-md flex items-center gap-1.5 hover:bg-rose-600 hover:border-rose-400 transition-all group">
      <span>${b.word}</span>
      <span class="text-xs text-blue-200 group-hover:text-white">✕</span>
    </button>
  `).join('');
}

function clearSelectedBlocks() {
  const hub = window.DIALOGUE_GAMES_HUB;
  hub.selectedSentenceBlocks = [];
  (hub.availableSentenceBlocks || []).forEach(b => {
    const btn = document.getElementById(b.id);
    if (btn) btn.classList.remove('opacity-30', 'pointer-events-none');
  });
  renderAnswerTray();
}

function submitSentenceBuilder() {
  const hub = window.DIALOGUE_GAMES_HUB;
  const item = hub.currentQuestion;
  if (!item) return;

  const userSentence = hub.selectedSentenceBlocks.map(b => b.word).join('');
  const cleanTarget = item.hanzi.replace(/[，。？！,?!]/g, '').trim();

  const isCorrect = userSentence.replace(/\s+/g, '') === cleanTarget.replace(/\s+/g, '');

  if (isCorrect) {
    playDlgSound('correct');
    hub.gameStats.sentence_builder.correct++;
    hub.gameStats.sentence_builder.score += 15;
    hub.gameCompleted.sentence_builder.push(item.uid);

    // Xóa khỏi queue
    hub.gameQueues.sentence_builder.shift();

    if (typeof showToast === 'function') showToast(`🎉 Hoàn hảo! "${item.hanzi}"`);
    if (typeof speakChinese === 'function') speakChinese(item.hanzi);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1200);
  } else {
    playDlgSound('wrong');
    hub.gameStats.sentence_builder.wrong++;
    if (typeof showToast === 'function') showToast(`❌ Chưa chính xác! Câu đúng là: "${item.hanzi}"`);

    // Chuyển xuống cuối queue để ôn lại
    const popped = hub.gameQueues.sentence_builder.shift();
    hub.gameQueues.sentence_builder.push(popped);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1800);
  }
}

/**
 * 2. GAME 2: Đoán câu đối đáp (Dialogue Response Quiz)
 */
function renderDialogueResponseGame(container, item) {
  const hub = window.DIALOGUE_GAMES_HUB;

  // Lấy câu đáp đúng
  let correctResponse = item.nextLine;
  let speakerPrompt = item.speaker;
  let linePrompt = item.hanzi;
  let pinyinPrompt = item.pinyin;
  let viPrompt = item.vi;

  // Nếu câu hiện tại là câu cuối đoạn, lấy câu trước đó làm prompt, câu hiện tại làm câu đáp
  if (!correctResponse) {
    const pool = getDialogueLinesPool(hub.currentLessonId);
    correctResponse = item;
    // Tìm câu trước
    const prev = pool.find(p => p.dialogue_idx === item.dialogue_idx && p.line_idx === item.line_idx - 1);
    if (prev) {
      speakerPrompt = prev.speaker;
      linePrompt = prev.hanzi;
      pinyinPrompt = prev.pinyin;
      viPrompt = prev.vi;
    }
  }

  // 3 câu đối đáp sai làm nhiễu
  const pool = getDialogueLinesPool(hub.currentLessonId);
  const otherLines = pool.filter(p => p.hanzi !== correctResponse.hanzi);
  const shuffledOthers = otherLines.sort(() => Math.random() - 0.5).slice(0, 3);

  const options = [correctResponse, ...shuffledOthers].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      <!-- Câu nói của nhân vật A -->
      <div class="p-5 rounded-3xl bg-slate-950/80 border border-amber-500/30 text-center space-y-2.5 shadow-lg">
        <span class="text-4xl">${item.avatar}</span>
        <div class="text-xs text-amber-300 font-bold">${speakerPrompt} nói:</div>
        <h3 class="text-2xl font-black text-white">${linePrompt}</h3>
        <p class="text-sm font-mono text-cyan-300 font-bold">${pinyinPrompt}</p>
        <p class="text-xs text-slate-400">"${viPrompt}"</p>

        <button onclick="speakChinese('${linePrompt}')" class="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-xs border border-amber-500/30 inline-flex items-center gap-1.5 mt-2">
          🔊 Nghe giọng nhân vật
        </button>
      </div>

      <p class="text-xs text-center text-slate-400 font-semibold uppercase tracking-wider">
        Nhân vật tiếp theo sẽ đối đáp câu nào?
      </p>

      <!-- 4 Lựa chọn câu đối đáp -->
      <div class="grid grid-cols-1 gap-2.5">
        ${options.map((opt, idx) => `
          <button onclick="handleDialogueResponseSelect('${escapeHtml(opt.hanzi)}', '${escapeHtml(correctResponse.hanzi)}', this)" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/80 hover:bg-slate-800/80 transition-all text-left flex items-center justify-between group">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-white">
                ${['A', 'B', 'C', 'D'][idx]}
              </span>
              <div>
                <p class="text-base font-black text-white">${opt.hanzi}</p>
                <p class="text-xs font-mono text-cyan-300 font-bold">${opt.pinyin}</p>
                <p class="text-xs text-slate-400">${opt.vi}</p>
              </div>
            </div>
            <span class="text-lg opacity-0 group-hover:opacity-100 transition-opacity">👉</span>
          </button>
        `).join('')}
      </div>

    </div>
  `;
}

function handleDialogueResponseSelect(selectedHanzi, correctHanzi, btnEl) {
  const hub = window.DIALOGUE_GAMES_HUB;
  const item = hub.currentQuestion;
  if (!item) return;

  const isCorrect = selectedHanzi === correctHanzi;

  if (isCorrect) {
    playDlgSound('correct');
    btnEl.className = "p-4 rounded-2xl bg-emerald-600 border border-emerald-400 text-white font-bold transition-all text-left flex items-center justify-between shadow-lg shadow-emerald-500/25";
    hub.gameStats.dialogue_response.correct++;
    hub.gameStats.dialogue_response.score += 10;
    hub.gameCompleted.dialogue_response.push(item.uid);

    hub.gameQueues.dialogue_response.shift();

    if (typeof speakChinese === 'function') speakChinese(selectedHanzi);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1100);
  } else {
    playDlgSound('wrong');
    btnEl.className = "p-4 rounded-2xl bg-rose-600 border border-rose-400 text-white font-bold transition-all text-left flex items-center justify-between shadow-lg shadow-rose-500/25";
    hub.gameStats.dialogue_response.wrong++;

    const popped = hub.gameQueues.dialogue_response.shift();
    hub.gameQueues.dialogue_response.push(popped);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1400);
  }
}

/**
 * 3. GAME 3: Nghe đoán câu (Dialogue Listening Quiz)
 */
function renderDialogueListeningGame(container, item) {
  const hub = window.DIALOGUE_GAMES_HUB;

  const pool = getDialogueLinesPool(hub.currentLessonId);
  const otherLines = pool.filter(p => p.vi !== item.vi);
  const distractors = otherLines.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [item, ...distractors].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6 text-center animate-in fade-in duration-200">
      
      <!-- Nút phát audio lớn -->
      <div class="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-lg">
        <button onclick="speakChinese('${item.hanzi}', 0.9)" class="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30 transition-transform">
          <svg class="w-10 h-10 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <div>
          <h3 class="text-base font-bold text-white">Bấm để nghe câu thoại</h3>
          <p class="text-xs text-slate-400">Nghe kỹ ngữ điệu và chọn nghĩa tiếng Việt chính xác</p>
        </div>
      </div>

      <!-- 4 Lựa chọn nghĩa tiếng Việt -->
      <div class="grid grid-cols-1 gap-2.5 text-left">
        ${options.map((opt, idx) => `
          <button onclick="handleDialogueListeningSelect('${escapeHtml(opt.vi)}', '${escapeHtml(item.vi)}', this)" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition-all flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
              ${['A', 'B', 'C', 'D'][idx]}
            </span>
            <span class="text-sm font-bold text-slate-200">${opt.vi}</span>
          </button>
        `).join('')}
      </div>

    </div>
  `;

  // Tự động phát âm 1 lần khi vào câu
  setTimeout(() => {
    if (typeof speakChinese === 'function') speakChinese(item.hanzi, 0.9);
  }, 300);
}

function handleDialogueListeningSelect(selectedVi, correctVi, btnEl) {
  const hub = window.DIALOGUE_GAMES_HUB;
  const item = hub.currentQuestion;
  if (!item) return;

  const isCorrect = selectedVi === correctVi;

  if (isCorrect) {
    playDlgSound('correct');
    btnEl.className = "p-4 rounded-2xl bg-emerald-600 border border-emerald-400 text-white font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/25";
    hub.gameStats.dialogue_listening.correct++;
    hub.gameStats.dialogue_listening.score += 10;
    hub.gameCompleted.dialogue_listening.push(item.uid);

    hub.gameQueues.dialogue_listening.shift();

    if (typeof showToast === 'function') showToast(`👏 Đúng rồi! "${item.hanzi}" (${item.pinyin})`);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1200);
  } else {
    playDlgSound('wrong');
    btnEl.className = "p-4 rounded-2xl bg-rose-600 border border-rose-400 text-white font-bold flex items-center gap-3 shadow-lg shadow-rose-500/25";
    hub.gameStats.dialogue_listening.wrong++;

    const popped = hub.gameQueues.dialogue_listening.shift();
    hub.gameQueues.dialogue_listening.push(popped);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1400);
  }
}

/**
 * 4. GAME 4: Nhìn nghĩa chọn câu chữ Hán (Hanzi Sentence Quiz)
 */
function renderDialogueHanziGame(container, item) {
  const hub = window.DIALOGUE_GAMES_HUB;

  const pool = getDialogueLinesPool(hub.currentLessonId);
  const otherLines = pool.filter(p => p.hanzi !== item.hanzi);
  const distractors = otherLines.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [item, ...distractors].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6 text-center animate-in fade-in duration-200">
      
      <!-- Thẻ nghĩa tiếng Việt -->
      <div class="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-2 shadow-lg">
        <span class="text-3xl">${item.avatar}</span>
        <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Chọn câu chữ Hán tương ứng:</p>
        <h3 class="text-xl sm:text-2xl font-black text-amber-300">"${item.vi}"</h3>
        <p class="text-xs text-slate-500">${item.speaker} (${item.speaker_vi || ''})</p>
      </div>

      <!-- 4 Lựa chọn chữ Hán -->
      <div class="grid grid-cols-1 gap-2.5 text-left">
        ${options.map((opt, idx) => `
          <button onclick="handleDialogueHanziSelect('${escapeHtml(opt.hanzi)}', '${escapeHtml(item.hanzi)}', this)" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition-all flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
              ${['A', 'B', 'C', 'D'][idx]}
            </span>
            <div>
              <p class="text-base font-black text-white">${opt.hanzi}</p>
              <p class="text-xs font-mono text-slate-400">${opt.pinyin}</p>
            </div>
          </button>
        `).join('')}
      </div>

    </div>
  `;
}

function handleDialogueHanziSelect(selectedHanzi, correctHanzi, btnEl) {
  const hub = window.DIALOGUE_GAMES_HUB;
  const item = hub.currentQuestion;
  if (!item) return;

  const isCorrect = selectedHanzi === correctHanzi;

  if (isCorrect) {
    playDlgSound('correct');
    btnEl.className = "p-4 rounded-2xl bg-emerald-600 border border-emerald-400 text-white font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/25";
    hub.gameStats.dialogue_hanzi.correct++;
    hub.gameStats.dialogue_hanzi.score += 10;
    hub.gameCompleted.dialogue_hanzi.push(item.uid);

    hub.gameQueues.dialogue_hanzi.shift();

    if (typeof speakChinese === 'function') speakChinese(selectedHanzi);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1100);
  } else {
    playDlgSound('wrong');
    btnEl.className = "p-4 rounded-2xl bg-rose-600 border border-rose-400 text-white font-bold flex items-center gap-3 shadow-lg shadow-rose-500/25";
    hub.gameStats.dialogue_hanzi.wrong++;

    const popped = hub.gameQueues.dialogue_hanzi.shift();
    hub.gameQueues.dialogue_hanzi.push(popped);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1400);
  }
}

/**
 * 5. GAME 5: Flashcard 3D Câu Thoại
 */
function renderDialogueFlashcardGame(container, item) {
  const hub = window.DIALOGUE_GAMES_HUB;
  hub.flashcardFlipped = false;

  container.innerHTML = `
    <div class="max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-200">
      
      <!-- Thẻ 3D lật -->
      <div id="dlg-flashcard-box" onclick="flipDialogueFlashcard()" class="relative w-full h-72 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-700/80 shadow-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-transform duration-500 select-none hover:scale-[1.02]">
        
        <!-- Mặt trước (Chữ Hán) -->
        <div id="fc-front" class="space-y-3">
          <span class="text-4xl">${item.avatar}</span>
          <p class="text-xs font-bold text-amber-400">${item.speaker} (${item.speaker_vi || ''})</p>
          <h3 class="text-2xl sm:text-3xl font-black text-white font-serif tracking-wide leading-relaxed">${item.hanzi}</h3>
          <p class="text-[11px] text-slate-500 mt-2">Bấm vào thẻ để lật xem Pinyin & Dịch nghĩa</p>
        </div>

        <!-- Mặt sau (Pinyin & Tiếng Việt) -->
        <div id="fc-back" class="hidden space-y-3">
          <span class="text-3xl">💡</span>
          <h4 class="text-xl font-bold font-mono text-cyan-300">${item.pinyin}</h4>
          <p class="text-lg font-bold text-emerald-300 leading-snug">"${item.vi}"</p>
          <p class="text-xs text-slate-400 italic">Ngữ cảnh: ${item.context_vi}</p>
        </div>

      </div>

      <!-- Nút phát âm thanh câu -->
      <div class="flex items-center justify-center gap-3">
        <button onclick="speakChinese('${item.hanzi}')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 flex items-center gap-2">
          <span>🔊</span> Nghe phát âm
        </button>
      </div>

      <!-- Nút đánh giá mức độ nhớ -->
      <div class="flex items-center justify-center gap-4 pt-2">
        <button onclick="handleDialogueFlashcardRating(false)" class="flex-1 py-3 px-4 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700 text-rose-300 font-black text-xs transition-all shadow-md">
          🔴 Chưa nhớ (Lặp lại)
        </button>
        <button onclick="handleDialogueFlashcardRating(true)" class="flex-1 py-3 px-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-black text-xs transition-all shadow-md">
          🟢 Đã thuộc (+10đ)
        </button>
      </div>

    </div>
  `;
}

function flipDialogueFlashcard() {
  const hub = window.DIALOGUE_GAMES_HUB;
  hub.flashcardFlipped = !hub.flashcardFlipped;
  const front = document.getElementById('fc-front');
  const back = document.getElementById('fc-back');
  const cardBox = document.getElementById('dlg-flashcard-box');

  playDlgSound('click');

  if (front && back && cardBox) {
    if (hub.flashcardFlipped) {
      front.classList.add('hidden');
      back.classList.remove('hidden');
      cardBox.classList.add('border-indigo-500');
    } else {
      back.classList.add('hidden');
      front.classList.remove('hidden');
      cardBox.classList.remove('border-indigo-500');
    }
  }
}

function handleDialogueFlashcardRating(known) {
  const hub = window.DIALOGUE_GAMES_HUB;
  const item = hub.currentQuestion;
  if (!item) return;

  if (known) {
    playDlgSound('correct');
    hub.gameStats.dialogue_flashcard.correct++;
    hub.gameStats.dialogue_flashcard.score += 10;
    hub.gameCompleted.dialogue_flashcard.push(item.uid);
    hub.gameQueues.dialogue_flashcard.shift();
  } else {
    playDlgSound('wrong');
    hub.gameStats.dialogue_flashcard.wrong++;
    const popped = hub.gameQueues.dialogue_flashcard.shift();
    hub.gameQueues.dialogue_flashcard.push(popped);
  }

  loadNextDialogueGameTurn();
}

/**
 * 6. GAME 6: Đánh máy & Luyện dịch câu thoại (Dialogue Typing Master)
 */
function renderDialogueTypingGame(container, item) {
  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6 text-center animate-in fade-in duration-200">
      
      <!-- Đề bài câu tiếng Việt -->
      <div class="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-2 shadow-lg">
        <span class="text-3xl">${item.avatar}</span>
        <div class="text-xs text-amber-300 font-bold">${item.speaker} (${item.speaker_vi || ''})</div>
        <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gõ câu chữ Hán hoặc Pinyin tương ứng:</p>
        <h3 class="text-2xl font-black text-white">"${item.vi}"</h3>
        <p class="text-xs font-mono text-slate-500">${item.pinyin}</p>
      </div>

      <!-- Ô nhập câu trả lời -->
      <div class="space-y-3">
        <input 
          type="text" 
          id="dlg-typing-input" 
          placeholder="Gõ chữ Hán hoặc pinyin tại đây rồi nhấn Enter..." 
          class="w-full px-5 py-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 focus:border-blue-500 focus:outline-none text-white font-bold text-base text-center shadow-inner"
          onkeydown="if(event.key === 'Enter') submitDialogueTyping()"
          autofocus
        >
        <div class="flex items-center justify-between text-xs text-slate-400">
          <button onclick="speakChinese('${item.hanzi}')" class="text-cyan-400 font-bold hover:underline flex items-center gap-1">
            <span>🔊</span> Nghe câu
          </button>
          <span>Nhấn Enter để nộp bài</span>
        </div>
      </div>

      <!-- Nút Nộp câu trả lời -->
      <button onclick="submitDialogueTyping()" class="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-blue-500/25 transition-all">
        Kiểm tra câu
      </button>

    </div>
  `;

  setTimeout(() => {
    const inp = document.getElementById('dlg-typing-input');
    if (inp) inp.focus();
  }, 100);
}

function submitDialogueTyping() {
  const hub = window.DIALOGUE_GAMES_HUB;
  const item = hub.currentQuestion;
  const inputEl = document.getElementById('dlg-typing-input');
  if (!item || !inputEl) return;

  const userText = inputEl.value.trim().toLowerCase().replace(/[，。？！,?!]/g, '');
  const cleanHanzi = item.hanzi.replace(/[，。？！,?!]/g, '').trim();
  const cleanPinyin = item.pinyin.toLowerCase().replace(/[，。？！,?!]/g, '').replace(/\s+/g, '');

  const normUser = userText.replace(/\s+/g, '');

  const isCorrect = (normUser === cleanHanzi) || (normUser === cleanPinyin);

  if (isCorrect) {
    playDlgSound('correct');
    inputEl.className = "w-full px-5 py-3.5 rounded-2xl bg-emerald-950/70 border-2 border-emerald-500 text-emerald-300 font-bold text-base text-center shadow-lg";
    hub.gameStats.dialogue_typing.correct++;
    hub.gameStats.dialogue_typing.score += 15;
    hub.gameCompleted.dialogue_typing.push(item.uid);

    hub.gameQueues.dialogue_typing.shift();

    if (typeof showToast === 'function') showToast(`👏 Quá chuẩn! "${item.hanzi}"`);
    if (typeof speakChinese === 'function') speakChinese(item.hanzi);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1100);
  } else {
    playDlgSound('wrong');
    inputEl.className = "w-full px-5 py-3.5 rounded-2xl bg-rose-950/70 border-2 border-rose-500 text-rose-300 font-bold text-base text-center shadow-lg animate-shake";
    hub.gameStats.dialogue_typing.wrong++;

    const popped = hub.gameQueues.dialogue_typing.shift();
    hub.gameQueues.dialogue_typing.push(popped);

    if (typeof showToast === 'function') showToast(`❌ Chưa đúng! Đáp án: ${item.hanzi} (${item.pinyin})`);

    setTimeout(() => {
      loadNextDialogueGameTurn();
    }, 1500);
  }
}

/**
 * Màn hình Tổng kết khi hoàn thành cả vòng
 */
function renderDialogueSummaryScreen() {
  const hub = window.DIALOGUE_GAMES_HUB;
  const gameArea = document.getElementById('dlg-game-area');
  const summaryBox = document.getElementById('dlg-summary-screen');
  if (!summaryBox || !gameArea) return;

  gameArea.classList.add('hidden');
  summaryBox.classList.remove('hidden');

  const mode = hub.activeMode;
  const stats = hub.gameStats[mode] || { correct: 0, wrong: 0, score: 0 };
  const completedCount = (hub.gameCompleted[mode] || []).length;

  summaryBox.innerHTML = `
    <div class="max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div class="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
        <span class="text-5xl">🏆</span>
        <h3 class="text-2xl font-black text-amber-300">Xuất Sắc! Hoàn Thành Vòng Game!</h3>
        <p class="text-xs text-slate-400">Bạn đã chinh phục toàn bộ câu thoại của bài học này</p>

        <div class="flex items-center justify-center gap-6 pt-3">
          <div>
            <span class="text-3xl font-black text-white">${completedCount}</span>
            <p class="text-[10px] text-slate-400 mt-0.5">Câu đã vượt qua</p>
          </div>
          <div class="h-8 w-[1px] bg-slate-800"></div>
          <div>
            <span class="text-3xl font-black text-amber-400">${stats.score}</span>
            <p class="text-[10px] text-slate-400 mt-0.5">Điểm số</p>
          </div>
          <div class="h-8 w-[1px] bg-slate-800"></div>
          <div>
            <span class="text-3xl font-black text-emerald-400">${stats.correct}</span>
            <p class="text-[10px] text-slate-400 mt-0.5">Lần trả lời đúng</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-3 flex-wrap">
        <button onclick="resetDialogueGameQueue()" class="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2">
          <span>🔄</span> Chơi lại chế độ này
        </button>
        <button onclick="closeDialogueGamesHub()" class="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all">
          Đóng
        </button>
      </div>
    </div>
  `;
}

function resetDialogueGameQueue() {
  const hub = window.DIALOGUE_GAMES_HUB;
  hub.gameQueues[hub.activeMode] = [];
  initDialogueModeQueue(hub.activeMode);
  loadNextDialogueGameTurn();
}

/**
 * Tạo Modal HTML trong DOM
 */
function createDialogueGamesModalHTML() {
  let modalEl = document.getElementById('dialogue-games-modal');
  if (modalEl) return;

  modalEl = document.createElement('div');
  modalEl.id = 'dialogue-games-modal';
  modalEl.className = 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 hidden';
  modalEl.innerHTML = `
    <div class="bg-[#0b101d] border border-slate-800 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- 1. Header Modal -->
      <div class="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white text-base shadow-md">
            🎮
          </div>
          <div>
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              Game Bài Khoá & Hội Thoại
              <span class="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold">6 TRÒ CHƠI</span>
            </h3>
            <p class="text-[10px] text-slate-400">Luyện phản xạ giao tiếp & nhớ câu thoại SGK</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Chọn bài học -->
          <select id="dlg-hub-lesson-select" onchange="switchDialogueGameLesson(parseInt(this.value))" class="bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer">
          </select>

          <!-- Nút Đóng -->
          <button onclick="closeDialogueGamesHub()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all border border-slate-700">
            ✕
          </button>
        </div>
      </div>

      <!-- 2. Tabs Chọn Trò Chơi (Scrollable) -->
      <div id="dlg-hub-tabs" class="px-4 py-2 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
      </div>

      <!-- 3. Thanh Tiến Trình & Điểm Số -->
      <div class="px-5 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 flex-1 max-w-xs">
          <span id="dlg-progress-counter" class="text-xs font-black text-slate-200 whitespace-nowrap">Câu 1/6</span>
          <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-[1px]">
            <div id="dlg-progress-fill" class="bg-gradient-to-r from-purple-500 to-amber-400 h-full rounded-full transition-all duration-300" style="width: 15%"></div>
          </div>
        </div>

        <div id="dlg-score-badge" class="flex items-center gap-2 text-xs font-bold bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
        </div>
      </div>

      <!-- 4. Khu Vực Chơi Game -->
      <div id="dlg-game-area" class="p-5 sm:p-6 overflow-y-auto max-h-[68vh] flex-1">
      </div>

      <!-- 5. Màn Hình Tổng Kết -->
      <div id="dlg-summary-screen" class="p-5 sm:p-6 overflow-y-auto max-h-[68vh] hidden flex-1">
      </div>

    </div>
  `;

  document.body.appendChild(modalEl);
}

function switchDialogueGameLesson(lessonId) {
  const hub = window.DIALOGUE_GAMES_HUB;
  hub.currentLessonId = lessonId;
  hub.gameQueues[hub.activeMode] = [];
  initDialogueModeQueue(hub.activeMode);
  updateDlgHubUI();
  loadNextDialogueGameTurn();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

window.openDialogueGamesHub = openDialogueGamesHub;
window.closeDialogueGamesHub = closeDialogueGamesHub;
window.setDialogueGameTab = setDialogueGameTab;
window.selectSentenceBlock = selectSentenceBlock;
window.removeSelectedBlock = removeSelectedBlock;
window.clearSelectedBlocks = clearSelectedBlocks;
window.submitSentenceBuilder = submitSentenceBuilder;
window.handleDialogueResponseSelect = handleDialogueResponseSelect;
window.handleDialogueListeningSelect = handleDialogueListeningSelect;
window.handleDialogueHanziSelect = handleDialogueHanziSelect;
window.flipDialogueFlashcard = flipDialogueFlashcard;
window.handleDialogueFlashcardRating = handleDialogueFlashcardRating;
window.submitDialogueTyping = submitDialogueTyping;
window.resetDialogueGameQueue = resetDialogueGameQueue;
window.switchDialogueGameLesson = switchDialogueGameLesson;
