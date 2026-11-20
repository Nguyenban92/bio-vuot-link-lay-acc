# ⚡ HƯỚNG DẪN QUẢN LÝ KHO ACC & VƯỢT LINK LẤY KEY (HỆ THỐNG MỚI)

> **Mô hình Vượt Link Lấy Key Kích Hoạt Nhận Acc Tự Động**  
> Admin nạp 1 danh sách Acc vào kho ➔ Khách vượt 1 link rút gọn ➔ Ra trang nhận Key ➔ Nhập Key vào Bio nhận Acc!

---

## 📌 QUY TRÌNH HOẠT ĐỘNG TOÀN DIỆN

```
[ADMIN NẠP KHO ACC VÀO SHEET]
 (Ví dụ nạp 100 Acc: User|Pass|Ghi chú)
       │
       ▼
[ADMIN ĐEM DUY NHẤT 1 LINK ĐI RÚT GỌN KIẾM TIỀN]
 (Link cần rút gọn: https://bio-cua-ban/key.html)
 ➔ Rút gọn xong được 1 link kiếm tiền (ví dụ: https://link4m.co/xxx)
 ➔ Dán link rút gọn vào file js/config.js (SHORTENED_BYPASS_URL)
       │
       ▼
[KHÁCH VÀO BIO LÀM 3 NHIỆM VỤ ➔ BẤM "VƯỢT LINK LẤY KEY"]
       │
       ▼ (Khách vượt qua link4m / linkvertise...)
[VƯỢT XONG: RA TRANG key.html HIỂN THỊ MÃ KEY]
 (Ví dụ: "Mã Key của bạn là: MG-KEY-8942-X102")
       │
       ▼
[KHÁCH COPY KEY VỀ BIO ➔ NHẬP VÀO Ô KÍCH HOẠT]
 (Hoặc bấm nút "Về Bio kích hoạt nhận Acc" trên trang key.html để tự động điền)
       │
       ▼
[GOOGLE SHEETS TỰ ĐỘNG BỐC 1 ACC TRONG KHO GỬI VỀ]
 • Đánh dấu Acc đó thành "🔴 ĐÃ PHÁT"
 • Đánh dấu Key đó thành "🔴 ĐÃ DÙNG" (Không thể dùng lại)
 • Trả về Tài khoản + Mật khẩu + Ghi chú cho khách!
```

---

## 🚀 CÁC BƯỚC CẬP NHẬT TRÊN GOOGLE SHEETS (CHỈ 1 PHÚT)

Vì bạn đã có sẵn Google Sheets, chỉ cần cập nhật lại mã script mới:

1. Mở trang tính Google Sheets của bạn.
2. Vào **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
3. Xóa toàn bộ mã cũ trong `Mã.gs`.
4. Mở file [backend/GoogleAppsScript_KhoAcc.js](./GoogleAppsScript_KhoAcc.js), copy toàn bộ và dán vào. Nhấn nút **Lưu 💾** (`Ctrl + S`).
5. Tại thanh công cụ Apps Script:
   - Chọn hàm: **`setupFullSystem`**.
   - Nhấn nút **Chạy ▶️**.
6. Quay lại Google Sheets, bạn sẽ thấy xuất hiện menu: **`⚡ MA GIÁO AOV - KHO ACC & KEY`** và 3 Tab:
   - 📦 **`KHO_ACC`**: Danh sách User, Pass, Ghi chú, Trạng thái phát.
   - 🔑 **`KHO_KEY`**: Danh sách mã Key cấp cho khách khi vượt link.
   - ⚙️ **`CẤU HÌNH HỆ THỐNG`**: Cài đặt chung.

---

## 🎯 CÁCH ADMIN SỬ DỤNG HÀNG NGÀY

### 1. Nạp Acc vào kho:
- **Cách 1**: Mở tab `KHO_ACC` gõ trực tiếp vào các dòng:
  - Cột B: Tài khoản
  - Cột C: Mật khẩu
  - Cột D: Loại / Ghi chú (Ví dụ: `Liên Quân VIP 100 Tướng`)
- **Cách 2 (Nhanh nhất)**: Bấm vào menu **`⚡ MA GIÁO AOV - KHO ACC & KEY`** ➔ Chọn **`➕ Nạp Acc Hàng Loạt Vào Kho`** ➔ Dán 1 phát 20-50 Acc dạng:
  ```
  garena_vip10|Pass@123|Liên Quân 90 skin
  garena_vip11|Pass@456|Trắng TT đổi pass ngay
  ff_vip12|FFPass@789|Free Fire Quỷ Dạ Xoa
  ```
  Bấm OK là hệ thống tự thêm vào bảng!

### 2. Lấy link đi rút gọn kiếm tiền:
- Bạn chỉ cần rút gọn **DUY NHẤT 1 LINK NÀY**:  
  `https://bio-cua-ban/key.html` (Trang trả mã Key cho khách sau khi vượt).
- Sau khi rút gọn xong (ví dụ được link `https://link4m.co/abc`), bạn mở file [js/config.js](../js/config.js), dán vào:
  ```javascript
  SHORTENED_BYPASS_URL: "https://link4m.co/abc",
  ```
- Từ giờ, bất kỳ khách nào làm xong 3 nhiệm vụ bấm nút vượt link sẽ được đưa tới link rút gọn đó. Vượt xong họ nhận được 1 Key độc nhất, mang về Bio dán vào là nhận được 1 Acc trong kho của bạn!
