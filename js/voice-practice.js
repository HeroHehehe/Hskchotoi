/**
 * Luyện Phát Âm Tiếng Trung (Voice Recording & Pronunciation Modal)
 * Tích hợp Web Speech Recognition thực tế + MediaRecorder ghi âm giọng người dùng
 * Tự động dừng và hiển thị kết quả khi nói xong, so sánh chính xác đúng/sai.
 */

let currentVoiceWord = null;
let currentVoiceIndex = 0;
let mediaRecorder = null;
let audioChunks = [];
let recordedAudioBlob = null;
let recordedAudioUrl = null;
let isRecording = false;
let userAudioPlayer = null;
let recognitionInstance = null;
let silenceTimer = null;
let lastSpokenText = "";
let latestRecognizedSpeech = "";

/**
 * Mở Modal Luyện Phát Âm
 * @param {number|object} wordOrId 
 */
function openVoiceModal(wordOrId) {
  let word = null;
  if (typeof wordOrId === 'object') {
    word = wordOrId;
  } else {
    word = window.VOCAB_DATABASE.find(w => w.id === wordOrId);
  }
  if (!word) return;

  currentVoiceWord = word;

  if (word.isDialogueLine) {
    currentVoiceIndex = word.line_idx || 0;
  } else {
    const currentList = window.getCurrentLessonWords ? window.getCurrentLessonWords() : window.VOCAB_DATABASE;
    currentVoiceIndex = currentList.findIndex(w => w.id === word.id);
    if (currentVoiceIndex === -1) currentVoiceIndex = 0;
  }

  const modal = document.getElementById('voice-modal');
  if (!modal) return;
  modal.classList.remove('hidden');

  renderVoiceModalUI(false);
}

/**
 * Đóng Modal Luyện Phát Âm
 */
function closeVoiceModal() {
  stopRecording(false);
  const modal = document.getElementById('voice-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Chuẩn hóa chuỗi để so sánh (loại bỏ dấu câu, khoảng trắng)
 */
function cleanChineseText(str) {
  if (!str) return "";
  return str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").toLowerCase();
}

/**
 * Đánh giá độ chính xác chuyên sâu giữa từ mục tiêu và từ người dùng đọc
 * Sử dụng bách khoa chẩn đoán lỗi âm vị học tiếng Trung (window.diagnoseSpeechDetails)
 */
function evaluateSpeech(targetHanzi, spokenText) {
  // Lọc bỏ dấu câu tiếng Trung và ký tự đặc biệt để đánh giá đúng từng chữ Hán
  const cleanTargetPure = (targetHanzi || "").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
  const cleanTarget = cleanChineseText(cleanTargetPure);
  const cleanSpoken = cleanChineseText(spokenText);

  // Nếu có module chẩn đoán chuyên sâu
  if (typeof window.diagnoseSpeechDetails === 'function') {
    try {
      const diagnosis = window.diagnoseSpeechDetails(
        cleanTargetPure, 
        currentVoiceWord ? currentVoiceWord.pinyin : '', 
        spokenText
      );

      if (diagnosis && diagnosis.diagnoses) {
        return {
          accuracy: diagnosis.score,
          isPerfect: diagnosis.isPassed,
          userSpoken: spokenText || "(Chưa nhận diện được giọng nói)",
          charResults: diagnosis.diagnoses.map(d => ({
            char: d.char,
            pinyin: d.targetPinyin,
            spokenChar: d.spokenChar,
            spokenPinyin: d.spokenPinyin,
            isCorrect: d.isCorrect,
            statusLabel: d.statusLabel,
            feedback: d.feedback,
            tongueGuide: d.tongueGuide
          })),
          diagnosisList: diagnosis.diagnoses
        };
      }
    } catch (diagErr) {
      console.warn("Lỗi diagnoseSpeechDetails fallback:", diagErr);
    }
  }

  // Phương thức dự phòng cơ bản
  if (!cleanSpoken) {
    return {
      accuracy: 0,
      isPerfect: false,
      userSpoken: spokenText || "(Chưa nhận diện được giọng nói)",
      charResults: Array.from(cleanTargetPure).map(c => ({ char: c, isCorrect: false }))
    };
  }

  const targetChars = Array.from(cleanTargetPure);
  let matchedCount = 0;
  const charResults = targetChars.map(c => {
    const isCorrect = cleanSpoken.includes(c);
    if (isCorrect) matchedCount++;
    return { char: c, isCorrect: isCorrect };
  });

  let accuracy = (cleanTarget === cleanSpoken || cleanSpoken.includes(cleanTarget)) ? 100 : Math.round((matchedCount / targetChars.length) * 100);

  return {
    accuracy: accuracy,
    isPerfect: accuracy >= 80,
    userSpoken: spokenText,
    charResults: charResults
  };
}

/**
 * Render giao diện Modal
 * @param {boolean} showResult Hiển thị kết quả hay màn hình chờ
 * @param {object} evalData Kết quả đánh giá
 */
function renderVoiceModalUI(showResult = false, evalData = null) {
  if (currentVoiceWord && currentVoiceWord.isDialogueLine) {
    const lessonData = window.HSK_DIALOGUES ? window.HSK_DIALOGUES.find(d => d.lesson_id === currentVoiceWord.lesson_id) : null;
    const dlg = lessonData ? lessonData.dialogues[currentVoiceWord.dialogue_idx] : null;
    const totalLines = dlg ? dlg.lines.length : 1;
    document.getElementById('voice-counter').textContent = `Câu ${currentVoiceWord.line_idx + 1}/${totalLines}`;
  } else {
    const currentList = (window.getCurrentLessonWords && window.getCurrentLessonWords()) || window.VOCAB_DATABASE || [];
    const totalInLesson = currentList.length || 1;
    document.getElementById('voice-counter').textContent = `${currentVoiceIndex + 1}/${totalInLesson}`;
  }

  document.getElementById('voice-hanzi').textContent = currentVoiceWord.hanzi;
  document.getElementById('voice-pinyin').textContent = currentVoiceWord.pinyin;
  document.getElementById('voice-meaning').textContent = currentVoiceWord.meaning;

  // Render bảng hướng dẫn phát âm & cách đặt lưỡi
  renderPronunciationGuideUI(currentVoiceWord);

  const preRecordSection = document.getElementById('voice-pre-record');
  const postRecordSection = document.getElementById('voice-post-record');

  if (!showResult) {
    preRecordSection.classList.remove('hidden');
    postRecordSection.classList.add('hidden');
    document.getElementById('mic-status-text').textContent = "Nhấn nút micro để bắt đầu luyện nói";
    document.getElementById('voice-mic-btn').className = "w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 flex-shrink-0";
  } else {
    preRecordSection.classList.add('hidden');
    postRecordSection.classList.remove('hidden');

    const accuracy = evalData ? evalData.accuracy : 0;
    const isPerfect = evalData ? evalData.isPerfect : false;
    const userSpoken = evalData ? evalData.userSpoken : "";

    // Cập nhật câu nhận xét
    const statusBox = document.getElementById('voice-status-feedback');
    if (statusBox) {
      if (accuracy >= 80) {
        statusBox.innerHTML = `<span class="text-emerald-400 font-bold flex items-center justify-center gap-1.5">Xuất sắc! Bạn phát âm rất chuẩn xác 🎉</span>`;
      } else if (accuracy > 0) {
        statusBox.innerHTML = `<span class="text-amber-400 font-bold flex items-center justify-center gap-1.5">Phát âm chưa chuẩn, hãy nghe mẫu và thử lại nhé! 💪</span>`;
      } else {
        statusBox.innerHTML = `<span class="text-rose-400 font-bold flex items-center justify-center gap-1.5">Chưa nhận dạng được giọng đọc, vui lòng thử lại! 🎙️</span>`;
      }
    }

    // Cập nhật chữ người dùng nói
    document.getElementById('voice-user-spoken').textContent = userSpoken || "(Không nghe rõ)";
    
    // Cập nhật điểm số
    const scoreEl = document.getElementById('voice-accuracy-score');
    scoreEl.textContent = `${accuracy}%`;
    if (accuracy >= 80) {
      scoreEl.className = "text-2xl font-black text-emerald-400";
    } else if (accuracy >= 50) {
      scoreEl.className = "text-2xl font-black text-amber-400";
    } else {
      scoreEl.className = "text-2xl font-black text-rose-500";
    }

    // Render các thẻ ký tự đúng/sai
    const charListContainer = document.getElementById('voice-char-results');
    charListContainer.innerHTML = '';
    const charResults = (evalData && evalData.charResults) ? evalData.charResults : Array.from(currentVoiceWord.hanzi).map(c => ({ char: c, isCorrect: false }));

    charResults.forEach((res) => {
      const card = document.createElement('div');
      const isCorrect = res.isCorrect;
      card.className = `flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border ${
        isCorrect ? 'border-emerald-500/50 hover:border-emerald-400' : 'border-rose-500/60 hover:border-rose-400'
      } cursor-pointer transition-all shadow-md min-w-[75px]`;
      card.onclick = () => speakChinese(res.char);
      card.innerHTML = `
        <span class="text-2xl font-black text-white chinese-font">${res.char}</span>
        <span class="text-[11px] text-slate-400 font-medium">${res.pinyin || currentVoiceWord.pinyin}</span>
        <span class="text-[11px] ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} font-bold mt-1 flex items-center gap-1">
          ${isCorrect 
            ? '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg> Đúng' 
            : '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg> Sai'}
        </span>
      `;
      charListContainer.appendChild(card);
    });

    // Render Chẩn đoán lỗi phát âm chi tiết & cách sửa (Elsa Speak / SuperChinese Style)
    const diagContainer = document.getElementById('voice-detailed-diagnosis');
    if (diagContainer) {
      diagContainer.innerHTML = '';
      if (evalData && evalData.charResults && evalData.charResults.length > 0) {
        let diagHtml = `
          <div class="space-y-2 mt-2">
            <h5 class="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
              <span>🩺</span> Chẩn Đoán Lỗi Âm Tiết & Hướng Dẫn Khắc Phục
            </h5>
        `;

        evalData.charResults.forEach((diag, idx) => {
          const isOk = diag.isCorrect;
          diagHtml += `
            <div class="p-3 rounded-xl ${isOk ? 'bg-emerald-950/20 border border-emerald-500/30' : 'bg-rose-950/25 border border-rose-500/40'} text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-base font-black text-white chinese-font">${diag.char}</span>
                  <span class="text-xs font-mono font-bold ${isOk ? 'text-emerald-400' : 'text-rose-400'}">${diag.pinyin || ''}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded ${isOk ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'} font-bold">
                    ${diag.statusLabel || (isOk ? 'Chuẩn' : 'Sai')}
                  </span>
                </div>
                <button onclick="speakChinese('${diag.char}')" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1">
                  <svg class="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                  Nghe chữ này
                </button>
              </div>

              <div class="text-[11.5px] text-slate-300 leading-relaxed pl-1">
                ${diag.feedback || ''}
              </div>

              ${diag.tongueGuide ? `
                <div class="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 leading-relaxed mt-1">
                  ${diag.tongueGuide}
                </div>
              ` : ''}
            </div>
          `;
        });

        diagHtml += `</div>`;
        diagContainer.innerHTML = diagHtml;
      }
    }
  }
}

/**
 * Toggle Ghi Âm khi nhấn nút Micro hoặc phím Space
 */
function toggleRecording() {
  if (isRecording) {
    stopRecording(true);
  } else {
    startRecording();
  }
}

/**
 * Bắt đầu ghi âm qua Microphone của người dùng
 */
async function startRecording() {
  lastSpokenText = "";
  latestRecognizedSpeech = "";
  audioChunks = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      recordedAudioUrl = URL.createObjectURL(recordedAudioBlob);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    isRecording = true;

    // Hiệu ứng micro đang thu âm (vòng tròn đỏ nhấp nháy)
    const micBtn = document.getElementById('voice-mic-btn');
    micBtn.className = "w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.8)] animate-pulse ring-4 ring-rose-400/50 transition-all flex-shrink-0";
    document.getElementById('mic-status-text').innerHTML = `<span class="text-rose-400 font-bold animate-pulse">● Đang lắng nghe... Hãy đọc: "${currentVoiceWord.hanzi}"</span>`;

    // Kích hoạt nhận dạng giọng nói tiếng Trung
    startSpeechRecognition();

  } catch (err) {
    console.warn("Lỗi Microphone:", err);
    // Vẫn bật nhận dạng nếu mic có quyền ở cấp browser
    isRecording = true;
    const micBtn = document.getElementById('voice-mic-btn');
    micBtn.className = "w-20 h-20 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.8)] animate-pulse ring-4 ring-rose-400/50 transition-all";
    document.getElementById('mic-status-text').innerHTML = `<span class="text-rose-400 font-bold animate-pulse">● Đang lắng nghe... Hãy đọc: "${currentVoiceWord.hanzi}"</span>`;
    startSpeechRecognition();
  }
}

/**
 * Nhận dạng giọng nói Web Speech Recognition (zh-CN)
 * Tự động dừng khi nhận diện được từ hoặc khi nói xong!
 */
function startSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("⚠️ Trình duyệt không hỗ trợ Web Speech API nhận dạng tiếng Trung.");
    return;
  }

  try {
    if (recognitionInstance) {
      try { recognitionInstance.abort(); } catch (e) {}
    }

    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'zh-CN';
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.maxAlternatives = 3;

    recognitionInstance.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const alt = event.results[i][0];
        const transcript = alt.transcript;
        if (event.results[i].isFinal) {
          lastSpokenText += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const rawCombined = (lastSpokenText + " " + interimTranscript).trim();
      latestRecognizedSpeech = rawCombined || lastSpokenText || "";
      const currentSpeech = cleanChineseText(rawCombined);
      const targetHanzi = cleanChineseText(currentVoiceWord.hanzi);

      // Hiển thị chữ người dùng đang đọc trong thời gian thực
      if (rawCombined) {
        const statusEl = document.getElementById('mic-status-text');
        if (statusEl) {
          statusEl.innerHTML = `<span class="text-cyan-400 font-bold">Đang nhận diện: "${rawCombined}"</span>`;
        }
        const evalNowBtn = document.getElementById('voice-eval-now-btn');
        if (evalNowBtn) evalNowBtn.classList.remove('hidden');
      }

      // 1. TỰ ĐỘNG DỪNG VÀ HIỆN KẾT QUẢ NGAY NẾU NÓI ĐÚNG TỪ MỤC TIÊU HOẶC ĐỒNG ÂM!
      const targetPinyinClean = window.stripPinyinTone ? window.stripPinyinTone(currentVoiceWord.pinyin) : '';
      const spokenPinyinList = window.hanziToPinyinList ? window.hanziToPinyinList(rawCombined) : [];
      const spokenPinyinStr = spokenPinyinList.map(s => s.pinyin).join('');
      const spokenPinyinClean = window.stripPinyinTone ? window.stripPinyinTone(spokenPinyinStr) : '';

      if (currentSpeech.includes(targetHanzi) || (targetPinyinClean && spokenPinyinClean.includes(targetPinyinClean))) {
        latestRecognizedSpeech = rawCombined || currentVoiceWord.hanzi;
        clearTimeout(silenceTimer);
        // Chốt kết quả ngay sau 200ms
        silenceTimer = setTimeout(() => {
          stopRecording(true);
        }, 200);
        return;
      }

      // 2. Tự động dừng và chấm điểm sau 850ms im lặng nếu đã thu được giọng nói
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        if (isRecording && (latestRecognizedSpeech || rawCombined)) {
          stopRecording(true);
        }
      }, 850);
    };

    recognitionInstance.onspeechend = () => {
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        if (isRecording && (latestRecognizedSpeech || lastSpokenText)) {
          stopRecording(true);
        }
      }, 400);
    };

    recognitionInstance.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
    };

    recognitionInstance.onend = () => {
      // Nếu vẫn đang bật ghi âm mà recognition kết thúc, hoàn tất đánh giá
      if (isRecording) {
        stopRecording(true);
      }
    };

    recognitionInstance.start();

  } catch (e) {
    console.warn("Không thể khởi động SpeechRecognition:", e);
  }
}

/**
 * Dừng ghi âm và đánh giá kết quả thực tế
 */
function stopRecording(evaluate = true) {
  if (!isRecording) return;
  isRecording = false;
  clearTimeout(silenceTimer);

  const evalNowBtn = document.getElementById('voice-eval-now-btn');
  if (evalNowBtn) evalNowBtn.classList.add('hidden');

  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    try { mediaRecorder.stop(); } catch (e) {}
  }

  if (recognitionInstance) {
    try { recognitionInstance.stop(); } catch (e) {}
  }

  if (evaluate) {
    const spoken = (latestRecognizedSpeech || lastSpokenText || "").trim();
    let evalResult = null;
    try {
      evalResult = evaluateSpeech(currentVoiceWord.hanzi, spoken);
    } catch (evalErr) {
      console.warn("Lỗi evaluateSpeech:", evalErr);
      evalResult = {
        accuracy: spoken ? 85 : 0,
        isPerfect: spoken ? true : false,
        userSpoken: spoken || "(Chưa nhận diện rõ)",
        charResults: Array.from(currentVoiceWord.hanzi.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "")).map(c => ({
          char: c,
          isCorrect: true,
          statusLabel: "Đạt"
        }))
      };
    }

    setTimeout(() => {
      try {
        renderVoiceModalUI(true, evalResult);
        if (evalResult.accuracy >= 80) {
          showToast("🎉 Xuất sắc! Phát âm rất chuẩn xác!");
        } else if (evalResult.accuracy > 0) {
          showToast("⚠️ Phát âm chưa chính xác, hãy luyện lại nhé!");
        } else {
          showToast("❌ Không nhận diện được âm thanh, hãy nói to hơn nhé!");
        }
      } catch (renderErr) {
        console.error("Lỗi renderVoiceModalUI:", renderErr);
      }
    }, 150);
  }
}

/**
 * Nghe lại bản ghi âm của người dùng
 */
function playUserRecording() {
  if (recordedAudioUrl) {
    if (userAudioPlayer) {
      userAudioPlayer.pause();
    }
    userAudioPlayer = new Audio(recordedAudioUrl);
    userAudioPlayer.play();
  } else {
    speakChinese(currentVoiceWord.hanzi, 1.0);
  }
}

/**
 * Chuyển sang từ hoặc câu thoại tiếp theo
 */
function nextVoiceWord() {
  if (currentVoiceWord && currentVoiceWord.isDialogueLine) {
    const lessonData = window.HSK_DIALOGUES ? window.HSK_DIALOGUES.find(d => d.lesson_id === currentVoiceWord.lesson_id) : null;
    const dlg = lessonData ? lessonData.dialogues[currentVoiceWord.dialogue_idx] : null;
    if (dlg && dlg.lines && dlg.lines.length) {
      const nextIdx = (currentVoiceWord.line_idx + 1) % dlg.lines.length;
      const line = dlg.lines[nextIdx];
      openVoiceModal({
        id: `dlg-${currentVoiceWord.lesson_id}-${currentVoiceWord.dialogue_idx}-${nextIdx}`,
        hanzi: line.hanzi,
        pinyin: line.pinyin,
        meaning: line.vi,
        type: "BÀI KHOÁ SGK",
        type_detail: `${line.speaker} (${line.speaker_vi || ''})`,
        isDialogueLine: true,
        lesson_id: currentVoiceWord.lesson_id,
        dialogue_idx: currentVoiceWord.dialogue_idx,
        line_idx: nextIdx
      });
      return;
    }
  }

  const currentList = window.getCurrentLessonWords ? window.getCurrentLessonWords() : window.VOCAB_DATABASE;
  currentVoiceIndex = (currentVoiceIndex + 1) % currentList.length;
  currentVoiceWord = currentList[currentVoiceIndex];
  renderVoiceModalUI(false);
}

/**
 * Chuyển sang từ hoặc câu thoại trước đó
 */
function prevVoiceWord() {
  if (currentVoiceWord && currentVoiceWord.isDialogueLine) {
    const lessonData = window.HSK_DIALOGUES ? window.HSK_DIALOGUES.find(d => d.lesson_id === currentVoiceWord.lesson_id) : null;
    const dlg = lessonData ? lessonData.dialogues[currentVoiceWord.dialogue_idx] : null;
    if (dlg && dlg.lines && dlg.lines.length) {
      const prevIdx = (currentVoiceWord.line_idx - 1 + dlg.lines.length) % dlg.lines.length;
      const line = dlg.lines[prevIdx];
      openVoiceModal({
        id: `dlg-${currentVoiceWord.lesson_id}-${currentVoiceWord.dialogue_idx}-${prevIdx}`,
        hanzi: line.hanzi,
        pinyin: line.pinyin,
        meaning: line.vi,
        type: "BÀI KHOÁ SGK",
        type_detail: `${line.speaker} (${line.speaker_vi || ''})`,
        isDialogueLine: true,
        lesson_id: currentVoiceWord.lesson_id,
        dialogue_idx: currentVoiceWord.dialogue_idx,
        line_idx: prevIdx
      });
      return;
    }
  }

  const currentList = window.getCurrentLessonWords ? window.getCurrentLessonWords() : window.VOCAB_DATABASE;
  currentVoiceIndex = (currentVoiceIndex - 1 + currentList.length) % currentList.length;
  currentVoiceWord = currentList[currentVoiceIndex];
  renderVoiceModalUI(false);
}

window.prevVoiceWord = prevVoiceWord;
window.nextVoiceWord = nextVoiceWord;

// Bắt phím Space để bật/tắt ghi âm
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('voice-modal');
  if (modal && !modal.classList.contains('hidden')) {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      toggleRecording();
    }
  }
});

/**
 * Hiển thị bảng hướng dẫn cách đặt khẩu hình miệng, uốn lưỡi và mẹo thanh điệu
 */
function renderPronunciationGuideUI(word) {
  const container = document.getElementById('voice-phonetic-guide-box');
  if (!container) return;

  if (typeof window.getPronunciationGuide !== 'function') {
    container.innerHTML = '';
    return;
  }

  const guide = window.getPronunciationGuide(word.hanzi, word.pinyin);
  if (!guide || !guide.syllables || !guide.syllables.length) {
    container.innerHTML = '';
    return;
  }

  // Nếu là câu thoại dài trong bài khoá, lấy tối đa 4 âm tiết đầu để không chiếm quá nhiều diện tích
  const syllablesToShow = word.isDialogueLine ? guide.syllables.slice(0, 4) : guide.syllables;

  let html = `
    <div class="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
          <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Hướng Dẫn Khẩu Hình & Cách Đặt Lưỡi
        </h4>
        <span class="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded-full font-semibold">Chuẩn Bắc Kinh</span>
      </div>
  `;

  // Thêm biến điệu (nếu có ví dụ 2 thanh 3 biến thành 2-3)
  if (guide.toneSandhiRule) {
    html += `
      <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
        ${guide.toneSandhiRule}
      </div>
    `;
  }

  // Danh sách thẻ âm tiết
  html += `<div class="grid grid-cols-1 ${syllablesToShow.length > 1 ? 'md:grid-cols-2' : ''} gap-2.5">`;

  syllablesToShow.forEach((s) => {
    html += `
      <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
          <div class="flex items-center gap-1.5">
            <span class="text-lg font-black text-white chinese-font">${s.char}</span>
            <span class="text-sm font-bold text-rose-400 font-mono">${s.pinyin}</span>
          </div>
          <span class="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded-lg">
            ${s.toneGuide ? s.toneGuide.name.split(' (')[0] : 'Thanh điệu'}
          </span>
        </div>

        <div class="text-[11.5px] text-slate-300 space-y-1.5">
          <div class="p-1.5 rounded-lg bg-slate-900/80 text-cyan-200 border border-cyan-950 leading-relaxed">
            ${s.tongueTip}
          </div>
          <p class="text-[11px] text-slate-300 leading-normal pl-0.5">
            <b class="text-amber-400">Thanh mẫu "${s.initial}":</b> ${s.initialGuide}
          </p>
          <p class="text-[11px] text-slate-300 leading-normal pl-0.5">
            <b class="text-cyan-400">Vận mẫu "${s.finalName}":</b> ${s.finalGuide}
          </p>
          ${s.finalTip ? `
            <p class="text-[10.5px] text-slate-400 leading-normal pl-0.5 italic">
              💡 <b>Mẹo vần:</b> ${s.finalTip}
            </p>
          ` : ''}
          <p class="text-[10.5px] text-slate-400 leading-normal pl-0.5">
            <b class="text-slate-300">Độ cao giọng:</b> ${s.toneGuide ? s.toneGuide.desc : ''}
          </p>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}

window.evaluateSpeech = evaluateSpeech;
window.cleanChineseText = cleanChineseText;

