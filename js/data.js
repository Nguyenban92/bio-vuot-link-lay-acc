/**
 * ==============================================================================
 * MA GIÁO AOV - DANH SÁCH FILE, MOD & CÔNG CỤ TẢI XUỐNG
 * ==============================================================================
 */

const DOWNLOAD_ITEMS = [
    {
        id: "lq-apk-map-auto-all",
        title: "Map AUTO ALL, APK NO Key",
        category: "lq",
        categories: ["lq", "tool"],
        subCategory: "tool",
        categoryBadge: "MAP LIÊN QUÂN",
        image: "assets/tab-lq.jpg",
        desc: "Bản APK Mod Map Auto All không cần nhập Key, hỗ trợ hiện Sight và Cam Xa cực mượt cho mọi dòng máy Android.",
        tags: ["HOT", "MAP", "NO KEY", "LIÊN QUÂN"],
        version: "v1.4",
        date: "20/11/2026",
        downloadUrl: "https://drive.google.com/drive/folders/1TqfPa4dNLOqD-XJnIcmNiz8y_RLcgOHr?usp=drive_link",
        icon: "fa-solid fa-eye",
        isHot: true,
        isNew: true,
        hasGuide: true,
        guide: {
            actionText: "TẢI MAP AUTO ALL APK",
            badge: "HƯỚNG DẪN CÀI ĐẶT",
            steps: [
                "Bấm nút Tải File phía dưới để mở thư mục Google Drive.",
                "Tải file APK Map Auto All về điện thoại Android.",
                "Gỡ cài đặt bản Liên Quân gốc hoặc cài đè theo hướng dẫn đính kèm.",
                "Mở game và thưởng thức trải nghiệm mượt mà không văng!"
            ],
            note: "LƯU Ý: Khuyến nghị dùng tài khoản phụ test trước khi leo rank cao."
        }
    },
    {
        id: "tool-do-code-fest",
        title: "TOOL DÒ CODE FEST LIÊN QUÂN",
        category: "tool",
        categories: ["lq", "tool"],
        subCategory: "tool",
        categoryBadge: "TOOL LIÊN QUÂN",
        image: "assets/icon-tool-do-code-fest.jpg",
        desc: "Công cụ tự động dò và nhập mã Code sự kiện Fest Liên Quân Mobile siêu tốc, chuẩn xác, săn quà và phần thưởng độc quyền nhanh nhất không cần thao tác thủ công.",
        tags: ["HOT", "TOOL", "CODE", "FEST", "LIÊN QUÂN"],
        version: "v2.0",
        date: "18/11/2026",
        downloadUrl: "https://drive.google.com/drive/folders/1TqfPa4dNLOqD-XJnIcmNiz8y_RLcgOHr?usp=drive_link",
        icon: "fa-solid fa-magnifying-glass",
        isHot: true,
        isNew: true,
        hasGuide: true,
        guide: {
            actionText: "TẢI TOOL DÒ CODE FEST",
            badge: "TOOL LIÊN QUÂN",
            steps: [
                "Bấm nút Tải File phía dưới để mở link Google Drive.",
                "Tải tool TOOL DÒ CODE FEST về thiết bị của bạn.",
                "Cài đặt và khởi chạy công cụ theo hướng dẫn.",
                "Nhập thông tin sự kiện và tiến hành dò nhận Code Fest tự động."
            ],
            note: "LƯU Ý: Công cụ hỗ trợ dò code sự kiện Fest Liên Quân an toàn và tự động."
        }
    },
    {
        id: "patch-app-3105",
        title: "APP 3105 CRACK FULL TÍNH NĂNG",
        category: "patch",
        categoryBadge: "PATCH 3105 VIP",
        image: "assets/tab-3105.jpg",
        desc: "Bản App 3105 mở khóa full tính năng tiêm patch, không cần chứng chỉ phức tạp, tương thích iOS & Android.",
        tags: ["3105", "IOS", "VIP"],
        version: "v2.5",
        date: "15/11/2026",
        downloadUrl: "https://drive.google.com",
        icon: "fa-solid fa-microchip",
        isHot: true,
        isNew: true
    },
    {
        id: "ff-antiban-v2",
        title: "DNS & SING-BOX ANTIBAN FF V2",
        category: "ff",
        categories: ["ff", "config"],
        categoryBadge: "ANTIBAN FF",
        image: "assets/icon-ff.jpg",
        desc: "Bộ lọc chống khóa tài khoản Free Fire, tương thích Filza & App 3105, ping xanh 20ms ổn định.",
        tags: ["ANTIBAN", "DNS", "FREE FIRE"],
        version: "v2.4",
        date: "14/11/2026",
        downloadUrl: "https://drive.google.com",
        icon: "fa-solid fa-shield-virus",
        isHot: true,
        isNew: true
    },
    {
        id: "ff-fixlag-144fps",
        title: "NGUỒN RAW FF FIX LAG 144FPS",
        category: "ff",
        categoryBadge: "FIX LAG FF",
        image: "assets/icon-ff.jpg",
        desc: "Tối ưu hóa đồ họa, loại bỏ hiệu ứng rác, tăng tốc khung hình khi giao tranh đông người.",
        tags: ["FIX LAG", "144FPS", "FREE FIRE"],
        version: "v3.0",
        date: "12/11/2026",
        downloadUrl: "https://drive.google.com",
        icon: "fa-solid fa-gauge-high",
        isHot: false,
        isNew: false
    },
    {
        id: "tool-tts-voice-adam",
        title: "Tool CHUYỂN VĂN BẢN THÀNH GIỌNG NÓI",
        category: "tool",
        categoryBadge: "TOOL AI",
        image: "assets/icon-tool-tts.jpg",
        desc: "Chuyển văn bản thành giọng nói AI chất lượng cao. Tích hợp giọng đọc Adam truyền cảm, tự nhiên chuẩn studio review phim / TikTok.",
        tags: ["AI", "ADAM", "VOICE", "STUDIO"],
        version: "v1.2",
        date: "10/11/2026",
        downloadUrl: "https://magiao-studio.onrender.com",
        icon: "fa-solid fa-microphone-lines",
        isHot: true,
        isNew: true
    },
    {
        id: "config-dns-antiban-lq",
        title: "DNS & SHADOWROCKET ANTIBAN AOV",
        category: "config",
        categoryBadge: "ANTIBAN LIÊN QUÂN",
        image: "assets/tab-dns.svg",
        desc: "File cấu hình Shadowrocket & DNS chống quét ban IP/HWID cho Liên Quân Mobile mùa mới nhất.",
        tags: ["DNS", "ANTIBAN", "SHADOWROCKET"],
        version: "v4.1",
        date: "08/11/2026",
        downloadUrl: "https://drive.google.com",
        icon: "fa-solid fa-shield-halved",
        isHot: false,
        isNew: false
    },
    {
        id: "app-youtube-premium",
        title: "YOUTUBE PREMIUM (NO ADS)",
        category: "apps",
        categoryBadge: "ỨNG DỤNG VIP",
        image: "assets/tab-app.png",
        desc: "Chặn 100% quảng cáo, nghe nhạc tắt màn hình, tích hợp SponsorBlock tự bỏ qua đoạn tài trợ.",
        tags: ["NO ADS", "MOD", "PREMIUM"],
        version: "v19.45",
        date: "05/11/2026",
        downloadUrl: "https://drive.google.com",
        icon: "fa-brands fa-youtube",
        isHot: false,
        isNew: false
    }
];
