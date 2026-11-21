# ⚡ HƯỚNG DẪN QUẢN LÝ 2 KHO ACC RIÊNG BIỆT & QUẢN TRỊ LIKE ĐỘ HOT (GOOGLE SHEETS)

> **Hệ thống Quản Trị Tự Động Phân Loại Riêng Biệt:**  
> - 💎 **Kho Acc 100-300 Skin**: Tab riêng `KHO_ACC_SKIN` (quản lý và phát riêng khi khách nhập nhận Acc Skin).  
> - 👑 **Kho Acc Chung Sức**: Tab riêng `KHO_ACC_CHUNG_SUC` (quản lý và phát riêng khi khách nhập nhận Acc Chung Sức).  
> - 🔑 **Kho Key**: Tab `KHO_KEY` (1 Key = 1 Lần kích hoạt duy nhất).  
> - 🔥 **Quản Lý Like & Độ Hot**: Tab `LIKE_HOT_LQ` (quản lý UID và trạng thái buff 200 Like).  

---

## 🚀 CÁC BƯỚC CẬP NHẬT TRÊN GOOGLE SHEETS (CHỈ 1 PHÚT)

1. Mở trang tính Google Sheets của bạn.
2. Vào **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
3. Mở tệp `Mã.gs` (hoặc `Code.gs`), xóa toàn bộ mã cũ.
4. Copy toàn bộ nội dung trong tệp [backend/GoogleAppsScript_KhoAcc.js](./GoogleAppsScript_KhoAcc.js) và dán đè vào.
5. Nhấn nút **Lưu 💾** (`Ctrl + S`).
6. **BẮT BUỘC - Triển khai phiên bản mới để Web App nhận mã:**
   - Bấm nút xanh **Triển khai (Deploy)** ở góc trên bên phải ➔ Chọn **Quản lý bản triển khai (Manage deployments)**.
   - Bấm vào biểu tượng cây bút ✏️ (Chỉnh sửa).
   - Tại mục **Phiên bản (Version)**: Chọn **Phiên bản mới (New version)**.
   - Nhấn **Triển khai (Deploy)** ➔ Bấm **Xong (Done)**.
7. Quay lại Google Sheets, bấm menu: **`⚡ MA GIÁO AOV - KHO ACC & KEY`** ➔ Chọn **`🚀 Khởi Tạo Hệ Thống Bảng Tính (1-Click)`** để tự động tạo và định dạng 2 Tab kho Acc riêng biệt:
   - 💎 **`KHO_ACC_SKIN`**: Quản lý kho Acc 100-300 Skin.
   - 👑 **`KHO_ACC_CHUNG_SUC`**: Quản lý kho Acc Chung Sức.
   - 🔑 **`KHO_KEY`**: Quản lý mã Key phát hành.
   - 🔥 **`LIKE_HOT_LQ`**: Quản lý đơn yêu cầu buff Like & Độ Hot.

---

## 🎯 CÁCH NẠP ACC HÀNG NGÀY

### Cách 1: Nạp trực tiếp trên Trang Web Admin (`/admin`)
1. Vào `https://vuot-link-nhan-acc.vercel.app/admin` (Mã PIN: `123456`).
2. Bấm vào nút tương ứng:
   - Bấm nút **`💎 Nạp Acc 100-300 Skin`** để nạp vào kho Skin.
   - Bấm nút **`👑 Nạp Acc Chung Sức`** để nạp vào kho Chung Sức.
3. Dán danh sách tài khoản theo định dạng (mỗi dòng 1 nick):
   ```
   garena_nick1|Pass123|Ghi chú tuỳ ý...
   garena_nick2:Pass456
   ```
4. Bấm **Lưu Vào Kho**. Hệ thống tự động ghi vào đúng Tab tương ứng trên Google Sheets.

### Cách 2: Nạp trên Menu Google Sheets
- Bấm menu **`⚡ MA GIÁO AOV - KHO ACC & KEY`**:
  - Chọn **`💎 Nạp Acc 100-300 Skin (Dán Text)`**
  - Chọn **`👑 Nạp Acc Chung Sức (Dán Text)`**
- Dán danh sách và bấm OK.

### Cách 3: Nạp nhanh bằng file `NAP_ACC.bat` trên máy tính
- Chạy file `NAP_ACC.bat` trong thư mục dự án.
- Chọn `1` để nạp vào kho 100-300 Skin, hoặc chọn `2` để nạp vào kho Chung Sức.
