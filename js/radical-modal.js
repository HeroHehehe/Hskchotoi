/**
 * Phân tích Cấu tạo Chữ Hán, Cây Chiết Tự, Lưới 10 Thẻ Chữ Liên Quan (Ảnh 4)
 * & Modal Cây Phân Tích Thành Phần Nét Bút Thuận / Bộ Thủ Trong Tập Viết (Ảnh 3)
 */

let activeRadicalWord = null;
let activeRadicalChar = null;
let selectedRadicalFilter = null;

/**
 * Mở Modal Phân tích Cấu tạo Chữ Hán (Ảnh 4)
 */
function openRadicalModal(wordId, targetChar = null) {
  const word = window.VOCAB_DATABASE.find(w => w.id === wordId);
  if (!word) return;
  activeRadicalWord = word;

  const modal = document.getElementById('radical-modal');
  modal.classList.remove('hidden');

  document.getElementById('radical-word-tag').textContent = word.hanzi;

  // Tabs chọn chữ (ví dụ: [ 你 ] [ 好 ])
  const charTabs = document.getElementById('radical-char-tabs');
  charTabs.innerHTML = '';
  const chars = word.chars || Array.from(word.hanzi);
  const initialChar = (targetChar && chars.includes(targetChar)) ? targetChar : chars[0];

  chars.forEach(c => {
    const btn = document.createElement('button');
    btn.className = `px-4 py-1.5 rounded-lg text-lg font-bold chinese-font border transition-all ${
      c === initialChar
        ? 'bg-red-600 text-white border-red-500 shadow-md'
        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
    }`;
    btn.textContent = c;
    btn.onclick = () => renderRadicalAnalysis(c);
    charTabs.appendChild(btn);
  });

  renderRadicalAnalysis(initialChar);
}

/**
 * Đóng Modal Phân tích Cấu tạo
 */
function closeRadicalModal() {
  const modal = document.getElementById('radical-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Render chi tiết phân tích của chữ Hán
 */
function renderRadicalAnalysis(char) {
  activeRadicalChar = char;

  // Highlight tab
  const tabs = document.querySelectorAll('#radical-char-tabs button');
  tabs.forEach(t => {
    if (t.textContent === char) {
      t.className = 'px-4 py-1.5 rounded-lg text-lg font-bold chinese-font border bg-red-600 text-white border-red-500 shadow-md';
    } else {
      t.className = 'px-4 py-1.5 rounded-lg text-lg font-bold chinese-font border bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white';
    }
  });

  const radData = window.RADICALS_DATABASE[char] || {
    char: char,
    pinyin: activeRadicalWord.pinyin,
    meaning: activeRadicalWord.meaning,
    strokes: 7,
    components: [
      { bo: char, ten_bo: `Chữ ${char}`, nghia_bo: activeRadicalWord.meaning, is_primary: true }
    ],
    mnemonic: `Chữ ${char} là một chữ cơ bản quan trọng trong HSK 3.0.`,
    radical_compounds: {}
  };

  // 1. Render Cây Chiết Tự (Tree)
  renderDecompositionTree(radData);

  // 2. Render Mẹo Nhớ Chữ (Mnemonic)
  const mnemonicBox = document.getElementById('radical-mnemonic');
  mnemonicBox.innerHTML = radData.mnemonic;

  // 3. Render Bộ lọc & Danh sách chữ liên quan (Radical Compounds)
  const defaultRadical = radData.components[0] ? radData.components[0].bo : Object.keys(radData.radical_compounds || {})[0];
  selectedRadicalFilter = defaultRadical;
  renderCompoundsSection(radData, selectedRadicalFilter);
}

/**
 * Render Cây Chiết Tự (Thẻ gốc màu đỏ bên trái, các nhánh bộ thủ bên phải)
 */
function renderDecompositionTree(data) {
  const rootNode = document.getElementById('tree-root-card');
  const branchesContainer = document.getElementById('tree-branches-list');

  // Thẻ cha (Root card - Màu đỏ nổi bật như Ảnh 4)
  rootNode.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-red-600 to-rose-700 rounded-2xl shadow-xl w-36 h-36 border border-rose-500/50 relative group flex-shrink-0">
      <span class="text-5xl font-black text-white chinese-font drop-shadow-md mb-1">${data.char}</span>
      <div class="flex items-center gap-1.5 text-rose-100 font-semibold text-sm">
        <span>${data.pinyin}</span>
        <button onclick="speakChinese('${data.char}')" title="Nghe phát âm" class="hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </button>
      </div>
      <span class="text-xs text-rose-200 text-center truncate max-w-full px-1 mt-0.5">${data.meaning}</span>
    </div>
  `;

  // Các thẻ con (Components cards)
  branchesContainer.innerHTML = '';
  data.components.forEach((comp) => {
    const isSelected = (comp.bo === selectedRadicalFilter);
    const item = document.createElement('div');
    item.className = `flex items-center gap-4 p-3.5 rounded-xl border transition-all cursor-pointer ${
      isSelected
        ? 'bg-slate-900/90 border-red-500 ring-1 ring-red-500/50'
        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
    }`;
    item.onclick = () => {
      selectedRadicalFilter = comp.bo;
      renderDecompositionTree(data);
      renderCompoundsSection(data, comp.bo);
    };

    item.innerHTML = `
      <div class="w-12 h-12 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center flex-shrink-0">
        <span class="text-2xl font-bold text-amber-300 chinese-font">${comp.bo}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5">
          <span class="text-white font-bold text-sm">${comp.ten_bo}</span>
          ${isSelected ? `<span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-600 text-white leading-none">Đang xem</span>` : ''}
        </div>
        <div class="text-xs text-slate-400 truncate">${comp.nghia_bo}</div>
      </div>
    `;

    branchesContainer.appendChild(item);
  });
}

/**
 * Render Danh sách chữ Hán liên quan chứa bộ thủ (Lưới 10 Thẻ - Ảnh 4)
 */
function renderCompoundsSection(data, radicalChar) {
  const labelEl = document.getElementById('compounds-title-label');
  const comp = data.components.find(c => c.bo === radicalChar) || { ten_bo: `Bộ ${radicalChar}` };
  labelEl.innerHTML = `<span class="text-amber-300 chinese-font text-lg font-bold">${radicalChar}</span> <span class="text-slate-300 font-semibold text-sm">(${comp.ten_bo})</span>`;

  // Render Filter Toggle Pills
  const filterContainer = document.getElementById('compounds-filter-pills');
  filterContainer.innerHTML = '';

  data.components.forEach(c => {
    const btn = document.createElement('button');
    const isAct = (c.bo === radicalChar);
    btn.className = `px-3 py-1 rounded-full text-xs font-semibold transition-all ${
      isAct 
        ? 'bg-red-600 text-white shadow' 
        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
    }`;
    btn.innerHTML = `<span class="chinese-font">${c.bo}</span> (${c.ten_bo})`;
    btn.onclick = () => {
      selectedRadicalFilter = c.bo;
      renderDecompositionTree(data);
      renderCompoundsSection(data, c.bo);
    };
    filterContainer.appendChild(btn);
  });

  // Render Grid Cards (10 Thẻ chia làm 2 hàng x 5 cột - Ảnh 4)
  const grid = document.getElementById('compounds-grid');
  grid.innerHTML = '';

  const list = (data.radical_compounds && data.radical_compounds[radicalChar]) || [];

  if (list.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-8 text-center text-slate-500 text-sm">Chưa có dữ liệu từ liên quan cho bộ thủ này.</div>`;
    return;
  }

  list.forEach(item => {
    const card = document.createElement('div');
    const isCurrentActive = (item.char === data.char);

    card.className = `flex flex-col items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border transition-all cursor-pointer group hover:-translate-y-1 ${
      isCurrentActive
        ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50'
        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850'
    }`;

    // Nút phát âm khi click
    card.onclick = () => {
      speakChinese(item.char);
    };

    // Khung ảnh hoặc chữ Hán nổi bật nét bộ thủ màu đỏ (Ảnh 4)
    let charVisualHtml = '';
    if (item.image_10) {
      charVisualHtml = `<img src="${item.image_10}" alt="${item.char}" class="w-16 h-16 rounded-xl object-contain p-1 group-hover:scale-105 transition-transform" />`;
    } else {
      charVisualHtml = `
        <div class="w-16 h-16 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-center mb-1 group-hover:border-slate-700 transition-colors">
          <span class="text-3xl font-extrabold text-white chinese-font">${item.char}</span>
        </div>
      `;
    }

    card.innerHTML = `
      <span class="text-xs text-rose-400 font-bold mb-1.5 group-hover:text-rose-300">${item.pinyin}</span>
      <div class="w-16 h-16 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-2 shadow-inner group-hover:border-slate-700 transition-colors">
        ${charVisualHtml}
      </div>
      <span class="text-[11px] text-slate-300 font-medium text-center line-clamp-2 h-7 px-1 mb-2 leading-tight">${item.meaning}</span>
      <div class="w-full flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">${item.strokes} nét</span>
        <button onclick="event.stopPropagation(); closeRadicalModal(); openWritingModal(${activeRadicalWord.id}, '${item.char}');" title="Tập viết chữ này" class="text-slate-500 hover:text-cyan-400 transition-colors p-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * ==============================================================
 * PHẦN 2: CÂY PHÂN TÍCH THÀNH PHẦN NÉT TRONG MODAL TẬP VIẾT (Ảnh 3)
 * ==============================================================
 */

/**
 * Mở Popup Phân tích cây thành phần nét (Ảnh 3)
 * @param {string} char Ký tự chữ Hán (ví dụ: '你', '好')
 */
function openStrokeTreeModal(char = null) {
  const targetChar = char || (window.currentChar || '你');
  const modal = document.getElementById('stroke-tree-modal');
  if (!modal) return;
  modal.classList.remove('hidden');

  document.getElementById('stroke-tree-char-title').textContent = targetChar;

  // Lấy dữ liệu cây phân tích từ RADICALS_DATABASE hoặc fallback
  const charData = window.RADICALS_DATABASE[targetChar];
  let treeData = charData ? charData.stroke_tree : null;

  if (!treeData) {
    // Cây mẫu mặc định nếu chưa có cấu hình chi tiết
    treeData = {
      name: targetChar,
      children: [
        { name: "Bộ 1", label: "Bộ chính", children: [{ name: "Nét 1" }, { name: "Nét 2" }] },
        { name: "Bộ 2", label: "Bộ phụ", children: [{ name: "Nét 3" }, { name: "Nét 4" }] }
      ]
    };
  }

  renderSvgStrokeTree(treeData);
}

/**
 * Đóng Popup Phân tích cây thành phần
 */
function closeStrokeTreeModal() {
  const modal = document.getElementById('stroke-tree-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Vẽ Cây Phân Tích bằng SVG (Nodes hình tròn + Đường nối chéo - Chuẩn Ảnh 3)
 */
function renderSvgStrokeTree(treeData) {
  const container = document.getElementById('stroke-tree-canvas');
  if (!container) return;

  const width = 420;
  const height = 480;

  // Tọa độ cấu hình cố định chuẩn xác theo Ảnh 3
  // Root: 你 (210, 60)
  // Level 1: 亻(140, 150), 尔 (280, 150)
  // Level 2: ノ (90, 240), 丨(180, 240), ⺈ (240, 240), 小 (320, 240)
  // Level 3: 亅 (280, 340), 八 (360, 340)

  let svgContent = '';

  if (treeData.name === '你') {
    // Các đường nối
    const lines = [
      [210, 60, 140, 150], // 你 -> 亻
      [210, 60, 280, 150], // 你 -> 尔
      [140, 150, 90, 240], // 亻 -> ノ
      [140, 150, 180, 240], // 亻 -> 丨
      [280, 150, 240, 240], // 尔 -> ⺈
      [280, 150, 320, 240], // 尔 -> 小
      [320, 240, 280, 340], // 小 -> 亅
      [320, 240, 360, 340]  // 小 -> 八
    ];

    lines.forEach(([x1, y1, x2, y2]) => {
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#64748b" stroke-width="2.5" />`;
    });

    // Các node tròn
    const nodes = [
      { x: 210, y: 60, char: "你", label: "", isRoot: true, r: 28 },
      { x: 140, y: 150, char: "亻", label: "Nhân", r: 24 },
      { x: 280, y: 150, char: "尔", label: "", r: 24 },
      { x: 90, y: 240, char: "ノ", label: "", r: 24 },
      { x: 180, y: 240, char: "丨", label: "Cổn", r: 24 },
      { x: 240, y: 240, char: "⺈", label: "", r: 24 },
      { x: 320, y: 240, char: "小", label: "Tiểu", r: 24 },
      { x: 280, y: 340, char: "亅", label: "Quyết", r: 24 },
      { x: 360, y: 340, char: "八", label: "Bát", r: 24 }
    ];

    nodes.forEach(n => {
      if (n.isRoot) {
        // Node gốc màu xanh dương nổi bật (Ảnh 3)
        svgContent += `
          <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="#3b82f6" stroke="#60a5fa" stroke-width="3" filter="drop-shadow(0 0 10px rgba(59,130,246,0.5))" />
          <text x="${n.x}" y="${n.y + 7}" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="900" font-family="'Noto Sans SC', sans-serif">${n.char}</text>
        `;
      } else {
        // Node con màu trắng viền xanh nhạt
        svgContent += `
          <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="#ffffff" stroke="#93c5fd" stroke-width="2.5" />
          <text x="${n.x}" y="${n.y + 6}" text-anchor="middle" fill="#0f172a" font-size="20" font-weight="800" font-family="'Noto Sans SC', sans-serif">${n.char}</text>
        `;
        if (n.label) {
          svgContent += `
            <text x="${n.x}" y="${n.y + 18}" text-anchor="middle" fill="#2563eb" font-size="9" font-weight="bold">${n.label}</text>
          `;
        }
      }
    });

  } else {
    // Vẽ cây tự động cho các chữ khác (như 好, 们...)
    const rootX = 210;
    const rootY = 70;
    svgContent += `
      <circle cx="${rootX}" cy="${rootY}" r="28" fill="#3b82f6" stroke="#60a5fa" stroke-width="3" />
      <text x="${rootX}" y="${rootY + 7}" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="900" font-family="'Noto Sans SC', sans-serif">${treeData.name}</text>
    `;

    if (treeData.children) {
      const count = treeData.children.length;
      treeData.children.forEach((c, idx) => {
        const cx = count === 1 ? rootX : (idx === 0 ? 140 : 280);
        const cy = 170;
        svgContent += `
          <line x1="${rootX}" y1="${rootY}" x2="${cx}" y2="${cy}" stroke="#64748b" stroke-width="2.5" />
          <circle cx="${cx}" cy="${cy}" r="24" fill="#ffffff" stroke="#93c5fd" stroke-width="2.5" />
          <text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="#0f172a" font-size="18" font-weight="800" font-family="'Noto Sans SC', sans-serif">${c.name}</text>
        `;
        if (c.label) {
          svgContent += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" fill="#2563eb" font-size="9" font-weight="bold">${c.label}</text>`;
        }
      });
    }
  }

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full max-h-[460px]">
      ${svgContent}
    </svg>
  `;
}
