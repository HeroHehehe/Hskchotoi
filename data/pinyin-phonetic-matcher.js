/**
 * BỘ TỰ ĐIỂN VÀ ÁNH XẠ NGỮ ÂM PINYIN PHỤC VỤ NHẬN DẠNG GIỌNG NÓI CHÍNH XÁC
 * Giúp nhận dạng chuẩn xác cả Chữ Hán, Thanh Mẫu đơn, Vận Mẫu đơn, Ghép vần
 */

// Ánh xạ 21 Thanh mẫu sang các chữ Hán và Pinyin mà Google Speech zh-CN nhận diện được khi đọc
window.PINYIN_INITIALS_MAP = {
  'b': { name: 'b', pinyin: 'bō', variants: ['b', 'bo', 'bō', 'bó', 'bǒ', 'bò'], hanzi: ['波', '玻', '播', '拨', '菠'] },
  'p': { name: 'p', pinyin: 'pō', variants: ['p', 'po', 'pō', 'pó', 'pǒ', 'pò'], hanzi: ['坡', '颇', '婆', '破', '粕'] },
  'm': { name: 'm', pinyin: 'mō', variants: ['m', 'mo', 'mō', 'mó', 'mǒ', 'mò'], hanzi: ['摸', '磨', '抹', '默', '莫'] },
  'f': { name: 'f', pinyin: 'fō', variants: ['f', 'fo', 'fō', 'fó'], hanzi: ['佛'] },
  'd': { name: 'd', pinyin: 'dē', variants: ['d', 'de', 'dē', 'dé', 'dě', 'dè'], hanzi: ['得', '的', '德'] },
  't': { name: 't', pinyin: 'tē', variants: ['t', 'te', 'tē', 'té', 'tě', 'tè'], hanzi: ['特', '忒'] },
  'n': { name: 'n', pinyin: 'nè', variants: ['n', 'ne', 'nē', 'né', 'ně', 'nè'], hanzi: ['讷', '呢', '呐'] },
  'l': { name: 'l', pinyin: 'lè', variants: ['l', 'le', 'lē', 'lé', 'lě', 'lè'], hanzi: ['勒', '乐', '了'] },
  'g': { name: 'g', pinyin: 'gē', variants: ['g', 'ge', 'gē', 'gé', 'gě', 'gè'], hanzi: ['哥', '歌', '格', '各', '个'] },
  'k': { name: 'k', pinyin: 'kē', variants: ['k', 'ke', 'kē', 'ké', 'kě', 'kè'], hanzi: ['科', '棵', '渴', '克', '客', '可'] },
  'h': { name: 'h', pinyin: 'hē', variants: ['h', 'he', 'hē', 'hé', 'hě', 'hè'], hanzi: ['喝', '河', '和', '何', '贺', '合'] },
  'j': { name: 'j', pinyin: 'jī', variants: ['j', 'ji', 'jī', 'jí', 'jǐ', 'jì'], hanzi: ['鸡', '基', '机', '极', '几', '记'] },
  'q': { name: 'q', pinyin: 'qī', variants: ['q', 'qi', 'qī', 'qí', 'qǐ', 'qì'], hanzi: ['七', '期', '奇', '起', '气', '器'] },
  'x': { name: 'x', pinyin: 'xī', variants: ['x', 'xi', 'xī', 'xí', 'xǐ', 'xì'], hanzi: ['西', '希', '息', '习', '喜', '细'] },
  'zh': { name: 'zh', pinyin: 'zhī', variants: ['zh', 'zhi', 'zhī', 'zhí', 'zhǐ', 'zhì'], hanzi: ['知', '支', '枝', '直', '只', '指', '志'] },
  'ch': { name: 'ch', pinyin: 'chī', variants: ['ch', 'chi', 'chī', 'chí', 'chǐ', 'chì'], hanzi: ['吃', '哧', '迟', '池', '尺', '齿', '赤'] },
  'sh': { name: 'sh', pinyin: 'shī', variants: ['sh', 'shi', 'shī', 'shí', 'shǐ', 'shì'], hanzi: ['诗', '师', '狮', '十', '石', '时', '使', '始', '是', '事'] },
  'r': { name: 'r', pinyin: 'rì', variants: ['r', 'ri', 'rī', 'rí', 'rǐ', 'rì'], hanzi: ['日', '热'] },
  'z': { name: 'z', pinyin: 'zī', variants: ['z', 'zi', 'zī', 'zí', 'zǐ', 'zì'], hanzi: ['资', '姿', '滋', '子', '紫', '自', '字'] },
  'c': { name: 'c', pinyin: 'cī', variants: ['c', 'ci', 'cī', 'cí', 'cǐ', 'cì'], hanzi: ['疵', '词', '慈', '此', '次', '刺'] },
  's': { name: 's', pinyin: 'sī', variants: ['s', 'si', 'sī', 'sí', 'sǐ', 'sì'], hanzi: ['思', '司', '丝', '斯', '死', '四', '寺'] }
};

// Ánh xạ 36 Vận mẫu sang chữ Hán và Pinyin nhận diện
window.PINYIN_FINALS_MAP = {
  'a': { name: 'a', pinyin: 'a', variants: ['a', 'ā', 'á', 'ǎ', 'à'], hanzi: ['啊', '阿'] },
  'o': { name: 'o', pinyin: 'o', variants: ['o', 'ō', 'ó', 'ǒ', 'ò', 'wo'], hanzi: ['哦', '喔', '窝'] },
  'e': { name: 'e', pinyin: 'e', variants: ['e', 'ē', 'é', 'ě', 'è'], hanzi: ['鹅', '俄', '饿', '阿', '额'] },
  'i': { name: 'i', pinyin: 'yi', variants: ['i', 'yi', 'yī', 'yí', 'yǐ', 'yì'], hanzi: ['衣', '一', '依', '疑', '已', '以', '意'] },
  'u': { name: 'u', pinyin: 'wu', variants: ['u', 'wu', 'wū', 'wú', 'wǔ', 'wù'], hanzi: ['乌', '屋', '无', '五', '物', '舞'] },
  'v': { name: 'ü', pinyin: 'yu', variants: ['v', 'ü', 'yu', 'yū', 'yú', 'yǔ', 'yù', 'lv', 'nv'], hanzi: ['迂', '鱼', '雨', '语', '玉', '育'] },
  'er': { name: 'er', pinyin: 'er', variants: ['er', 'ēr', 'ér', 'ěr', 'èr'], hanzi: ['儿', '耳', '二', '而'] },
  'ai': { name: 'ai', pinyin: 'ai', variants: ['ai', 'āi', 'ái', 'ǎi', 'ài'], hanzi: ['哀', '埃', '矮', '爱', '挨'] },
  'ei': { name: 'ei', pinyin: 'ei', variants: ['ei', 'ēi', 'éi', 'ěi', 'èi'], hanzi: ['诶', '欸'] },
  'ao': { name: 'ao', pinyin: 'ao', variants: ['ao', 'āo', 'áo', 'ǎo', 'ào'], hanzi: ['熬', '敖', '袄', '傲', '奥'] },
  'ou': { name: 'ou', pinyin: 'ou', variants: ['ou', 'ōu', 'óu', 'ǒu', 'òu'], hanzi: ['欧', '鸥', '偶', '藕', '肉'] },
  'ia': { name: 'ia', pinyin: 'ya', variants: ['ia', 'ya', 'yā', 'yá', 'yǎ', 'yà'], hanzi: ['呀', '鸭', '牙', '哑', '亚'] },
  'ie': { name: 'ie', pinyin: 'ye', variants: ['ie', 'ye', 'yē', 'yé', 'yě', 'yè'], hanzi: ['耶', '椰', '爷', '也', '野', '页', '夜'] },
  'ua': { name: 'ua', pinyin: 'wa', variants: ['ua', 'wa', 'wā', 'wá', 'wǎ', 'wà'], hanzi: ['哇', '蛙', '娃', '瓦', '袜'] },
  'uo': { name: 'uo', pinyin: 'wo', variants: ['uo', 'wo', 'wō', 'wó', 'wǒ', 'wò'], hanzi: ['窝', '我', '握', '卧'] },
  've': { name: 'üe', pinyin: 'yue', variants: ['ve', 'üe', 'yue', 'yuē', 'yué', 'yuě', 'yuè'], hanzi: ['约', '月', '乐', '越', '跃'] },
  'iao': { name: 'iao', pinyin: 'yao', variants: ['iao', 'yao', 'yāo', 'yáo', 'yǎo', 'yào'], hanzi: ['腰', '妖', '摇', '咬', '要', '耀'] },
  'iou': { name: 'iu', pinyin: 'you', variants: ['iu', 'iou', 'you', 'yōu', 'yóu', 'yǒu', 'yòu'], hanzi: ['优', '油', '游', '有', '又', '右'] },
  'uai': { name: 'uai', pinyin: 'wai', variants: ['uai', 'wai', 'wāi', 'wái', 'wǎi', 'wài'], hanzi: ['歪', '外'] },
  'uei': { name: 'ui', pinyin: 'wei', variants: ['ui', 'uei', 'wei', 'wēi', 'wéi', 'wěi', 'wèi'], hanzi: ['微', '威', '围', '为', '伟', '卫', '对'] },
  'an': { name: 'an', pinyin: 'an', variants: ['an', 'ān', 'án', 'ǎn', 'àn'], hanzi: ['安', '按', '暗', '岸'] },
  'en': { name: 'en', pinyin: 'en', variants: ['en', 'ēn', 'én', 'ěn', 'èn'], hanzi: ['恩', '嗯'] },
  'in': { name: 'in', pinyin: 'yin', variants: ['in', 'yin', 'yīn', 'yín', 'yǐn', 'yìn'], hanzi: ['音', '因', '阴', '银', '引', '印'] },
  'vn': { name: 'ün', pinyin: 'yun', variants: ['vn', 'ün', 'yun', 'yūn', 'yún', 'yǔn', 'yùn'], hanzi: ['晕', '云', '匀', '允', '运', '韵'] },
  'ian': { name: 'ian', pinyin: 'yan', variants: ['ian', 'yan', 'yān', 'yán', 'yǎn', 'yàn'], hanzi: ['烟', '淹', '言', '严', '眼', '演', '燕', '见', '天'] },
  'uan': { name: 'uan', pinyin: 'wan', variants: ['uan', 'wan', 'wān', 'wán', 'wǎn', 'wàn'], hanzi: ['弯', '湾', '完', '玩', '晚', '万'] },
  'van': { name: 'üan', pinyin: 'yuan', variants: ['van', 'üan', 'yuan', 'yuān', 'yuán', 'yuǎn', 'yuàn'], hanzi: ['冤', '渊', '元', '原', '圆', '远', '院'] },
  'uen': { name: 'un', pinyin: 'wen', variants: ['un', 'uen', 'wen', 'wēn', 'wén', 'wěn', 'wèn'], hanzi: ['温', '文', '闻', '吻', '问'] },
  'ang': { name: 'ang', pinyin: 'ang', variants: ['ang', 'āng', 'áng', 'ǎng', 'àng'], hanzi: ['昂'] },
  'eng': { name: 'eng', pinyin: 'eng', variants: ['eng', 'ēng', 'éng', 'ěng', 'èng', 'heng'], hanzi: ['鞥', '亨', '层', '生', '朋'] },
  'ing': { name: 'ing', pinyin: 'ying', variants: ['ing', 'ying', 'yīng', 'yíng', 'yǐng', 'yìng'], hanzi: ['英', '应', '鹰', '迎', '影', '硬'] },
  'ong': { name: 'ong', pinyin: 'weng', variants: ['ong', 'weng', 'hōng', 'tóng'], hanzi: ['翁', '同', '通', '中'] },
  'iang': { name: 'iang', pinyin: 'yang', variants: ['iang', 'yang', 'yāng', 'yáng', 'yǎng', 'yàng'], hanzi: ['央', '羊', '阳', '养', '样'] },
  'iong': { name: 'iong', pinyin: 'yong', variants: ['iong', 'yong', 'yōng', 'yóng', 'yǒng', 'yòng'], hanzi: ['庸', '拥', '勇', '用'] },
  'uang': { name: 'uang', pinyin: 'wang', variants: ['uang', 'wang', 'wāng', 'wáng', 'wǎng', 'wàng'], hanzi: ['汪', '王', '亡', '往', '望'] },
  'ueng': { name: 'ueng', pinyin: 'weng', variants: ['ueng', 'weng', 'wēng', 'wéng', 'wěng', 'wèng'], hanzi: ['翁', '瓮'] }
};

/**
 * Chuẩn hóa Pinyin (bỏ dấu) để so khớp âm thuần
 */
window.stripPinyinTone = function(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[āáǎà]/g, 'a')
    .replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i')
    .replace(/[ōóǒò]/g, 'o')
    .replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'v')
    .replace(/[^a-z]/g, '');
};

/**
 * Tính khoảng cách Levenshtein giữa 2 chuỗi để đánh giá độ giống nhau âm vị
 */
window.calcStringSimilarity = function(s1, s2) {
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = Array.from({ length: len1 + 1 }, () => new Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const dist = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return Math.max(0, 1 - dist / maxLen);
};
