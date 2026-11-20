/**
 * ==============================================================================
 * MA GIÁO AOV - CẤU HÌNH HỆ THỐNG TRANG BIO VƯỢT LINK NHẬN ACC (CHUẨN KEY)
 * ==============================================================================
 */

const CONFIG = {
    // 🔗 URL GOOGLE APPS SCRIPT WEB APP QUẢN LÝ ACC & KEY
    GOOGLE_SHEET_API_URL: "https://script.google.com/macros/s/AKfycbyq3pNuXPuOjrkdPzxoACKmdqlqaiXuSTpP2xLGQBfmEwrl3JA20ZEqMmrGMdp9mXxM/exec", 

    // 🔗 LINK RÚT GỌN KIẾM TIỀN CỦA BẠN (Dán link rút gọn của bạn vào đây):
    // (Link rút gọn này bạn rút gọn từ trang: https://bio-cua-ban/key.html)
    // Nếu để trống, hệ thống sẽ mở trực tiếp trang key.html để bạn test thử!
    SHORTENED_BYPASS_URL: "", 

    // Thông tin thương hiệu Ma Giáo AOV
    brand: {
        name: "MA GIÁO AOV",
        handle: "Ma Giáo AOV • Thách Đấu VIP",
        verifiedBadge: "Creator Đã Xác Minh • Game AOV",
        avatar: "assets/avatar.jpg",
        description: "Hệ thống phát Acc Liên Quân Mobile VIP độc quyền. Hoàn thành 3 nhiệm vụ để mở link vượt, lấy mã Key và kích hoạt nhận Acc ngay!",
        crownText: "Vương Miện Thách Đấu - Ma Giáo AOV",
        onlineBase: 168,
        visitorsBase: 24500,
        viewsBase: 68900
    },

    // 🎯 3 NHIỆM VỤ BẮT BUỘC ĐỂ MỞ KHÓA LINK VƯỢT
    tasks: [
        {
            id: "task_tiktok",
            name: "Follow TikTok Ma Giáo",
            icon: "fa-brands fa-tiktok",
            url: "https://www.tiktok.com/@magiaoaov",
            actionText: "Thực Hiện",
            color: "#ff0050",
            verifySeconds: 5
        },
        {
            id: "task_telegram",
            name: "Tham Gia Telegram",
            icon: "fa-brands fa-telegram",
            url: "https://t.me/Magiao_AOV",
            actionText: "Tham Gia",
            color: "#229ed9",
            verifySeconds: 5
        },
        {
            id: "task_youtube",
            name: "Đăng Ký YouTube",
            icon: "fa-brands fa-youtube",
            url: "https://www.youtube.com",
            actionText: "Đăng Ký",
            color: "#ff0000",
            verifySeconds: 5
        }
    ],

    // 📞 3 ICON MẠNG XÃ HỘI LIÊN HỆ XẾP HÀNG NGANG
    contacts: [
        {
            name: "TikTok",
            icon: "fa-brands fa-tiktok",
            url: "https://www.tiktok.com/@magiaoaov",
            color: "#ff0050"
        },
        {
            name: "Telegram",
            icon: "fa-brands fa-telegram",
            url: "https://t.me/Magiao_AOV",
            color: "#229ed9"
        },
        {
            name: "YouTube",
            icon: "fa-brands fa-youtube",
            url: "https://www.youtube.com",
            color: "#ff0000"
        }
    ],

    // Nhạc nền trang Bio
    music: {
        title: "Như Một Người Dưng (Remix VIP)",
        artist: "Ma Giáo AOV Sound",
        streamUrl: "assets/bg-music.mp3",
        autoplay: false,
        loop: true
    }
};
