/**
 * Module Sách Bài Tập HSK 1 (学练手册) - Làm bài tập & Luyện nói tương tác
 */

let currentWorkbookLesson = 1;
let currentWorkbookTab = 'phonetics'; // 'phonetics' | 'practice' | 'mock_test'
let workbookAnswers = {}; // user answers keyed by question id
let workbookResults = {}; // evaluated results { qId: { correct: bool, explain: str } }
let workbookAudioPlayer = null;
let workbookSpeechRec = null;
let isWorkbookRecording = false;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.HSK_WORKBOOK !== 'undefined') {
    initWorkbookModule();
  }
});

function initWorkbookModule() {
  currentWorkbookLesson = window.currentLessonId || 1;
  const container = document.getElementById('workbook-view-container');
  if (container) {
    renderWorkbookView(currentWorkbookLesson);
  }
}

/**
 * Chuyển đổi giữa các tab trong Sách bài tập
 */
function setWorkbookTab(tabName) {
  currentWorkbookTab = tabName;
  const lessonData = getWorkbookLessonData(currentWorkbookLesson);
  if (!lessonData) return;
  renderWorkbookContent(lessonData);
}

function getWorkbookLessonData(lessonId) {
  if (!window.HSK_WORKBOOK) return null;
  return window.HSK_WORKBOOK.find(l => l.lesson_id === lessonId) || window.HSK_WORKBOOK[0];
}

/**
 * Render toàn bộ giao diện Sách Bài Tập
 */
function renderWorkbookView(lessonId) {
  currentWorkbookLesson = lessonId;
  const container = document.getElementById('workbook-view-container');
  if (!container) return;

  const lessonData = getWorkbookLessonData(lessonId);
  if (!lessonData) {
    container.innerHTML = `<div class="p-6 text-center text-slate-400">Không tìm thấy dữ liệu Sách bài tập cho Bài ${lessonId}</div>`;
    return;
  }

  // Tự động chọn tab khả dụng đầu tiên nếu tab hiện tại không có trong bài
  const availableSections = lessonData.sections.map(s => s.id);
  if (!availableSections.includes(currentWorkbookTab)) {
    currentWorkbookTab = availableSections[0] || 'phonetics';
  }

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- 1. HEADER BANNER SÁCH BÀI TẬP -->
      <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/40 border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-2xl shadow-inner">
            📝
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/40">SÁCH BÀI TẬP 3.0</span>
              <span class="text-xs text-slate-400 font-medium">学练手册</span>
            </div>
            <h2 class="text-lg font-black text-white mt-0.5">
              Bài ${lessonData.lesson_id}: ${lessonData.lesson_title} 
              <span class="text-emerald-300 font-normal text-sm">(${lessonData.lesson_title_vi})</span>
            </h2>
          </div>
        </div>

        <!-- Bộ chuyển bài & Nút YouTube -->
        <div class="flex items-center gap-2 flex-wrap self-end md:self-auto">
          <button onclick="prevWorkbookLesson()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 shadow-sm">
            ◀ Bài trước
          </button>
          
          <select id="workbook-lesson-select" onchange="switchWorkbookLesson(parseInt(this.value))" class="bg-slate-900 border border-emerald-500/60 text-emerald-300 font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-md">
            ${(window.HSK_LESSONS || []).map(l => `<option value="${l.id}" ${l.id === currentWorkbookLesson ? 'selected' : ''}>Bài ${l.id}: ${l.title}</option>`).join('')}
          </select>

          <button onclick="nextWorkbookLesson()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20">
            Bài tiếp ▶
          </button>

          <a href="${lessonData.audio.youtube}" target="_blank" rel="noopener noreferrer" title="Mở danh sách phát Audio trên YouTube" class="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
            <span>▶</span>
            <span class="hidden sm:inline">Audio YouTube</span>
          </a>
        </div>
      </div>

      <!-- 2. THANH TABS CHUYỂN PHẦN BÀI TẬP -->
      <div class="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-1.5 shadow-md overflow-x-auto no-scrollbar">
        ${renderSectionTabs(lessonData)}
      </div>

      <!-- 3. KHUNG PHÁT AUDIO BÀI TẬP HIỆN TẠI -->
      <div id="workbook-audio-bar" class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <!-- Render động qua updateWorkbookAudioPlayer() -->
      </div>

      <!-- 4. KHU VỰC NỘI DUNG LÀM BÀI TẬP -->
      <div id="workbook-content-area" class="space-y-4">
        <!-- Render động -->
      </div>

    </div>
  `;

  renderWorkbookContent(lessonData);
}

function renderSectionTabs(lessonData) {
  const sections = lessonData.sections;
  return sections.map(sec => {
    const isActive = sec.id === currentWorkbookTab;
    let activeClass = "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-black";
    let inactiveClass = "text-slate-400 hover:text-white hover:bg-slate-800 font-bold";

    let icon = "🎙️";
    if (sec.id === 'practice') icon = "🎧";
    if (sec.id === 'mock_test') icon = "📋";

    return `
      <button onclick="setWorkbookTab('${sec.id}')" class="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${isActive ? activeClass : inactiveClass}">
        <span>${icon}</span>
        <span>${sec.title.split('•')[0].trim()}</span>
      </button>
    `;
  }).join('');
}

/**
 * Render nội dung bài tập theo tab đã chọn
 */
function renderWorkbookContent(lessonData) {
  const contentArea = document.getElementById('workbook-content-area');
  const audioBar = document.getElementById('workbook-audio-bar');
  if (!contentArea) return;

  const section = lessonData.sections.find(s => s.id === currentWorkbookTab) || lessonData.sections[0];
  if (!section) return;

  // Cập nhật Audio Bar
  const audioUrl = section.audio_url || lessonData.audio[section.audio_key];
  if (audioBar) {
    audioBar.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
        <div class="text-xs">
          <p class="font-bold text-white">Audio Bài Tập: <span class="text-emerald-300">${section.title}</span></p>
          <p class="text-[10px] text-slate-400">Nghe trực tiếp từ file MP3 chính thức của sách</p>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-1 max-w-md justify-end">
        <audio id="wb-audio-element" controls src="${audioUrl}" class="h-9 w-full max-w-xs rounded-lg"></audio>
      </div>
    `;
  }

  // Render theo từng loại Section
  if (section.id === 'phonetics') {
    renderPhoneticsSection(contentArea, section);
  } else if (section.id === 'practice') {
    renderPracticeSection(contentArea, section);
  } else if (section.id === 'mock_test') {
    renderMockSection(contentArea, section);
  }
}

/**
 * PHẦN 1: Ngữ Âm & Luyện Nói (小语讲堂)
 */
function renderPhoneticsSection(container, section) {
  let html = `
    <!-- Ghi chú lý thuyết ngữ âm -->
    <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
      <h3 class="text-sm font-black text-amber-300 flex items-center gap-2">
        <span>💡</span> Trọng tâm ngữ âm bài học
      </h3>
      <ul class="space-y-2 text-xs text-slate-300 list-disc list-inside">
        ${(section.notes || []).map(n => `<li class="leading-relaxed">${n}</li>`).join('')}
      </ul>
    </div>

    <!-- Bảng Luyện Nói & Thu Âm Chấm Điểm -->
    <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>🗣️</span> Luyện Nói Theo Sách Bài Tập
          </h3>
          <p class="text-xs text-slate-400">Bấm nút loa để nghe phát âm chuẩn, bấm Micro để đọc to và nhận điểm số</p>
        </div>
        <span class="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/30">
          ${(section.speaking_practice || []).length} từ luyện nói
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${(section.speaking_practice || []).map((item, idx) => `
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2.5">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-2xl font-black text-white font-serif tracking-wide">${item.hanzi}</span>
                <p class="text-xs font-mono font-bold text-cyan-300">${item.pinyin || ''}</p>
                <p class="text-[11px] text-slate-400">${item.vi || ''}</p>
              </div>
              <button onclick="speakChinese('${item.hanzi}')" title="Nghe phát âm chuẩn" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 flex items-center justify-center transition-all shadow-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>

            <!-- Nút Luyện Nói Micro -->
            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button id="wb-mic-btn-${idx}" onclick="startWorkbookSpeaking('${item.hanzi}', '${item.pinyin}', ${idx})" class="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5">
                <span>🎙️</span>
                <span>Nhấn để đọc</span>
              </button>
              <div id="wb-score-${idx}" class="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                Chưa thử
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * PHẦN 2: Nghe, đọc và luyện tập (听读练)
 */
function renderPracticeSection(container, section) {
  let html = `<div class="space-y-4">`;

  (section.exercises || []).forEach((ex, exIdx) => {
    html += `
      <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-black">${exIdx + 1}</span>
            <span>${ex.title}</span>
          </h3>
        </div>

        <!-- Danh sách câu hỏi -->
        <div class="space-y-3.5">
          ${(ex.questions || []).map((q, qIdx) => renderQuestionCard(q, ex.id)).join('')}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

/**
 * PHẦN 3: Luyện thi mô phỏng HSK (模拟测练)
 */
function renderMockSection(container, section) {
  let html = `<div class="space-y-4">`;

  (section.exercises || []).forEach((ex, exIdx) => {
    html += `
      <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-sm font-black text-amber-300">${ex.title}</h3>
            <p class="text-[11px] text-slate-400">Chọn đáp án và bấm "Kiểm tra đáp án" để xem giải thích chi tiết</p>
          </div>
        </div>

        <!-- Danh sách câu hỏi thi thử -->
        <div class="space-y-3.5">
          ${(ex.questions || []).map(q => renderQuestionCard(q, ex.id)).join('')}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

/**
 * Render từng thẻ câu hỏi trắc nghiệm
 */
function renderQuestionCard(q, exId) {
  const currentAnswer = workbookAnswers[q.id];
  const evaluated = workbookResults[q.id];

  let statusBadge = '';
  if (evaluated) {
    if (evaluated.correct) {
      statusBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1">✅ Đúng (+10đ)</span>`;
    } else {
      statusBadge = `<span class="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1">❌ Chưa đúng</span>`;
    }
  }

  return `
    <div id="q-card-${q.id}" class="p-4 rounded-xl bg-slate-950/80 border ${evaluated ? (evaluated.correct ? 'border-emerald-500/50' : 'border-rose-500/50') : 'border-slate-800'} space-y-3 transition-all">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-bold text-white">${q.prompt || q.context || q.statement || ''}</p>
          ${q.sentence ? `<p class="text-sm font-extrabold text-blue-300 mt-1">${q.sentence}</p>` : ''}
          ${q.audio_text ? `<div class="mt-1 flex items-center gap-2"><button onclick="speakChinese('${q.audio_text}')" class="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 hover:bg-blue-800 text-[10px] font-bold flex items-center gap-1 border border-blue-700/50">🔊 Nghe câu hỏi</button><span class="text-[11px] text-slate-400 italic">"${q.audio_text}"</span></div>` : ''}
        </div>
        ${statusBadge}
      </div>

      <!-- Các lựa chọn đáp án (A, B, C, D) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        ${(q.options || []).map(opt => {
          const isSelected = currentAnswer === opt;
          let btnClass = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800";
          if (isSelected) {
            btnClass = "bg-blue-600 border-blue-500 text-white font-bold shadow-md shadow-blue-500/20";
          }
          if (evaluated) {
            if (opt === q.answer) {
              btnClass = "bg-emerald-600 border-emerald-500 text-white font-bold";
            } else if (isSelected && !evaluated.correct) {
              btnClass = "bg-rose-600 border-rose-500 text-white font-bold";
            }
          }

          return `
            <button onclick="selectWorkbookOption('${q.id}', '${escapeHtml(opt)}')" class="p-2.5 rounded-xl border text-xs text-left transition-all flex items-center gap-2 ${btnClass}">
              <span class="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">${opt.charAt(0)}</span>
              <span>${opt}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Nút Kiểm Tra Đáp Án & Lời Giải -->
      <div class="pt-2 border-t border-slate-900 flex items-center justify-between gap-3">
        <button onclick="checkWorkbookAnswer('${q.id}')" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm flex items-center gap-1.5">
          <span>🔍</span>
          <span>Kiểm tra đáp án</span>
        </button>

        ${evaluated ? `
          <div class="text-xs text-slate-300 flex-1 text-right animate-in fade-in">
            <span class="font-bold text-emerald-400">Đáp án: ${q.answer}</span> 
            ${q.explain ? `• <span class="text-slate-400">${q.explain}</span>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function selectWorkbookOption(qId, opt) {
  workbookAnswers[qId] = opt;
  // Re-render question card
  const lessonData = getWorkbookLessonData(currentWorkbookLesson);
  if (lessonData) renderWorkbookContent(lessonData);
}

function checkWorkbookAnswer(qId) {
  const lessonData = getWorkbookLessonData(currentWorkbookLesson);
  if (!lessonData) return;

  let targetQ = null;
  for (const sec of lessonData.sections) {
    for (const ex of (sec.exercises || [])) {
      const found = (ex.questions || []).find(q => q.id === qId);
      if (found) {
        targetQ = found;
        break;
      }
    }
    if (targetQ) break;
  }

  if (!targetQ) return;

  const userAns = workbookAnswers[qId];
  if (!userAns) {
    if (typeof showToast === 'function') showToast("Vui lòng chọn một đáp án trước!");
    return;
  }

  const isCorrect = userAns.trim() === targetQ.answer.trim();
  workbookResults[qId] = {
    correct: isCorrect,
    explain: targetQ.explain || ''
  };

  if (isCorrect) {
    if (typeof showToast === 'function') showToast("🎉 Chính xác! Bạn làm rất tốt.");
  } else {
    if (typeof showToast === 'function') showToast("❌ Chưa đúng! Hãy xem lời giải và đáp án đúng.");
  }

  renderWorkbookContent(lessonData);
}

/**
 * Tương tác luyện nói bằng Micro AI
 */
function startWorkbookSpeaking(targetHanzi, targetPinyin, idx) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (typeof showToast === 'function') showToast("Trình duyệt không hỗ trợ Web Speech Recognition.");
    return;
  }

  const scoreBadge = document.getElementById(`wb-score-${idx}`);
  const micBtn = document.getElementById(`wb-mic-btn-${idx}`);

  if (isWorkbookRecording) {
    if (workbookSpeechRec) workbookSpeechRec.stop();
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      isWorkbookRecording = true;
      if (micBtn) {
        micBtn.className = "flex-1 py-1.5 px-2.5 rounded-lg bg-red-600 text-white font-bold text-xs border border-red-500 animate-pulse flex items-center justify-center gap-1.5";
        micBtn.innerHTML = `<span>⏹️</span><span>Đang nghe...</span>`;
      }
      if (scoreBadge) scoreBadge.textContent = "Đang nhận diện...";
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim();
      const confidence = e.results[0][0].confidence;
      evaluateWorkbookSpeech(transcript, targetHanzi, idx);
    };

    recognition.onerror = (e) => {
      console.warn("Speech error:", e);
      if (scoreBadge) scoreBadge.innerHTML = `<span class="text-rose-400">Không nghe rõ</span>`;
    };

    recognition.onend = () => {
      isWorkbookRecording = false;
      if (micBtn) {
        micBtn.className = "flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5";
        micBtn.innerHTML = `<span>🎙️</span><span>Đọc lại</span>`;
      }
    };

    recognition.start();
    workbookSpeechRec = recognition;
  } catch (err) {
    console.error("Speech rec init failed:", err);
  }
}

function evaluateWorkbookSpeech(spoken, expected, idx) {
  const scoreBadge = document.getElementById(`wb-score-${idx}`);
  if (!scoreBadge) return;

  const cleanSpoken = spoken.replace(/[^\u4e00-\u9fa5]/g, '');
  const cleanExpected = expected.replace(/[^\u4e00-\u9fa5]/g, '');

  if (cleanSpoken === cleanExpected || cleanSpoken.includes(cleanExpected) || cleanExpected.includes(cleanSpoken)) {
    scoreBadge.innerHTML = `<span class="text-emerald-400 font-black">100 điểm ★ "${spoken}"</span>`;
    if (typeof showToast === 'function') showToast(`👏 Xuất sắc! Phát âm chuẩn "${spoken}"`);
  } else {
    scoreBadge.innerHTML = `<span class="text-amber-400 font-bold">Nghe được: "${spoken}"</span>`;
    if (typeof showToast === 'function') showToast(`Bạn vừa nói "${spoken}". Hãy thử lại nhé!`);
  }
}

function prevWorkbookLesson() {
  if (currentWorkbookLesson > 1) {
    switchWorkbookLesson(currentWorkbookLesson - 1);
  }
}

function nextWorkbookLesson() {
  if (currentWorkbookLesson < (window.HSK_LESSONS ? window.HSK_LESSONS.length : 15)) {
    switchWorkbookLesson(currentWorkbookLesson + 1);
  }
}

function switchWorkbookLesson(lessonId) {
  currentWorkbookLesson = lessonId;
  renderWorkbookView(lessonId);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

window.initWorkbookModule = initWorkbookModule;
window.renderWorkbookView = renderWorkbookView;
window.setWorkbookTab = setWorkbookTab;
window.switchWorkbookLesson = switchWorkbookLesson;
window.prevWorkbookLesson = prevWorkbookLesson;
window.nextWorkbookLesson = nextWorkbookLesson;
window.selectWorkbookOption = selectWorkbookOption;
window.checkWorkbookAnswer = checkWorkbookAnswer;
window.startWorkbookSpeaking = startWorkbookSpeaking;
