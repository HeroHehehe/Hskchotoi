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
  activeSpeechUtterance: null,
  
  // Chế độ Đóng vai tương tác 2 chiều (Interactive 2-Way Role-Play)
  rolePlayActive: false,
  rolePlayTurnIndex: -1,
  rolePlayListening: false,
  rolePlaySpokenText: "",
  rolePlayRecognition: null,
  rolePlayPassedLines: {}
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
            <span>${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🎤'}</span>
            <span>${dlg.title}</span>
            <span class="text-[10px] font-normal opacity-90">(${dlg.title_vi})</span>
          </button>
        `).join('')}
      </div>

      <!-- Actions: Mini Game & Từ vựng bài khoá -->
      <div class="flex items-center gap-2 flex-wrap">
        <button onclick="openDialogueGamesHub('sentence_builder', window.DialogueState.currentLessonId)" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white border border-purple-400/40 text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all">
          <span>🎮</span>
          <span>Mini Game Hội Thoại (6 Trò)</span>
        </button>
        <a href="#dialogue-vocab-section" class="px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 text-xs font-bold flex items-center gap-1.5 transition-all">
          <span>📖</span>
          <span>${dialogue.vocab ? dialogue.vocab.length : 0} Từ mới bài</span>
        </a>
      </div>
    </div>

    <!-- BANNER BÀI TẬP NÓI CÔ GIAO (BÀI 4) -->
    ${lessonData.lesson_id === 4 ? `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/60 border-2 border-amber-500/60 shadow-xl shadow-amber-950/30 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 flex-shrink-0 animate-bounce">
            🎤
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">Bài tập cô giao</span>
              <span class="text-xs text-amber-300 font-bold">Thuyết trình: Giới thiệu gia đình mình (Bài 4)</span>
            </div>
            <p class="text-xs text-slate-300 mt-0.5">
              Nhà 3 người (bố, mẹ, em) • Bố 60 tuổi, Mẹ 55 tuổi • Bố mẹ về hưu / không bận • Không anh chị em • Rất yêu gia đình
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="selectDialogueTab(3)" class="px-3.5 py-2 rounded-xl ${window.DialogueState.currentDialogueIdx === 3 ? 'bg-amber-600 text-white ring-2 ring-amber-300' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'} text-xs font-black shadow-lg shadow-orange-500/25 flex items-center gap-1.5 transition-all">
            <span>🗣️</span> <span>${window.DialogueState.currentDialogueIdx === 3 ? 'Đang xem bài nói mẫu' : 'Mở bài nói mẫu (Tab 4)'}</span>
          </button>
          <button onclick="openFamilySpeechModal()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all">
            <span>✨</span> <span>Studio Luyện Thuyết Trình AI</span>
          </button>
        </div>
      </div>
    ` : ''}

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

        <!-- Toggle Phông Khải Thư -->
        <button onclick="toggleChineseFont()" class="btn-font-toggle px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-700/60 bg-amber-950/60 text-amber-300 hover:text-white transition-all flex items-center gap-1.5" title="Đổi phông chữ Khải Thư / Mặc định">
          <span>🖌️</span>
          <span class="font-toggle-text">Khải Thư</span>
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

        <!-- Nút Mini Game Hội Thoại -->
        <button onclick="openDialogueGamesHub('sentence_builder', window.DialogueState.currentLessonId)" class="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/30 flex items-center gap-1.5 border border-purple-400/30 transition-all">
          <span>🎮</span>
          <span>Mini Game</span>
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

    <!-- Thanh chọn nhân vật đóng vai & Điều khiển đối thoại 2 chiều -->
    ${window.DialogueState.rolePlayMode ? `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/50 border border-rose-600/60 flex flex-wrap items-center justify-between gap-4 shadow-xl animate-fadeIn">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-600/30 flex-shrink-0">
            🎭
          </div>
          <div>
            <h4 class="text-sm font-black text-white flex items-center gap-2">
              Luyện Đóng Vai Đối Thoại 2 Chiều
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold border border-rose-500/30">Microphone AI</span>
            </h4>
            <p class="text-xs text-rose-200 mt-0.5">
              Bạn nói vai <b class="text-white underline">${window.DialogueState.selectedRole || roles[0]}</b> khi mic 🎙️ bật. Nói đúng, máy sẽ tự động đáp lại vai kia!
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <!-- Các nút chọn vai -->
          <div class="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-rose-900/60">
            ${roles.map(r => `
              <button onclick="selectRolePlayRole('${r}')" class="px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                window.DialogueState.selectedRole === r
                  ? 'bg-rose-600 text-white border-rose-400 shadow-md scale-105'
                  : 'bg-transparent text-rose-300 border-transparent hover:bg-slate-800'
              }">
                <span>${getSpeakerAvatar(r)}</span>
                <span>${r}</span>
                ${window.DialogueState.selectedRole === r ? '✓' : ''}
              </button>
            `).join('')}
          </div>

          <!-- Nút Bắt đầu / Tạm dừng đối thoại -->
          <button onclick="toggleInteractiveRolePlay()" class="px-4 py-2 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 ${
            window.DialogueState.rolePlayActive
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 animate-pulse'
          }">
            <span>${window.DialogueState.rolePlayActive ? '⏸️ Tạm dừng' : '▶️ Bắt đầu đối thoại'}</span>
          </button>
        </div>
      </div>
    ` : ''}

    <!-- THẺ TỔNG QUAN BÀI THUYẾT TRÌNH (KHI Ở TAB 4 BÀI 4) -->
    ${(lessonData.lesson_id === 4 && window.DialogueState.currentDialogueIdx === 3 && typeof window.FAMILY_SPEECH_DATA !== 'undefined') ? `
      <div class="p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 shadow-2xl space-y-4 animate-fadeIn">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">📜</span>
            <div>
              <h3 class="text-sm font-black text-white">Toàn văn bài nói hoàn chỉnh (100% từ vựng Bài 1 - Bài 4)</h3>
              <p class="text-xs text-slate-400">Đáp ứng trọn vẹn 6 yêu cầu cô giáo giao</p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="togglePlayFullFamilySpeech()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all">
              <span>▶️</span> <span>Đọc toàn bộ bài nói</span>
            </button>
            <button onclick="copyFamilySpeechScript()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all" title="Copy để nộp cô giáo">
              <span>📋</span> <span>Sao chép bài nộp</span>
            </button>
            <button onclick="openFamilySpeechModal()" class="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-600 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all">
              <span>🎙️</span> <span>Studio Luyện Nói AI</span>
            </button>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <p class="text-base md:text-lg font-black text-white font-kaiti leading-relaxed tracking-wide">
            ${window.FAMILY_SPEECH_DATA.fullParagraph.hanzi}
          </p>
          <p class="text-xs md:text-sm font-bold text-cyan-400/95 leading-relaxed">
            ${window.FAMILY_SPEECH_DATA.fullParagraph.pinyin}
          </p>
          <div class="border-t border-slate-800 pt-2 mt-1">
            <p class="text-xs text-slate-300 leading-relaxed">
              <span class="text-amber-400 font-bold">Bản dịch:</span> ${window.FAMILY_SPEECH_DATA.fullParagraph.vietnamese}
            </p>
          </div>
        </div>

        <!-- BẢNG ĐỐI CHIẾU 6 YÊU CẦU CÔ GIAO -->
        <div class="space-y-2 pt-2 border-t border-slate-800/80">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
              <span>📋</span> Đối chiếu 6 nội dung cô giao với câu tiếng Trung chuẩn Bài 1-4:
            </h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span class="text-amber-400 font-bold block text-[11px]">1. Số người & Thành viên ("Nhà 3 người: bố, mẹ, em"):</span>
              <p class="text-white font-bold mt-0.5">我家有三口人：爸爸、妈妈和我。</p>
              <span class="text-[10px] text-slate-400 block mt-0.5">Wǒ jiā yǒu sān kǒu rén: bàba, māma hé wǒ. (100% từ Bài 1-4)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span class="text-amber-400 font-bold block text-[11px]">2. Tuổi các thành viên ("Bố 60 tuổi, Mẹ 55 tuổi"):</span>
              <p class="text-white font-bold mt-0.5">我爸爸今年六十岁，我妈妈今年五十五岁。</p>
              <span class="text-[10px] text-slate-400 block mt-0.5">Wǒ bàba jīnnián liùshí suì, wǒ māma jīnnián wǔshíwǔ suì. (100% từ Bài 4)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span class="text-amber-400 font-bold block text-[11px]">3. Bố mẹ làm nghề gì? ("Bố mẹ về hưu rồi"):</span>
              <p class="text-white font-bold mt-0.5">我爸爸妈妈都不工作。</p>
              <span class="text-[10px] text-slate-400 block mt-0.5">Chuẩn Bài 1-4: 都不工作 (đều không đi làm). Mở rộng thực tế: 退休了 (tuìxiū le - về hưu).</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span class="text-amber-400 font-bold block text-[11px]">4. Công việc bố mẹ có bận không? ("Không bận"):</span>
              <p class="text-white font-bold mt-0.5">他们的工作不忙。</p>
              <span class="text-[10px] text-slate-400 block mt-0.5">Tāmen de gōngzuò bù máng. (100% từ Bài 1-4)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span class="text-amber-400 font-bold block text-[11px]">5. Công việc anh/chị/em (Không có anh chị em, bản thân là học sinh):</span>
              <p class="text-white font-bold mt-0.5">我没有哥哥、姐姐，也没有妹妹。我是学生，我不工作。</p>
              <span class="text-[10px] text-slate-400 block mt-0.5">没有 (không có) + 哥哥/姐姐/妹妹 + 学生 (học sinh) + 不工作 (100% Bài 1-4)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span class="text-amber-400 font-bold block text-[11px]">6. Tình cảm ("Tôi rất yêu gia đình tôi"):</span>
              <p class="text-white font-bold mt-0.5">我很爱我的家，也很爱我的爸爸妈妈。</p>
              <span class="text-[10px] text-slate-400 block mt-0.5">Wǒ hěn ài wǒ de jiā, yě hěn ài wǒ de bàba māma.</span>
            </div>
          </div>
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

  if (window.ChineseFontManager) {
    window.ChineseFontManager.updateToggleButtons();
  }
}

/**
 * Lấy avatar tương ứng cho từng nhân vật
 */
function getSpeakerAvatar(speaker) {
  const map = {
    '我': '🧑‍🎓',
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
  const isRolePlayTurn = (window.DialogueState.rolePlayMode && window.DialogueState.rolePlayActive && window.DialogueState.rolePlayTurnIndex === index);
  const isPassed = Boolean(window.DialogueState.rolePlayPassedLines && window.DialogueState.rolePlayPassedLines[index]);
  const evalData = (window.DialogueState.rolePlayEvaluations && window.DialogueState.rolePlayEvaluations[index]);

  return `
    <div id="dlg-line-${index}" class="flex items-start gap-3 transition-all duration-300 ${
      isLeft ? 'flex-row' : 'flex-row-reverse'
    }">
      <!-- Avatar nhân vật -->
      <div class="flex flex-col items-center flex-shrink-0">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md border ${
          isRolePlayTurn
            ? (isUserRole ? 'bg-rose-950 border-rose-400 ring-4 ring-rose-500/50 scale-110' : 'bg-blue-950 border-cyan-400 ring-4 ring-cyan-500/50 scale-110')
            : isUserRole 
              ? 'bg-rose-950 border-rose-500 ring-2 ring-rose-400' 
              : isLeft 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'bg-indigo-950/90 border-indigo-700'
        } transition-all">
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
      <div class="max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 transition-all duration-300 ${
        isRolePlayTurn
          ? (isUserRole 
              ? 'bg-rose-950/70 border-2 border-rose-500 ring-4 ring-rose-500/30 shadow-2xl shadow-rose-950/80 scale-[1.02]' 
              : 'bg-gradient-to-r from-blue-950/90 to-indigo-950/90 border-2 border-cyan-400 ring-4 ring-cyan-500/30 shadow-2xl scale-[1.02]')
          : isPlaying
            ? 'bg-gradient-to-r from-blue-900/90 to-indigo-900/90 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.01]'
            : isUserRole
              ? 'bg-rose-950/40 border border-rose-700/60 shadow-lg'
              : isLeft
                ? 'bg-slate-900/90 border border-slate-800 shadow-md'
                : 'bg-[#10172d]/90 border border-indigo-900/80 shadow-md'
      }">
        <!-- Header của bong bóng thoại: Tên nhân vật & nút thao tác -->
        <div class="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1.5 mb-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-xs font-black text-amber-400">${line.speaker}</span>
            ${isUserRole ? `
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white">VAI CỦA BẠN</span>
            ` : ''}
            ${isRolePlayTurn ? (
              isUserRole 
                ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-500 text-white animate-pulse">ĐẾN LƯỢT BẠN</span>'
                : '<span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-400 text-slate-950 animate-pulse">🤖 MÁY ĐANG TRẢ LỜI...</span>'
            ) : isPlaying ? `
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-500 text-slate-950 animate-pulse">ĐANG PHÁT</span>
            ` : ''}
            ${isPassed ? `
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✓ Đã nói xong</span>
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
        <p class="text-xl sm:text-2xl font-bold tracking-wide text-white leading-relaxed chinese-font dialogue-line-hanzi">
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

        <!-- KHU VỰC TƯƠNG TÁC ĐÓNG VAI: MICRO & CHẤM ĐIỂM CHI TIẾT TẠI Ô THOẠI -->
        ${isUserRole && (isRolePlayTurn || evalData) ? `
          <div id="roleplay-status-box-${index}" class="mt-3 p-3.5 rounded-2xl bg-slate-950/95 border ${
            evalData 
              ? (evalData.isPass ? 'border-emerald-500/70 shadow-emerald-950/40' : 'border-rose-500/70 shadow-rose-950/40') 
              : 'border-rose-500/80 shadow-rose-900/50 ring-2 ring-rose-500/30'
          } shadow-xl space-y-2.5 animate-fadeIn">
            
            ${evalData ? `
              <!-- MÀN HÌNH ĐÁNH GIÁ ĐIỂM SỐ & NHẬN XÉT CHI TIẾT (GIỐNG PHẦN TỪ VỰNG) -->
              <div class="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2 flex-wrap">
                <div class="flex items-center gap-2.5">
                  <span class="text-2xl font-black ${evalData.isPass ? 'text-emerald-400' : 'text-rose-400'}">${evalData.accuracy}%</span>
                  <div>
                    <p class="text-xs font-bold ${evalData.isPass ? 'text-emerald-300' : 'text-rose-300'}">${evalData.feedback}</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">Bạn đã nói: "<span class="text-slate-200 font-medium">${evalData.userSpoken}</span>"</p>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 flex-shrink-0">
                  ${!evalData.isPass ? `
                    <button onclick="retryRolePlayLine(${index})" class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/30 transition-all flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
                      Đọc lại câu này
                    </button>
                  ` : `
                    <span class="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <svg class="w-4 h-4 text-emerald-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      Đang chuyển cho Bạn diễn...
                    </span>
                  `}
                  <button onclick="skipRolePlayUserTurn(${index})" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all">
                    Máy đọc hộ ⏭️
                  </button>
                </div>
              </div>

              <!-- Dãy thẻ chữ Hán Đúng / Sai có thể bấm vào để xem hướng dẫn sửa -->
              <div class="space-y-2 pt-0.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                  ${(evalData.charResults || []).map((c) => {
                    const isSelected = window.DialogueState.selectedCharGuide && 
                      window.DialogueState.selectedCharGuide.lineIndex === index && 
                      window.DialogueState.selectedCharGuide.char === c.char;
                    return `
                      <button type="button" onclick="toggleDialogueCharGuide(${index}, '${c.char}')" class="px-2.5 py-1 rounded-xl text-xs font-black chinese-font transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-cyan-400 bg-cyan-950 text-cyan-200 border border-cyan-400 scale-105' 
                          : (c.isCorrect 
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900' 
                              : 'bg-rose-950/90 text-rose-300 border border-rose-500/70 hover:bg-rose-900 animate-pulse')
                      }" title="Bấm để xem phân tích chi tiết lỗi sai và khẩu hình chữ này">
                        <span>${c.char}</span>
                        <span class="text-[10px] font-mono opacity-80">${c.pinyin || ''}</span>
                        <span>${c.isCorrect ? '✓' : '✗'}</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                <!-- KHU VỰC CHẨN ĐOÁN LỖI SAI & HƯỚNG DẪN KHẮC PHỤC CHI TIẾT -->
                ${(() => {
                  const charResults = evalData.charResults || [];
                  const wrongChars = charResults.filter(c => !c.isCorrect);
                  const selectedChar = (window.DialogueState.selectedCharGuide && window.DialogueState.selectedCharGuide.lineIndex === index) 
                    ? charResults.find(c => c.char === window.DialogueState.selectedCharGuide.char) 
                    : null;

                  const showAll = !!(window.DialogueState.showAllPhonetics && window.DialogueState.showAllPhonetics[index]);
                  const charsToShow = selectedChar ? [selectedChar] : (showAll ? charResults : wrongChars);

                  if (charsToShow.length === 0) {
                    return `
                      <div class="pt-1 flex items-center gap-2">
                        <button type="button" onclick="toggleAllPhoneticsForLine(${index})" class="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors underline">
                          <span>🩺</span> Bấm xem chi tiết khẩu hình & vị trí đặt lưỡi từng chữ câu này
                        </button>
                      </div>
                    `;
                  }

                  return `
                    <div class="mt-2 p-3.5 rounded-2xl bg-slate-900/95 border ${wrongChars.length > 0 ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-700/80'} space-y-2.5 text-xs animate-fadeIn">
                      <div class="flex items-center justify-between pb-1.5 border-b border-slate-800">
                        <h5 class="font-extrabold ${wrongChars.length > 0 ? 'text-rose-400' : 'text-amber-300'} flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                          <span>🩺</span> ${wrongChars.length > 0 ? 'Chỉ Dẫn Sửa Lỗi Phát Âm Chi Tiết' : 'Hướng Dẫn Khẩu Hình & Cách Đặt Lưỡi Chuẩn'}
                        </h5>
                        <div class="flex items-center gap-2">
                          <button type="button" onclick="toggleAllPhoneticsForLine(${index})" class="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline">
                            ${showAll ? 'Chỉ hiện từ sai' : 'Xem tất cả chữ'}
                          </button>
                        </div>
                      </div>

                      <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        ${charsToShow.map(c => {
                          const guide = getFullPhoneticGuide(c.char, c.pinyin);
                          const isOk = c.isCorrect;
                          return `
                            <div class="p-3 rounded-xl bg-slate-950 border ${isOk ? 'border-emerald-500/30' : 'border-rose-500/50'} space-y-2 shadow-sm">
                              <!-- Header chữ -->
                              <div class="flex items-center justify-between flex-wrap gap-2">
                                <div class="flex items-center gap-2">
                                  <button type="button" onclick="speakChinese('${c.char}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-white font-black chinese-font text-lg flex items-center gap-1.5 border border-slate-700 transition-all shadow-sm" title="Bấm để nghe âm chuẩn">
                                    ${c.char}
                                    <svg class="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                                  </button>
                                  <span class="text-sm font-mono font-bold text-cyan-400">[${c.pinyin || guide.pinyin}]</span>
                                  <span class="text-[10px] px-2 py-0.5 rounded font-bold ${isOk ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' : 'bg-rose-900/60 text-rose-300 border border-rose-500/50'}">
                                    ${c.statusLabel || (isOk ? 'Đúng chuẩn ✓' : 'Chưa chuẩn ✗')}
                                  </span>
                                </div>

                                ${c.spokenChar && c.spokenChar !== '—' && !isOk ? `
                                  <span class="text-[11px] text-slate-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                                    Bạn đọc thành: <b class="text-rose-300 font-bold chinese-font">${c.spokenChar}</b> <span class="text-slate-400 font-mono">[${c.spokenPinyin || ''}]</span>
                                  </span>
                                ` : ''}
                              </div>

                              <!-- Mục 1: Sai ở đâu -->
                              ${!isOk ? `
                                <div class="p-2.5 rounded-lg bg-rose-950/25 border border-rose-900/40 space-y-1">
                                  <div class="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                                    <span>⚠️</span> Bạn sai ở đâu:
                                  </div>
                                  <div class="text-xs text-rose-200 leading-relaxed">
                                    ${c.feedback || guide.commonMistake}
                                  </div>
                                </div>
                              ` : ''}

                              <!-- Mục 2: Cách sửa khẩu hình & vị trí đặt lưỡi -->
                              <div class="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                                <div class="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                  <span>💡</span> Cách sửa khẩu hình & vị trí đặt lưỡi chuẩn:
                                </div>
                                <div class="text-xs text-amber-100/90 leading-relaxed space-y-1">
                                  ${c.tongueGuide || guide.tongueGuideHtml}
                                </div>
                              </div>
                            </div>
                          `;
                        }).join('')}
                      </div>
                    </div>
                  `;
                })()}
              </div>
            ` : `
              <!-- MÀN HÌNH ĐANG LẮNG NGHE BẠN NÓI -->
              <div class="flex items-center justify-between gap-3 flex-wrap">
                <div class="flex items-center gap-3">
                  <!-- Mic đỏ nhấp nháy -->
                  <div class="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse shadow-lg shadow-rose-600/60 ring-2 ring-rose-400/50 flex-shrink-0">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
                  </div>
                  <div>
                    <p class="text-xs font-black text-rose-300 flex items-center gap-1.5">
                      <span>🎙️ Mic đang nghe... Hãy đọc to trọn vẹn cả câu!</span>
                    </p>
                    <p id="roleplay-live-text-${index}" class="text-[11px] text-cyan-300 font-bold mt-0.5">
                      ${window.DialogueState.rolePlaySpokenText ? 'Đang nhận diện: "' + window.DialogueState.rolePlaySpokenText + '"' : 'Nói to rõ cả câu vào micro...'}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button onclick="manualGradeRolePlay(${index})" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1 animate-bounce">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    Chấm điểm
                  </button>
                  <button onclick="skipRolePlayUserTurn(${index})" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all">
                    Máy đọc hộ ⏭️
                  </button>
                </div>
              </div>
            `}

          </div>
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
  if (!window.DialogueState.rolePlayMode) {
    stopInteractiveRolePlay();
  } else {
    const data = getCurrentDialogueData();
    if (data && data.dialogue.lines.length && !window.DialogueState.selectedRole) {
      window.DialogueState.selectedRole = data.dialogue.lines[0].speaker;
    }
  }
  renderDialogueView();
}

/**
 * Chọn nhân vật đóng vai & Bắt đầu đối thoại ngay
 */
function selectRolePlayRole(role) {
  window.DialogueState.selectedRole = role;
  startInteractiveRolePlay(0);
}

let rolePlaySilenceTimer = null;

/**
 * Chuẩn hóa chuỗi tiếng Trung để so sánh
 */
function cleanChineseText(str) {
  if (!str) return "";
  return str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").toLowerCase();
}

/**
 * Lấy hướng dẫn khẩu hình & âm vị học đầy đủ cho một chữ Hán
 */
function getFullPhoneticGuide(char, pinyinStr) {
  let pinyin = pinyinStr || '';
  if (!pinyin && window.hanziToPinyinList) {
    const list = window.hanziToPinyinList(char);
    if (list && list[0]) pinyin = list[0].pinyin;
  }
  if (!pinyin && window.PINYIN_MAP) {
    pinyin = window.PINYIN_MAP[char] || '';
  }

  let parsed = null;
  if (typeof window.parsePinyinSyllable === 'function') {
    parsed = window.parsePinyinSyllable(pinyin);
  }

  const initial = parsed ? parsed.initial : '';
  const finalPart = parsed ? parsed.finalPart : '';
  const tone = parsed ? parsed.tone : 0;

  const initInfo = (initial && window.CHINESE_PHONETICS_DB && window.CHINESE_PHONETICS_DB.initials) 
    ? window.CHINESE_PHONETICS_DB.initials[initial] 
    : null;

  const finalInfo = (finalPart && window.CHINESE_FINALS_DB) 
    ? window.CHINESE_FINALS_DB[finalPart] 
    : null;

  const toneInfo = (tone && window.CHINESE_PHONETICS_DB && window.CHINESE_PHONETICS_DB.tones) 
    ? window.CHINESE_PHONETICS_DB.tones[tone] 
    : null;

  let guideParts = [];
  if (initInfo) {
    guideParts.push(`<div><b>Thanh mẫu [${initInfo.name}]:</b> ${initInfo.tongue} <br><span class="text-amber-300 font-bold">💡 Mẹo chuẩn: ${initInfo.fixTip}</span></div>`);
  }
  if (finalInfo) {
    guideParts.push(`<div><b>Vận mẫu [${finalInfo.name}]:</b> ${finalInfo.tongue} <br><span class="text-cyan-300 font-bold">💡 Mẹo vần: ${finalInfo.fixTip}</span></div>`);
  }
  if (toneInfo) {
    guideParts.push(`<div><b>Thanh điệu [${toneInfo.name}]:</b> ${toneInfo.desc}</div>`);
  }

  const tongueGuideHtml = guideParts.length > 0 
    ? guideParts.join("<div class='my-1 border-t border-slate-800/80'></div>") 
    : "Mở khoang miệng tự nhiên, luồng hơi giữ đều đặn và phát âm theo đúng thanh điệu.";

  const commonMistake = initInfo && initInfo.vnMistake 
    ? initInfo.vnMistake 
    : "Phát âm chưa chuẩn xác hoặc âm lượng quá nhỏ. Hãy nghe lại âm mẫu để sửa khẩu hình.";

  return {
    pinyin: pinyin,
    initial: initial,
    finalPart: finalPart,
    tone: tone,
    tongueGuideHtml: tongueGuideHtml,
    commonMistake: commonMistake
  };
}

function toggleDialogueCharGuide(lineIndex, char) {
  if (window.DialogueState.selectedCharGuide && 
      window.DialogueState.selectedCharGuide.lineIndex === lineIndex && 
      window.DialogueState.selectedCharGuide.char === char) {
    window.DialogueState.selectedCharGuide = null;
  } else {
    window.DialogueState.selectedCharGuide = { lineIndex, char };
  }
  renderDialogueView();
}

function toggleAllPhoneticsForLine(lineIndex) {
  if (!window.DialogueState.showAllPhonetics) window.DialogueState.showAllPhonetics = {};
  window.DialogueState.showAllPhonetics[lineIndex] = !window.DialogueState.showAllPhonetics[lineIndex];
  renderDialogueView();
}

window.getFullPhoneticGuide = getFullPhoneticGuide;
window.toggleDialogueCharGuide = toggleDialogueCharGuide;
window.toggleAllPhoneticsForLine = toggleAllPhoneticsForLine;

/**
 * Đánh giá chấm điểm câu thoại đóng vai (Sử dụng module chẩn đoán âm vị học)
 */
function gradeRolePlaySentence(targetHanzi, spokenText, targetPinyin = "") {
  if (typeof window.evaluateSpeech === 'function') {
    try {
      const res = window.evaluateSpeech(targetHanzi, spokenText, targetPinyin);
      if (res && typeof res.accuracy === 'number') {
        return res;
      }
    } catch (e) {
      console.warn("Lỗi evaluateSpeech roleplay:", e);
    }
  }

  // Fallback nếu chưa nạp module
  const cleanTargetPure = (targetHanzi || "").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
  const cleanSpoken = (spokenText || "").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").toLowerCase();

  const targetChars = Array.from(cleanTargetPure);
  if (!cleanSpoken || targetChars.length === 0) {
    return {
      accuracy: 0,
      isPerfect: false,
      userSpoken: spokenText || "(Chưa có âm thanh)",
      charResults: targetChars.map(c => ({ char: c, isCorrect: false }))
    };
  }

  let matched = 0;
  const charResults = targetChars.map(c => {
    const isCorrect = cleanSpoken.includes(c.toLowerCase());
    if (isCorrect) matched++;
    return { char: c, isCorrect: isCorrect };
  });

  const accuracy = Math.round((matched / targetChars.length) * 100);
  return {
    accuracy: accuracy,
    isPerfect: accuracy >= 80,
    userSpoken: spokenText,
    charResults: charResults
  };
}

/**
 * Kết thúc nói và chấm điểm câu thoại của Người dùng
 * - Phải đọc trọn vẹn cả câu (đủ độ dài)
 * - Đạt điểm >= 70% mới cho đi tiếp
 * - Nếu chưa đạt: Dừng lại và yêu cầu nói lại
 */
function finishAndGradeRolePlaySentence(line, index, spokenText) {
  stopRolePlayRecognition();

  const evalResult = gradeRolePlaySentence(line.hanzi, spokenText, line.pinyin);
  const cleanTargetPure = (line.hanzi || "").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
  const cleanSpoken = (spokenText || "").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");

  // ĐIỀU KIỆN TIÊN QUYẾT: Phải đọc cả câu (độ dài >= 60% tổng số chữ câu thoại) VÀ điểm số >= 70%
  const isFullLength = cleanSpoken.length >= Math.max(1, Math.round(cleanTargetPure.length * 0.6));
  const isPass = (evalResult.accuracy >= 70) && isFullLength;

  let feedback = "";
  if (isPass) {
    feedback = "🎉 Xuất sắc! Bạn phát âm trọn vẹn và rất chuẩn xác!";
  } else if (!isFullLength) {
    feedback = `⚠️ Bạn mới đọc ${cleanSpoken.length}/${cleanTargetPure.length} chữ. Hãy đọc trọn vẹn cả câu!`;
  } else {
    feedback = `⚠️ Chưa đạt (cần ≥ 70%). Hãy xem phân tích lỗi sai và luyện lại các chữ màu đỏ!`;
  }

  window.DialogueState.rolePlayEvaluations[index] = {
    accuracy: evalResult.accuracy,
    isPass: isPass,
    userSpoken: spokenText || "(Chưa nghe rõ)",
    charResults: evalResult.charResults || [],
    feedback: feedback,
    targetHanzi: line.hanzi,
    targetPinyin: line.pinyin
  };

  if (isPass) {
    // ĐẠT CHUẨN: Đánh dấu câu xong và cho Máy đối thoại tiếp!
    window.DialogueState.rolePlayPassedLines[index] = true;
    if (typeof playSoundEffect === 'function') {
      playSoundEffect('correct');
    }
    renderDialogueView();

    // Máy tự động đáp lại câu tiếp theo sau 1.3 giây
    setTimeout(() => {
      if (window.DialogueState.rolePlayActive) {
        executeRolePlayTurn(index + 1);
      }
    }, 1300);
  } else {
    // CHƯA ĐẠT: DỪNG LẠI TẠI CÂU NÀY, YÊU CẦU NÓI LẠI!
    if (typeof playSoundEffect === 'function') {
      playSoundEffect('wrong');
    }
    renderDialogueView();
  }
}

/**
 * Người dùng bấm nút Chấm điểm thủ công
 */
function manualGradeRolePlay(index) {
  const data = getCurrentDialogueData();
  if (!data || !data.dialogue.lines[index]) return;
  const line = data.dialogue.lines[index];
  const spoken = window.DialogueState.rolePlaySpokenText || "";
  finishAndGradeRolePlaySentence(line, index, spoken);
}

/**
 * Đọc lại câu thoại khi chưa đạt điểm
 */
function retryRolePlayLine(index) {
  if (window.DialogueState.rolePlayEvaluations) {
    delete window.DialogueState.rolePlayEvaluations[index];
  }
  window.DialogueState.rolePlaySpokenText = "";
  renderDialogueView();

  const data = getCurrentDialogueData();
  if (data && data.dialogue.lines[index]) {
    startRolePlayRecognition(data.dialogue.lines[index], index);
  }
}

/**
 * Bắt đầu luồng đóng vai tương tác 2 chiều (Turn-by-turn Interactive Role-Play)
 */
function startInteractiveRolePlay(startIdx = 0) {
  stopDialogueAudio();
  stopRolePlayRecognition();

  const data = getCurrentDialogueData();
  if (!data || !data.dialogue.lines.length) return;

  if (!window.DialogueState.selectedRole) {
    window.DialogueState.selectedRole = data.dialogue.lines[0].speaker;
  }

  window.DialogueState.rolePlayActive = true;
  window.DialogueState.rolePlayTurnIndex = startIdx;
  window.DialogueState.rolePlayPassedLines = {};
  window.DialogueState.rolePlayEvaluations = {};
  window.DialogueState.rolePlaySpokenText = "";

  renderDialogueView();
  executeRolePlayTurn(startIdx);
}

/**
 * Dừng chế độ đóng vai tương tác
 */
function stopInteractiveRolePlay() {
  window.DialogueState.rolePlayActive = false;
  window.DialogueState.rolePlayTurnIndex = -1;
  window.DialogueState.rolePlayListening = false;
  stopRolePlayRecognition();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  renderDialogueView();
}

/**
 * Bật/Tắt đóng vai tương tác qua nút bấm
 */
function toggleInteractiveRolePlay() {
  if (window.DialogueState.rolePlayActive) {
    stopInteractiveRolePlay();
  } else {
    startInteractiveRolePlay(0);
  }
}

/**
 * Thực thi từng lượt đối thoại (Lượt của Máy hoặc Lượt của Bạn)
 */
function executeRolePlayTurn(index) {
  if (!window.DialogueState.rolePlayActive) return;

  const data = getCurrentDialogueData();
  if (!data || index >= data.dialogue.lines.length) {
    // Hoàn thành xuất sắc toàn bộ đoạn hội thoại
    window.DialogueState.rolePlayActive = false;
    window.DialogueState.rolePlayTurnIndex = -1;
    stopRolePlayRecognition();
    renderDialogueView();

    if (typeof playSoundEffect === 'function') {
      playSoundEffect('match');
    }
    if (typeof showToast === 'function') {
      showToast("🎉 Xuất sắc! Bạn đã hoàn thành trọn vẹn đoạn hội thoại!");
    }
    return;
  }

  window.DialogueState.rolePlayTurnIndex = index;
  window.DialogueState.rolePlaySpokenText = "";
  const line = data.dialogue.lines[index];
  const isUserTurn = (line.speaker === window.DialogueState.selectedRole);

  renderDialogueView();

  // Tự động cuộn êm đến câu đang đối thoại
  setTimeout(() => {
    const el = document.getElementById(`dlg-line-${index}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);

  if (!isUserTurn) {
    // ==========================================
    // 1. LƯỢT CỦA MÁY (AI ĐỐI THOẠI ĐỌC CÂU CỦA NÓ)
    // ==========================================
    stopRolePlayRecognition();

    setTimeout(() => {
      if (!window.DialogueState.rolePlayActive || window.DialogueState.rolePlayTurnIndex !== index) return;
      speakChineseText(line.hanzi, () => {
        if (!window.DialogueState.rolePlayActive) return;
        // Máy đọc xong câu của nó -> Tự động nhường lượt tiếp theo cho Bạn
        setTimeout(() => {
          if (window.DialogueState.rolePlayActive) {
            executeRolePlayTurn(index + 1);
          }
        }, 500);
      });
    }, 400);

  } else {
    // ==========================================
    // 2. LƯỢT CỦA BẠN (MICROPHONE TỰ ĐỘNG LẮNG NGHE TẠI Ô THOẠI ĐÓ)
    // ==========================================
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    startRolePlayRecognition(line, index);
  }
}

/**
 * Kích hoạt nhận diện giọng nói khi đến lượt người dùng đọc
 */
function startRolePlayRecognition(line, index) {
  stopRolePlayRecognition();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (typeof showToast === 'function') {
      showToast("⚠️ Trình duyệt chưa hỗ trợ Web Speech API. Bấm 'Máy đọc hộ' để tiếp tục.");
    }
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    window.DialogueState.rolePlayRecognition = recognition;
    window.DialogueState.rolePlayListening = true;

    let currentAccumulatedSpeech = "";

    recognition.onresult = (event) => {
      let interim = "";
      let finalStr = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const rawCombined = (currentAccumulatedSpeech + " " + finalStr + " " + interim).trim();
      if (finalStr) currentAccumulatedSpeech += " " + finalStr;
      if (!rawCombined) return;

      window.DialogueState.rolePlaySpokenText = rawCombined;
      const liveTextEl = document.getElementById(`roleplay-live-text-${index}`);
      if (liveTextEl) {
        liveTextEl.textContent = `Bạn đang nói: "${rawCombined}"`;
      }

      // Tự động dừng và chấm điểm cả câu sau 850ms im lặng
      clearTimeout(rolePlaySilenceTimer);
      rolePlaySilenceTimer = setTimeout(() => {
        if (window.DialogueState.rolePlayActive && 
            window.DialogueState.rolePlayTurnIndex === index && 
            !window.DialogueState.rolePlayEvaluations[index]) {
          finishAndGradeRolePlaySentence(line, index, rawCombined);
        }
      }, 850);
    };

    recognition.onspeechend = () => {
      clearTimeout(rolePlaySilenceTimer);
      rolePlaySilenceTimer = setTimeout(() => {
        if (window.DialogueState.rolePlayActive && 
            window.DialogueState.rolePlayTurnIndex === index && 
            window.DialogueState.rolePlaySpokenText &&
            !window.DialogueState.rolePlayEvaluations[index]) {
          finishAndGradeRolePlaySentence(line, index, window.DialogueState.rolePlaySpokenText);
        }
      }, 400);
    };

    recognition.onerror = (err) => {
      console.warn("Lỗi nhận dạng giọng nói đóng vai:", err);
    };

    recognition.onend = () => {
      // Nếu vẫn đang đến lượt bạn và chưa có kết quả đánh giá -> tự động lắng nghe tiếp
      if (window.DialogueState.rolePlayActive && 
          window.DialogueState.rolePlayTurnIndex === index && 
          !window.DialogueState.rolePlayEvaluations[index]) {
        try { recognition.start(); } catch(e) {}
      }
    };

    recognition.start();
  } catch (e) {
    console.warn("Không khởi động được SpeechRecognition đóng vai:", e);
  }
}

/**
 * Tắt nhận dạng giọng nói đóng vai
 */
function stopRolePlayRecognition() {
  window.DialogueState.rolePlayListening = false;
  clearTimeout(rolePlaySilenceTimer);
  if (window.DialogueState.rolePlayRecognition) {
    try {
      window.DialogueState.rolePlayRecognition.abort();
    } catch (e) {}
    window.DialogueState.rolePlayRecognition = null;
  }
}

/**
 * Người dùng bỏ qua lượt nói (Nhường máy đọc hộ)
 */
function skipRolePlayUserTurn(index) {
  stopRolePlayRecognition();
  const data = getCurrentDialogueData();
  if (!data || !data.dialogue.lines[index]) return;

  window.DialogueState.rolePlayPassedLines[index] = true;
  const line = data.dialogue.lines[index];

  // Máy đọc hộ câu này rồi chuyển tiếp lượt sau
  speakChineseText(line.hanzi, () => {
    setTimeout(() => {
      if (window.DialogueState.rolePlayActive) {
        executeRolePlayTurn(index + 1);
      }
    }, 450);
  });
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
 * Phát từng bước trong bài thoại (khi phát bình thường)
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

  // Nếu đang ở chế độ Role-Play: chuyển qua luồng đóng vai tương tác
  if (window.DialogueState.rolePlayMode) {
    stopDialogueAudio();
    startInteractiveRolePlay(index);
    return;
  }

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
window.startInteractiveRolePlay = startInteractiveRolePlay;
window.stopInteractiveRolePlay = stopInteractiveRolePlay;
window.toggleInteractiveRolePlay = toggleInteractiveRolePlay;
window.skipRolePlayUserTurn = skipRolePlayUserTurn;
window.retryRolePlayLine = retryRolePlayLine;
window.manualGradeRolePlay = manualGradeRolePlay;
window.playSingleLine = playSingleLine;
window.togglePlayFullDialogue = togglePlayFullDialogue;
window.stopDialogueAudio = stopDialogueAudio;
window.practiceLinePrompt = practiceLinePrompt;
