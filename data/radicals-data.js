/**
 * Dữ liệu Phân tích Cấu tạo Chữ Hán, Cây Chiết Tự, Mẹo Nhớ, Chữ Liên Quan (Ảnh 4)
 * và Cây Phân Tích Nét Bút Thuận / Bộ Thủ Trong Modal Tập Viết (Ảnh 3)
 */

window.RADICALS_DATABASE = {
  "你": {
    char: "你",
    pinyin: "nǐ",
    meaning: "bạn, anh, chị, ông, bà",
    strokes: 7,
    stroke_tree: {
      name: "你",
      children: [
        {
          name: "亻",
          label: "Nhân",
          children: [
            { name: "ノ" },
            { name: "丨", label: "Cổn" }
          ]
        },
        {
          name: "尔",
          children: [
            { name: "⺈" },
            {
              name: "小",
              label: "Tiểu",
              children: [
                { name: "亅", label: "Quyết" },
                { name: "八", label: "Bát" }
              ]
            }
          ]
        }
      ]
    },
    components: [
      {
        bo: "亻",
        ten_bo: "Bộ Nhân (đứng)",
        nghia_bo: "Người (nằm bên trái)",
        is_primary: true
      },
      {
        bo: "尔",
        ten_bo: "Nhĩ",
        nghia_bo: "Ngươi, anh/chị (nằm bên phải)",
        is_primary: false
      }
    ],
    mnemonic: "Một người ( <span class='text-red-400 font-bold'>亻</span> ) đứng đối diện, chỉ tay gọi ngươi ( <span class='text-red-400 font-bold'>尔</span> ), người ở phía bên kia chính là bạn <span class='text-red-400 font-bold'>你</span>.",
    radical_compounds: {
      "亻": [
        { id: 1, char: "你", pinyin: "nǐ", meaning: "bạn, anh, chị, ông, bà", strokes: 7, image_10: "assets/images/vocab10_1_你_1773157032852.webp" },
        { id: 23, char: "他", pinyin: "tā", meaning: "anh ấy, cậu ấy, ông ấy", strokes: 5, image_10: "assets/images/vocab10_23_他_1773157216555.webp" },
        { id: 44, char: "信", pinyin: "xìn", meaning: "thư, bức thư; tin, tin tưởng", strokes: 9, image_10: "assets/images/vocab10_44_信_1773157410157.webp" },
        { id: 200, char: "住", pinyin: "zhù", meaning: "ở, sống, cư trú", strokes: 7, image_10: "assets/images/vocab10_200_住_1773158808390.webp" },
        { id: 216, char: "位", pinyin: "wèi", meaning: "vị, ngài (lượng từ lịch sự cho người)", strokes: 7, image_10: "assets/images/vocab10_216_位_1773159404037.webp" },
        { id: 259, char: "件", pinyin: "jiàn", meaning: "Cái, chiếc, mảnh, việc...(Đơn vị đếm cho trang phục, vật dụng, sự việc)", strokes: 6, image_10: "assets/images/vocab10_259_件_1773159662861.webp" },
        { id: 299, char: "做", pinyin: "zuò", meaning: "làm, nấu (cơm)", strokes: 11, image_10: "assets/images/vocab10_299_做_1773159905638.webp" },
        { id: 317, char: "借", pinyin: "jiè", meaning: "mượn, cho mượn", strokes: 10, image_10: "assets/images/vocab10_317_借_1773160013405.webp" },
        { id: 369, char: "份", pinyin: "fèn", meaning: "phần, suất, tờ (lượng từ cho báo, tài liệu)", strokes: 6, image_10: "assets/images/vocab10_369_份_1773160326047.webp" },
        { id: 455, char: "们", pinyin: "men", meaning: "chúng (hậu tố số nhiều)", strokes: 5, image_10: "assets/images/vocab10_455_们_1773160845794.webp" }
      ],
      "尔": [
        { id: 1, char: "你", pinyin: "nǐ", meaning: "bạn, anh, chị", strokes: 7, image_10: "assets/images/vocab10_1_你_1773157032852.webp" },
        { id: 2, char: "迩", pinyin: "ěr", meaning: "gần, thân cận", strokes: 8 },
        { id: 3, char: "祢", pinyin: "mí", meaning: "đền thờ tổ phụ", strokes: 9 }
      ]
    }
  },
  "好": {
    char: "好",
    pinyin: "hǎo",
    meaning: "tốt, khỏe, hay, được",
    strokes: 6,
    stroke_tree: {
      name: "好",
      children: [
        {
          name: "女",
          label: "Nữ",
          children: [
            { name: "㇛" },
            {
              name: "丆",
              children: [
                { name: "一" },
                { name: "丿" }
              ]
            }
          ]
        },
        {
          name: "子",
          label: "Tử",
          children: [
            {
              name: "了",
              children: [
                { name: "㇇" },
                { name: "亅" }
              ]
            },
            { name: "一" }
          ]
        }
      ]
    },
    components: [
      {
        bo: "女",
        ten_bo: "Bộ Nữ",
        nghia_bo: "Phụ nữ, con gái (nằm bên trái)",
        is_primary: true
      },
      {
        bo: "子",
        ten_bo: "Bộ Tử",
        nghia_bo: "Đứa trẻ, con trai (nằm bên phải)",
        is_primary: false
      }
    ],
    mnemonic: "Một gia đình có đủ cả con gái ( <span class='text-red-400 font-bold'>女</span> ) và con trai ( <span class='text-red-400 font-bold'>子</span> ) là một điều vô cùng tốt đẹp <span class='text-red-400 font-bold'>好</span> và viên mãn.",
    radical_compounds: {
      "女": [
        { id: 2, char: "好", pinyin: "hǎo", meaning: "tốt, đẹp, khỏe", strokes: 6, image_10: "assets/images/vocab10_2_好_1773157041991.webp" },
        { id: 24, char: "她", pinyin: "tā", meaning: "cô ấy, bà ấy", strokes: 6, image_10: "assets/images/vocab10_24_她_1773157225707.webp" },
        { id: 25, char: "妈", pinyin: "mā", meaning: "mẹ", strokes: 6 },
        { id: 26, char: "妹", pinyin: "mèi", meaning: "em gái", strokes: 8 },
        { id: 27, char: "姐", pinyin: "jiě", meaning: "chị gái", strokes: 8 },
        { id: 28, char: "奶", pinyin: "nǎi", meaning: "bà nội, sữa", strokes: 5 },
        { id: 29, char: "姓", pinyin: "xìng", meaning: "họ", strokes: 8 }
      ],
      "子": [
        { id: 2, char: "好", pinyin: "hǎo", meaning: "tốt, đẹp", strokes: 6, image_10: "assets/images/vocab10_2_好_1773157041991.webp" },
        { id: 1130, char: "字", pinyin: "zì", meaning: "chữ, chữ Hán", strokes: 6, image_10: "assets/images/vocab10_1130_字_1773164878727.webp" },
        { id: 29, char: "学", pinyin: "xué", meaning: "học tập", strokes: 8 },
        { id: 30, char: "孩", pinyin: "hái", meaning: "đứa trẻ", strokes: 9 }
      ]
    }
  },
  "们": {
    char: "们",
    pinyin: "men",
    meaning: "số nhiều (người)",
    strokes: 5,
    stroke_tree: {
      name: "们",
      children: [
        {
          name: "亻",
          label: "Nhân",
          children: [
            { name: "ノ" },
            { name: "丨", label: "Cổn" }
          ]
        },
        {
          name: "门",
          label: "Môn",
          children: [
            { name: "丶" },
            { name: "丨" },
            { name: "𠃌" }
          ]
        }
      ]
    },
    components: [
      {
        bo: "亻",
        ten_bo: "Bộ Nhân (đứng)",
        nghia_bo: "Người (nằm bên trái)",
        is_primary: true
      },
      {
        bo: "门",
        ten_bo: "Bộ Môn",
        nghia_bo: "Cánh cửa (nằm bên phải)",
        is_primary: false
      }
    ],
    mnemonic: "Nhiều người ( <span class='text-red-400 font-bold'>亻</span> ) cùng đứng trước cánh cửa ( <span class='text-red-400 font-bold'>门</span> ) tụ họp lại biểu thị số nhiều chúng tôi, các bạn <span class='text-red-400 font-bold'>们</span>.",
    radical_compounds: {
      "亻": [
        { id: 1, char: "你", pinyin: "nǐ", meaning: "bạn, anh, chị, ông, bà", strokes: 7, image_10: "assets/images/vocab10_1_你_1773157032852.webp" },
        { id: 23, char: "他", pinyin: "tā", meaning: "anh ấy, cậu ấy, ông ấy", strokes: 5, image_10: "assets/images/vocab10_23_他_1773157216555.webp" },
        { id: 44, char: "信", pinyin: "xìn", meaning: "thư, bức thư; tin, tin tưởng", strokes: 9, image_10: "assets/images/vocab10_44_信_1773157410157.webp" },
        { id: 200, char: "住", pinyin: "zhù", meaning: "ở, sống, cư trú", strokes: 7, image_10: "assets/images/vocab10_200_住_1773158808390.webp" },
        { id: 216, char: "位", pinyin: "wèi", meaning: "vị, ngài (lượng từ lịch sự cho người)", strokes: 7, image_10: "assets/images/vocab10_216_位_1773159404037.webp" },
        { id: 259, char: "件", pinyin: "jiàn", meaning: "Cái, chiếc, mảnh, việc...", strokes: 6, image_10: "assets/images/vocab10_259_件_1773159662861.webp" },
        { id: 299, char: "做", pinyin: "zuò", meaning: "làm, nấu (cơm)", strokes: 11, image_10: "assets/images/vocab10_299_做_1773159905638.webp" },
        { id: 317, char: "借", pinyin: "jiè", meaning: "mượn, cho mượn", strokes: 10, image_10: "assets/images/vocab10_317_借_1773160013405.webp" },
        { id: 369, char: "份", pinyin: "fèn", meaning: "phần, suất, tờ", strokes: 6, image_10: "assets/images/vocab10_369_份_1773160326047.webp" },
        { id: 455, char: "们", pinyin: "men", meaning: "chúng (hậu tố số nhiều)", strokes: 5, image_10: "assets/images/vocab10_455_们_1773160845794.webp" }
      ]
    }
  },
  "您": {
    char: "您",
    pinyin: "nín",
    meaning: "ngài, ông, bà (kính ngữ)",
    strokes: 11,
    stroke_tree: {
      name: "您",
      children: [
        {
          name: "你",
          label: "Nhĩ",
          children: [
            { name: "亻", label: "Nhân" },
            { name: "尔" }
          ]
        },
        {
          name: "心",
          label: "Tâm",
          children: [
            { name: "丶" },
            { name: "乚" },
            { name: "丶" },
            { name: "丶" }
          ]
        }
      ]
    },
    components: [
      {
        bo: "你",
        ten_bo: "Chữ Nhĩ (Bạn)",
        nghia_bo: "Người đối diện (ở phía trên)",
        is_primary: false
      },
      {
        bo: "心",
        ten_bo: "Bộ Tâm",
        nghia_bo: "Trái tim, tấm lòng (ở phía dưới)",
        is_primary: true
      }
    ],
    mnemonic: "Đặt bạn ( <span class='text-red-400 font-bold'>你</span> ) lên trên trái tim ( <span class='text-red-400 font-bold'>心</span> ) của mình để thể hiện sự tôn trọng, kính cẩn đối với ngài, ông, bà <span class='text-red-400 font-bold'>您</span>.",
    radical_compounds: {
      "心": [
        { id: 1, char: "您", pinyin: "nín", meaning: "ngài (kính ngữ)", strokes: 11 },
        { id: 2, char: "想", pinyin: "xiǎng", meaning: "nghĩ, nhớ, muốn", strokes: 13 },
        { id: 3, char: "感", pinyin: "gǎn", meaning: "cảm giác, cảm động", strokes: 13 },
        { id: 4, char: "意", pinyin: "yì", meaning: "ý nghĩa, ý định", strokes: 13 }
      ]
    }
  }
};
