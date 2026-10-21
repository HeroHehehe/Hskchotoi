/**
 * BÁCH KHOA TOÀN THƯ VẬN MẪU TIẾNG TRUNG (36 VẬN MẪU - FINALS)
 * Hướng dẫn chi tiết khẩu hình, độ mở của môi, vị trí đặt lưỡi, luồng khí
 * và các lỗi phát âm người Việt hay gặp kèm mẹo sửa chuẩn xác nhất.
 */

window.CHINESE_FINALS_DB = {
  // --- 1. NHÓM 6 VẬN MẪU ĐƠN (Đơn nguyên âm) ---
  'a': {
    name: 'a',
    ipa: '[a]',
    group: 'Vận mẫu đơn',
    tongue: 'Miệng mở to hết cỡ tự nhiên, lưỡi hạ thấp nằm phẳng ở đáy miệng, phát âm to rõ từ đáy họng.',
    vnMistake: 'Mở khẩu hình miệng quá nhỏ làm âm bị tù.',
    fixTip: 'Mở rộng cơ hàm trên dưới như khi bác sĩ khám họng, phát âm "a" tròn và vang.'
  },
  'o': {
    name: 'o',
    ipa: '[o]',
    group: 'Vận mẫu đơn',
    tongue: 'Môi tròn và hơi chu về trước, cuống lưỡi nâng cao về phía ngạc mềm. Âm nghe lai giữa "o" và "ua".',
    vnMistake: 'Đọc thành "o" dẹt tiếng Việt.',
    fixTip: 'Giữ môi thật tròn, tạo dáng môi hình chữ O trước khi phát âm.'
  },
  'e': {
    name: 'e',
    ipa: '[ɤ]',
    group: 'Vận mẫu đơn',
    tongue: 'Miệng hé tự nhiên, khóe môi kéo nhẹ sang hai bên như đang cười mỉm, cuống lưỡi nâng lên chạm ngạc mềm, phát âm từ sâu trong cuống họng. Đọc giống âm "ưa" trong tiếng Việt.',
    vnMistake: 'Rất nhiều bạn đọc nhầm thành chữ "e" hoặc "ê" tiếng Việt.',
    fixTip: 'Khóe miệng kéo sang hai bên, phát âm chữ "ưa", KHÔNG đọc thành "e/ê".'
  },
  'i': {
    name: 'i',
    ipa: '[i]',
    group: 'Vận mẫu đơn',
    tongue: 'Khóe môi bẹt căng sang 2 bên hết cỡ như đang cười toe toét, đầu lưỡi chạm mặt sau răng cửa dưới. (LƯU Ý ĐẶC BIỆT: Khi đi sau z, c, s, zh, ch, sh, r thì chuyển đọc thành âm "Ư").',
    vnMistake: 'Đọc âm "i" sau zh, ch, sh, z, c, s mà vẫn đọc là "i" (ví dụ: shí đọc thành xi là sai, phải đọc là "sư").',
    fixTip: 'Khi đi với nhóm uốn lưỡi/thẳng lưỡi (zh,ch,sh,r,z,c,s), hãy đọc thành âm "ư" trầm và chắc.'
  },
  'u': {
    name: 'u',
    ipa: '[u]',
    group: 'Vận mẫu đơn',
    tongue: 'Môi tròn nhỏ chu về phía trước hết cỡ, cuống lưỡi nâng cao về phía sau. Hoàn toàn giống âm "u" tiếng Việt.',
    vnMistake: 'Khẩu hình môi chưa đủ tròn nhỏ.',
    fixTip: 'Chu môi tròn nhỏ như ống hút, đẩy hơi nhẹ nhàng ra.'
  },
  'v': {
    name: 'ü (u hai chấm)',
    ipa: '[y]',
    group: 'Vận mẫu đơn đặc biệt',
    tongue: 'GIỮ KHẨU HÌNH TRÒN CHU NHỎ NHƯ HUÝT SÁO, nhưng BÊN TRONG CỔ HỌNG PHÁT ÂM CHỮ "I". Đọc giống chữ "uy" nhưng môi tuyệt đối giữ nguyên tròn vo, không được xê dịch hay bẹt môi.',
    vnMistake: 'Người Việt hay phát âm bẹt môi thành "uy" bị nhúc nhích khóe môi.',
    fixTip: 'Chu môi tròn nhỏ huýt sáo cố định, chỉ rung dây thanh phát âm "i" ở trong họng, môi không động đậy.'
  },
  'er': {
    name: 'er',
    ipa: '[aɚ]',
    group: 'Vận mẫu cuốn lưỡi',
    tongue: 'Phát âm "e" (ưa) trước, sau đó ĐẦU LƯỠI LẬP TỨC UỐN CONG NGƯỢC LÊN VÒM HỌNG TRÊN. Đây là âm uốn lưỡi đặc trưng.',
    vnMistake: 'Quên uốn lưỡi nên đọc thành "ơ" phẳng.',
    fixTip: 'Bắt đầu bằng âm "ơ/ưa", vừa phát âm vừa cuốn cong lưỡi về phía vòm họng.'
  },

  // --- 2. NHÓM VẬN MẪU KÉP (Phức nguyên âm) ---
  'ai': {
    name: 'ai',
    ipa: '[aɪ]',
    group: 'Vận mẫu kép',
    tongue: 'Bắt đầu từ âm "a" mở rộng miệng, rồi lướt nhanh sang âm "i" bẹt khóe môi. Giống âm "ai" tiếng Việt.',
    vnMistake: 'Chuyển âm quá chậm.',
    fixTip: 'Lướt mượt mà từ a sang i.'
  },
  'ei': {
    name: 'ei',
    ipa: '[eɪ]',
    group: 'Vận mẫu kép',
    tongue: 'Bắt đầu từ âm "e" (nửa ê nửa ưa), lướt nhanh sang âm "i". Đọc tựa như vần "ây" tiếng Việt nhưng thanh thoát hơn.',
    vnMistake: 'Đọc thành "e-i" tách rời.',
    fixTip: 'Đọc như vần "ây" trong "cây cối".'
  },
  'ao': {
    name: 'ao',
    ipa: '[aʊ]',
    group: 'Vận mẫu kép',
    tongue: 'Bắt đầu từ âm "a" mở rộng miệng, trượt dần sang thu tròn môi thành "o". Đọc gần giống vần "ao" tiếng Việt.',
    vnMistake: 'Đọc thành "au".',
    fixTip: 'Mở to chữ "a" trước rồi mới khép tròn môi.'
  },
  'ou': {
    name: 'ou',
    ipa: '[oʊ]',
    group: 'Vận mẫu kép',
    tongue: 'Bắt đầu từ âm "o" tròn môi, lướt nhanh sang thu nhỏ môi thành "u". Đọc tựa như vần "âu" trong tiếng Việt.',
    vnMistake: 'Đọc nhầm thành "ô" hoặc "u".',
    fixTip: 'Đọc như chữ "âu" trong "châu báu".'
  },
  'ia': {
    name: 'ia',
    ipa: '[ia]',
    group: 'Vận mẫu kép',
    tongue: 'Khóe môi bẹt phát âm "i" thật ngắn, rồi mở to miệng sang âm "a". Đọc như "i-a" lướt nhanh.',
    vnMistake: 'Đọc thành "da".',
    fixTip: 'Âm "i" nhẹ lướt sang "a" vang rộng.'
  },
  'ie': {
    name: 'ie',
    ipa: '[iɛ]',
    group: 'Vận mẫu kép',
    tongue: 'Bắt đầu từ âm "i" bẹt khóe môi, mở nhẹ sang âm "ê" mềm mại. Đọc như vần "iê" tiếng Việt.',
    vnMistake: 'Đọc thành "i-ưa".',
    fixTip: 'Kết thúc ở âm "ê" bẹt môi (ví dụ: xiè xie đọc là "xia-xê" nhẹ nhàng).'
  },
  'ua': {
    name: 'ua',
    ipa: '[ua]',
    group: 'Vận mẫu kép',
    tongue: 'Môi chu tròn phát âm "u" ngắn, rồi mở rộng miệng bung to ra âm "a". Giống vần "oa" tiếng Việt.',
    vnMistake: 'Môi không đủ tròn lúc bắt đầu.',
    fixTip: 'Bắt đầu chu môi chữ u rồi bung nhanh sang a.'
  },
  'uo': {
    name: 'uo',
    ipa: '[uo]',
    group: 'Vận mẫu kép',
    tongue: 'Bắt đầu từ âm "u" chu nhỏ môi, chuyển dần sang âm "o" tròn vành môi. Đọc như vần "ua" tiếng Việt.',
    vnMistake: 'Đọc cứng thành "u-o".',
    fixTip: 'Chuyển môi tròn trơn tru như chữ "ua" trong "mùa vụ".'
  },
  've': {
    name: 'üe (ve)',
    ipa: '[yɛ]',
    group: 'Vận mẫu kép',
    tongue: 'Bắt đầu từ âm "ü" (tròn môi huýt sáo), mở nhẹ môi sang âm "ê". Đọc như "uy-ê" mượt mà.',
    vnMistake: 'Bẹt môi từ đầu làm mất âm ü.',
    fixTip: 'Chu môi tròn trước rồi mới hé mở sang ê (ví dụ: yuè du)..'
  },
  'iao': {
    name: 'iao',
    ipa: '[iaʊ]',
    group: 'Vận mẫu kép ba',
    tongue: 'Lướt nhanh liên tục: "i" $\\rightarrow$ "a" $\\rightarrow$ "o". Đọc tựa như vần "ieo" trong tiếng Việt.',
    vnMistake: 'Bỏ sót âm giữa "a".',
    fixTip: 'Nhấn rõ nhất vào âm chính "a" ở giữa.'
  },
  'iou': {
    name: 'iu (iou)',
    ipa: '[ioʊ]',
    group: 'Vận mẫu kép ba',
    tongue: 'Khi ghép âm viết tắt là "iu". Bắt đầu bằng âm "i" bẹt môi, lướt qua "o" rất nhanh và kết thúc ở "u". Đọc như "iêu" tiếng Việt.',
    vnMistake: 'Đọc thành "iu" cứng như tiếng Việt.',
    fixTip: 'Đọc có độ lướt như "iêu" (ví dụ: liù đọc như liêu).'
  },
  'uai': {
    name: 'uai',
    ipa: '[uaɪ]',
    group: 'Vận mẫu kép ba',
    tongue: 'Lướt nhanh: "u" $\\rightarrow$ "a" $\\rightarrow$ "i". Đọc giống như vần "oai" trong tiếng Việt.',
    vnMistake: 'Đọc rời rạc.',
    fixTip: 'Trượt một hơi liền mạch từ u qua a đến i.'
  },
  'uei': {
    name: 'ui (uei)',
    ipa: '[ueɪ]',
    group: 'Vận mẫu kép ba',
    tongue: 'Khi ghép âm viết tắt là "ui". Bắt đầu chu môi "u", lướt qua âm "e" (ơ nhẹ) rồi kết thúc ở "i". Đọc tựa như vần "uây" tiếng Việt.',
    vnMistake: 'Đọc thành "ui" tiếng Việt (ví dụ: duì đọc thành dui là sai).',
    fixTip: 'Phải đọc có âm ơ ở giữa thành "uây" (ví dụ: duì đọc như "đuây").'
  },

  // --- 3. NHÓM VẬN MẪU MŨI TRƯỚC (Âm tận cùng bằng N - ngậm đầu lưỡi) ---
  'an': {
    name: 'an',
    ipa: '[an]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Mở to phát âm "a", sau đó ĐẦU LƯỠI DÍNH CHẶT VÀO NƯỚU RĂNG TRÊN chặn hơi để âm thoát qua mũi. Đọc như vần "an" tiếng Việt.',
    vnMistake: 'Quên nâng đầu lưỡi chạm nướu răng trên.',
    fixTip: 'Kết thúc âm đầu lưỡi phải dán vào nướu răng cửa trên.'
  },
  'en': {
    name: 'en',
    ipa: '[ən]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Phát âm "e" (ưa/ơn) nhẹ nhàng, đầu lưỡi nâng lên chạm nướu trên để luồng khí thoát qua khoang mũi. Đọc gần giống vần "ơn" tiếng Việt.',
    vnMistake: 'Đọc thành "en" bẹt.',
    fixTip: 'Đọc như vần "ơn" (ví dụ: hěn đọc tựa như "hẩn").'
  },
  'in': {
    name: 'in',
    ipa: '[in]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Bẹt khóe môi phát âm "i", đầu lưỡi dán vào chân răng trên kết thúc âm mũi "n". Giống vần "in" tiếng Việt.',
    vnMistake: 'Âm này khá dễ với người Việt.',
    fixTip: 'Giữ âm thanh vang nhẹ ở cánh mũi.'
  },
  'vn': {
    name: 'ün (vn)',
    ipa: '[yn]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Môi giữ nguyên tròn nhỏ "ü" huýt sáo, kết thúc âm bằng cách đưa đầu lưỡi chạm nướu trên. Đọc tựa như vần "uyn" tiếng Việt nhưng môi chu cố định.',
    vnMistake: 'Môi bị bẹt ra khi kết thúc âm.',
    fixTip: 'Môi tròn suốt từ đầu đến cuối.'
  },
  'ian': {
    name: 'ian',
    ipa: '[iɛn]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Âm "i" lướt nhanh sang âm "e" (ê mềm) rồi đưa lưỡi lên chạm nướu trên. ĐỌC GIỐNG VẦN "IÊN" TIẾNG VIỆT.',
    vnMistake: 'CỰC KỲ NHIỀU BẠN ĐỌC THÀNH "I-AN" LÀ SAI! (Ví dụ: tiān phải đọc là "thiên", không đọc là thi-an).',
    fixTip: 'Nhớ kỹ: "ian" luôn đọc thành "IÊN" (như trong tiền, thiên).'
  },
  'uan': {
    name: 'uan',
    ipa: '[uan]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Bắt đầu từ "u" chu môi rồi sang "an" (đầu lưỡi chạm nướu trên). Đọc như vần "oan" tiếng Việt.',
    vnMistake: 'Đọc thành u-an rời.',
    fixTip: 'Lướt liền mạch thành "oan".'
  },
  'van': {
    name: 'üan (van)',
    ipa: '[yɛn]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Bắt đầu từ "ü" (tròn môi), lướt sang âm "ê" rồi khép đầu lưỡi nướu trên. ĐỌC NHƯ VẦN "UYÊN" TRONG TIẾNG VIỆT.',
    vnMistake: 'Đọc thành "u-an".',
    fixTip: 'Nhớ kỹ: üan luôn đọc thành "UYÊN" (ví dụ: yuán đọc như "nguyên/uyển").'
  },
  'uen': {
    name: 'un (uen)',
    ipa: '[uən]',
    group: 'Vận mẫu mũi trước (-n)',
    tongue: 'Khi ghép âm viết tắt là "un". Bắt đầu từ "u", lướt qua âm "ơ" rồi khép đầu lưỡi nướu trên. Đọc như vần "uân" trong tiếng Việt.',
    vnMistake: 'Đọc thành "un" tiếng Việt (ví dụ: wén đọc là vân/uân).',
    fixTip: 'Đọc có âm ơ nhẹ thành "uân" (ví dụ: chūn đọc như xuân).'
  },

  // --- 4. NHÓM VẬN MẪU MŨI SAU (Âm tận cùng bằng NG - nâng cuống lưỡi) ---
  'ang': {
    name: 'ang',
    ipa: '[aŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Mở to phát âm "a", sau đó NÂNG CUỐNG LƯỠI CHẠM NGẠC MỀM (vòm sau), hơi thoát qua mũi tạo âm vang to. Giống vần "ang" tiếng Việt.',
    vnMistake: 'Không nâng cuống lưỡi làm âm mũi bị nông.',
    fixTip: 'Để âm vang vọng từ đáy cuống họng lên mũi.'
  },
  'eng': {
    name: 'eng',
    ipa: '[əŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Mở miệng tự nhiên phát âm "e" (ưa/ơ), cuống lưỡi thụt về sau khép vào ngạc mềm. ĐỌC GẦN GIỐNG VẦN "ÂNG" TIẾNG VIỆT.',
    vnMistake: 'Đọc thành "eng" bẹt tiếng Việt (ví dụ: péngyou đọc thành peng-you là sai).',
    fixTip: 'Đọc thành vần "âng" (ví dụ: péng đọc là pẩng, shēng đọc là sâng).'
  },
  'ing': {
    name: 'ing',
    ipa: '[iŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Bẹt khóe môi phát âm "i", nâng cuống lưỡi lên ngạc mềm để tạo âm vang mũi sau. Giống vần "inh" tiếng Việt.',
    vnMistake: 'Quên kéo khóe môi sang 2 bên.',
    fixTip: 'Mỉm cười bè môi phát âm "inh" thanh thoát.'
  },
  'ong': {
    name: 'ong',
    ipa: '[ʊŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Môi tròn khép nhỏ, cuống lưỡi nâng cao chạm ngạc mềm. ĐỌC NHƯ VẦN "UNG" TRONG TIẾNG VIỆT.',
    vnMistake: 'Đọc thành "ong" mở rộng miệng tiếng Việt (ví dụ: tóngxué đọc thành tong là sai).',
    fixTip: 'Môi tròn nhỏ đọc thành "ung" (ví dụ: tóng đọc là thúng).'
  },
  'iang': {
    name: 'iang',
    ipa: '[iaŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Bắt đầu từ "i" bẹt môi, lướt nhanh sang "ang" cuống lưỡi vang mũi. Giống vần "iang" trong tiếng Việt.',
    vnMistake: 'Bỏ sót âm i ban đầu.',
    fixTip: 'Đọc như "i-ang" lướt nhanh (ví dụ: liǎng đọc là liảng).'
  },
  'iong': {
    name: 'iong',
    ipa: '[iʊŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Khóe môi bẹt "i", lướt nhanh sang "ong" (ung tròn môi). ĐỌC NHƯ VẦN "IUNG" HOẶC "UNG" MỎNG.',
    vnMistake: 'Đọc thành "i-ong".',
    fixTip: 'Đọc như vần "iung" (ví dụ: xióng māo đọc là xiung mao).'
  },
  'uang': {
    name: 'uang',
    ipa: '[uaŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Bắt đầu từ "u" chu môi, lướt nhanh sang "ang" nâng cuống lưỡi. Đọc như vần "oang" tiếng Việt.',
    vnMistake: 'Đọc rời rạc.',
    fixTip: 'Lướt mượt mà thành "oang" (ví dụ: huáng).'
  },
  'ueng': {
    name: 'ueng',
    ipa: '[uəŋ]',
    group: 'Vận mẫu mũi sau (-ng)',
    tongue: 'Bắt đầu bằng "u", lướt sang "eng" (âng). Thường chỉ đứng độc lập viết thành "weng".',
    vnMistake: 'Âm này ít gặp.',
    fixTip: 'Đọc tựa như "uâng".'
  }
};
