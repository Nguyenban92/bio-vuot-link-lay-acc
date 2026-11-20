# 👑 MA GIÁO AOV - HỆ THỐNG TRANG BIO 3 NHIỆM VỤ & VƯỢT LINK NHẬN ACC

> **Dự án Bio Link Game Chuyên Biệt - Đậm Chất Thách Đấu Liên Quân Mobile**  
> Trang web duy nhất 1 chức năng: Làm 3 nhiệm vụ (TikTok, Telegram, YouTube) ➔ Mở khóa link vượt ➔ Vượt link xong hệ thống tự động cấp Acc từ Google Sheets!

---

## ⚡ CƠ CHẾ HOẠT ĐỘNG CHUẨN XÁC

```
[KHÁCH VÀO TRANG BIO]
        │
        ▼
[BƯỚC 1: LÀM ĐỦ 3 NHIỆM VỤ]
 1. Follow TikTok Ma Giáo AOV (Đếm ngược kiểm tra 5s ➔ ✅ Đã xong)
 2. Tham gia Telegram Ma Giáo AOV (✅ Đã xong)
 3. Đăng ký YouTube Ma Giáo AOV (✅ Đã xong)
        │
        ▼ (Tiến trình đạt 3/3 - 100%)
[BƯỚC 2: MỞ KHÓA NÚT "LẤY LINK VƯỢT NHẬN ACC"]
 (Trước đó nút bị KHÓA hoàn toàn với biểu tượng ổ khóa 🔒)
        │
        ▼ (Khách bấm lấy link)
[HỆ THỐNG GOOGLE SHEETS CẤP 1 LINK RÚT GỌN ĐỘC QUYỀN]
 (Tự động đánh dấu "🟡 ĐANG VƯỢT" trên Sheet để không ai bị trùng link)
        │
        ▼
[KHÁCH VƯỢT LINK XONG (LINKVERTISE, LINK4M, YEUMONEY...)]
 (Link rút gọn chuyển hướng về Bio: ?claim_token=MG-AOV-XXXX)
        │
        ▼
[TRANG BIO TỰ ĐỘNG BẬT RƯƠNG LOOTBOX PHÁT SÁNG]
 1. Gọi Google Apps Script xác thực Token
 2. Chuyển trạng thái dòng trên Sheet sang "🔴 ĐÃ NHẬN" vĩnh viễn
 3. Tự động ghi vào tab "LỊCH SỬ NHẬN ACC"
 4. Hiển thị: TÀI KHOẢN + MẬT KHẨU + GHI CHÚ / 2FA + Nút Copy 1-Click
```

---

## 📁 CẤU TRÚC DỰ ÁN

```
d:\GAME\BIO\BIO VƯỢT LINK LẤY ACC\
├── index.html                     <-- Trang Bio giao diện mới toanh
├── css\
│   └── style.css                  <-- CSS Cyberpunk Luxury Gaming, thanh tiến trình nhiệm vụ, hiệu ứng khóa/mở
├── js\
│   ├── config.js                  <-- Cấu hình link 3 nhiệm vụ, thông tin liên hệ, link Google Sheets
│   ├── sound.js                   <-- Bộ âm thanh Procedural Web Audio (Click, mở rương, fanfare, copy)
│   ├── bypass-claim.js            <-- Quản lý 3 nhiệm vụ 0/3->3/3, mở khóa link, claim token từ Google Sheets
│   └── app.js                     <-- Đồng hồ theo buổi, Canvas hạt sao, Player nhạc đĩa than
├── assets\                        <-- Hình ảnh avatar, favicon, nhạc nền mp3
└── backend\
    ├── GoogleAppsScript_KhoAcc.js <-- Toàn bộ mã nguồn chạy trên Google Sheets (script.google.com)
    └── README_CAI_DAT_SHEET.md   <-- Hướng dẫn cài đặt Google Sheets trong 2 phút
```

---

## 🚀 HƯỚNG DẪN 3 BƯỚC ĐỂ SỬ DỤNG

### Bước 1: Trải nghiệm ngay trên máy (Không cần cài đặt)
- Nhấp đúp chuột vào file `index.html` để mở trên trình duyệt.
- Trang đang có sẵn **Chế độ Demo thông minh**:
  - Bấm thử làm lần lượt 3 nhiệm vụ TikTok, Telegram, YouTube (mỗi nút sẽ đếm ngược 5 giây rồi hiện tick xanh ✅).
  - Khi hoàn thành 3/3, nút lớn sẽ **tự động mở khóa rực rỡ kèm âm thanh**!
  - Bấm nút mở link vượt ➔ Mở hòm Lootbox hiển thị Acc mẫu và copy tài khoản!

### Bước 2: Tạo Google Sheets Quản Lý Kho Acc
1. Mở [Google Sheets](https://sheets.google.com) ➔ Tạo trang tính mới.
2. Vào **Tiện ích mở rộng** *(Extensions)* ➔ **Apps Script**.
3. Dán toàn bộ mã trong file [backend/GoogleAppsScript_KhoAcc.js](./backend/GoogleAppsScript_KhoAcc.js) vào và bấm Lưu 💾 (`Ctrl + S`).
4. Chọn hàm `setupFullSystem` và bấm **Chạy ▶️** để tự động tạo 3 Tab.
5. Bấm **Triển khai** *(Deploy)* ➔ **Tùy chọn triển khai mới** ➔ Chọn **Ứng dụng web** *(Web app)* ➔ Mục *Ai có quyền truy cập* chọn **Bất kỳ ai** *(Anyone)* ➔ Bấm **Triển khai** và copy link đuôi `/exec`.

### Bước 3: Gắn link Web App vào Bio
- Mở file [js/config.js](./js/config.js), dán link vào:
  ```javascript
  GOOGLE_SHEET_API_URL: "https://script.google.com/macros/s/AKfycb.../exec",
  ```
- Hoàn tất! Khi khách vượt link xong, hệ thống Google Sheets sẽ tự động cấp Acc xuống trang Bio ngay lập tức.
