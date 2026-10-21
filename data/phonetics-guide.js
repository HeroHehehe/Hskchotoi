/**
 * Dữ liệu bách khoa hướng dẫn phát âm, khẩu hình miệng, vị trí đặt lưỡi (Phonetics Guide)
 * Dành riêng cho người Việt học tiếng Trung HSK 3.0
 */

window.CHINESE_PHONETICS_GUIDE = {
  // --- BẢNG THANH MẪU (Phụ âm đầu) ---
  initials: {
    'b': { name: 'b', ipa: '[p]', tongue: 'Hai môi khép chặt, cản luồng khí rồi mở nhanh bật ra nhẹ nhàng, KHÔNG bật hơi. Giống âm "p" nhẹ tiếng Việt nhưng không rung dây thanh.' },
    'p': { name: 'p', ipa: '[pʰ]', tongue: 'Hai môi khép chặt, bật mở mạnh để LUỒNG KHÍ BẬT MẠNH RA NGOÀI (bật hơi). Đặt tờ giấy trước miệng tờ giấy phải bay mạnh.' },
    'm': { name: 'm', ipa: '[m]', tongue: 'Hai môi khép lại, luồng hơi thoát ra theo khoang mũi, dây thanh rung. Giống âm "m" tiếng Việt.' },
    'f': { name: 'f', ipa: '[f]', tongue: 'Răng trên chạm nhẹ môi dưới, hơi ma sát thoát qua kẽ răng. Giống âm "ph" tiếng Việt.' },
    'd': { name: 'd', ipa: '[t]', tongue: 'Đầu lưỡi dính chặt vào chân răng trên (nướu trên), chặn khí rồi hạ lưỡi xuống bật âm ra, KHÔNG bật hơi. Đọc gần như âm "t" tiếng Việt.' },
    't': { name: 't', ipa: '[tʰ]', tongue: 'Vị trí giống âm "d" (đầu lưỡi chạm nướu trên), nhưng BẬT HƠI CỰC MẠNH khi hạ lưỡi. Đọc tựa âm "th" tiếng Việt nhưng bật mạnh hơn.' },
    'n': { name: 'n', ipa: '[n]', tongue: 'Đầu lưỡi áp vào chân răng trên, hơi thoát qua mũi. Giống âm "n" tiếng Việt.' },
    'l': { name: 'l', ipa: '[l]', tongue: 'Đầu lưỡi chạm vào nướu trên, luồng khí thoát ra hai bên mép lưỡi. Giống âm "l" tiếng Việt.' },
    'g': { name: 'g', ipa: '[k]', tongue: 'Gốc lưỡi (cuống lưỡi) nâng lên chạm ngạc mềm, chặn hơi rồi hạ nhanh xuống, KHÔNG bật hơi. Gần giống âm "c / k" trong tiếng Việt.' },
    'k': { name: 'k', ipa: '[kʰ]', tongue: 'Cuống lưỡi nâng lên chạm ngạc mềm như âm "g", nhưng BẬT HƠI RẤT MẠNH từ sâu trong cổ họng ra.' },
    'h': { name: 'h', ipa: '[x]', tongue: 'Cuống lưỡi nâng nhẹ gần ngạc mềm tạo khe hẹp, luồng khí cọ xát nhẹ qua cuống họng. Hơi lai giữa "h" và "kh" tiếng Việt nhẹ nhàng.' },
    'j': { name: 'j', ipa: '[tɕ]', tongue: 'Mặt lưỡi áp sát ngạc cứng (vòm họng trên), đầu lưỡi hạ thấp áp vào chân răng dưới, khóe miệng kéo sang 2 bên như đang cười. Đọc nhẹ giống "chi" nhưng dẹp môi, không bật hơi.' },
    'q': { name: 'q', ipa: '[tɕʰ]', tongue: 'Vị trí miệng và lưỡi y hệt âm "j", nhưng BẬT HƠI MẠNH LÒNG BÀN TAY CẢM NHẬN HƠI NÓNG BẮN RA. Tương tự như âm "siêu bật hơi" của "ch".' },
    'x': { name: 'x', ipa: '[ɕ]', tongue: 'Mặt lưỡi nâng cao gần ngạc cứng tạo khe hẹp, đầu lưỡi sát chân răng dưới, miệng bè sang 2 bên, khí cọ xát thoát ra. Giống âm "x" xoe môi mỏng tiếng Việt.' },
    'zh': { name: 'zh', ipa: '[ʈʂ]', tongue: 'ĐẦU LƯỠI UỐN CONG LÊN CHẠM VÒM HỌNG TRÊN (ngạc cứng), sau đó hé nhẹ để khí thoát ra từ từ, KHÔNG BẬT HƠI. Đọc giống âm "tr" chuẩn miền Nam/Trung.' },
    'ch': { name: 'ch', ipa: '[ʈʂʰ]', tongue: 'ĐẦU LƯỠI UỐN CONG LÊN CHẠM VÒM HỌNG như "zh", nhưng BẬT HƠI CỰC MẠNH ra ngoài. Âm cong lưỡi bật hơi đặc trưng tiếng Bắc Kinh.' },
    'sh': { name: 'sh', ipa: '[ʂ]', tongue: 'ĐẦU LƯỠI UỐN CONG LÊN gần vòm miệng (không chạm hẳn), luồng khí ma sát qua khe hẹp phát ra âm xì dày. Giống âm "s" uốn lưỡi (nặng).' },
    'r': { name: 'r', ipa: '[ʐ]', tongue: 'ĐẦU LƯỠI UỐN CONG LÊN vòm họng như "sh", nhưng RUNG DÂY THANH QUẢN trong họng. Nghe hơi lai giữa âm "r" và "d" rung.' },
    'z': { name: 'z', ipa: '[ts]', tongue: 'ĐẦU LƯỠI THẲNG chạm mặt sau răng trên, khép hở nhẹ cản hơi rồi mở nhẹ, KHÔNG BẬT HƠI. Đọc như "tz" / "ch" nhẹ với đầu lưỡi áp thẳng lưng răng.' },
    'c': { name: 'c', ipa: '[tsʰ]', tongue: 'ĐẦU LƯỠI THẲNG chạm mặt sau răng trên như "z", nhưng BẬT HƠI MẠNH qua kẽ răng kèm tiếng xì hơi sắc nét (bật hơi đầu lưỡi).' },
    's': { name: 's', ipa: '[s]', tongue: 'ĐẦU LƯỠI THẲNG đặt sát mặt sau răng dưới, luồng hơi ma sát lướt qua mặt lưỡi và răng cửa trên. Giống âm "x" nhẹ tiếng Việt.' }
  },

  // --- BẢNG VẬN MẪU ĐẶC BIỆT (Nguyên âm & vần) ---
  finals: {
    'a': { name: 'a', tongue: 'Miệng mở rộng hết cỡ, lưỡi nằm tự nhiên đáy miệng, âm phát vang to từ đáy họng.' },
    'o': { name: 'o', tongue: 'Môi tròn lại, cuống lưỡi nâng nhẹ về phía ngạc mềm. Nghe lai giữa "o" và "ua".' },
    'e': { name: 'e', tongue: 'Miệng mở tự nhiên như đang cười mỉm, khóe miệng kéo sang 2 bên, phát âm từ cuống họng. Đọc như âm "ưa" tiếng Việt.' },
    'i': { name: 'i', tongue: 'Khóe môi bẹt sang 2 bên hết cỡ như cười toe toét, đầu lưỡi chạm mặt sau răng dưới. (Lưu ý: đi sau z,c,s,zh,ch,sh,r thì đọc thành "ư").' },
    'u': { name: 'u', tongue: 'Môi tròn nhỏ chu về phía trước, cuống lưỡi nâng cao về phía sau. Giống âm "u" tiếng Việt.' },
    'ü': { name: 'ü (u hai chấm)', tongue: 'GIỮ KHẨU HÌNH TRÒN CHU NHỎ NHƯ HUÝT SÁO, nhưng BÊN TRONG PHÁT ÂM CHỮ "I". Đọc giống chữ "uy" nhưng môi giữ nguyên tròn không được nhúc nhích.' },
    'er': { name: 'er', tongue: 'Phát âm "e" (ưa) trước, sau đó ĐẦU LƯỠI LẬP TỨC UỐN CONG NGƯỢC LÊN VÒM HỌNG. Đây là âm uốn lưỡi đặc trưng.' },
    'an': { name: 'an', tongue: 'Phát âm "a" rồi đưa đầu lưỡi chạm nướu trên để kết thúc âm "n". Giống vần "an".' },
    'en': { name: 'en', tongue: 'Phát âm "e" (ơn) rồi khép đầu lưỡi lên chân răng trên. Gần như "ơn" tiếng Việt.' },
    'ang': { name: 'ang', tongue: 'Cuống lưỡi nâng lên chạm ngạc mềm sau khi mở to miệng phát âm "a".' },
    'eng': { name: 'eng', tongue: 'Mở miệng tự nhiên phát âm "e", cuống lưỡi thụt về sau khép vào ngạc mềm. Đọc như "âng".' },
    'ong': { name: 'ong', tongue: 'Môi tròn phát âm như "ung" tiếng Việt.' }
  },

  // --- BẢNG 4 THANH ĐIỆU (Tones) ---
  tones: {
    1: { name: 'Thanh 1 (Âm Bình: 55)', mark: '¯', desc: 'Cao và đều bằng phẳng, giữ hơi dài ổn định từ đầu đến cuối ở nốt cao nhất của giọng bạn, KHÔNG hạ giọng.' },
    2: { name: 'Thanh 2 (Dương Bình: 35)', mark: '´', desc: 'Đi từ độ cao trung bình vút thẳng lên độ cao tối đa (giống dấu Sắc tiếng Việt nhưng thanh thoát và dài hơn).' },
    3: { name: 'Thanh 3 (Thượng Thanh: 214)', mark: 'ˇ', desc: 'Hạ giọng xuống trầm nhất cổ họng (như dấu Nặng) rồi uốn nhẹ lên một chút. Chú ý: 2 thanh 3 đi liền nhau (ví dụ: 你好 nǐ hǎo) thì từ đầu chuyển đọc thành thanh 2 (ní hǎo)!' },
    4: { name: 'Thanh 4 (Khứ Thanh: 51)', mark: '`', desc: 'Rơi thẳng đứng từ nốt cao nhất dứt khoát xuống nốt thấp nhất, phát âm mạnh mẽ, dứt khoát, ngắt hơi bất ngờ như ra lệnh.' },
    0: { name: 'Thanh nhẹ (Khinh thanh)', mark: '•', desc: 'Đọc rất ngắn, nhẹ nhàng, lướt qua, không nhấn trọng âm (ví dụ: 们 men, 谢谢 xièxie).' }
  }
};

/**
 * Phân tích và sinh bản hướng dẫn khẩu hình + vị trí đặt lưỡi cho 1 từ vựng HSK
 * @param {string} hanzi Chữ Hán (vd: 你好, 老师)
 * @param {string} pinyin Phiên âm pinyin (vd: nǐ hǎo, lǎoshī)
 */
window.getPronunciationGuide = function(hanzi, pinyin) {
  if (!pinyin) return null;

  // Xử lý các từ ghép nhiều âm tiết
  const syllables = pinyin.trim().toLowerCase().split(/\s+/);
  const chars = Array.from(hanzi || "");

  const syllablesDetail = syllables.map((syl, idx) => {
    // Tách dấu thanh điệu
    let tone = 0;
    let cleanSyl = syl;

    if (/[āēīōūǖ]/.test(syl)) tone = 1;
    else if (/[áéíóúǘ]/.test(syl)) tone = 2;
    else if (/[ǎěǐǒǔǚ]/.test(syl)) tone = 3;
    else if (/[àèìòùǜ]/.test(syl)) tone = 4;

    // Chuẩn hóa pinyin không dấu
    const normalized = syl
      .replace(/[āáǎà]/g, 'a')
      .replace(/[ēéěè]/g, 'e')
      .replace(/[īíǐì]/g, 'i')
      .replace(/[ōóǒò]/g, 'o')
      .replace(/[ūúǔù]/g, 'u')
      .replace(/[ǖǘǚǜü]/g, 'v')
      .replace(/[^a-z]/g, '');

    // Nhận diện thanh mẫu kép hoặc đơn
    let initial = '';
    const doubleInitials = ['zh', 'ch', 'sh'];
    for (let di of doubleInitials) {
      if (normalized.startsWith(di)) {
        initial = di;
        break;
      }
    }
    if (!initial) {
      const singleInitials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
      for (let si of singleInitials) {
        if (normalized.startsWith(si)) {
          initial = si;
          break;
        }
      }
    }

    const finalPart = initial ? normalized.slice(initial.length) : normalized;

    // Tra cứu hướng dẫn
    const initialGuide = window.CHINESE_PHONETICS_GUIDE.initials[initial] || null;
    const toneGuide = window.CHINESE_PHONETICS_GUIDE.tones[tone] || window.CHINESE_PHONETICS_GUIDE.tones[0];

    // Tạo mẹo đặt lưỡi trực quan
    let tongueTip = "";
    if (['zh', 'ch', 'sh', 'r'].includes(initial)) {
      tongueTip = "🌀 <b>Uốn lưỡi:</b> Đầu lưỡi cong lên chạm nhẹ vòm họng trên, không để lưỡi bẹt!";
    } else if (['z', 'c', 's'].includes(initial)) {
      tongueTip = "📏 <b>Lưỡi thẳng:</b> Đầu lưỡi áp thẳng lưng răng cửa trên/dưới, miệng hé cười ép hơi xì ra!";
    } else if (['j', 'q', 'x'].includes(initial)) {
      tongueTip = "😁 <b>Mặt lưỡi bè:</b> Mặt lưỡi ép sát vòm trên, đầu lưỡi chạm chân răng dưới, miệng bẹt như cười!";
    } else if (['p', 't', 'k', 'q', 'ch', 'c'].includes(initial)) {
      tongueTip = "💨 <b>Bật hơi mạnh:</b> Nén khí trong miệng rồi phóng hơi ra thật mạnh!";
    } else if (['b', 'd', 'g', 'j', 'zh', 'z'].includes(initial)) {
      tongueTip = "🔇 <b>Không bật hơi:</b> Giữ âm chắc, phát âm gọn gàng không xì luồng khí mạnh!";
    } else {
      tongueTip = "👄 <b>Khẩu hình tự nhiên:</b> Thả lỏng vòm miệng và điều tiết hơi từ cơ bụng.";
    }

    return {
      char: chars[idx] || "",
      pinyin: syl,
      initial: initial || '(không có)',
      initialGuide: initialGuide ? initialGuide.tongue : 'Nguyên âm tự do, mở khoang miệng tự nhiên.',
      finalPart: finalPart,
      toneNum: tone,
      toneGuide: toneGuide,
      tongueTip: tongueTip
    };
  });

  // Kiểm tra quy tắc biến điệu đặc biệt (Ví dụ 2 thanh 3 đi liền nhau)
  let toneSandhiRule = "";
  if (syllablesDetail.length >= 2) {
    if (syllablesDetail[0].toneNum === 3 && syllablesDetail[1].toneNum === 3) {
      toneSandhiRule = `💡 <b>Quy tắc biến điệu 2 thanh 3:</b> Từ <code>${hanzi}</code> gồm 2 thanh 3 đi liền nhau (${syllables[0]} + ${syllables[1]}), nên chữ đầu <code>${chars[0]}</code> sẽ đổi đọc thành <b>thanh 2</b> (dấu sắc nhẹ, ví dụ đọc thành <i>"${chars[0] === '你' ? 'ní' : ''} ${syllables[1]}"</i>)!`;
    }
  }

  return {
    hanzi: hanzi,
    pinyin: pinyin,
    syllables: syllablesDetail,
    toneSandhiRule: toneSandhiRule
  };
};
