// Hàm sinh dữ liệu hướng dẫn phát âm cho UI
window.getPronunciationGuide = function(hanzi, pinyin) {
  if (!pinyin) return null;

  // Lọc bỏ dấu câu tiếng Trung và ký tự đặc biệt (chỉ giữ lại chữ Hán / chữ cái / số)
  const cleanHanzi = (hanzi || "").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
  // Lọc pinyin chỉ giữ các âm tiết và dấu thanh
  const cleanPinyin = (pinyin || "").replace(/[^\w\sāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/gi, " ").trim();

  const chars = Array.from(cleanHanzi);
  if (chars.length === 0) return null;

  let syllables = cleanPinyin.toLowerCase().split(/\s+/).filter(Boolean);
  if (syllables.length !== chars.length) {
    const dictList = window.hanziToPinyinList ? window.hanziToPinyinList(cleanHanzi) : [];
    syllables = chars.map((c, i) => (dictList[i] && dictList[i].pinyin) || syllables[i] || "");
  }

  const syllablesDetail = chars.map((ch, idx) => {
    const syl = syllables[idx] || "";
    const parsed = (window.parsePinyinSyllable ? window.parsePinyinSyllable(syl) : null) || {
      original: syl,
      raw: "",
      initial: "",
      finalPart: "",
      tone: 0
    };

    const initialGuide = (parsed.initial && window.CHINESE_PHONETICS_DB && window.CHINESE_PHONETICS_DB.initials) 
      ? window.CHINESE_PHONETICS_DB.initials[parsed.initial] 
      : null;

    const finalGuide = (parsed.finalPart && window.CHINESE_FINALS_DB) 
      ? window.CHINESE_FINALS_DB[parsed.finalPart] 
      : null;

    const toneGuide = (window.CHINESE_PHONETICS_DB && window.CHINESE_PHONETICS_DB.tones) 
      ? (window.CHINESE_PHONETICS_DB.tones[parsed.tone] || window.CHINESE_PHONETICS_DB.tones[0]) 
      : null;

    // Tạo mẹo đặt lưỡi trực quan
    let tongueTip = "";
    if (['zh', 'ch', 'sh', 'r'].includes(parsed.initial)) {
      tongueTip = "🌀 <b>Uốn lưỡi:</b> Đầu lưỡi cong lên chạm nhẹ vòm họng ngạc cứng trên!";
    } else if (['z', 'c', 's'].includes(parsed.initial)) {
      tongueTip = "📏 <b>Lưỡi thẳng:</b> Đầu lưỡi áp thẳng lưng răng cửa trên/dưới, ép hơi xì ra!";
    } else if (['j', 'q', 'x'].includes(parsed.initial)) {
      tongueTip = "😁 <b>Mặt lưỡi bè:</b> Mặt lưỡi ép sát vòm trên, miệng bẹt khóe môi như cười!";
    } else if (['p', 't', 'k', 'q', 'ch', 'c'].includes(parsed.initial)) {
      tongueTip = "💨 <b>Bật hơi mạnh:</b> Nén khí rồi phóng luồng hơi mạnh ra ngoài!";
    } else if (['b', 'd', 'g', 'j', 'zh', 'z'].includes(parsed.initial)) {
      tongueTip = "🔇 <b>Không bật hơi:</b> Giữ âm chắc gọn, không xì luồng khí mạnh!";
    } else {
      tongueTip = "👄 <b>Khẩu hình tự nhiên:</b> Thả lỏng vòm miệng, điều tiết hơi từ cơ bụng.";
    }

    return {
      char: ch,
      pinyin: syl,
      initial: parsed.initial || '(không có)',
      initialGuide: initialGuide ? initialGuide.tongue : 'Nguyên âm tự do, mở khoang miệng tự nhiên.',
      initialTip: initialGuide ? initialGuide.fixTip : '',
      finalPart: parsed.finalPart,
      finalName: finalGuide ? finalGuide.name : parsed.finalPart,
      finalGuide: finalGuide ? finalGuide.tongue : 'Phát âm theo nguyên âm tự nhiên.',
      finalTip: finalGuide ? finalGuide.fixTip : '',
      toneNum: parsed.tone,
      toneGuide: toneGuide,
      tongueTip: tongueTip
    };
  });

  let toneSandhiRule = "";
  if (syllablesDetail.length >= 2) {
    if (syllablesDetail[0].toneNum === 3 && syllablesDetail[1].toneNum === 3) {
      toneSandhiRule = `💡 <b>Quy tắc biến điệu 2 thanh 3:</b> Từ <code>${cleanHanzi}</code> gồm 2 thanh 3 đi liền nhau, chữ đầu <code>${chars[0]}</code> sẽ đổi đọc thành <b>thanh 2</b> (dấu sắc nhẹ, ví dụ đọc thành <i>"${chars[0] === '你' ? 'ní' : ''} ${syllables[1]}"</i>)!`;
    }
  }

  return {
    hanzi: cleanHanzi,
    pinyin: cleanPinyin,
    syllables: syllablesDetail,
    toneSandhiRule: toneSandhiRule
  };
};
