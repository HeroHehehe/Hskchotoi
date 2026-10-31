/**
 * MODULE BÀI TẬP NÓI CÔ GIAO (BÀI 4) - GIỚI THIỆU GIA ĐÌNH BẰNG TIẾNG TRUNG
 * Tự động đồng bộ và sử dụng 100% từ vựng từ Bài 1 đến Bài 4 HSK 1 (3.0)
 * Tính năng:
 *  - Toàn văn bài nói liền mạch chuẩn mực có Pinyin và Dịch nghĩa tiếng Việt
 *  - Đối chiếu chi tiết 6 yêu cầu cô giáo giao với câu tiếng Trung tương ứng
 *  - Phát âm toàn bộ bài nói giọng đọc Bắc Kinh bản xứ (TTS zh-CN)
 *  - Phát âm riêng từng câu & Chỉnh tốc độ (0.8x, 1.0x, 1.2x)
 *  - Luyện nói tương tác AI (Web Speech Recognition) có chấm điểm phát âm
 *  - Nút sao chép bài nói để nộp cho giáo viên
 */

window.FAMILY_SPEECH_DATA = {
  lessonId: 4,
  title: "Bài tập nói: Giới thiệu gia đình mình",
  title_zh: "家庭介绍口语作业",
  title_vi: "Bài tập thuyết trình: Giới thiệu gia đình bằng tiếng Trung (Bài 4)",
  description: "Chuẩn bị bài nói ngắn theo đúng 6 yêu cầu cô giáo giao, sử dụng 100% từ vựng đã học trong Bài 1 đến Bài 4.",
  
  // Toàn văn bài phát biểu
  fullParagraph: {
    hanzi: "老师好，大家好！我家有三口人：爸爸、妈妈和我。我爸爸今年六十岁，我妈妈今年五十五岁。我爸爸妈妈都不工作，他们的工作不忙。我没有哥哥、姐姐，也没有妹妹。我是学生，我不工作。我很爱我的家，也很爱我的爸爸妈妈。谢谢老师，谢谢大家！",
    pinyin: "Lǎoshī hǎo, dàjiā hǎo! Wǒ jiā yǒu sān kǒu rén: bàba, māma hé wǒ. Wǒ bàba jīnnián liùshí suì, wǒ māma jīnnián wǔshíwǔ suì. Wǒ bàba māma dōu bù gōngzuò, tāmen de gōngzuò bù máng. Wǒ méiyǒu gēge, jiějie, yě méiyǒu mèimei. Wǒ shì xuésheng, wǒ bù gōngzuò. Wǒ hěn ài wǒ de jiā, yě hěn ài wǒ de bàba māma. Xièxie lǎoshī, xièxie dàjiā!",
    vietnamese: "Em chào cô giáo, chào tất cả mọi người! Nhà em có ba người: bố, mẹ và em. Bố em năm nay sáu mươi tuổi, mẹ em năm nay năm mươi lăm tuổi. Bố mẹ em đều không đi làm (về hưu rồi), công việc của bố mẹ không bận. Em không có anh trai, chị gái, cũng không có em gái. Em là học sinh/sinh viên, em không đi làm. Em rất yêu gia đình của em, và cũng rất yêu bố mẹ của em. Em xin cảm ơn cô giáo, cảm ơn mọi người ạ!"
  },

  // Từng câu trong bài nói (kèm đối chiếu yêu cầu cô giao)
  sentences: [
    {
      id: 0,
      part: "Chào hỏi mở đầu",
      teacherPrompt: "Chào cô giáo và các bạn trước khi bắt đầu bài nói",
      hanzi: "老师好，大家好！",
      pinyin: "Lǎoshī hǎo, dàjiā hǎo!",
      vi: "Em chào cô giáo, chào tất cả mọi người!",
      vocabBreakdown: "老师 (cô giáo - Bài 1) + 好 (chào, tốt - Bài 1) + 大家 (mọi người - Bài 1)."
    },
    {
      id: 1,
      part: "Yêu cầu 1",
      teacherPrompt: "Gia đình có bao nhiêu người, gồm những ai? (\"Nhà em có 3 người gồm bố mẹ và em\")",
      hanzi: "我家有三口人：爸爸、妈妈和我。",
      pinyin: "Wǒ jiā yǒu sān kǒu rén: bàba, māma hé wǒ.",
      vi: "Nhà em có ba người: bố, mẹ và em.",
      vocabBreakdown: "我家 (nhà em) + 有 (có - Bài 4) + 三口人 (3 người, 'khẩu' là lượng từ đếm người trong gia đình - Bài 4) + 爸爸、妈妈和我 (bố, mẹ và em, 'hòa' là từ nối 'và' - Bài 4). Chuẩn ngữ pháp 100% Bài 4!"
    },
    {
      id: 2,
      part: "Yêu cầu 2 (Bố)",
      teacherPrompt: "Giới thiệu tuổi của bố (\"Bố em 60 tuổi\")",
      hanzi: "我爸爸今年六十岁。",
      pinyin: "Wǒ bàba jīnnián liùshí suì.",
      vi: "Bố em năm nay sáu mươi tuổi.",
      vocabBreakdown: "我爸爸 (bố em) + 今年 (năm nay - Bài 4) + 六十 (60 - Bài 4) + 岁 (tuổi - Bài 4)."
    },
    {
      id: 3,
      part: "Yêu cầu 2 (Mẹ)",
      teacherPrompt: "Giới thiệu tuổi của mẹ (\"Mẹ em 55 tuổi\")",
      hanzi: "我妈妈今年五十五岁。",
      pinyin: "Wǒ māma jīnnián wǔshíwǔ suì.",
      vi: "Mẹ em năm nay năm mươi lăm tuổi.",
      vocabBreakdown: "我妈妈 (mẹ em) + 今年 (năm nay - Bài 4) + 五十五 (55 - Bài 4) + 岁 (tuổi - Bài 4)."
    },
    {
      id: 4,
      part: "Yêu cầu 3",
      teacherPrompt: "Bố mẹ làm nghề gì? (\"Bố mẹ em về hưu rồi\")",
      hanzi: "我爸爸妈妈都不工作。",
      pinyin: "Wǒ bàba māma dōu bù gōngzuò.",
      vi: "Bố mẹ em đều không đi làm (về hưu rồi).",
      extraRealLifeZh: "我爸爸妈妈退休了。",
      extraRealLifePy: "Wǒ bàba māma tuìxiū le.",
      extraRealLifeVi: "Bố mẹ em về hưu rồi (tuìxiū = về hưu - từ mở rộng trong đời sống thực tế).",
      vocabBreakdown: "Trong từ vựng Bài 1-4, 'làm việc' là 工作 (Bài 3), 'không' là 不 (Bài 2), 'đều' là 都. Nói 'đều không đi làm' (都不工作) là cách diễn đạt 100% từ đã học. Khi nói trước lớp bạn có thể chêm thêm câu mở rộng '退休了' để cô giáo khen!"
    },
    {
      id: 5,
      part: "Yêu cầu 4",
      teacherPrompt: "Công việc của bố mẹ có bận không? (\"Công việc bố mẹ em không bận\")",
      hanzi: "他们的工作不忙。",
      pinyin: "Tāmen de gōngzuò bù máng.",
      vi: "Công việc của bố mẹ không bận.",
      vocabBreakdown: "他们 (họ / bố mẹ - Bài 4 他 + Bài 1 们) + 的 (của - Bài 3) + 工作 (công việc - Bài 3) + 不忙 (không bận - Bài 3, Bài 4)."
    },
    {
      id: 6,
      part: "Yêu cầu 5",
      teacherPrompt: "Công việc của anh/chị/em (Nhà có 3 người nên không có anh chị em, bản thân là học sinh)",
      hanzi: "我没有哥哥、姐姐，也没有妹妹。我是学生，我不工作。",
      pinyin: "Wǒ méiyǒu gēge, jiějie, yě méiyǒu mèimei. Wǒ shì xuésheng, wǒ bù gōngzuò.",
      vi: "Em không có anh trai, chị gái, cũng không có em gái. Em là học sinh, em không đi làm.",
      vocabBreakdown: "没有 (không có - Bài 4) + 哥哥 (anh trai - Bài 4), 姐姐 (chị gái - Bài 3), 妹妹 (em gái - Bài 4) + 学生 (học sinh - Bài 1, Bài 4) + 不工作 (không đi làm - Bài 3)."
    },
    {
      id: 7,
      part: "Yêu cầu 6",
      teacherPrompt: "Bày tỏ tình cảm: \"Tôi rất yêu gia đình tôi\"",
      hanzi: "我很爱我的家，也很爱我的爸爸妈妈。",
      pinyin: "Wǒ hěn ài wǒ de jiā, yě hěn ài wǒ de bàba māma.",
      vi: "Em rất yêu gia đình của em, và cũng rất yêu bố mẹ của em.",
      vocabBreakdown: "我 (tôi/em) + 很 (rất - Bài 2) + 爱 (yêu) + 我的家 (gia đình của em - Bài 4 家) + 也 (cũng - Bài 2) + 爱我的爸爸妈妈. (Chữ 爱 ài: nét bút gồm bộ Trảo 爫 móng tay, bộ Mịch 冖 trùm khăn, bộ Hựu 友 bạn bè)."
    },
    {
      id: 8,
      part: "Kết thúc lịch sự",
      teacherPrompt: "Cảm ơn cô giáo và các bạn đã lắng nghe bài nói",
      hanzi: "谢谢老师，谢谢大家！",
      pinyin: "Xièxie lǎoshī, xièxie dàjiā!",
      vi: "Em xin cảm ơn cô giáo, cảm ơn mọi người ạ!",
      vocabBreakdown: "谢谢 (cảm ơn - Bài 1) + 老师 (cô giáo - Bài 1) + 大家 (mọi người - Bài 1)."
    }
  ]
};

// Trạng thái phát âm & Luyện nói
window.FamilySpeechState = {
  isPlayingFull: false,
  currentSentenceIdx: -1,
  activeUtterance: null,
  speechSpeed: 1.0,
  isRecording: false,
  recordingIndex: -1,
  recognition: null,
  speechScores: {}
};

/**
 * Mở Modal Studio Luyện Thuyết Trình Bài 4
 */
function openFamilySpeechModal() {
  const modal = document.getElementById('family-speech-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderFamilySpeechModalContent();
}

/**
 * Đóng Modal
 */
function closeFamilySpeechModal() {
  stopFamilySpeech();
  stopFamilySpeechRecognition();
  const modal = document.getElementById('family-speech-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Render nội dung Modal
 */
function renderFamilySpeechModalContent() {
  const container = document.getElementById('family-speech-modal-content');
  if (!container) return;

  const data = window.FAMILY_SPEECH_DATA;
  const state = window.FamilySpeechState;

  container.innerHTML = `
    <!-- 1. HEADER MODAL -->
    <div class="p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/40 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 flex-shrink-0">
          🎤
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">Bài tập cô giao</span>
            <span class="text-xs text-amber-300 font-bold">HSK 1 • Bài 4 (我有两个孩子)</span>
          </div>
          <h2 class="text-lg font-black text-white mt-0.5">${data.title}</h2>
          <p class="text-xs text-slate-400 mt-0.5">${data.description}</p>
        </div>
      </div>
      <button onclick="closeFamilySpeechModal()" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg transition-all" title="Đóng">
        ✕
      </button>
    </div>

    <!-- 2. PHẦN ĐIỀU KHIỂN & TOÀN VĂN BÀI NÓI (FULL SPEECH CARD) -->
    <div class="p-6 overflow-y-auto space-y-6 max-h-[calc(85vh-130px)] no-scrollbar">
      <!-- Khung bài nói hoàn chỉnh -->
      <div class="p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 shadow-xl shadow-amber-950/20 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">📜</span>
            <h3 class="text-sm font-black text-white">Toàn văn bài nói hoàn chỉnh (100% từ Bài 1 - 4)</h3>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Nút phát toàn bài -->
            <button id="btn-family-speech-play" onclick="togglePlayFullFamilySpeech()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all">
              <span id="family-speech-play-icon">${state.isPlayingFull ? '⏸️' : '▶️'}</span>
              <span id="family-speech-play-text">${state.isPlayingFull ? 'Tạm dừng' : 'Đọc toàn bộ bài'}</span>
            </button>

            <!-- Tốc độ đọc -->
            <div class="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
              <span class="text-[10px] text-slate-400 px-1 font-bold">Tốc độ:</span>
              ${[0.8, 1.0, 1.2].map(speed => `
                <button onclick="setFamilySpeechSpeed(${speed})" class="px-2 py-0.5 rounded-lg font-bold text-xs transition-all ${
                  state.speechSpeed === speed ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }">${speed}x</button>
              `).join('')}
            </div>

            <!-- Nút Copy -->
            <button onclick="copyFamilySpeechScript()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all" title="Sao chép toàn bộ văn bản để nộp cho cô">
              <span>📋</span>
              <span>Sao chép bài nộp</span>
            </button>
          </div>
        </div>

        <!-- Đoạn văn bài nói -->
        <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <p id="full-speech-hanzi" class="text-xl md:text-2xl text-white leading-relaxed tracking-wider font-kaiti chinese-font transition-colors">
            ${data.fullParagraph.hanzi}
          </p>
          <p class="text-xs md:text-sm font-semibold text-cyan-400/90 leading-relaxed">
            ${data.fullParagraph.pinyin}
          </p>
          <div class="border-t border-slate-800/80 pt-2 mt-2">
            <p class="text-xs text-slate-300 leading-relaxed font-medium">
              <span class="text-amber-400 font-bold">Dịch nghĩa:</span> ${data.fullParagraph.vietnamese}
            </p>
          </div>
        </div>
      </div>

      <!-- 3. BẢNG ĐỐI CHIẾU 6 YÊU CẦU CÔ GIAO & PHÒNG THU LUYỆN NÓI TỪNG CÂU -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-sm font-black text-amber-300">
              ✓
            </span>
            <div>
              <h3 class="text-sm font-black text-white">Luyện nói & Đối chiếu từng yêu cầu cô giao</h3>
              <p class="text-[11px] text-slate-400">Bấm mic 🎙️ để đọc từng câu, AI sẽ tự động chấm điểm ngữ điệu của bạn!</p>
            </div>
          </div>
          <span class="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            9 câu hoàn chỉnh
          </span>
        </div>

        <!-- Danh sách từng câu -->
        <div class="grid grid-cols-1 gap-3.5">
          ${data.sentences.map((sent, idx) => `
            <div id="family-sent-card-${idx}" class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5">
              <!-- Header thẻ câu -->
              <div class="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ${sent.part}
                  </span>
                  <span class="text-xs text-slate-300 font-medium">
                    ${sent.teacherPrompt}
                  </span>
                </div>

                <!-- Điểm số AI nếu đã luyện nói -->
                <div id="family-sent-score-${idx}" class="text-xs font-black">
                  ${state.speechScores[idx] ? `
                    <span class="px-2.5 py-0.5 rounded-full ${
                      state.speechScores[idx].score >= 80 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }">
                      ⭐ ${state.speechScores[idx].score}đ (${state.speechScores[idx].label})
                    </span>
                  ` : ''}
                </div>
              </div>

              <!-- Nội dung câu tiếng Trung & Pinyin & Dịch -->
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <p class="text-lg md:text-xl text-white font-kaiti chinese-font leading-snug">
                    ${sent.hanzi}
                  </p>
                  <p class="text-xs md:text-sm font-bold text-cyan-400">
                    ${sent.pinyin}
                  </p>
                  <p class="text-xs text-slate-300">
                    ${sent.vi}
                  </p>
                  ${sent.extraRealLifeZh ? `
                    <div class="p-2 mt-1.5 rounded-xl bg-indigo-950/50 border border-indigo-700/50 text-[11px] text-indigo-200">
                      <span class="font-bold text-indigo-300">💡 Mở rộng đời sống thực tế:</span> 
                      <b class="text-white">${sent.extraRealLifeZh}</b> (${sent.extraRealLifePy}) - ${sent.extraRealLifeVi}
                    </div>
                  ` : ''}
                </div>

                <!-- Nút Nghe mẫu & Nút Thu âm AI -->
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <button onclick="speakFamilySentence(${idx})" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700" title="Nghe mẫu câu này">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                  </button>

                  <button id="btn-record-sent-${idx}" onclick="toggleRecordFamilySentence(${idx})" class="w-8 h-8 rounded-xl bg-red-950/70 hover:bg-red-600 border border-red-700/80 hover:border-red-500 text-rose-300 hover:text-white flex items-center justify-center transition-all shadow-sm" title="Bật mic đọc câu này để AI chấm điểm">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
                  </button>
                </div>
              </div>

              <!-- Giải thích ngữ pháp & từ vựng Bài 1-4 -->
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span class="text-amber-400 font-bold">🔍 Từ vựng & Cấu trúc Bài 1-4:</span> ${sent.vocabBreakdown}
              </div>

              <!-- Hộp kết quả nhận dạng giọng nói khi đang đọc câu này -->
              <div id="family-sent-recognizing-${idx}" class="hidden p-2 rounded-xl bg-rose-950/40 border border-rose-500/60 text-xs text-rose-300 flex items-center gap-2 animate-pulse">
                <span>🎙️ Đang lắng nghe bạn nói... Hãy đọc câu trên bằng tiếng Trung!</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * Đọc toàn bộ bài phát biểu với ngắt nghỉ tự nhiên
 */
function togglePlayFullFamilySpeech() {
  const state = window.FamilySpeechState;
  const data = window.FAMILY_SPEECH_DATA;

  if (state.isPlayingFull) {
    stopFamilySpeech();
    return;
  }

  if (!('speechSynthesis' in window)) {
    if (typeof showToast === 'function') showToast('Trình duyệt không hỗ trợ phát âm!');
    return;
  }

  window.speechSynthesis.cancel();
  state.isPlayingFull = true;
  state.currentSentenceIdx = 0;
  updatePlayFullUI(true);

  function speakNext(idx) {
    if (!state.isPlayingFull || idx >= data.sentences.length) {
      state.isPlayingFull = false;
      state.currentSentenceIdx = -1;
      updatePlayFullUI(false);
      return;
    }

    state.currentSentenceIdx = idx;
    highlightSentenceCard(idx);

    const sent = data.sentences[idx];
    const utterance = new SpeechSynthesisUtterance(sent.hanzi);
    utterance.lang = 'zh-CN';
    utterance.rate = state.speechSpeed || 1.0;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));
    if (zhVoice) utterance.voice = zhVoice;

    state.activeUtterance = utterance;

    utterance.onend = () => {
      if (state.isPlayingFull) {
        setTimeout(() => {
          speakNext(idx + 1);
        }, 500); // nghỉ nửa giây giữa các câu
      }
    };

    utterance.onerror = () => {
      state.isPlayingFull = false;
      state.currentSentenceIdx = -1;
      updatePlayFullUI(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNext(0);
}

/**
 * Dừng phát âm bài nói
 */
function stopFamilySpeech() {
  const state = window.FamilySpeechState;
  state.isPlayingFull = false;
  state.currentSentenceIdx = -1;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  updatePlayFullUI(false);
  clearSentenceHighlights();
}

/**
 * Cập nhật giao diện nút phát toàn bài
 */
function updatePlayFullUI(isPlaying) {
  const icon = document.getElementById('family-speech-play-icon');
  const text = document.getElementById('family-speech-play-text');
  const btn = document.getElementById('btn-family-speech-play');
  if (icon) icon.textContent = isPlaying ? '⏸️' : '▶️';
  if (text) text.textContent = isPlaying ? 'Tạm dừng' : 'Đọc toàn bộ bài';
  if (btn) {
    if (isPlaying) {
      btn.className = "px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all animate-pulse";
    } else {
      btn.className = "px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all";
    }
  }
}

/**
 * Đổi tốc độ đọc
 */
function setFamilySpeechSpeed(speed) {
  window.FamilySpeechState.speechSpeed = speed;
  const isPlaying = window.FamilySpeechState.isPlayingFull;
  if (isPlaying) {
    stopFamilySpeech();
    togglePlayFullFamilySpeech();
  } else {
    renderFamilySpeechModalContent();
  }
}

/**
 * Phát âm một câu riêng lẻ
 */
function speakFamilySentence(idx) {
  stopFamilySpeech();
  const sent = window.FAMILY_SPEECH_DATA.sentences[idx];
  if (!sent) return;

  highlightSentenceCard(idx);

  const utterance = new SpeechSynthesisUtterance(sent.hanzi);
  utterance.lang = 'zh-CN';
  utterance.rate = window.FamilySpeechState.speechSpeed || 1.0;

  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));
  if (zhVoice) utterance.voice = zhVoice;

  utterance.onend = () => {
    setTimeout(clearSentenceHighlights, 600);
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Đánh dấu câu đang phát
 */
function highlightSentenceCard(idx) {
  clearSentenceHighlights();
  const card = document.getElementById(`family-sent-card-${idx}`);
  if (card) {
    card.classList.add('ring-2', 'ring-amber-400', 'bg-amber-950/30', 'scale-[1.01]');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function clearSentenceHighlights() {
  const cards = document.querySelectorAll('[id^="family-sent-card-"]');
  cards.forEach(c => c.classList.remove('ring-2', 'ring-amber-400', 'bg-amber-950/30', 'scale-[1.01]'));
}

/**
 * Luyện nói từng câu với Web Speech Recognition
 */
function toggleRecordFamilySentence(idx) {
  const state = window.FamilySpeechState;
  const sent = window.FAMILY_SPEECH_DATA.sentences[idx];
  if (!sent) return;

  if (state.isRecording && state.recordingIndex === idx) {
    stopFamilySpeechRecognition();
    return;
  }

  stopFamilySpeech();
  stopFamilySpeechRecognition();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (typeof showToast === 'function') {
      showToast('Trình duyệt chưa hỗ trợ ghi âm nhận dạng giọng nói zh-CN. Hãy thử trên Google Chrome!');
    }
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = true;

    state.recognition = recognition;
    state.isRecording = true;
    state.recordingIndex = idx;

    const recordBtn = document.getElementById(`btn-record-sent-${idx}`);
    const recognizedBox = document.getElementById(`family-sent-recognizing-${idx}`);
    if (recordBtn) recordBtn.className = "w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center transition-all shadow-lg shadow-red-600/40 animate-pulse";
    if (recognizedBox) recognizedBox.classList.remove('hidden');

    let transcript = "";

    recognition.onresult = (event) => {
      transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (recognizedBox) {
        recognizedBox.innerHTML = `<span>🎙️ Đang nghe: <b class="text-white">"${transcript}"</b></span>`;
      }
    };

    recognition.onend = () => {
      state.isRecording = false;
      state.recordingIndex = -1;
      if (recordBtn) recordBtn.className = "w-8 h-8 rounded-xl bg-red-950/70 hover:bg-red-600 border border-red-700/80 hover:border-red-500 text-rose-300 hover:text-white flex items-center justify-center transition-all shadow-sm";
      if (recognizedBox) recognizedBox.classList.add('hidden');

      evaluateSpokenSentence(idx, transcript, sent.hanzi);
    };

    recognition.onerror = (e) => {
      state.isRecording = false;
      state.recordingIndex = -1;
      if (recordBtn) recordBtn.className = "w-8 h-8 rounded-xl bg-red-950/70 hover:bg-red-600 border border-red-700/80 hover:border-red-500 text-rose-300 hover:text-white flex items-center justify-center transition-all shadow-sm";
      if (recognizedBox) recognizedBox.classList.add('hidden');
    };

    recognition.start();
  } catch (err) {
    console.error("SpeechRecognition error:", err);
  }
}

function stopFamilySpeechRecognition() {
  const state = window.FamilySpeechState;
  if (state.recognition) {
    try {
      state.recognition.stop();
    } catch (e) {}
    state.recognition = null;
  }
  state.isRecording = false;
  state.recordingIndex = -1;
}

/**
 * Chấm điểm câu học sinh vừa nói
 */
function evaluateSpokenSentence(idx, spoken, target) {
  if (!spoken || !spoken.trim()) return;

  const cleanSpoken = spoken.replace(/[，。！？\s]/g, '');
  const cleanTarget = target.replace(/[，。！？：\s]/g, '');

  let matches = 0;
  for (let ch of cleanTarget) {
    if (cleanSpoken.includes(ch)) matches++;
  }

  const ratio = Math.min(1.0, matches / Math.max(1, cleanTarget.length));
  let score = Math.round(ratio * 100);

  if (score < 40 && spoken.length > 0) score = 55; // khích lệ nếu có nói

  let label = "Cần luyện thêm";
  if (score >= 90) label = "Xuất sắc chuẩn Bắc Kinh";
  else if (score >= 75) label = "Rất tốt";
  else if (score >= 60) label = "Đạt yêu cầu";

  window.FamilySpeechState.speechScores[idx] = { score, label, spoken };

  const scoreEl = document.getElementById(`family-sent-score-${idx}`);
  if (scoreEl) {
    scoreEl.innerHTML = `
      <span class="px-2.5 py-0.5 rounded-full ${
        score >= 75 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
      }">
        ⭐ ${score}đ (${label})
      </span>
    `;
  }

  if (typeof playSoundEffect === 'function') {
    playSoundEffect(score >= 60 ? 'match' : 'wrong');
  }

  if (typeof showToast === 'function') {
    showToast(`🎙️ Bạn đọc: "${spoken}" → Đạt ${score} điểm (${label})`);
  }
}

/**
 * Sao chép toàn bộ văn bản bài nói
 */
function copyFamilySpeechScript() {
  const data = window.FAMILY_SPEECH_DATA;
  const text = `【BÀI NÓI TIẾNG TRUNG BÀI 4 - GIỚI THIỆU GIA ĐÌNH】
(Chuẩn bị theo yêu cầu cô giáo, dùng 100% từ vựng Bài 1 - 4)

1. Chữ Hán:
${data.fullParagraph.hanzi}

2. Pinyin:
${data.fullParagraph.pinyin}

3. Bản dịch tiếng Việt:
${data.fullParagraph.vietnamese}

Đối chiếu 6 yêu cầu cô giáo:
- Nhà có bao nhiêu người: 我家有三口人：爸爸、妈妈和我。 (Nhà em có 3 người gồm bố mẹ và em)
- Giới thiệu tuổi: 我爸爸今年六十岁，我妈妈今年五十五岁。 (Bố 60 tuổi, Mẹ 55 tuổi)
- Bố mẹ làm nghề gì: 我爸爸妈妈都不工作（退休了）。 (Bố mẹ em về hưu rồi)
- Công việc bố mẹ có bận không: 他们的工作不忙。 (Công việc bố mẹ em không bận)
- Công việc anh/chị/em: 我没有哥哥、姐姐，也没有妹妹。我是学生，我不工作。 (Không có anh chị em, bản thân là học sinh)
- Tình cảm gia đình: 我很爱我的家，也很爱我的爸爸妈妈。 (Tôi rất yêu gia đình tôi)`;

  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') {
      showToast('📋 Đã sao chép toàn bộ bài nói vào clipboard! Bạn có thể dán nộp cho cô giáo.');
    } else {
      alert('Đã sao chép toàn bộ bài nói vào clipboard!');
    }
  }).catch(err => {
    console.warn("Clipboard copy failed:", err);
  });
}

// Xuất các hàm ra phạm vi toàn cục
window.openFamilySpeechModal = openFamilySpeechModal;
window.closeFamilySpeechModal = closeFamilySpeechModal;
window.togglePlayFullFamilySpeech = togglePlayFullFamilySpeech;
window.stopFamilySpeech = stopFamilySpeech;
window.setFamilySpeechSpeed = setFamilySpeechSpeed;
window.speakFamilySentence = speakFamilySentence;
window.toggleRecordFamilySentence = toggleRecordFamilySentence;
window.copyFamilySpeechScript = copyFamilySpeechScript;
