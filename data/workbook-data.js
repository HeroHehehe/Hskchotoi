/**
 * Cơ sở dữ liệu 15 Bài Sách Bài Tập (学练手册) HSK 1 Chuẩn 3.0
 * Đầy đủ bài tập ngữ âm, nghe đọc điền khuyết, trắc nghiệm mô phỏng HSK, audio MP3 và lời giải chi tiết
 */

window.HSK_WORKBOOK = [
  {
    "lesson_id": 1,
    "lesson_title": "AI小语，你好！",
    "lesson_title_vi": "AI Xiaoyu, xin chào!",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_01_phonetics.mp3",
      "practice": "assets/audio/workbook/lesson_01_practice.mp3",
      "mock": null,
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_01_phonetics.mp3",
        "notes": [
          "Cấu tạo âm tiết tiếng Trung: Thông thường gồm Thanh mẫu (声母) + Vận mẫu (韵母) + Thanh điệu (声调).",
          "Bảng thanh mẫu đầu tiên: b, p, m, f, d, t, n, l, g, k, h.",
          "4 Thanh điệu cơ bản: Thanh 1 (ngang cao 55), Thanh 2 (lên cao 35), Thanh 3 (xuống lên 214), Thanh 4 (xuống dứt khoát 51)."
        ],
        "speaking_practice": [
          {
            "hanzi": "茶",
            "pinyin": "chá",
            "vi": "trà"
          },
          {
            "hanzi": "狗",
            "pinyin": "gǒu",
            "vi": "chó"
          },
          {
            "hanzi": "猫",
            "pinyin": "māo",
            "vi": "mèo"
          },
          {
            "hanzi": "菜",
            "pinyin": "cài",
            "vi": "món ăn / rau"
          },
          {
            "hanzi": "杯子",
            "pinyin": "bēizi",
            "vi": "cốc, ly"
          },
          {
            "hanzi": "学生",
            "pinyin": "xuésheng",
            "vi": "học sinh"
          },
          {
            "hanzi": "老师",
            "pinyin": "lǎoshī",
            "vi": "thầy/cô giáo"
          },
          {
            "hanzi": "鸡蛋",
            "pinyin": "jīdàn",
            "vi": "trứng gà"
          },
          {
            "hanzi": "你好",
            "pinyin": "nǐhǎo",
            "vi": "xin chào"
          },
          {
            "hanzi": "朋友",
            "pinyin": "péngyou",
            "vi": "bạn bè"
          }
        ]
      },
      {
        "id": "practice",
        "title": "听读练 • Nghe, đọc và luyện tập",
        "audio_key": "practice",
        "audio_url": "assets/audio/workbook/lesson_01_practice.mp3",
        "exercises": [
          {
            "id": "p1_fill_initial",
            "title": "1. Nghe ghi âm, chọn thanh mẫu thích hợp điền vào chỗ trống",
            "type": "quiz_choice",
            "questions": [
              {
                "id": "q1",
                "prompt": "1. _ēi",
                "options": [
                  "m",
                  "b",
                  "p",
                  "f"
                ],
                "answer": "m",
                "pinyin": "mēi",
                "explain": "Nghe được âm 'mēi' -> chọn thanh mẫu m."
              },
              {
                "id": "q2",
                "prompt": "2. _ān",
                "options": [
                  "d",
                  "t",
                  "n",
                  "l"
                ],
                "answer": "d",
                "pinyin": "dān",
                "explain": "Nghe được âm 'dān' -> chọn thanh mẫu d."
              },
              {
                "id": "q3",
                "prompt": "3. _ī",
                "options": [
                  "p",
                  "b",
                  "m",
                  "t"
                ],
                "answer": "p",
                "pinyin": "pī",
                "explain": "Nghe được âm 'pī' (bật hơi) -> chọn p."
              },
              {
                "id": "q4",
                "prompt": "4. _èng",
                "options": [
                  "f",
                  "g",
                  "k",
                  "h"
                ],
                "answer": "f",
                "pinyin": "fèng",
                "explain": "Nghe được âm 'fèng' -> chọn f."
              }
            ]
          },
          {
            "id": "p1_dialogue_match",
            "title": "2. Nhìn hình ảnh và chọn câu hội thoại phù hợp",
            "type": "dialogue_match",
            "questions": [
              {
                "id": "d1",
                "context": "Hai người bạn lần đầu gặp nhau chào hỏi thân thiện:",
                "options": [
                  "A: 你好！ B: 你好！",
                  "A: 谢谢！ B: 不客气！",
                  "A: 再见！ B: 再见！"
                ],
                "answer": "A: 你好！ B: 你好！",
                "explain": "Chào hỏi thông thường giữa 2 người dùng 你好！"
              },
              {
                "id": "d2",
                "context": "Cô giáo bước vào lớp chào tất cả học sinh:",
                "options": [
                  "A: 你们好！ B: 老师好！",
                  "A: 对不起！ B: 没关系！",
                  "A: 没事！ B: 没事！"
                ],
                "answer": "A: 你们好！ B: 老师好！",
                "explain": "Cô giáo chào cả lớp là 你们好, học sinh chào lại là 老师好!"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 2,
    "lesson_title": "我叫李文",
    "lesson_title_vi": "Mình tên là Lý Văn",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_02_phonetics.mp3",
      "practice": "assets/audio/workbook/lesson_02_practice.mp3",
      "mock": null,
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_02_phonetics.mp3",
        "notes": [
          "Quy tắc ghép âm của nhóm j, q, x: Khi ghép với vận mẫu ü, dấu hai chấm trên đầu lược bỏ, viết thành u (nhưng vẫn đọc là ü).",
          "Cách phát âm các thanh mẫu mặt lưỡi: j (ch nhẹ), q (bật hơi), x (x nhẹ)."
        ],
        "speaking_practice": [
          {
            "hanzi": "七",
            "pinyin": "qī",
            "vi": "số bảy"
          },
          {
            "hanzi": "鞋",
            "pinyin": "xié",
            "vi": "giày"
          },
          {
            "hanzi": "洗手",
            "pinyin": "xǐshǒu",
            "vi": "rửa tay"
          },
          {
            "hanzi": "铅笔",
            "pinyin": "qiānbǐ",
            "vi": "bút chì"
          },
          {
            "hanzi": "下棋",
            "pinyin": "xiàqí",
            "vi": "đánh cờ"
          },
          {
            "hanzi": "谢谢",
            "pinyin": "xièxie",
            "vi": "cảm ơn"
          },
          {
            "hanzi": "李文",
            "pinyin": "Lǐ Wén",
            "vi": "Lý Văn"
          },
          {
            "hanzi": "名字",
            "pinyin": "míngzi",
            "vi": "tên"
          }
        ]
      },
      {
        "id": "practice",
        "title": "听读练 • Nghe, đọc và luyện tập",
        "audio_key": "practice",
        "audio_url": "assets/audio/workbook/lesson_02_practice.mp3",
        "exercises": [
          {
            "id": "p2_quiz",
            "title": "1. Nghe và chọn từ/âm tiết chính xác",
            "type": "quiz_choice",
            "questions": [
              {
                "id": "q1",
                "prompt": "1. Chọn cách viết pinyin đúng của từ 'cảm ơn':",
                "options": [
                  "xièxie",
                  "xìexie",
                  "xèixei",
                  "sièsie"
                ],
                "answer": "xièxie",
                "explain": "谢谢 viết pinyin chuẩn là xièxie."
              },
              {
                "id": "q2",
                "prompt": "2. Đại từ nhân xưng 'Tôi' trong tiếng Trung là:",
                "options": [
                  "我 (wǒ)",
                  "你 (nǐ)",
                  "他 (tā)",
                  "您 (nín)"
                ],
                "answer": "我 (wǒ)",
                "explain": "我 (wǒ) là đại từ ngôi thứ nhất số ít."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 3,
    "lesson_title": "我是中国人",
    "lesson_title_vi": "Mình là người Trung Quốc",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_03_phonetics.mp3",
      "practice": "assets/audio/workbook/lesson_03_practice.mp3",
      "mock": null,
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_03_phonetics.mp3",
        "notes": [
          "Các thanh mẫu đầu lưỡi trước: z, c, s và đầu lưỡi sau: zh, ch, sh, r.",
          "Nguyên âm đặc biệt i khi đi với z, c, s đọc là ư nhẹ; đi với zh, ch, sh, r đọc là ư uốn lưỡi."
        ],
        "speaking_practice": [
          {
            "hanzi": "中国",
            "pinyin": "Zhōngguó",
            "vi": "Trung Quốc"
          },
          {
            "hanzi": "法国",
            "pinyin": "Fǎguó",
            "vi": "Pháp"
          },
          {
            "hanzi": "英国",
            "pinyin": "Yīngguó",
            "vi": "Anh"
          },
          {
            "hanzi": "美国",
            "pinyin": "Měiguó",
            "vi": "Mỹ"
          },
          {
            "hanzi": "人",
            "pinyin": "rén",
            "vi": "người"
          },
          {
            "hanzi": "中文",
            "pinyin": "Zhōngwén",
            "vi": "tiếng Trung"
          }
        ]
      },
      {
        "id": "practice",
        "title": "听读练 • Nghe, đọc và luyện tập",
        "audio_key": "practice",
        "audio_url": "assets/audio/workbook/lesson_03_practice.mp3",
        "exercises": [
          {
            "id": "p3_quiz",
            "title": "1. Nghe và điền từ vựng quốc gia & ngôn ngữ",
            "type": "quiz_choice",
            "questions": [
              {
                "id": "q1",
                "prompt": "1. 'Tôi là người Trung Quốc' dịch sang tiếng Trung là:",
                "options": [
                  "我是中国人 (Wǒ shì Zhōngguó rén)",
                  "我叫中国人 (Wǒ jiào Zhōngguó rén)",
                  "我不是中国人 (Wǒ bú shì Zhōngguó rén)",
                  "我认识中国人 (Wǒ rènshi Zhōngguó rén)"
                ],
                "answer": "我是中国人 (Wǒ shì Zhōngguó rén)",
                "explain": "Cấu trúc A 是 B: Tôi là người Trung Quốc."
              },
              {
                "id": "q2",
                "prompt": "2. Từ chỉ tiếng Pháp là:",
                "options": [
                  "法语 (Fǎyǔ)",
                  "中文 (Zhōngwén)",
                  "英语 (Yīngyǔ)",
                  "汉语 (Hànyǔ)"
                ],
                "answer": "法语 (Fǎyǔ)",
                "explain": "法语 là tiếng Pháp, 法国 là nước Pháp."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 4,
    "lesson_title": "我有两个孩子",
    "lesson_title_vi": "Chị có hai con",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_04_phonetics.mp3",
      "practice": "assets/audio/workbook/lesson_04_practice.mp3",
      "mock": "assets/audio/workbook/lesson_04_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_04_phonetics.mp3",
        "notes": [
          "Quy tắc biến điệu 2 thanh 3: Khi hai thanh 3 đi liền nhau, chữ thứ nhất đổi đọc thành thanh 2 (214 + 214 -> 35 + 214). Ví dụ: 你好 (nǐ hǎo -> ní hǎo), 水果 (shuǐ guǒ -> shuí guǒ).",
          "Thanh nhẹ (轻声): Đọc nhẹ và ngắn, không đánh dấu thanh điệu. Ví dụ: 衣服 (yīfu), 谢谢 (xièxie)."
        ],
        "speaking_practice": [
          {
            "hanzi": "哪里",
            "pinyin": "nǎli",
            "vi": "đâu, ở đâu"
          },
          {
            "hanzi": "小语",
            "pinyin": "Xiǎoyǔ",
            "vi": "Tiểu Ngữ"
          },
          {
            "hanzi": "水果",
            "pinyin": "shuǐguǒ",
            "vi": "hoa quả, trái cây"
          },
          {
            "hanzi": "衣服",
            "pinyin": "yīfu",
            "vi": "quần áo"
          },
          {
            "hanzi": "漂亮",
            "pinyin": "piàoliang",
            "vi": "xinh đẹp"
          },
          {
            "hanzi": "早上",
            "pinyin": "zǎoshang",
            "vi": "buổi sáng"
          },
          {
            "hanzi": "两个孩子",
            "pinyin": "liǎng gè háizi",
            "vi": "hai đứa con"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_04_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_04_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 5,
    "lesson_title": "今天我休息",
    "lesson_title_vi": "Hôm nay anh được nghỉ",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_05_phonetics.mp3",
      "practice": "assets/audio/workbook/lesson_05_practice.mp3",
      "mock": "assets/audio/workbook/lesson_05_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_05_phonetics.mp3",
        "notes": [
          "Quy tắc biến điệu của chữ 不 (bù): Bình thường đọc thanh 4, nhưng khi đứng trước từ mang thanh 4 thì 不 đổi đọc thành thanh 2 (bú). Ví dụ: 不是 (bú shì), 不要 (bú yào).",
          "Thanh nhẹ trong từ xưng hô thân mật: 妈妈 (māma), 爸爸 (bàba)."
        ],
        "speaking_practice": [
          {
            "hanzi": "今天我休息",
            "pinyin": "",
            "vi": "Hôm nay anh được nghỉ"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_05_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_05_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 6,
    "lesson_title": "你的手机号是多少？",
    "lesson_title_vi": "Số điện thoại của bạn là bao nhiêu?",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_06_phonetics.mp3",
      "practice": "assets/audio/workbook/lesson_06_practice.mp3",
      "mock": "assets/audio/workbook/lesson_06_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_06_phonetics.mp3",
        "notes": [
          "Quy tắc biến điệu của chữ 一 (yī): Bình thường đọc thanh 1. Đứng trước thanh 4 đổi đọc thành thanh 2 (yí). Đứng trước thanh 1, 2, 3 đổi đọc thành thanh 4 (yì).",
          "Cách đọc số điện thoại: Số 1 thường đọc là yāo để tránh nhầm với số 7 (qī)."
        ],
        "speaking_practice": [
          {
            "hanzi": "你的手机号是多少？",
            "pinyin": "",
            "vi": "Số điện thoại của bạn là bao nhiêu?"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_06_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_06_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 7,
    "lesson_title": "我晚上六点半下班",
    "lesson_title_vi": "Em tan làm lúc 6 rưỡi tối",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_07_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_07_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_07_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 7: 我晚上六点半下班 (Em tan làm lúc 6 rưỡi tối).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "我晚上六点半下班",
            "pinyin": "",
            "vi": "Em tan làm lúc 6 rưỡi tối"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_07_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_07_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 8,
    "lesson_title": "我爸爸也在医院工作",
    "lesson_title_vi": "Bố em cũng làm việc ở bệnh viện",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_08_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_08_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_08_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 8: 我爸爸也在医院工作 (Bố em cũng làm việc ở bệnh viện).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "我爸爸也在医院工作",
            "pinyin": "",
            "vi": "Bố em cũng làm việc ở bệnh viện"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_08_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_08_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 9,
    "lesson_title": "我明天上午在学校学习",
    "lesson_title_vi": "Sáng mai mình học ở trường",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_09_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_09_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_09_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 9: 我明天上午在学校学习 (Sáng mai mình học ở trường).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "我明天上午在学校学习",
            "pinyin": "",
            "vi": "Sáng mai mình học ở trường"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_09_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_09_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 10,
    "lesson_title": "这儿的苹果真便宜！",
    "lesson_title_vi": "Táo ở đây rẻ thật!",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_10_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_10_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_10_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 10: 这儿的苹果真便宜！ (Táo ở đây rẻ thật!).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "这儿的苹果真便宜！",
            "pinyin": "",
            "vi": "Táo ở đây rẻ thật!"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_10_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_10_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 11,
    "lesson_title": "我读大学呢",
    "lesson_title_vi": "Em đang học đại học",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_11_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_11_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_11_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 11: 我读大学呢 (Em đang học đại học).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "我读大学呢",
            "pinyin": "",
            "vi": "Em đang học đại học"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_11_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_11_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 12,
    "lesson_title": "昨天下雪了",
    "lesson_title_vi": "Hôm qua tuyết rơi rồi",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_12_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_12_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_12_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 12: 昨天下雪了 (Hôm qua tuyết rơi rồi).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "昨天下雪了",
            "pinyin": "",
            "vi": "Hôm qua tuyết rơi rồi"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_12_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_12_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 13,
    "lesson_title": "请给我一杯茶",
    "lesson_title_vi": "Cho tôi một cốc trà",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_13_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_13_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_13_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 13: 请给我一杯茶 (Cho tôi một cốc trà).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "请给我一杯茶",
            "pinyin": "",
            "vi": "Cho tôi một cốc trà"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_13_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_13_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 14,
    "lesson_title": "我看了一个电影",
    "lesson_title_vi": "Mình đã xem một bộ phim",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_14_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_14_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_14_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 14: 我看了一个电影 (Mình đã xem một bộ phim).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "我看了一个电影",
            "pinyin": "",
            "vi": "Mình đã xem một bộ phim"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_14_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_14_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "lesson_id": 15,
    "lesson_title": "大兴机场见！",
    "lesson_title_vi": "Hẹn gặp ở sân bay Đại Hưng!",
    "audio": {
      "phonetics": "assets/audio/workbook/lesson_15_phonetics.mp3",
      "practice": null,
      "mock": "assets/audio/workbook/lesson_15_mock.mp3",
      "youtube": "https://www.youtube.com/watch?v=avk5eJSrALw&list=PLFXnXYoI8zL4drnswoPt8MLE3xnehKkWz"
    },
    "sections": [
      {
        "id": "phonetics",
        "title": "小语讲堂 • Kiến thức Ngữ âm & Luyện nói",
        "audio_key": "phonetics",
        "audio_url": "assets/audio/workbook/lesson_15_phonetics.mp3",
        "notes": [
          "Trọng tâm kiến thức ngữ âm và kết cấu chữ Hán của Bài 15: 大兴机场见！ (Hẹn gặp ở sân bay Đại Hưng!).",
          "Nắm vững khẩu hình, quy tắc ngắt nhịp và ngữ điệu tự nhiên của câu hỏi và câu trần thuật."
        ],
        "speaking_practice": [
          {
            "hanzi": "大兴机场见！",
            "pinyin": "",
            "vi": "Hẹn gặp ở sân bay Đại Hưng!"
          }
        ]
      },
      {
        "id": "mock_test",
        "title": "模拟测练 • Luyện thi mô phỏng HSK (Có chấm điểm ngay)",
        "audio_key": "mock",
        "audio_url": "assets/audio/workbook/lesson_15_mock.mp3",
        "exercises": [
          {
            "id": "mock_listening",
            "title": "Phần 1: 听力 (Nghe hiểu mô phỏng HSK)",
            "type": "mock_listening",
            "audio_url": "assets/audio/workbook/lesson_15_mock.mp3",
            "questions": [
              {
                "id": "m_l1",
                "prompt": "Câu 1: Nghe cụm từ và chọn câu trả lời đúng với nội dung nghe được:",
                "audio_text": "三个苹果 (Sān gè píngguǒ)",
                "options": [
                  "A. 三个苹果 (3 quả táo)",
                  "B. 两个孩子 (2 đứa con)",
                  "C. 四本书 (4 quyển sách)"
                ],
                "answer": "A. 三个苹果 (3 quả táo)",
                "explain": "Audio đọc '三个苹果' nghĩa là 3 quả táo."
              },
              {
                "id": "m_l2",
                "prompt": "Câu 2: Nghe câu hỏi và chọn câu đáp phù hợp:",
                "audio_text": "今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
                "options": [
                  "A. 非常热 (Rất nóng)",
                  "B. 在学习 (Đang học)",
                  "C. 很好听 (Rất hay)"
                ],
                "answer": "A. 非常热 (Rất nóng)",
                "explain": "Câu hỏi thời tiết hôm nay thế nào -> Trả lời: 非常热 (Rất nóng)."
              },
              {
                "id": "m_l3",
                "prompt": "Câu 3: Nghe hội thoại và xác nhận tính Đúng / Sai:",
                "audio_text": "女：你好！ 男：你好！很高兴认识你。",
                "statement": "Hai người trong đoạn hội thoại rất vui được quen biết nhau.",
                "options": [
                  "Đúng (✓)",
                  "Sai (✗)"
                ],
                "answer": "Đúng (✓)",
                "explain": "Nam nói '很高兴认识你' (Rất vui được quen bạn) -> Nhận định Đúng."
              }
            ]
          },
          {
            "id": "mock_reading",
            "title": "Phần 2: 阅读 (Đọc hiểu mô phỏng HSK)",
            "type": "mock_reading",
            "questions": [
              {
                "id": "m_r1",
                "prompt": "Câu 4: Nối câu hỏi với câu trả lời phù hợp nhất:",
                "context": "A: 你们好吗？ (Các bạn khỏe không?)",
                "options": [
                  "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                  "B: 没关系。(Không sao.)",
                  "B: 好的，谢谢！(Được rồi, cảm ơn!)"
                ],
                "answer": "B: 很好，我们很高兴。(Rất khỏe, chúng tôi rất vui.)",
                "explain": "Hỏi 'Các bạn khỏe không?' -> Đáp lại tình trạng sức khỏe: 很好."
              },
              {
                "id": "m_r2",
                "prompt": "Câu 5: Chọn từ thích hợp điền vào chỗ trống:",
                "sentence": "我每天____八个小时。(Tôi mỗi ngày ____ 8 tiếng đồng hồ.)",
                "options": [
                  "工作 (gōngzuò)",
                  "吃 (chī)",
                  "喝 (hē)",
                  "读 (dú)"
                ],
                "answer": "工作 (gōngzuò)",
                "explain": "工作 (làm việc): Tôi mỗi ngày làm việc 8 tiếng."
              }
            ]
          }
        ]
      }
    ]
  }
];
