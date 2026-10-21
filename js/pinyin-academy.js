/**
 * MODULE TRUNG TÂM PHÁT ÂM TIẾNG TRUNG TOÀN DIỆN (PINYIN MASTER ACADEMY)
 * 1. Học & Luyện đọc 21 Thanh mẫu (Initials)
 * 2. Học & Luyện đọc 36 Vận mẫu (Finals)
 * 3. Học & Luyện ghép vần (Spelling Pinyin)
 * 4. Học 4 Thanh điệu & Biến điệu (Tones & Sandhi)
 * 5. Ghi âm thời gian thực, chấm điểm và sửa lỗi phát âm tức thì!
 */

let pinyinCurrentTab = 'initials'; // 'initials' | 'finals' | 'spelling' | 'tones'
let pinyinSelectedInitial = 'b';
let pinyinSelectedFinal = 'a';
let pinyinSelectedTone = 1;
let pinyinActiveItem = null;

// Trạng thái ghi âm Pinyin
let pinyinIsRecording = false;
let pinyinRecognition = null;
let pinyinMediaRecorder = null;
let pinyinAudioChunks = [];
let pinyinUserAudioBlob = null;
let pinyinUserAudioUrl = null;
let pinyinSilenceTimer = null;
let pinyinLastSpoken = "";

/**
 * Mở Modal Học Bảng Chữ Cái & Ghép Âm Pinyin
 */
function openPinyinModal() {
  const modal = document.getElementById('pinyin-modal');
  if (!modal) return;
  modal.classList.remove('hidden');

  // Khởi tạo tab mặc định
  switchPinyinTab(pinyinCurrentTab);
}

/**
 * Đóng Modal
 */
function closePinyinModal() {
  stopPinyinRecording(false);
  const modal = document.getElementById('pinyin-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Chuyển Tab trong Modal Pinyin
 */
function switchPinyinTab(tabKey) {
  pinyinCurrentTab = tabKey;
  stopPinyinRecording(false);

  // Cập nhật giao diện tab buttons
  const tabs = ['initials', 'finals', 'spelling', 'tones'];
  tabs.forEach(t => {
    const btn = document.getElementById(`pinyin-tab-btn-${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5";
      } else {
        btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5";
      }
    }
  });

  if (tabKey === 'initials') {
    renderInitialsTab();
  } else if (tabKey === 'finals') {
    renderFinalsTab();
  } else if (tabKey === 'spelling') {
    renderSpellingTab();
  } else if (tabKey === 'tones') {
    renderTonesTab();
  }
}

/**
 * TAB 1: DANH SÁCH 21 THANH MẪU
 */
function renderInitialsTab() {
  const container = document.getElementById('pinyin-tab-content');
  const initialsObj = window.CHINESE_PHONETICS_DB.initials;
  const keys = Object.keys(initialsObj);

  if (!pinyinActiveItem || !initialsObj[pinyinActiveItem.key]) {
    pinyinActiveItem = { type: 'initial', key: 'b', data: initialsObj['b'] };
  }

  let gridHtml = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <!-- Cột trái: Lưới 21 thanh mẫu -->
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <span class="text-xs font-bold text-slate-300">21 Phụ Âm Đầu (Thanh Mẫu)</span>
          <span class="text-[11px] text-slate-400">Nhấn để xem cách đọc & luyện nói</span>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
  `;

  keys.forEach(k => {
    const item = initialsObj[k];
    const isSelected = pinyinActiveItem.key === k;
    gridHtml += `
      <button onclick="selectPinyinItem('initial', '${k}')" class="p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
        isSelected 
          ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-500/30 scale-105 border-2 border-blue-400' 
          : 'bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-slate-200'
      }">
        <span class="text-xl font-black font-mono">${k}</span>
        <span class="text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'} font-sans mt-0.5">${item.ipa}</span>
      </button>
    `;
  });

  gridHtml += `
        </div>

        <!-- Mẹo các cặp âm dễ nhầm lẫn -->
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11.5px] text-amber-200 space-y-1">
          <p class="font-bold flex items-center gap-1.5 text-amber-300">
            <span>⚠️</span> Các cặp âm dễ nhầm nhất:
          </p>
          <ul class="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
            <li><b>b - p:</b> "b" không bật hơi, "p" BẬT HƠI MẠNH bay tờ giấy.</li>
            <li><b>d - t:</b> "d" đọc như chữ "t" nhẹ, "t" BẬT HƠI CỰC MẠNH.</li>
            <li><b>g - k:</b> "g" đọc như "c/k", "k" BẬT HƠI từ cuống họng.</li>
            <li><b>zh/ch/sh vs z/c/s:</b> "zh/ch/sh" UỐN CONG LƯỠI, "z/c/s" DUỖI THẲNG LƯỠI.</li>
          </ul>
        </div>
      </div>

      <!-- Cột phải: Khung Luyện Tập & Ghi Âm Sửa Lỗi -->
      <div class="lg:col-span-6">
        <div id="pinyin-practice-box" class="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          ${renderItemDetailPracticeHtml(pinyinActiveItem)}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = gridHtml;
}

/**
 * TAB 2: DANH SÁCH 36 VẬN MẪU (FINALS)
 */
function renderFinalsTab() {
  const container = document.getElementById('pinyin-tab-content');
  const finalsObj = window.CHINESE_FINALS_DB || {};
  const keys = Object.keys(finalsObj);

  if (!pinyinActiveItem || !finalsObj[pinyinActiveItem.key]) {
    pinyinActiveItem = { type: 'final', key: 'a', data: finalsObj['a'] };
  }

  let gridHtml = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <!-- Cột trái: Danh sách các nhóm Vận mẫu -->
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <span class="text-xs font-bold text-slate-300">36 Vần Tiếng Trung (Vận Mẫu)</span>
          <span class="text-[11px] text-cyan-400">Bấm để luyện vần & kiểm tra</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
  `;

  keys.forEach(k => {
    const item = finalsObj[k];
    const isSelected = pinyinActiveItem.key === k;
    gridHtml += `
      <button onclick="selectPinyinItem('final', '${k}')" class="p-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
        isSelected 
          ? 'bg-cyan-600 text-white font-black shadow-lg shadow-cyan-500/30 scale-105 border-2 border-cyan-400' 
          : 'bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-slate-200'
      }">
        <span class="text-base font-black font-mono">${k}</span>
        <span class="text-[9.5px] ${isSelected ? 'text-cyan-100' : 'text-slate-400'} font-sans mt-0.5 truncate max-w-full">${item.ipa}</span>
      </button>
    `;
  });

  gridHtml += `
        </div>

        <div class="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-[11.5px] text-cyan-200 space-y-1">
          <p class="font-bold flex items-center gap-1.5 text-cyan-300">
            <span>💡</span> 4 Quy Tắc Vần Sống Còn Của Người Học:
          </p>
          <ul class="list-disc list-inside space-y-0.5 text-slate-300 pl-1 text-[11px]">
            <li><b>ian:</b> Luôn đọc là <b>"IÊN"</b> (như tiên, tiền), không đọc "i-an".</li>
            <li><b>eng:</b> Đọc thành <b>"ÂNG"</b> (như vâng, tầng), không đọc bẹt "eng".</li>
            <li><b>ong:</b> Khẩu hình môi tròn chu nhỏ đọc thành <b>"UNG"</b>.</li>
            <li><b>ü:</b> Giữ tròn môi huýt sáo không nhúc nhích, chỉ phát âm "i" trong họng.</li>
          </ul>
        </div>
      </div>

      <!-- Cột phải: Khung Luyện Tập & Ghi Âm Sửa Lỗi -->
      <div class="lg:col-span-6">
        <div id="pinyin-practice-box" class="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          ${renderItemDetailPracticeHtml(pinyinActiveItem)}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = gridHtml;
}

/**
 * TAB 3: GHÉP VẦN THANH MẪU + VẬN MẪU + THANH ĐIỆU (SPELLING MATRIX)
 */
function renderSpellingTab() {
  const container = document.getElementById('pinyin-tab-content');
  const initialsList = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'];
  const finalsList = ['a', 'o', 'e', 'i', 'u', 'v', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong'];

  // Tạo âm tiết ghép hiện tại
  const sylRaw = pinyinSelectedInitial + pinyinSelectedFinal;
  const toneMarks = {
    'a': ['a', 'ā', 'á', 'ǎ', 'à'],
    'o': ['o', 'ō', 'ó', 'ǒ', 'ò'],
    'e': ['e', 'ē', 'é', 'ě', 'è'],
    'i': ['i', 'ī', 'í', 'ǐ', 'ì'],
    'u': ['u', 'ū', 'ú', 'ǔ', 'ù'],
    'v': ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ']
  };

  // Tạo âm tiết có dấu
  let sylWithTone = sylRaw;
  const firstVowel = pinyinSelectedFinal[0];
  if (toneMarks[firstVowel] && pinyinSelectedTone > 0) {
    sylWithTone = pinyinSelectedInitial + pinyinSelectedFinal.replace(firstVowel, toneMarks[firstVowel][pinyinSelectedTone]);
  }

  pinyinActiveItem = {
    type: 'spelling',
    key: sylWithTone,
    initial: pinyinSelectedInitial,
    final: pinyinSelectedFinal,
    tone: pinyinSelectedTone,
    data: {
      name: sylWithTone,
      ipa: `[${pinyinSelectedInitial} + ${pinyinSelectedFinal}]`,
      type: 'Ghép vần hoàn chỉnh',
      tongue: `Khởi đầu bằng khẩu hình của phụ âm <b>[${pinyinSelectedInitial}]</b>, lướt thật nhanh nối liền với vần <b>[${pinyinSelectedFinal}]</b> và giữ cao độ của <b>Thanh ${pinyinSelectedTone}</b>.`,
      fixTip: `Đọc liền một hơi dứt khoát không tách rời thành 2 âm đơn!`
    }
  };

  let html = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div class="lg:col-span-6 space-y-4">
        <!-- Bộ chọn Thanh mẫu -->
        <div>
          <label class="block text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wide">1. Chọn Thanh Mẫu (Âm đầu):</label>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${initialsList.map(init => `
              <button onclick="changeSpellingParts('${init}', null, null)" class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                pinyinSelectedInitial === init ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }">
                ${init}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Bộ chọn Vận mẫu -->
        <div>
          <label class="block text-xs font-bold text-cyan-400 mb-1.5 uppercase tracking-wide">2. Chọn Vận Mẫu (Vần):</label>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${finalsList.map(fin => `
              <button onclick="changeSpellingParts(null, '${fin}', null)" class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                pinyinSelectedFinal === fin ? 'bg-cyan-500 text-slate-950 shadow-md font-black ring-2 ring-cyan-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }">
                ${fin}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Bộ chọn Thanh điệu -->
        <div>
          <label class="block text-xs font-bold text-rose-400 mb-1.5 uppercase tracking-wide">3. Chọn Thanh Điệu:</label>
          <div class="grid grid-cols-4 gap-2">
            ${[1, 2, 3, 4].map(tNum => `
              <button onclick="changeSpellingParts(null, null, ${tNum})" class="p-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center ${
                pinyinSelectedTone === tNum ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }">
                <span class="text-sm font-black">Thanh ${tNum}</span>
                <span class="text-[10px] text-slate-300">${window.CHINESE_PHONETICS_DB.tones[tNum].name.split(' (')[0]}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Cột phải: Hiển thị âm ghép & Luyện nói -->
      <div class="lg:col-span-6">
        <div id="pinyin-practice-box" class="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          ${renderItemDetailPracticeHtml(pinyinActiveItem)}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * TAB 4: 4 THANH ĐIỆU & QUY TẮC BIẾN ĐIỆU
 */
function renderTonesTab() {
  const container = document.getElementById('pinyin-tab-content');
  const tones = [
    { num: 1, name: 'Thanh 1 (Âm Bình)', mark: '¯ (55)', syl: 'mā (Mẹ)', desc: 'Cao và đều bằng phẳng (nốt Sol), giữ hơi dài ổn định từ đầu đến cuối, KHÔNG hạ giọng.' },
    { num: 2, name: 'Thanh 2 (Dương Bình)', mark: '´ (35)', syl: 'má (Cây gai)', desc: 'Đi từ độ cao trung bình vút thẳng lên cao nhất (tựa như dấu Sắc tiếng Việt nhưng thanh thoát hơn).' },
    { num: 3, name: 'Thanh 3 (Thượng Thanh)', mark: 'ˇ (214)', syl: 'mǎ (Ngựa)', desc: 'Hạ giọng xuống thật trầm ở đáy cổ họng rồi hơi uốn lên nhẹ.' },
    { num: 4, name: 'Thanh 4 (Khứ Thanh)', mark: '` (51)', syl: 'mà (Mắng)', desc: 'Rơi thẳng đứng từ nốt cao nhất dứt khoát xuống nốt thấp nhất, phát âm dứt khoát như ra lệnh.' }
  ];

  if (!pinyinActiveItem || pinyinActiveItem.type !== 'tone') {
    pinyinActiveItem = { type: 'tone', key: 'mā', data: { name: 'mā (Thanh 1)', ipa: 'Thanh 1', tongue: tones[0].desc, fixTip: 'Giữ cao độ ổn định.' } };
  }

  let html = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <span class="text-xs font-bold text-slate-300">4 Thanh Điệu Trong Tiếng Hán</span>
          <span class="text-[11px] text-rose-400">Đọc sai thanh điệu sẽ đổi hẳn nghĩa từ!</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${tones.map(t => `
            <div onclick="selectToneItem('${t.syl.split(' ')[0]}', '${t.name}', '${t.desc}')" class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all space-y-1.5 shadow-md">
              <div class="flex items-center justify-between">
                <span class="text-base font-black text-rose-400 font-mono">${t.syl}</span>
                <span class="text-[10.5px] px-2 py-0.5 rounded-lg bg-rose-950/80 text-rose-300 font-bold border border-rose-900/60">${t.mark}</span>
              </div>
              <p class="text-xs font-bold text-white">${t.name}</p>
              <p class="text-[11px] text-slate-400 leading-normal">${t.desc}</p>
            </div>
          `).join('')}
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11.5px] text-slate-300 space-y-1.5">
          <p class="font-bold text-amber-400 flex items-center gap-1.5">
            <span>💡</span> 2 Quy Tắc Biến Điệu Cực Kỳ Quan Trọng:
          </p>
          <p class="leading-relaxed">
            1. <b>Biến điệu 2 thanh 3:</b> Khi hai âm tiết mang thanh 3 đi liền nhau (ví dụ: <code>你好 nǐ hǎo</code>), chữ đầu tiên sẽ đổi đọc thành <b>thanh 2</b> $\rightarrow$ đọc là <i>"ní hǎo"</i>.
          </p>
          <p class="leading-relaxed">
            2. <b>Biến điệu chữ 不 (bù):</b> Bình thường đọc thanh 4, nhưng khi đứng trước một từ mang <b>thanh 4</b> khác thì đổi đọc thành <b>thanh 2</b> (ví dụ: <code>不是 bú shì</code>, <code>不客气 bú kèqi</code>).
          </p>
        </div>
      </div>

      <div class="lg:col-span-6">
        <div id="pinyin-practice-box" class="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          ${renderItemDetailPracticeHtml(pinyinActiveItem)}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Chọn mục Thanh mẫu / Vận mẫu
 */
function selectPinyinItem(type, key) {
  if (type === 'initial') {
    const data = window.CHINESE_PHONETICS_DB.initials[key];
    pinyinActiveItem = { type: 'initial', key: key, data: data };
    renderInitialsTab();
  } else if (type === 'final') {
    const data = window.CHINESE_FINALS_DB[key];
    pinyinActiveItem = { type: 'final', key: key, data: data };
    renderFinalsTab();
  }
}

/**
 * Chọn mục Thanh điệu
 */
function selectToneItem(syl, name, desc) {
  pinyinActiveItem = {
    type: 'tone',
    key: syl,
    data: {
      name: `${syl} - ${name}`,
      ipa: name,
      tongue: desc,
      fixTip: 'Điều khiển hơi thở từ bụng để giữ chuẩn cao độ.'
    }
  };
  renderTonesTab();
}

/**
 * Đổi phần tử trong Tab Ghép vần
 */
function changeSpellingParts(newInit, newFin, newTone) {
  if (newInit) pinyinSelectedInitial = newInit;
  if (newFin) pinyinSelectedFinal = newFin;
  if (newTone !== null && newTone !== undefined) pinyinSelectedTone = newTone;
  renderSpellingTab();
}

/**
 * Render khung chi tiết Luyện Nói + Ghi Âm Sửa Lỗi ở cột phải
 */
function renderItemDetailPracticeHtml(item) {
  if (!item || !item.data) return '';
  const d = item.data;

  return `
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div>
        <span class="text-[10px] font-bold text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2.5 py-0.5 rounded-full uppercase">
          ${item.type === 'initial' ? 'Thanh Mẫu' : (item.type === 'final' ? 'Vận Mẫu' : (item.type === 'spelling' ? 'Ghép Vần' : 'Thanh Điệu'))}
        </span>
        <h3 class="text-3xl font-black text-white font-mono mt-1">${item.key}</h3>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="playPinyinSound('${item.key}')" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          Nghe phát âm mẫu
        </button>
      </div>
    </div>

    <!-- Hướng dẫn khẩu hình & vị trí lưỡi -->
    <div class="space-y-2 text-xs">
      <div class="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 leading-relaxed">
        <p class="font-bold text-cyan-300 flex items-center gap-1.5">
          <span>👅</span> Khẩu hình & Vị trí đặt lưỡi:
        </p>
        <p class="text-slate-300 text-[11.5px]">${d.tongue}</p>
      </div>

      ${d.vnMistake ? `
        <div class="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1 text-slate-300 leading-relaxed text-[11.5px]">
          <p class="font-bold text-rose-400">❌ Lỗi người Việt hay gặp:</p>
          <p>${d.vnMistake}</p>
        </div>
      ` : ''}

      ${d.fixTip ? `
        <div class="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1 text-slate-300 leading-relaxed text-[11.5px]">
          <p class="font-bold text-emerald-400">💡 Mẹo phát âm chuẩn & sửa lỗi:</p>
          <p>${d.fixTip}</p>
        </div>
      ` : ''}
    </div>

    <!-- KHU VỰC THỬ THÁCH GHI ÂM & CHẤM ĐIỂM SỬA LỖI TRỰC TIẾP -->
    <div class="pt-3 border-t border-slate-800 text-center space-y-3">
      <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">🎙️ Luyện Phát Âm Trực Tiếp & Nhận Xét</h4>
      
      <div class="flex items-center justify-center gap-3">
        <button id="pinyin-mic-btn" onclick="togglePinyinRecording()" class="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
        </button>
      </div>

      <p id="pinyin-mic-status" class="text-xs font-semibold text-slate-400">Bấm nút đỏ để đọc: <span class="text-white font-bold font-mono text-sm">"${item.key}"</span></p>

      <!-- Hộp kết quả nhận diện & sửa lỗi -->
      <div id="pinyin-eval-result" class="hidden text-left p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <!-- Render động qua JS -->
      </div>
    </div>
  `;
}

/**
 * Phát âm mẫu cho Pinyin
 */
function playPinyinSound(text) {
  if (!text) return;
  // Sử dụng Web Speech Synthesis với lang zh-CN
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  }
}

/**
 * Bật / Tắt Ghi âm Pinyin
 */
function togglePinyinRecording() {
  if (pinyinIsRecording) {
    stopPinyinRecording(true);
  } else {
    startPinyinRecording();
  }
}

/**
 * Bắt đầu ghi âm Pinyin
 */
async function startPinyinRecording() {
  pinyinLastSpoken = "";
  pinyinAudioChunks = [];
  const statusEl = document.getElementById('pinyin-mic-status');
  const micBtn = document.getElementById('pinyin-mic-btn');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    pinyinMediaRecorder = new MediaRecorder(stream);
    pinyinMediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) pinyinAudioChunks.push(e.data);
    };
    pinyinMediaRecorder.onstop = () => {
      pinyinUserAudioBlob = new Blob(pinyinAudioChunks, { type: 'audio/webm' });
      pinyinUserAudioUrl = URL.createObjectURL(pinyinUserAudioBlob);
      stream.getTracks().forEach(t => t.stop());
    };
    pinyinMediaRecorder.start();
    pinyinIsRecording = true;

    if (micBtn) micBtn.className = "w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.8)] animate-pulse ring-4 ring-rose-400/50";
    if (statusEl) statusEl.innerHTML = `<span class="text-rose-400 font-bold animate-pulse">● Đang lắng nghe... Hãy phát âm "${pinyinActiveItem.key}"</span>`;

    startPinyinRecognition();

  } catch (err) {
    pinyinIsRecording = true;
    if (micBtn) micBtn.className = "w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.8)] animate-pulse ring-4 ring-rose-400/50";
    if (statusEl) statusEl.innerHTML = `<span class="text-rose-400 font-bold animate-pulse">● Đang lắng nghe... Hãy phát âm "${pinyinActiveItem.key}"</span>`;
    startPinyinRecognition();
  }
}

/**
 * Khởi động nhận dạng giọng nói zh-CN cho Pinyin
 */
function startPinyinRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("⚠️ Trình duyệt chưa hỗ trợ Web Speech API.");
    return;
  }

  try {
    if (pinyinRecognition) {
      try { pinyinRecognition.abort(); } catch (e) {}
    }

    pinyinRecognition = new SpeechRecognition();
    pinyinRecognition.lang = 'zh-CN';
    pinyinRecognition.continuous = true;
    pinyinRecognition.interimResults = true;

    pinyinRecognition.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          pinyinLastSpoken += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }

      const spoken = (pinyinLastSpoken || interim).trim();
      const statusEl = document.getElementById('pinyin-mic-status');
      if (statusEl && spoken) {
        statusEl.innerHTML = `<span class="text-cyan-400 font-bold">Bạn đang đọc: "${spoken}"</span>`;
      }

      // Tự động dừng sau 1.2s
      clearTimeout(pinyinSilenceTimer);
      pinyinSilenceTimer = setTimeout(() => {
        if (pinyinIsRecording && spoken) {
          pinyinLastSpoken = spoken;
          stopPinyinRecording(true);
        }
      }, 1200);
    };

    pinyinRecognition.onend = () => {
      if (pinyinIsRecording) stopPinyinRecording(true);
    };

    pinyinRecognition.start();
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Dừng ghi âm & Chấm điểm sửa lỗi Pinyin
 */
function stopPinyinRecording(evaluate = true) {
  if (!pinyinIsRecording) return;
  pinyinIsRecording = false;
  clearTimeout(pinyinSilenceTimer);

  const micBtn = document.getElementById('pinyin-mic-btn');
  if (micBtn) micBtn.className = "w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95";

  if (pinyinMediaRecorder && pinyinMediaRecorder.state !== 'inactive') {
    try { pinyinMediaRecorder.stop(); } catch (e) {}
  }
  if (pinyinRecognition) {
    try { pinyinRecognition.stop(); } catch (e) {}
  }

  if (evaluate) {
    evaluatePinyinResult(pinyinLastSpoken.trim());
  }
}

/**
 * Đánh giá & Chẩn đoán lỗi phát âm cho mục Pinyin (Thanh mẫu, Vận mẫu, Ghép vần)
 * Tích hợp đối chiếu bộ phiên âm chuẩn và biến thể chữ Hán
 */
function evaluatePinyinResult(spokenText) {
  const resultBox = document.getElementById('pinyin-eval-result');
  const statusEl = document.getElementById('pinyin-mic-status');
  if (!resultBox) return;

  resultBox.classList.remove('hidden');

  if (!spokenText) {
    if (statusEl) statusEl.textContent = "Nhấn nút đỏ để bắt đầu đọc lại";
    resultBox.innerHTML = `
      <div class="text-rose-400 font-bold flex items-center gap-1.5 text-xs">
        <span>❌</span> Không nhận diện được âm thanh. Bạn hãy nói to và rõ ràng hơn nhé!
      </div>
    `;
    return;
  }

  // Tra cứu Pinyin của chữ người dùng đọc
  const spokenPinyinList = window.hanziToPinyinList ? window.hanziToPinyinList(spokenText) : [];
  const spokenPinyinStr = spokenPinyinList.map(s => s.pinyin).join(' ') || spokenText;
  const targetKey = pinyinActiveItem.key;
  const targetType = pinyinActiveItem.type;

  let isCorrect = false;
  let matchReason = "";

  // 1. Nếu là Thanh mẫu (Initial)
  if (targetType === 'initial') {
    const initMap = window.PINYIN_INITIALS_MAP ? window.PINYIN_INITIALS_MAP[targetKey] : null;
    if (initMap) {
      // Kiểm tra chữ Hán đại diện (vd: bō -> 波, 玻)
      const hasHanzi = initMap.hanzi.some(h => spokenText.includes(h));
      // Kiểm tra biến thể pinyin
      const hasVariant = initMap.variants.some(v => spokenPinyinStr.toLowerCase().includes(v) || spokenText.toLowerCase().includes(v));
      if (hasHanzi || hasVariant || spokenText.includes(targetKey)) {
        isCorrect = true;
        matchReason = `Bạn đã phát âm chuẩn thanh mẫu <b>${targetKey}</b> (${initMap.pinyin}).`;
      }
    }
  } 
  // 2. Nếu là Vận mẫu (Final)
  else if (targetType === 'final') {
    const finalMap = window.PINYIN_FINALS_MAP ? window.PINYIN_FINALS_MAP[targetKey] : null;
    if (finalMap) {
      const hasHanzi = finalMap.hanzi.some(h => spokenText.includes(h));
      const hasVariant = finalMap.variants.some(v => spokenPinyinStr.toLowerCase().includes(v) || spokenText.toLowerCase().includes(v));
      if (hasHanzi || hasVariant || spokenText.includes(targetKey)) {
        isCorrect = true;
        matchReason = `Bạn đã phát âm chuẩn vận mẫu <b>${targetKey}</b>.`;
      }
    }
  } 
  // 3. Nếu là Ghép vần (Spelling) hoặc Thanh điệu (Tone)
  else {
    const targetClean = window.stripPinyinTone ? window.stripPinyinTone(targetKey) : targetKey.toLowerCase();
    const spokenClean = window.stripPinyinTone ? window.stripPinyinTone(spokenPinyinStr) : spokenPinyinStr.toLowerCase();

    if (spokenText.includes(targetKey) || spokenClean.includes(targetClean)) {
      isCorrect = true;
      matchReason = `Bạn đã phát âm chuẩn xác âm ghép <b>${targetKey}</b>.`;
    }
  }

  // Nếu vẫn chưa khớp, tính độ tương đồng Levenshtein
  if (!isCorrect && window.calcStringSimilarity) {
    const targetSim = window.stripPinyinTone ? window.stripPinyinTone(targetKey) : targetKey;
    const spokenSim = window.stripPinyinTone ? window.stripPinyinTone(spokenPinyinStr) : spokenPinyinStr;
    const simScore = window.calcStringSimilarity(targetSim, spokenSim);
    if (simScore >= 0.75) {
      isCorrect = true;
      matchReason = `Phát âm rất gần chuẩn xác (đạt ${(simScore * 100).toFixed(0)}% tương đồng)!`;
    }
  }

  let evalHtml = `
    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-300">Kết quả của bạn:</span>
        <span class="text-sm font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} font-mono">${spokenText} [${spokenPinyinStr}]</span>
      </div>
      <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}">
        ${isCorrect ? 'Đạt chuẩn 100%' : 'Chưa chuẩn'}
      </span>
    </div>

    <div class="text-[11.5px] leading-relaxed text-slate-300 pt-1">
  `;

  if (isCorrect) {
    evalHtml += `
      <p class="text-emerald-400 font-bold flex items-center gap-1">
        <span>🎉</span> ${matchReason || `Bạn phát âm rất chuẩn xác âm <b>"${targetKey}"</b>! Khẩu hình và luồng khí đã đạt chuẩn.`}
      </p>
    `;
  } else {
    evalHtml += `
      <p class="text-rose-400 font-bold flex items-center gap-1">
        <span>⚠️</span> Phát âm chưa khớp với mục tiêu <b>"${targetKey}"</b>:
      </p>
      <p class="mt-1 text-slate-300">
        Hệ thống nghe được bạn đọc thành: <code>${spokenText} [${spokenPinyinStr}]</code>. Hãy xem lại hướng dẫn vị trí đặt lưỡi ở phía trên và nghe mẫu để điều chỉnh lại nhé!
      </p>
    `;
  }

  evalHtml += `</div>`;
  resultBox.innerHTML = evalHtml;
  if (statusEl) statusEl.textContent = "Đã hoàn thành đánh giá. Nhấn mic để thử lại!";
}
