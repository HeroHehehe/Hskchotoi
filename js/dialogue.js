/**
 * MODULE BÀI KHOÁ (课文) - 15 BÀI GIÁO TRÌNH HSK 1 (3.0)
 * Tính năng:
 *  - 3 bài khoá mỗi bài học (Tổng cộng 45 bài khoá chuẩn SGK)
 *  - Ngữ cảnh thực tế (Context) tiếng Trung & tiếng Việt
 *  - Lời thoại từng nhân vật kèm avatar, Pinyin, dịch nghĩa
 *  - Phát âm từng câu & phát tự động toàn bộ bài thoại (TTS zh-CN)
 *  - Đánh dấu câu đang đọc (Highlight theo thời gian thực)
 *  - Chế độ Luyện đóng vai (Role-play Practice)
 *  - Bật/Tắt Pinyin & Dịch nghĩa
 *  - Bảng từ mới bài khoá (生词) chi tiết
 *  - Điều chỉnh tốc độ đọc (0.8x, 1.0x, 1.2x)
 */

window.DialogueState = {
  currentLessonId: 1,
  currentDialogueIdx: 0,
  showPinyin: true,
  showTranslation: true,
  isPlaying: false,
  playingLineIndex: -1,
  speechSpeed: 1.0,
  rolePlayMode: false,
  selectedRole: null,
  activeSpeechUtterance: null
};

/**
 * Khởi tạo Module Bài khoá
 */
function initDialogueModule() {
  renderDialogueView();
}

/**
 * Lấy dữ liệu bài khoá hiện tại
 */
function getCurrentDialogueData() {
  if (!window.HSK_DIALOGUES || !window.HSK_DIALOGUES.length) return null;
  const lessonData = window.HSK_DIALOGUES.find(d => d.lesson_id === window.DialogueState.currentLessonId) || window.HSK_DIALOGUES[0];
  const dialogue = lessonData.dialogues[window.DialogueState.currentDialogueIdx] || lessonData.dialogues[0];
  return { lessonData, dialogue };
}

/**
 * Render toàn bộ giao diện Bài khoá
 */
function renderDialogueView(lessonId = null, dialogueIdx = null) {
  if (lessonId !== null) window.DialogueState.currentLessonId = lessonId;
  if (dialogueIdx !== null) window.DialogueState.currentDialogueIdx = dialogueIdx;

  stopDialogueAudio();

  const container = document.getElementById('dialogue-view-container');
  if (!container) return;

  const data = getCurrentDialogueData();
  if (!data) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 bg-slate-900/60 rounded-3xl border border-slate-800">
        <p class="text-base font-bold">Đang tải dữ liệu bài khoá...</p>
      </div>`;
    return;
  }

  const { lessonData, dialogue } = data;

  // Lấy danh sách các nhân vật trong bài khoá để phục vụ đóng vai
  const roles = [...new Set(dialogue.lines.map(l => l.speaker))];

  // Render HTML
  container.innerHTML = `
    <!-- 1. THANH CHỌN 3 BÀI KHOÁ CỦA BÀI HỌC (课文 1, 课文 2, 课文 3) -->
    <div class="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        ${lessonData.dialogues.map((dlg, idx) => `
          <button onclick="selectDialogueTab(${idx})" 
            class="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              idx === window.DialogueState.currentDialogueIdx
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25 ring-2 ring-amber-400/40 scale-[1.02]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }">
            <span>${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
            <span>${dlg.title}</span>
            <span class="text-[10px] font-normal opacity-90">(${dlg.title_vi})</span>
          </button>
        `).join('')}
      </div>

      <!-- Quick Action: Từ vựng bài khoá -->
      <a href="#dialogue-vocab-section" class="px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 text-xs font-bold flex items-center gap-1.5 transition-all">
        <span>📖</span>
        <span>${dialogue.vocab ? dialogue.vocab.length : 0} Từ mới bài</span>
      </a>
    </div>

    <!-- 2. KHUNG NGỮ CẢNH (SITUATION CONTEXT CARD) -->
    <div class="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 shadow-md">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
          🏛️
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Ngữ cảnh bài khoá</span>
            <span class="text-xs text-slate-400 font-medium">Băng ghi âm SGK mã [${dialogue.audio_ref || 'Audio'}]</span>
          </div>
          <p class="text-sm font-bold text-white mt-1 leading-snug">
            ${dialogue.context_zh}
          </p>
          <p class="text-xs text-amber-200/90 font-medium mt-0.5 leading-snug">
            ${dialogue.context_vi}
          </p>
        </div>
      </div>
    </div>

    <!-- 3. THANH ĐIỀU KHIỂN & BẬT TẮT PINYIN/DỊCH/ĐÓNG VAI -->
    <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <!-- Bộ nút phát âm -->
      <div class="flex items-center gap-2 flex-wrap">
        <button id="btn-play-dialogue" onclick="togglePlayFullDialogue()" 
          class="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span id="play-dialogue-text">Phát toàn bộ bài</span>
        </button>

        <button onclick="stopDialogueAudio()" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
          Dừng
        </button>

        <!-- Tốc độ đọc -->
        <div class="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
          <span class="text-[10px] text-slate-400 px-1 font-bold">Tốc độ:</span>
          ${[0.8, 1.0, 1.2].map(speed => `
            <button onclick="setDialogueSpeed(${speed})" class="px-2 py-1 rounded-lg font-bold text-[11px] transition-all ${
              window.DialogueState.speechSpeed === speed
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }">${speed}x</button>
          `).join('')}
        </div>
      </div>

      <!-- Bộ công tắc hiển thị & đóng vai -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Toggle Pinyin -->
        <button onclick="toggleDialoguePinyin()" class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
          window.DialogueState.showPinyin
            ? 'bg-blue-950/60 border-blue-600 text-blue-300'
            : 'bg-slate-800/80 border-slate-700 text-slate-400'
        }">
          <span>🔤</span>
          <span>Pinyin</span>
          <span class="text-[10px] font-black">${window.DialogueState.showPinyin ? 'BẬT' : 'TẮT'}</span>
        </button>

        <!-- Toggle Dịch nghĩa -->
        <button onclick="toggleDialogueTranslation()" class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
          window.DialogueState.showTranslation
            ? 'bg-indigo-950/60 border-indigo-600 text-indigo-300'
            : 'bg-slate-800/80 border-slate-700 text-slate-400'
        }">
          <span>🇻🇳</span>
          <span>Dịch TV</span>
          <span class="text-[10px] font-black">${window.DialogueState.showTranslation ? 'BẬT' : 'TẮT'}</span>
        </button>

        <!-- Toggle Role-Play Practice -->
        <div class="relative">
          <button onclick="toggleRolePlayMode()" class="px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
            window.DialogueState.rolePlayMode
              ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-md shadow-rose-900/30 ring-1 ring-rose-400/40'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }">
            <span>🎭</span>
            <span>Luyện đóng vai</span>
            <span class="text-[10px] px-1 rounded ${window.DialogueState.rolePlayMode ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-400'}">
              ${window.DialogueState.rolePlayMode ? 'ĐANG BẬT' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Thanh chọn nhân vật đóng vai khi rolePlayMode = true -->
    ${window.DialogueState.rolePlayMode ? `
      <div class="p-3 rounded-2xl bg-rose-950/30 border border-rose-700/50 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
        <div class="flex items-center gap-2">
          <span class="text-lg">🎭</span>
          <div>
            <p class="text-xs font-extrabold text-rose-200">Chọn vai của bạn:</p>
            <p class="text-[10px] text-slate-400">Khi phát, máy sẽ tự động đọc vai kia và nhường lượt cho bạn đọc vai này!</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          ${roles.map(r => `
            <button onclick="selectRolePlayRole('${r}')" class="px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
              window.DialogueState.selectedRole === r
                ? 'bg-rose-600 text-white border-rose-400 shadow-md scale-105'
                : 'bg-slate-900/80 text-rose-300 border-rose-800/60 hover:bg-slate-800'
            }">
              <span>${getSpeakerAvatar(r)}</span>
              <span>${r}</span>
              ${window.DialogueState.selectedRole === r ? '✓' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- 4. DANH SÁCH BONG BÓNG LỜI THOẠI (CHAT BUBBLES) -->
    <div class="space-y-4 py-2">
      ${dialogue.lines.map((line, idx) => renderDialogueLine(line, idx, roles)).join('')}
    </div>

    <!-- 5. BẢNG TỪ MỚI CỦA BÀI KHOÁ NÀY (生词) -->
    ${dialogue.vocab && dialogue.vocab.length ? `
      <div id="dialogue-vocab-section" class="mt-6 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-sm font-black text-indigo-400">
              词
            </div>
            <div>
              <h3 class="text-sm font-extrabold text-white">Từ mới bài khoá (生词)</h3>
              <p class="text-[11px] text-slate-400">Trích xuất chính xác theo bài khoá ${dialogue.title} - SGK</p>
            </div>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-900/40 text-indigo-300 border border-indigo-700/60">
            ${dialogue.vocab.length} từ
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          ${dialogue.vocab.map(v => `
            <div class="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 transition-all flex items-center justify-between gap-3 group">
              <div class="flex items-center gap-2.5">
                <span class="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center flex-shrink-0">
                  ${v.num}
                </span>
                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">${v.hanzi}</span>
                    <span class="text-xs font-bold text-cyan-400">${v.pinyin}</span>
                  </div>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">${v.pos}</span>
                    <span class="text-xs text-slate-300 font-medium">${v.meaning}</span>
                  </div>
                </div>
              </div>
              <button onclick="speakChineseText('${v.hanzi}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 flex-shrink-0" title="Phát âm từ này">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

/**
 * Lấy avatar tương ứng cho từng nhân vật
 */
function getSpeakerAvatar(speaker) {
  const map = {
    '王一飞': '👩‍🏫',
    'AI小语': '🤖',
    '小语': '🤖',
    '李文': '👨‍🎓',
    '白家月': '👩‍🎓',
    '陈天中': '👨‍🎓',
    '安妮': '👱‍♀️',
    '刘明': '👨',
    '王一雪': '👩',
    '杨同乐': '👨‍💼',
    '刘小明': '👦',
    '刘小雪': '👧',
    '医生': '👨‍⚕️',
    '胡医生': '👨‍⚕️',
    '服务员': '🧑‍🍳',
    '售货员': '🧑‍💼',
    '学生': '🎓',
    '同学们': '👥'
  };
  return map[speaker] || '👤';
}

/**
 * Render từng câu thoại (Bong bóng hội thoại)
 */
function renderDialogueLine(line, index, roles) {
  const isLeft = (roles.indexOf(line.speaker) % 2 === 0);
  const isPlaying = (window.DialogueState.playingLineIndex === index);
  const isUserRole = (window.DialogueState.rolePlayMode && window.DialogueState.selectedRole === line.speaker);

  return `
    <div id="dlg-line-${index}" class="flex items-start gap-3 transition-all duration-300 ${
      isLeft ? 'flex-row' : 'flex-row-reverse'
    }">
      <!-- Avatar nhân vật -->
      <div class="flex flex-col items-center flex-shrink-0">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md border ${
          isUserRole 
            ? 'bg-rose-950 border-rose-500 ring-2 ring-rose-400' 
            : isLeft 
              ? 'bg-slate-800/90 border-slate-700' 
              : 'bg-indigo-950/90 border-indigo-700'
        }">
          ${line.avatar || getSpeakerAvatar(line.speaker)}
        </div>
        <span class="text-[10px] font-bold text-slate-300 mt-1 max-w-[65px] truncate text-center leading-tight">
          ${line.speaker}
        </span>
        <span class="text-[9px] text-slate-400 max-w-[65px] truncate text-center leading-none">
          ${line.speaker_vi || ''}
        </span>
      </div>

      <!-- Bong bóng lời thoại -->
      <div class="max-w-[80%] sm:max-w-[75%] rounded-3xl p-4 transition-all duration-300 ${
        isPlaying
          ? 'bg-gradient-to-r from-blue-900/90 to-indigo-900/90 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.01]'
          : isUserRole
            ? 'bg-rose-950/40 border border-rose-700/60 shadow-lg'
            : isLeft
              ? 'bg-slate-900/90 border border-slate-800 shadow-md'
              : 'bg-[#10172d]/90 border border-indigo-900/80 shadow-md'
      }">
        <!-- Header của bong bóng thoại: Tên nhân vật & nút thao tác -->
        <div class="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1.5 mb-2">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-black text-amber-400">${line.speaker}</span>
            ${isUserRole ? `
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white">VAI CỦA BẠN</span>
            ` : ''}
            ${isPlaying ? `
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-500 text-slate-950 animate-pulse">ĐANG PHÁT</span>
            ` : ''}
          </div>

          <!-- Nút phát riêng & Luyện đọc câu này -->
          <div class="flex items-center gap-1.5">
            <button onclick="playSingleLine(${index})" class="w-7 h-7 rounded-xl bg-slate-800/90 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all text-xs border border-slate-700 hover:border-blue-500 shadow-sm" title="Nghe mẫu câu này">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </button>
            <button onclick="practiceLinePrompt(${index})" class="w-7 h-7 rounded-xl bg-red-950/70 hover:bg-red-600 border border-red-700/80 hover:border-red-500 text-rose-300 hover:text-white flex items-center justify-center transition-all text-xs shadow-sm" title="Luyện nói câu này bằng AI (Ghi âm & Chấm điểm)">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
            </button>
          </div>
        </div>

        <!-- Hán tự (Hanzi) -->
        <p class="text-xl sm:text-2xl font-bold tracking-wide text-white leading-relaxed">
          ${line.hanzi}
        </p>

        <!-- Phiên âm Pinyin (Bật/Tắt) -->
        ${window.DialogueState.showPinyin ? `
          <p class="text-xs sm:text-sm font-semibold text-cyan-400 mt-1 font-mono tracking-wide">
            ${line.pinyin}
          </p>
        ` : ''}

        <!-- Bản dịch tiếng Việt (Bật/Tắt) -->
        ${window.DialogueState.showTranslation ? `
          <p class="text-xs sm:text-[13px] text-slate-300 font-medium mt-1.5 pt-1.5 border-t border-slate-800/60 leading-normal">
            ${line.vi}
          </p>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Chọn tab bài khoá (课文 1, 2, 3)
 */
function selectDialogueTab(idx) {
  window.DialogueState.currentDialogueIdx = idx;
  renderDialogueView();
}

/**
 * Bật/Tắt hiển thị Pinyin
 */
function toggleDialoguePinyin() {
  window.DialogueState.showPinyin = !window.DialogueState.showPinyin;
  renderDialogueView();
}

/**
 * Bật/Tắt hiển thị Dịch nghĩa
 */
function toggleDialogueTranslation() {
  window.DialogueState.showTranslation = !window.DialogueState.showTranslation;
  renderDialogueView();
}

/**
 * Đặt tốc độ đọc
 */
function setDialogueSpeed(speed) {
  window.DialogueState.speechSpeed = speed;
  renderDialogueView();
}

/**
 * Bật/Tắt chế độ Đóng vai
 */
function toggleRolePlayMode() {
  window.DialogueState.rolePlayMode = !window.DialogueState.rolePlayMode;
  if (window.DialogueState.rolePlayMode && !window.DialogueState.selectedRole) {
    const data = getCurrentDialogueData();
    if (data && data.dialogue.lines.length) {
      window.DialogueState.selectedRole = data.dialogue.lines[0].speaker;
    }
  }
  renderDialogueView();
}

/**
 * Chọn nhân vật đóng vai
 */
function selectRolePlayRole(role) {
  window.DialogueState.selectedRole = role;
  renderDialogueView();
}

/**
 * Phát âm thanh tiếng Trung chuẩn qua Web Speech API
 */
function speakChineseText(text, onEndCallback = null) {
  if (!('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = window.DialogueState.speechSpeed || 1.0;

  // Tìm giọng zh-CN nếu có
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));
  if (zhVoice) utterance.voice = zhVoice;

  utterance.onend = () => {
    window.DialogueState.activeSpeechUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  utterance.onerror = () => {
    window.DialogueState.activeSpeechUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  window.DialogueState.activeSpeechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Phát một câu riêng lẻ
 */
function playSingleLine(index) {
  const data = getCurrentDialogueData();
  if (!data || !data.dialogue.lines[index]) return;

  stopDialogueAudio();

  window.DialogueState.playingLineIndex = index;
  highlightPlayingLine(index);

  const line = data.dialogue.lines[index];
  speakChineseText(line.hanzi, () => {
    window.DialogueState.playingLineIndex = -1;
    highlightPlayingLine(-1);
  });
}

/**
 * Bật/Tắt phát toàn bộ bài khoá tự động
 */
function togglePlayFullDialogue() {
  if (window.DialogueState.isPlaying) {
    stopDialogueAudio();
  } else {
    startFullDialoguePlayback();
  }
}

/**
 * Bắt đầu phát toàn bộ bài hội thoại từ câu đầu đến cuối
 */
function startFullDialoguePlayback() {
  const data = getCurrentDialogueData();
  if (!data || !data.dialogue.lines.length) return;

  window.DialogueState.isPlaying = true;
  updatePlayButtonUI(true);

  playDialogueStep(0);
}

/**
 * Phát từng bước trong bài thoại
 */
function playDialogueStep(index) {
  if (!window.DialogueState.isPlaying) return;

  const data = getCurrentDialogueData();
  if (!data || index >= data.dialogue.lines.length) {
    stopDialogueAudio();
    if (typeof showToast === 'function') {
      showToast("🎉 Đã hoàn thành bài đọc hội thoại!");
    }
    return;
  }

  window.DialogueState.playingLineIndex = index;
  highlightPlayingLine(index);

  const line = data.dialogue.lines[index];

  // Nếu đang ở chế độ Role-Play và đây là vai người dùng chọn:
  if (window.DialogueState.rolePlayMode && window.DialogueState.selectedRole === line.speaker) {
    if (typeof showToast === 'function') {
      showToast(`🎙️ Đến lượt bạn đọc vai [${line.speaker}]!`);
    }

    // Tạm dừng 4.5 giây để người dùng đọc to theo vai của mình
    setTimeout(() => {
      if (window.DialogueState.isPlaying) {
        playDialogueStep(index + 1);
      }
    }, 4500);
  } else {
    // Đọc bình thường
    speakChineseText(line.hanzi, () => {
      if (window.DialogueState.isPlaying) {
        // Nghỉ 700ms giữa 2 câu
        setTimeout(() => {
          playDialogueStep(index + 1);
        }, 700);
      }
    });
  }
}

/**
 * Dừng phát âm thanh bài khoá
 */
function stopDialogueAudio() {
  window.DialogueState.isPlaying = false;
  window.DialogueState.playingLineIndex = -1;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  updatePlayButtonUI(false);
  highlightPlayingLine(-1);
}

/**
 * Cập nhật giao diện nút Phát tất cả
 */
function updatePlayButtonUI(isPlaying) {
  const btnText = document.getElementById('play-dialogue-text');
  const btn = document.getElementById('btn-play-dialogue');
  if (btnText && btn) {
    if (isPlaying) {
      btnText.textContent = "Đang đọc bài...";
      btn.classList.remove('from-emerald-600', 'to-teal-600');
      btn.classList.add('from-amber-600', 'to-orange-600', 'animate-pulse');
    } else {
      btnText.textContent = "Phát toàn bộ bài";
      btn.classList.remove('from-amber-600', 'to-orange-600', 'animate-pulse');
      btn.classList.add('from-emerald-600', 'to-teal-600');
    }
  }
}

/**
 * Đánh dấu (Highlight) câu đang được phát
 */
function highlightPlayingLine(index) {
  const container = document.getElementById('dialogue-view-container');
  if (!container) return;

  const allLines = container.querySelectorAll('[id^="dlg-line-"]');
  allLines.forEach((el, idx) => {
    const bubble = el.querySelector('div.rounded-3xl');
    if (!bubble) return;

    if (idx === index) {
      bubble.classList.add('border-cyan-400', 'shadow-cyan-500/30', 'scale-[1.01]');
      // Cuộn êm đến câu đang nói nếu nằm ngoài tầm nhìn
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      bubble.classList.remove('border-cyan-400', 'shadow-cyan-500/30', 'scale-[1.01]');
    }
  });
}

/**
 * Luyện đọc từng câu thoại với phản hồi âm thanh & Ghi âm chấm điểm AI
 */
function practiceLinePrompt(index) {
  const data = getCurrentDialogueData();
  if (!data || !data.dialogue.lines[index]) return;

  const line = data.dialogue.lines[index];

  // Dừng phát bài khoá nếu đang chạy
  stopDialogueAudio();

  // Mở modal Luyện phát âm AI thực tế với câu thoại này
  if (typeof openVoiceModal === 'function') {
    openVoiceModal({
      id: `dlg-${window.DialogueState.currentLessonId}-${window.DialogueState.currentDialogueIdx}-${index}`,
      hanzi: line.hanzi,
      pinyin: line.pinyin,
      meaning: line.vi,
      type: "BÀI KHOÁ SGK",
      type_detail: `${line.speaker} (${line.speaker_vi || ''})`,
      isDialogueLine: true,
      lesson_id: window.DialogueState.currentLessonId,
      dialogue_idx: window.DialogueState.currentDialogueIdx,
      line_idx: index
    });
  } else {
    speakChineseText(line.hanzi);
  }
}

// Xuất các hàm ra phạm vi toàn cục (Global window)
window.initDialogueModule = initDialogueModule;
window.renderDialogueView = renderDialogueView;
window.selectDialogueTab = selectDialogueTab;
window.toggleDialoguePinyin = toggleDialoguePinyin;
window.toggleDialogueTranslation = toggleDialogueTranslation;
window.setDialogueSpeed = setDialogueSpeed;
window.toggleRolePlayMode = toggleRolePlayMode;
window.selectRolePlayRole = selectRolePlayRole;
window.playSingleLine = playSingleLine;
window.togglePlayFullDialogue = togglePlayFullDialogue;
window.stopDialogueAudio = stopDialogueAudio;
window.practiceLinePrompt = practiceLinePrompt;
