/**
 * Công cụ phân tích âm vị học Tiếng Trung & Khẩu hình, Vị trí đặt lưỡi, Chẩn đoán lỗi sai
 * Dành riêng cho người Việt Nam học tiếng Trung HSK 3.0
 */

window.CHINESE_PHONETICS_DB = {
  // 21 THANH MẪU (Phụ âm đầu)
  initials: {
    'b': {
      name: 'b',
      ipa: '[p]',
      type: 'Âm 2 môi, không bật hơi',
      tongue: 'Hai môi khép chặt, cản luồng khí trong miệng rồi mở nhanh bật ra nhẹ nhàng, KHÔNG bật hơi. Giống âm "p" tiếng Việt nhưng không rung dây thanh.',
      vnMistake: 'Người Việt hay phát âm nhầm thành chữ "b" (rung cổ) hoặc nhầm sang bật hơi "p".',
      fixTip: 'Cắn chặt 2 môi lại, mở nhẹ phát ra tiếng "pua" không rung thanh quản, đặt tay lên cổ họng không thấy rung.'
    },
    'p': {
      name: 'p',
      ipa: '[pʰ]',
      type: 'Âm 2 môi, BẬT HƠI MẠNH',
      tongue: 'Hai môi khép chặt, nén luồng khí lại rồi BẬT MỞ MẠNH PHÓNG LUỒNG KHÍ RA NGOÀI. Đặt một tờ giấy ăn trước miệng cách 5cm, khi đọc tờ giấy phải bay mạnh.',
      vnMistake: 'Rất nhiều bạn đọc thành "p" nhẹ (không bật hơi) hoặc đọc thành "ph".',
      fixTip: 'Nén hơi thật chặt ở môi trước khi nhả âm, để luồng gió mạnh bung ra ngoài.'
    },
    'm': {
      name: 'm',
      ipa: '[m]',
      type: 'Âm 2 môi, mũi',
      tongue: 'Hai môi khép lại, luồng hơi thoát theo khoang mũi, rung dây thanh. Hoàn toàn giống âm "m" tiếng Việt.',
      vnMistake: 'Âm này người Việt đọc rất chuẩn.',
      fixTip: 'Giữ âm tự nhiên như tiếng Việt.'
    },
    'f': {
      name: 'f',
      ipa: '[f]',
      type: 'Âm răng - môi',
      tongue: 'Răng cửa trên chạm nhẹ vào môi dưới, luồng hơi ma sát thoát qua kẽ răng. Giống âm "ph" tiếng Việt.',
      vnMistake: 'Đôi khi ngậm cả 2 môi.',
      fixTip: 'Chỉ dùng răng trên cắn hờ bờ môi dưới.'
    },
    'd': {
      name: 'd',
      ipa: '[t]',
      type: 'Âm đầu lưỡi trên, không bật hơi',
      tongue: 'Đầu lưỡi dính chặt vào nướu răng trên (chân răng trên), chặn luồng khí rồi hạ nhanh lưỡi xuống, KHÔNG BẬT HƠI. Đọc gần như âm "t" tiếng Việt.',
      vnMistake: 'Người Việt hay đọc nhầm thành chữ "đ" (âm rung).',
      fixTip: 'Đọc tựa như chữ "t" trong "tôi", giữ âm thanh gọn, không rung thanh quản.'
    },
    't': {
      name: 't',
      ipa: '[tʰ]',
      type: 'Âm đầu lưỡi trên, BẬT HƠI MẠNH',
      tongue: 'Vị trí giống âm "d" (đầu lưỡi áp nướu trên), nhưng BẬT HƠI CỰC MẠNH khi hạ lưỡi. Tương tự âm "th" tiếng Việt nhưng phóng luồng khí mạnh mẽ và dứt khoát hơn.',
      vnMistake: 'Quên bật hơi hoặc bật quá yếu.',
      fixTip: 'Đầu lưỡi giật nhanh xuống và tống hơi ra phía trước.'
    },
    'n': {
      name: 'n',
      ipa: '[n]',
      type: 'Âm đầu lưỡi - mũi',
      tongue: 'Đầu lưỡi áp chân răng trên, hơi thoát qua mũi. Giống âm "n" tiếng Việt.',
      vnMistake: 'Một số bạn bị nhầm lẫn giữa n và l.',
      fixTip: 'Hơi đi lên mũi tạo độ vang êm.'
    },
    'l': {
      name: 'l',
      ipa: '[l]',
      type: 'Âm bên đầu lưỡi',
      tongue: 'Đầu lưỡi chạm nướu trên, luồng khí thoát ra hai bên mép lưỡi. Giống âm "l" tiếng Việt.',
      vnMistake: 'Nhầm lẫn với n.',
      fixTip: 'Uốn đầu lưỡi chạm nướu trên rồi nhả xuống.'
    },
    'g': {
      name: 'g',
      ipa: '[k]',
      type: 'Âm cuống lưỡi, không bật hơi',
      tongue: 'Gốc lưỡi nâng cao chạm ngạc mềm (vòm họng sau), chặn hơi rồi hạ nhanh xuống, KHÔNG bật hơi. Đọc gần giống âm "c/k" tiếng Việt.',
      vnMistake: 'Rất hay đọc thành âm "g" tiếng Việt (ví dụ: gēge đọc thành gơ-gơ là sai).',
      fixTip: 'Hãy đọc thành âm "c" (ví dụ: gēge đọc thành "cưa cưa").'
    },
    'k': {
      name: 'k',
      ipa: '[kʰ]',
      type: 'Âm cuống lưỡi, BẬT HƠI MẠNH',
      tongue: 'Cuống lưỡi nâng lên chạm ngạc mềm như âm "g", nhưng BẬT HƠI RẤT MẠNH từ đáy họng ra. Giống âm "kh" tiếng Việt nhưng bật mạnh và sắc nét hơn.',
      vnMistake: 'Đọc thành "k" không bật hơi hoặc âm "kh" quá yếu.',
      fixTip: 'Khạc luồng hơi mạnh từ cuống họng ra ngoài.'
    },
    'h': {
      name: 'h',
      ipa: '[x]',
      type: 'Âm cuống lưỡi ma sát',
      tongue: 'Cuống lưỡi nâng nhẹ gần ngạc mềm tạo khe hẹp, luồng hơi ma sát nhẹ thoát ra. Âm này nằm ở khoảng giữa âm "h" và "kh" tiếng Việt nhẹ nhàng.',
      vnMistake: 'Đọc âm "h" quá nhẹ như tiếng Việt (hē đọc thành he) hoặc quá nặng thành "kh".',
      fixTip: 'Nâng gốc lưỡi lên một chút tạo lực ma sát nhẹ trong vòm họng.'
    },
    'j': {
      name: 'j',
      ipa: '[tɕ]',
      type: 'Âm mặt lưỡi, không bật hơi',
      tongue: 'Mặt lưỡi ép sát ngạc cứng (vòm họng trên), đầu lưỡi hạ thấp áp vào chân răng dưới, khóe miệng kéo sang hai bên như đang cười. Đọc nhẹ giống "chi" nhưng bẹt môi, không bật hơi.',
      vnMistake: 'Đọc nhầm thành "d" hoặc "gi" tiếng Việt, hoặc quên kéo bẹt khóe môi.',
      fixTip: 'Mỉm cười kéo mép sang hai bên, mặt lưỡi dính lên ngạc cứng rồi nhả nhẹ.'
    },
    'q': {
      name: 'q',
      ipa: '[tɕʰ]',
      type: 'Âm mặt lưỡi, BẬT HƠI MẠNH',
      tongue: 'Vị trí miệng và lưỡi y hệt âm "j", nhưng BẬT HƠI CỰC MẠNH. Đặt lòng bàn tay trước miệng cảm nhận hơi gió bắn ra.',
      vnMistake: 'Hay đọc thành "chi" không bật hơi, hoặc đọc thành "kh".',
      fixTip: 'Cười bẹt miệng, dồn hơi nén lại rồi phóng hơi bắn qua kẽ mặt lưỡi.'
    },
    'x': {
      name: 'x',
      ipa: '[ɕ]',
      type: 'Âm mặt lưỡi ma sát',
      tongue: 'Mặt lưỡi nâng cao sát ngạc cứng tạo khe hẹp, đầu lưỡi sát chân răng dưới, miệng bẹt như cười, luồng hơi cọ xát thoát ra. Giống âm "x" mỏng tiếng Việt.',
      vnMistake: 'Đọc chu môi hoặc uốn lưỡi.',
      fixTip: 'Kéo căng khóe môi sang 2 bên để âm thanh thật sắc nét và thanh.'
    },
    'zh': {
      name: 'zh',
      ipa: '[ʈʂ]',
      type: 'Âm uốn lưỡi (quặt lưỡi), không bật hơi',
      tongue: 'ĐẦU LƯỠI UỐN CONG LÊN CHẠM VÒM HỌNG TRÊN (ngạc cứng), sau đó hé nhẹ đầu lưỡi để khí thoát ra từ từ, KHÔNG BẬT HƠI. Đọc tương tự âm "tr" chuẩn miền Nam/Trung.',
      vnMistake: 'Người miền Bắc hay đọc thành "ch/tr" phẳng lưỡi không uốn.',
      fixTip: 'Cong đầu lưỡi ngược lên trên trần miệng trước khi phát âm!'
    },
    'ch': {
      name: 'ch',
      ipa: '[ʈʂʰ]',
      type: 'Âm uốn lưỡi, BẬT HƠI CỰC MẠNH',
      tongue: 'ĐẦU LƯỠI UỐN CONG LÊN CHẠM VÒM HỌNG như "zh", nhưng BẬT HƠI CỰC MẠNH ra ngoài. Âm khó bậc nhất trong tiếng Trung!',
      vnMistake: 'Chỉ uốn lưỡi mà quên bật hơi, hoặc bật hơi mà quên uốn lưỡi.',
      fixTip: 'Uốn cong đầu lưỡi chạm ngạc trên, giữ hơi nén chặt rồi bung mạnh kèm tiếng xì gió.'
    },
    'sh': {
      name: 'sh',
      ipa: '[ʂ]',
      type: 'Âm uốn lưỡi ma sát',
      tongue: 'ĐẦU LƯỠI UỐN CONG LÊN gần sát vòm miệng (không chạm hẳn), luồng hơi ma sát qua khe hẹp phát ra tiếng xì dày và trầm. Giống âm "s" uốn lưỡi tiếng Việt.',
      vnMistake: 'Đọc phẳng lưỡi thành "x" nhẹ.',
      fixTip: 'Luôn uốn cong đầu lưỡi lên trần miệng để tạo độ vang dày.'
    },
    'r': {
      name: 'r',
      ipa: '[ʐ]',
      type: 'Âm uốn lưỡi, rung thanh quản',
      tongue: 'ĐẦU LƯỠI UỐN CONG LÊN vòm họng như "sh", nhưng RUNG DÂY THANH QUẢN trong họng. Nghe hơi lai giữa âm "r" và âm "d" rung nhẹ.',
      vnMistake: 'Rung lưỡi quá đà như chữ R tiếng Pháp/Nga, hoặc đọc thành "d" bẹt.',
      fixTip: 'Uốn cong lưỡi cố định, phát âm rung trong cổ họng.'
    },
    'z': {
      name: 'z',
      ipa: '[ts]',
      type: 'Âm đầu lưỡi thẳng, không bật hơi',
      tongue: 'ĐẦU LƯỠI THẲNG chạm mặt sau răng cửa trên, khép hở nhẹ cản luồng hơi rồi mở nhẹ, KHÔNG BẬT HƠI. Đọc tựa như "tz" gọn gàng.',
      vnMistake: 'Rất hay uốn lưỡi hoặc đọc thành "d".',
      fixTip: 'Lưỡi PHẢI DUỖI THẲNG ÉP VÀO RĂNG, miệng hơi hé cười.'
    },
    'c': {
      name: 'c',
      ipa: '[tsʰ]',
      type: 'Âm đầu lưỡi thẳng, BẬT HƠI MẠNH',
      tongue: 'ĐẦU LƯỠI THẲNG áp sát sau răng cửa trên như "z", nhưng BẬT HƠI MẠNH qua kẽ răng kèm tiếng xì hơi sắc nét (bật hơi đầu lưỡi).',
      vnMistake: 'Đọc thành "x" hoặc "ch" không bật hơi.',
      fixTip: 'Ép chặt đầu lưỡi thẳng vào răng trên, bật hơi xì mạnh qua kẽ răng.'
    },
    's': {
      name: 's',
      ipa: '[s]',
      type: 'Âm đầu lưỡi thẳng ma sát',
      tongue: 'ĐẦU LƯỠI THẲNG đặt sát mặt sau răng dưới, luồng hơi ma sát lướt qua mặt lưỡi và răng cửa trên. Giống âm "x" nhẹ tiếng Việt.',
      vnMistake: 'Uốn lưỡi thành âm "s" nặng.',
      fixTip: 'Giữ đầu lưỡi thẳng tắp áp chân răng dưới.'
    }
  },

  // 4 THANH ĐIỆU (Tones)
  tones: {
    1: { name: 'Thanh 1 (Âm Bình: 55)', mark: '¯', desc: 'Cao và đều bằng phẳng (nốt Sol), giữ hơi dài ổn định từ đầu đến cuối, KHÔNG hạ giọng.' },
    2: { name: 'Thanh 2 (Dương Bình: 35)', mark: '´', desc: 'Đi từ độ cao trung bình vút thẳng lên cao nhất (tựa như dấu Sắc tiếng Việt nhưng thanh thoát hơn).' },
    3: { name: 'Thanh 3 (Thượng Thanh: 214)', mark: 'ˇ', desc: 'Hạ giọng xuống thật trầm ở đáy cổ họng rồi hơi uốn lên nhẹ. (Chú ý: khi đi trước thanh 3 khác thì đổi đọc thành thanh 2)!' },
    4: { name: 'Thanh 4 (Khứ Thanh: 51)', mark: '`', desc: 'Rơi thẳng đứng từ nốt cao nhất dứt khoát xuống nốt thấp nhất, phát âm mạnh mẽ, dứt khoát, ngắt hơi bất ngờ như ra lệnh.' },
    0: { name: 'Thanh nhẹ (Khinh thanh)', mark: '•', desc: 'Đọc rất ngắn, nhẹ nhàng, lướt qua, không nhấn trọng âm (ví dụ: 们 men, 谢谢 xièxie).' }
  }
};

/**
 * Tách và phân tích âm tiết pinyin chuẩn xác (initial, final, tone, toneNum)
 */
window.parsePinyinSyllable = function(syl) {
  if (!syl) return null;
  const s = syl.trim().toLowerCase();

  let tone = 0;
  if (/[āēīōūǖ]/.test(s)) tone = 1;
  else if (/[áéíóúǘ]/.test(s)) tone = 2;
  else if (/[ǎěǐǒǔǚ]/.test(s)) tone = 3;
  else if (/[àèìòùǜ]/.test(s)) tone = 4;

  const raw = s
    .replace(/[āáǎà]/g, 'a')
    .replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i')
    .replace(/[ōóǒò]/g, 'o')
    .replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'v')
    .replace(/[^a-z]/g, '');

  let initial = '';
  const doubleInitials = ['zh', 'ch', 'sh'];
  for (let di of doubleInitials) {
    if (raw.startsWith(di)) {
      initial = di;
      break;
    }
  }
  if (!initial) {
    const singleInitials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
    for (let si of singleInitials) {
      if (raw.startsWith(si)) {
        initial = si;
        break;
      }
    }
  }

  const finalPart = initial ? raw.slice(initial.length) : raw;
  return {
    original: syl,
    raw: raw,
    initial: initial,
    finalPart: finalPart,
    tone: tone
  };
};

/**
 * Chuyển đổi một chuỗi chữ Hán thành mảng Pinyin dựa trên từ điển offline window.PINYIN_MAP
 */
window.hanziToPinyinList = function(hanziStr) {
  if (!hanziStr) return [];
  const chars = Array.from(hanziStr);
  const map = window.PINYIN_MAP || {};
  return chars.map(c => {
    return {
      char: c,
      pinyin: map[c] || ''
    };
  });
};

/**
 * SO SÁNH CHUYÊN SÂU & CHẨN ĐOÁN LỖI PHÁT ÂM CHI TIẾT
 * @param {string} targetWord Từ vựng mục tiêu (vd: 老师, 你好)
 * @param {string} targetPinyin Pinyin mục tiêu (vd: lǎoshī, nǐ hǎo)
 * @param {string} spokenWord Từ người dùng vừa nói (vd: 老四, 泥好, 谢谢)
 */
window.diagnoseSpeechDetails = function(targetWord, targetPinyin, spokenWord) {
  const targetChars = Array.from(targetWord || "");
  const spokenChars = Array.from(spokenWord || "");

  // Tách pinyin mục tiêu thành mảng các âm tiết
  let targetSyls = targetPinyin ? targetPinyin.trim().toLowerCase().split(/\s+/) : [];
  if (targetSyls.length !== targetChars.length) {
    const dictList = window.hanziToPinyinList(targetWord);
    targetSyls = dictList.map((d, i) => d.pinyin || targetSyls[i] || "");
  }

  // Lấy pinyin tương ứng của những chữ người dùng đã nói
  const spokenPinyinList = window.hanziToPinyinList(spokenWord);

  let correctCount = 0;
  const charDiagnoses = [];

  for (let i = 0; i < targetChars.length; i++) {
    const tChar = targetChars[i];
    const tSylStr = targetSyls[i] || (window.PINYIN_MAP ? window.PINYIN_MAP[tChar] : '');
    const tParsed = window.parsePinyinSyllable(tSylStr) || { original: tSylStr || '', raw: '', initial: '', finalPart: '', tone: 0 };

    // Ký tự người dùng nói tại vị trí tương ứng (hoặc tìm ký tự khớp tốt nhất trong chuỗi spoken)
    let sChar = null;
    let sSylStr = '';
    let sParsed = null;
    let bestMatchIdx = -1;

    // 1. Kiểm tra nếu có chữ Hán hoàn toàn giống nhau xuất hiện trong spokenWord
    const directIdx = spokenChars.indexOf(tChar);
    if (directIdx !== -1) {
      sChar = tChar;
      sSylStr = tSylStr;
      sParsed = tParsed;
      bestMatchIdx = directIdx;
    } else {
      // 2. Tìm chữ có âm đọc gần nhất (đồng âm / pinyin trùng khớp)
      for (let j = 0; j < spokenChars.length; j++) {
        const candidateChar = spokenChars[j];
        const candidateSyl = spokenPinyinList[j] ? spokenPinyinList[j].pinyin : (window.PINYIN_MAP ? window.PINYIN_MAP[candidateChar] : '');
        if (candidateSyl && tSylStr && window.stripPinyinTone && window.stripPinyinTone(candidateSyl) === window.stripPinyinTone(tSylStr)) {
          sChar = candidateChar;
          sSylStr = candidateSyl;
          sParsed = window.parsePinyinSyllable(sSylStr) || { original: sSylStr, raw: '', initial: '', finalPart: '', tone: 0 };
          bestMatchIdx = j;
          break;
        }
      }

      // 3. Nếu vẫn không thấy, lấy theo vị trí chỉ số
      if (!sChar && i < spokenChars.length) {
        sChar = spokenChars[i];
        sSylStr = spokenPinyinList[i] ? spokenPinyinList[i].pinyin : (window.PINYIN_MAP ? window.PINYIN_MAP[sChar] : '');
        sParsed = window.parsePinyinSyllable(sSylStr) || { original: sSylStr, raw: '', initial: '', finalPart: '', tone: 0 };
      }
    }

    if (!sParsed && sSylStr) {
      sParsed = window.parsePinyinSyllable(sSylStr) || { original: sSylStr, raw: '', initial: '', finalPart: '', tone: 0 };
    }

    let isMatch = false;
    let feedback = "";
    let tongueGuide = "";
    let statusLabel = "";

    // Lấy hướng dẫn thanh mẫu an toàn
    const initialInfo = (tParsed && tParsed.initial && window.CHINESE_PHONETICS_DB && window.CHINESE_PHONETICS_DB.initials) 
      ? window.CHINESE_PHONETICS_DB.initials[tParsed.initial] 
      : null;

    // So sánh: Đúng nếu trùng chữ Hán HOẶC trùng âm pinyin thuần (loại bỏ trường hợp máy trả về chữ đồng âm)
    const isPinyinIdentical = sParsed && tSylStr && sSylStr && (
      sSylStr === tSylStr || (window.stripPinyinTone && window.stripPinyinTone(sSylStr) === window.stripPinyinTone(tSylStr))
    );

    if (sChar === tChar || isPinyinIdentical) {
      isMatch = true;
      correctCount++;
      statusLabel = "Đúng chuẩn";
      feedback = `🎉 Bạn phát âm chuẩn xác chữ <b>${tChar} [${tSylStr}]</b>!`;
    } else if (sChar) {
      statusLabel = "Chưa chuẩn";
      let errorPoints = [];

      // So sánh âm đầu (thanh mẫu)
      if (tParsed && sParsed && tParsed.initial !== sParsed.initial) {
        if (['zh', 'ch', 'sh'].includes(tParsed.initial) && ['z', 'c', 's'].includes(sParsed.initial)) {
          errorPoints.push(`⚠️ <b>Lỗi uốn lưỡi:</b> Bạn đang phát âm phẳng lưỡi <code>${sParsed.initial}</code> thay vì <b>uốn cong đầu lưỡi lên vòm họng</b> cho âm <code>${tParsed.initial}</code>.`);
        } else if (['p', 't', 'k', 'q', 'ch', 'c'].includes(tParsed.initial) && !['p', 't', 'k', 'q', 'ch', 'c'].includes(sParsed.initial)) {
          errorPoints.push(`💨 <b>Lỗi thiếu bật hơi:</b> Âm <code>${tParsed.initial}</code> cần <b>bật hơi thật mạnh từ đáy họng/kẽ răng</b>.`);
        } else if (tParsed.initial === 'g' && sParsed.initial === 'h') {
          errorPoints.push(`🔇 <b>Lỗi thanh mẫu:</b> Âm <code>g</code> trong tiếng Trung đọc như chữ "c" (không rung), không đọc thành "g".`);
        } else {
          errorPoints.push(`👄 <b>Khác phụ âm đầu:</b> Bạn đọc thành âm [<code>${sParsed.initial || 'nguyên âm'}</code>], trong khi âm chuẩn là [<code>${tParsed.initial}</code>].`);
        }
      }

      // So sánh vần (vận mẫu)
      if (tParsed && sParsed && tParsed.finalPart !== sParsed.finalPart) {
        const finalInfo = (window.CHINESE_FINALS_DB && tParsed.finalPart) ? window.CHINESE_FINALS_DB[tParsed.finalPart] : null;
        if (tParsed.finalPart === 'ian' && sParsed.finalPart !== 'ian') {
          errorPoints.push(`💡 <b>Lỗi vần "ian":</b> Trong tiếng Trung "ian" đọc thành <b>"iên"</b> (như tiên, tiền), không đọc thành "i-an".`);
        } else if (tParsed.finalPart === 'eng' && sParsed.finalPart !== 'eng') {
          errorPoints.push(`💡 <b>Lỗi vần "eng":</b> Vần "eng" đọc như <b>"âng"</b> (như tầng, vâng), không đọc bẹt thành "eng".`);
        } else if (tParsed.finalPart === 'ong' && sParsed.finalPart !== 'ong') {
          errorPoints.push(`💡 <b>Lỗi vần "ong":</b> Vần "ong" khẩu hình môi tròn nhỏ đọc thành <b>"ung"</b>, không đọc mở to thành "ong".`);
        } else if (finalInfo && finalInfo.fixTip) {
          errorPoints.push(`👄 <b>Sai vần "${tParsed.finalPart}":</b> ${finalInfo.fixTip}`);
        }
      }

      // So sánh thanh điệu
      if (tParsed && sParsed && tParsed.tone !== sParsed.tone && tParsed.tone > 0 && sParsed.tone > 0) {
        errorPoints.push(`🎵 <b>Lỗi thanh điệu:</b> Bạn đang nói <b>Thanh ${sParsed.tone}</b>, trong khi từ này là <b>Thanh ${tParsed.tone}</b>.`);
      }

      if (errorPoints.length === 0) {
        errorPoints.push(`Bạn đọc thành chữ <b>"${sChar}" [${sSylStr}]</b>. Hãy nghe lại âm mẫu để điều chỉnh khẩu hình.`);
      }

      feedback = errorPoints.join("<br>");
    } else {
      statusLabel = "Bị thiếu / Bỏ sót";
      feedback = `Bạn chưa phát âm hoặc đọc quá nhỏ chữ <b>${tChar}</b>.`;
    }

    // Mẹo đặt lưỡi & vần cho chữ này
    const finalInfo = tParsed.finalPart ? (window.CHINESE_FINALS_DB ? window.CHINESE_FINALS_DB[tParsed.finalPart] : null) : null;
    let guideParts = [];
    if (initialInfo) {
      guideParts.push(`<b>Thanh mẫu [${initialInfo.name}]:</b> ${initialInfo.tongue} <br><span class="text-amber-300">💡 <b>Khắc phục:</b> ${initialInfo.fixTip}</span>`);
    }
    if (finalInfo) {
      guideParts.push(`<b>Vận mẫu [${finalInfo.name}]:</b> ${finalInfo.tongue} <br><span class="text-cyan-300">💡 <b>Mẹo vần:</b> ${finalInfo.fixTip}</span>`);
    }
    if (guideParts.length > 0) {
      tongueGuide = guideParts.join("<div class='my-1 border-t border-slate-800/80'></div>");
    } else {
      tongueGuide = `Mở khoang miệng tự nhiên, giữ luồng hơi ổn định theo thanh điệu.`;
    }

    charDiagnoses.push({
      char: tChar,
      targetPinyin: tSylStr,
      spokenChar: sChar || '—',
      spokenPinyin: sSylStr || '—',
      isCorrect: isMatch,
      statusLabel: statusLabel,
      feedback: feedback,
      tongueGuide: tongueGuide,
      initial: tParsed.initial,
      tone: tParsed.tone
    });
  }

  // Tính điểm chính xác tổng quan
  let overallScore = Math.round((correctCount / targetChars.length) * 100);
  if (targetWord === spokenWord) overallScore = 100;

  return {
    score: overallScore,
    isPassed: overallScore >= 75,
    userSpoken: spokenWord || '(Không nghe rõ giọng đọc)',
    targetWord: targetWord,
    targetPinyin: targetPinyin,
    diagnoses: charDiagnoses
  };
};
