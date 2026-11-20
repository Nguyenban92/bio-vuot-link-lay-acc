/**
 * ==============================================================================
 * MA GIÁO AOV - HỆ THỐNG QUẢN LÝ KHO ACC & KEY VƯỢT LINK (CHUẨN KEY-BASED)
 * - Admin chỉ cần nạp Kho Acc (User | Pass | Note)
 * - Vượt link rút gọn xong sẽ ra trang cấp Key
 * - Khách nhập Key vào Bio sẽ kích hoạt bốc 1 Acc từ kho gửi về
 * - Mỗi Key chỉ dùng được đúng 1 lần, mỗi Acc phát đúng 1 người
 * ==============================================================================
 */

const TAB_KHO_ACC = "KHO_ACC";
const TAB_KHO_KEY = "KHO_KEY";
const TAB_CAU_HINH = "CẤU HÌNH HỆ THỐNG";

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("⚡ MA GIÁO AOV - KHO ACC & KEY")
    .addItem("🚀 Khởi Tạo Hệ Thống Bảng Tính (1-Click)", "setupFullSystem")
    .addSeparator()
    .addItem("➕ Nạp Acc Hàng Loạt Vào Kho (Hộp Thoại)", "showQuickAddAccModal")
    .addItem("🎲 Tạo Thêm 20 Key Dự Phòng", "generateBatchKeys")
    .addSeparator()
    .addItem("📊 Xem Báo Cáo Thống Kê Kho Acc & Key", "showStockStats")
    .addItem("🔄 Reset Toàn Bộ Acc Về Chưa Phát (Test)", "resetAllAccToAvailable")
    .addToUi();
}

/**
 * Khởi tạo toàn diện 3 Tab: KHO_ACC, KHO_KEY, CẤU HÌNH
 */
function setupFullSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. TẠO TAB KHO_ACC
  let sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  if (!sheetAcc) {
    sheetAcc = ss.insertSheet(TAB_KHO_ACC);
  } else {
    sheetAcc.clear();
  }
  
  const headersAcc = [
    "STT",
    "TÀI KHOẢN (USER)",
    "MẬT KHẨU (PASS)",
    "LOẠI ACC / GHI CHÚ",
    "TRẠNG THÁI",
    "MÃ KEY ĐÃ KÍCH HOẠT",
    "THỜI GIAN PHÁT",
    "IP / THIẾT BỊ NGƯỜI NHẬN"
  ];
  
  sheetAcc.getRange(1, 1, 1, headersAcc.length).setValues([headersAcc]);
  formatHeaderRange(sheetAcc.getRange(1, 1, 1, headersAcc.length), "#0f172a", "#38bdf8");
  sheetAcc.setRowHeight(1, 42);
  sheetAcc.setFrozenRows(1);
  
  // Dữ liệu Acc mẫu ban đầu
  const sampleAccs = [
    [1, "garena_vip_01", "MagiaoPass@2026A", "Liên Quân VIP 105 Tướng, 120 Skin SSS, Full ngọc", "🟢 CHƯA PHÁT", "", "", ""],
    [2, "garena_trang_02", "MagiaoPass@2026B", "Acc Trắng Thông Tin 100%, Đổi mật khẩu ngay", "🟢 CHƯA PHÁT", "", "", ""],
    [3, "garena_rank_03", "MagiaoPass@2026C", "Rank Cao Thủ 25 Sao, có Florentino Tinh Hệ", "🟢 CHƯA PHÁT", "", "", ""],
    [4, "freefire_vip_04", "FFPass@2026D", "Free Fire VIP có Quỷ Dạ Xoa, AK Rồng Xanh", "🟢 CHƯA PHÁT", "", "", ""],
    [5, "random_nick_05", "RandomPass@2026E", "Nick ngẫu nhiên 40-80 skin, tỉ lệ trúng skin SSS cao", "🟢 CHƯA PHÁT", "", "", ""]
  ];
  sheetAcc.getRange(2, 1, sampleAccs.length, headersAcc.length).setValues(sampleAccs);
  
  // Validation Dropdown cho Cột TRẠNG THÁI (Cột E)
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["🟢 CHƯA PHÁT", "🔴 ĐÃ PHÁT"], true)
    .setAllowInvalid(false)
    .build();
  sheetAcc.getRange("E2:E1000").setDataValidation(statusRule);
  
  sheetAcc.setColumnWidth(1, 55);  // STT
  sheetAcc.setColumnWidth(2, 190); // TÀI KHOẢN
  sheetAcc.setColumnWidth(3, 190); // MẬT KHẨU
  sheetAcc.setColumnWidth(4, 280); // GHI CHÚ
  sheetAcc.setColumnWidth(5, 140); // TRẠNG THÁI
  sheetAcc.setColumnWidth(6, 180); // KEY
  sheetAcc.setColumnWidth(7, 160); // THỜI GIAN
  sheetAcc.setColumnWidth(8, 180); // IP
  
  // 2. TẠO TAB KHO_KEY
  let sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheetKey) {
    sheetKey = ss.insertSheet(TAB_KHO_KEY);
  } else {
    sheetKey.clear();
  }
  
  const headersKey = [
    "MÃ KEY",
    "TRẠNG THÁI",
    "THỜI GIAN TẠO",
    "ACC ĐÃ CẤP",
    "THỜI GIAN KÍCH HOẠT",
    "IP / THIẾT BỊ"
  ];
  sheetKey.getRange(1, 1, 1, headersKey.length).setValues([headersKey]);
  formatHeaderRange(sheetKey.getRange(1, 1, 1, headersKey.length), "#1e1b4b", "#a855f7");
  sheetKey.setRowHeight(1, 42);
  sheetKey.setFrozenRows(1);
  
  const keyStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["🟢 CHƯA DÙNG", "🔴 ĐÃ DÙNG"], true)
    .setAllowInvalid(false)
    .build();
  sheetKey.getRange("B2:B2000").setDataValidation(keyStatusRule);
  
  sheetKey.setColumnWidth(1, 190);
  sheetKey.setColumnWidth(2, 140);
  sheetKey.setColumnWidth(3, 160);
  sheetKey.setColumnWidth(4, 180);
  sheetKey.setColumnWidth(5, 160);
  sheetKey.setColumnWidth(6, 180);
  
  // Tạo sẵn 5 Key mẫu ban đầu
  const nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm");
  const sampleKeys = [
    ["MG-KEY-98F2-A101", "🟢 CHƯA DÙNG", nowStr, "", "", ""],
    ["MG-KEY-74D1-B202", "🟢 CHƯA DÙNG", nowStr, "", "", ""],
    ["MG-KEY-55K9-C303", "🟢 CHƯA DÙNG", nowStr, "", "", ""],
    ["MG-KEY-32M4-D404", "🟢 CHƯA DÙNG", nowStr, "", "", ""],
    ["MG-KEY-88Q7-E505", "🟢 CHƯA DÙNG", nowStr, "", "", ""]
  ];
  sheetKey.getRange(2, 1, sampleKeys.length, headersKey.length).setValues(sampleKeys);

  // 3. TẠO TAB CẤU HÌNH HỆ THỐNG
  let sheetConfig = ss.getSheetByName(TAB_CAU_HINH);
  if (!sheetConfig) {
    sheetConfig = ss.insertSheet(TAB_CAU_HINH);
  } else {
    sheetConfig.clear();
  }
  
  const configHeaders = ["THÔNG SỐ / THIẾT LẬP", "GIÁ TRỊ CẤU HÌNH", "HƯỚNG DẪN"];
  sheetConfig.getRange(1, 1, 1, configHeaders.length).setValues([configHeaders]);
  formatHeaderRange(sheetConfig.getRange(1, 1, 1, configHeaders.length), "#0f172a", "#fbbf24");
  sheetConfig.setRowHeight(1, 42);
  sheetConfig.setFrozenRows(1);
  
  const configRows = [
    ["Tên Thương Hiệu Bio", "MA GIÁO AOV", "Tên hiển thị trên web"],
    ["Link Rút Gọn Của Admin", "https://link4m.co/xxx", "Dán link rút gọn của bạn vào đây (Link rút gọn dẫn đến trang key.html)"],
    ["Trạng Thái Nhận Acc", "BẬT", "BẬT: Khách nhận bình thường. TẮT: Tạm dừng sự kiện."],
    ["Kênh TikTok", "https://www.tiktok.com/@magiaoaov", "Link TikTok"],
    ["Kênh Telegram", "https://t.me/Magiao_AOV", "Link Telegram"],
    ["Kênh YouTube", "https://www.youtube.com", "Link YouTube"]
  ];
  sheetConfig.getRange(2, 1, configRows.length, configHeaders.length).setValues(configRows);
  sheetConfig.setColumnWidth(1, 240);
  sheetConfig.setColumnWidth(2, 360);
  sheetConfig.setColumnWidth(3, 360);

  SpreadsheetApp.getUi().alert("🎉 KHỞI TẠO THÀNH CÔNG HỆ THỐNG KEY & KHO ACC!\n\n1. Tab KHO_ACC: Nạp tài khoản & mật khẩu\n2. Tab KHO_KEY: Quản lý mã Key cấp cho khách sau khi vượt link\n3. Tab CẤU HÌNH: Điền link rút gọn kiếm tiền của bạn.");
}

function formatHeaderRange(range, bgColor, fontColor) {
  range.setBackground(bgColor)
       .setFontColor(fontColor)
       .setFontWeight("bold")
       .setFontSize(11)
       .setHorizontalAlignment("center")
       .setVerticalAlignment("middle");
}

/**
 * Hộp thoại nạp nhanh Acc cho Admin (Dán 1 lần 10 - 50 Acc)
 * Định dạng: TàiKhoản|MậtKhẩu|GhiChú
 */
function showQuickAddAccModal() {
  const ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt(
    "➕ NẠP ACC HÀNG LOẠT VÀO KHO",
    "Dán danh sách Acc theo định dạng (mỗi dòng 1 Acc):\nTàiKhoản|MậtKhẩu|GhiChú\n\nVí dụ:\ngarena_vip10|Pass@123|Liên Quân VIP 100 Tướng\ngarena_vip11|Pass@456|Trắng TT đổi pass ngay",
    ui.ButtonSet.OK_CANCEL
  );
  
  if (prompt.getSelectedButton() !== ui.Button.OK) return;
  const input = prompt.getResponseText();
  if (!input || !input.trim()) return;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TAB_KHO_ACC);
  if (!sheet) {
    ui.alert("Vui lòng chạy Khởi Tạo Hệ Thống trước!");
    return;
  }
  
  const lines = input.trim().split("\n");
  const lastRow = sheet.getLastRow();
  let nextSTT = lastRow > 1 ? lastRow : 1;
  
  let addedCount = 0;
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    const parts = line.split("|");
    const user = parts[0] ? parts[0].trim() : "";
    const pass = parts[1] ? parts[1].trim() : "";
    const note = parts[2] ? parts[2].trim() : "Acc game VIP";
    
    if (user && pass) {
      sheet.appendRow([
        nextSTT++,
        user,
        pass,
        note,
        "🟢 CHƯA PHÁT",
        "",
        "",
        ""
      ]);
      addedCount++;
    }
  });
  
  ui.alert(`✅ ĐÃ NẠP THÀNH CÔNG ${addedCount} ACC VÀO KHO!`);
}

/**
 * Tạo danh sách 20 Key dự phòng
 */
function generateBatchKeys() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheet) return;
  
  const nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm");
  for (let i = 0; i < 20; i++) {
    sheet.appendRow([
      generateUniqueKey(),
      "🟢 CHƯA DÙNG",
      nowStr,
      "",
      "",
      ""
    ]);
  }
  SpreadsheetApp.getUi().alert("🎲 ĐÃ TẠO THÊM 20 MÃ KEY MỚI VÀO TAB KHO_KEY!");
}

/**
 * Reset tất cả Acc về Chưa phát (Dùng khi Admin cần test lại)
 */
function resetAllAccToAvailable() {
  const ui = SpreadsheetApp.getUi();
  const confirm = ui.alert(
    "⚠️ CẢNH BÁO RESET KHO ACC & KEY",
    "Bạn có muốn đặt lại toàn bộ Acc về '🟢 CHƯA PHÁT' và toàn bộ Key về '🟢 CHƯA DÙNG' không?",
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  
  if (sheetAcc && sheetAcc.getLastRow() >= 2) {
    for (let r = 2; r <= sheetAcc.getLastRow(); r++) {
      sheetAcc.getRange(r, 5).setValue("🟢 CHƯA PHÁT"); // Cột E
      sheetAcc.getRange(r, 6).setValue(""); // Xóa Key
      sheetAcc.getRange(r, 7).setValue(""); // Xóa thời gian
      sheetAcc.getRange(r, 8).setValue(""); // Xóa IP
    }
  }
  
  if (sheetKey && sheetKey.getLastRow() >= 2) {
    for (let r = 2; r <= sheetKey.getLastRow(); r++) {
      sheetKey.getRange(r, 2).setValue("🟢 CHƯA DÙNG"); // Cột B
      sheetKey.getRange(r, 4).setValue(""); // Xóa Acc
      sheetKey.getRange(r, 5).setValue(""); // Xóa thời gian
      sheetKey.getRange(r, 6).setValue(""); // Xóa IP
    }
  }
  
  ui.alert("✅ ĐÃ RESET TOÀN BỘ VỀ TRẠNG THÁI CHƯA DÙNG!");
}

/**
 * Sinh mã Key ngẫu nhiên: MG-KEY-XXXX-YYYY
 */
function generateUniqueKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  function randPart(len) {
    let s = "";
    for (let i = 0; i < len; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  }
  return `MG-KEY-${randPart(4)}-${randPart(4)}`;
}

/**
 * Thống kê dữ liệu
 */
function calculateStockStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  
  let totalAcc = 0, availableAcc = 0, claimedAcc = 0;
  let totalKey = 0, availableKey = 0, usedKey = 0;
  
  if (sheetAcc && sheetAcc.getLastRow() >= 2) {
    const dataAcc = sheetAcc.getRange(2, 5, sheetAcc.getLastRow() - 1, 1).getValues();
    totalAcc = dataAcc.length;
    dataAcc.forEach(r => {
      const st = String(r[0] || "").trim();
      if (st.includes("CHƯA PHÁT")) availableAcc++;
      else if (st.includes("ĐÃ PHÁT")) claimedAcc++;
    });
  }
  
  if (sheetKey && sheetKey.getLastRow() >= 2) {
    const dataKey = sheetKey.getRange(2, 2, sheetKey.getLastRow() - 1, 1).getValues();
    totalKey = dataKey.length;
    dataKey.forEach(r => {
      const st = String(r[0] || "").trim();
      if (st.includes("CHƯA DÙNG")) availableKey++;
      else if (st.includes("ĐÃ DÙNG")) usedKey++;
    });
  }
  
  return {
    total_acc: totalAcc,
    available_acc: availableAcc,
    claimed_acc: claimedAcc,
    total_key: totalKey,
    available_key: availableKey,
    used_key: usedKey
  };
}

function showStockStats() {
  const s = calculateStockStats();
  SpreadsheetApp.getUi().alert(
    `📊 BÁO CÁO THỐNG KÊ MA GIÁO AOV:\n\n` +
    `📦 KHO ACC:\n` +
    `• Tổng số Acc trong kho: ${s.total_acc}\n` +
    `• Acc sẵn sàng phát (🟢 Chưa phát): ${s.available_acc}\n` +
    `• Acc đã phát cho khách (🔴 Đã phát): ${s.claimed_acc}\n\n` +
    `🔑 KHO KEY:\n` +
    `• Tổng số Key: ${s.total_key}\n` +
    `• Key chưa dùng: ${s.available_key}\n` +
    `• Key đã kích hoạt: ${s.used_key}`
  );
}

/**
 * ==============================================================================
 * API ENGINE: XỬ LÝ GET & POST TỪ TRANG BIO & TRANG KEY
 * ==============================================================================
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({
      success: false,
      error: "SERVER_BUSY",
      message: "Hệ thống đang xử lý nhiều lượt yêu cầu cùng lúc, vui lòng thử lại sau vài giây!"
    });
  }
  
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (ex) {}
    }
    
    const action = params.action || postData.action || "get_stats";
    
    // 1. ACTION: LẤY THỐNG KÊ CHO BIO
    if (action === "get_stats") {
      const stats = calculateStockStats();
      const recentClaims = getRecentClaimsLog(10);
      return jsonResponse({
        success: true,
        stats: {
          total: stats.total_acc,
          available: stats.available_acc,
          claimed: stats.claimed_acc
        },
        recent_claims: recentClaims
      });
    }
    
    // 2. ACTION: CẤP 1 KEY MỚI CHO KHÁCH SAU KHI VƯỢT LINK (DÀNH CHO TRANG key.html)
    if (action === "get_key" || action === "generate_key") {
      const keyData = issueUniqueKey(params.client_info || postData.client_info);
      return jsonResponse(keyData);
    }
    
    // 3. ACTION: KÍCH HOẠT KEY & TRẢ ACC VỀ CHO KHÁCH TRÊN BIO
    if (action === "activate_key" || action === "claim_with_key") {
      const key = (params.key || postData.key || "").trim().toUpperCase();
      const clientInfo = params.client_info || postData.client_info || "Web Browser";
      const result = processActivateKey(key, clientInfo);
      return jsonResponse(result);
    }
    
    return jsonResponse({
      success: false,
      error: "INVALID_ACTION",
      message: "Yêu cầu không hợp lệ."
    });
    
  } catch (error) {
    return jsonResponse({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Lỗi xử lý máy chủ: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Cấp 1 Key duy nhất khi khách mở trang key.html sau khi vượt link
 */
function issueUniqueKey(clientInfo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheetKey) {
    return { success: false, message: "Kho Key chưa được khởi tạo!" };
  }
  
  const nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm");
  
  // Tìm xem có Key nào '🟢 CHƯA DÙNG' chưa được cấp không
  let availableKey = "";
  const lastRow = sheetKey.getLastRow();
  if (lastRow >= 2) {
    const data = sheetKey.getRange(2, 1, lastRow - 1, 2).getValues();
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][1] || "").includes("CHƯA DÙNG")) {
        availableKey = String(data[i][0]).trim();
        break;
      }
    }
  }
  
  // Nếu không còn Key nào trong kho, tự động sinh mới 1 Key và thêm vào Sheet
  if (!availableKey) {
    availableKey = generateUniqueKey();
    sheetKey.appendRow([
      availableKey,
      "🟢 CHƯA DÙNG",
      nowStr,
      "",
      "",
      clientInfo || "Vừa vượt link"
    ]);
  }
  
  return {
    success: true,
    key: availableKey,
    issued_at: nowStr,
    message: "Đã cấp mã Key thành công!"
  };
}

/**
 * KÍCH HOẠT KEY & BỐC 1 ACC TRONG KHO GỬI VỀ CHO KHÁCH
 */
function processActivateKey(key, clientInfo) {
  if (!key) {
    return {
      success: false,
      error: "EMPTY_KEY",
      message: "Vui lòng nhập mã Key của bạn!"
    };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  
  if (!sheetKey || !sheetAcc) {
    return { success: false, error: "NO_SHEET", message: "Hệ thống chưa được thiết lập!" };
  }
  
  // 1. KIỂM TRA MÃ KEY TRONG TAB KHO_KEY
  const keyLastRow = sheetKey.getLastRow();
  if (keyLastRow < 2) {
    return { success: false, error: "INVALID_KEY", message: "Mã Key không tồn tại trên hệ thống!" };
  }
  
  const keyData = sheetKey.getRange(2, 1, keyLastRow - 1, 5).getValues();
  let foundKeyIndex = -1;
  let keyRow = null;
  
  for (let i = 0; i < keyData.length; i++) {
    const k = String(keyData[i][0] || "").trim().toUpperCase();
    if (k === key) {
      foundKeyIndex = i + 2;
      keyRow = keyData[i];
      break;
    }
  }
  
  if (!keyRow || foundKeyIndex === -1) {
    return {
      success: false,
      error: "NOT_FOUND",
      message: `Mã Key '${key}' không chính xác hoặc không tồn tại!`
    };
  }
  
  const keyStatus = String(keyRow[1] || "").trim();
  const usedTime = String(keyRow[4] || "").trim();
  
  // BẢO VỆ: MỖI KEY CHỈ DÙNG ĐÚNG 1 LẦN
  if (keyStatus.includes("ĐÃ DÙNG")) {
    return {
      success: false,
      error: "ALREADY_USED",
      message: `Mã Key '${key}' này đã được sử dụng vào lúc: ${usedTime || "Trước đó"}!\nMỗi Key chỉ kích hoạt nhận Acc đúng 1 lần duy nhất.`
    };
  }
  
  // 2. TÌM 1 ACC ĐẦU TIÊN CÒN TRỐNG TRONG KHO_ACC (🟢 CHƯA PHÁT)
  const accLastRow = sheetAcc.getLastRow();
  if (accLastRow < 2) {
    return {
      success: false,
      error: "OUT_OF_STOCK",
      message: "Kho hiện đang hết Acc, vui lòng báo Admin nạp thêm!"
    };
  }
  
  const accData = sheetAcc.getRange(2, 1, accLastRow - 1, 8).getValues();
  let foundAccIndex = -1;
  let targetAcc = null;
  
  for (let i = 0; i < accData.length; i++) {
    const accStatus = String(accData[i][4] || "").trim(); // Cột E (index 4)
    if (accStatus.includes("CHƯA PHÁT")) {
      foundAccIndex = i + 2;
      targetAcc = accData[i];
      break;
    }
  }
  
  if (!targetAcc || foundAccIndex === -1) {
    return {
      success: false,
      error: "OUT_OF_STOCK",
      message: "Tất cả Acc trong kho đã được phát hết! Bạn vui lòng giữ mã Key này và liên hệ Admin nạp thêm Acc để kích hoạt lại nhé."
    };
  }
  
  // 3. HỢP LỆ -> CẤP ACC & CẬP NHẬT GOOGLE SHEETS
  const now = new Date();
  const nowFormatted = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  
  const user = String(targetAcc[1] || "").trim();
  const pass = String(targetAcc[2] || "").trim();
  const note = String(targetAcc[3] || "").trim();
  
  // Cập nhật tab KHO_ACC: chuyển thành 🔴 ĐÃ PHÁT
  sheetAcc.getRange(foundAccIndex, 5).setValue("🔴 ĐÃ PHÁT");
  sheetAcc.getRange(foundAccIndex, 6).setValue(key);
  sheetAcc.getRange(foundAccIndex, 7).setValue(nowFormatted);
  sheetAcc.getRange(foundAccIndex, 8).setValue(clientInfo || "Khách kích hoạt Key");
  
  // Cập nhật tab KHO_KEY: chuyển thành 🔴 ĐÃ DÙNG
  sheetKey.getRange(foundKeyIndex, 2).setValue("🔴 ĐÃ DÙNG");
  sheetKey.getRange(foundKeyIndex, 4).setValue(user);
  sheetKey.getRange(foundKeyIndex, 5).setValue(nowFormatted);
  sheetKey.getRange(foundKeyIndex, 6).setValue(clientInfo || "Web Browser");
  
  return {
    success: true,
    message: "🎉 CHÚC MỪNG BẠN! KÍCH HOẠT KEY THÀNH CÔNG!",
    data: {
      category: note || "Acc Game VIP",
      username: user,
      password: pass,
      note: "Đổi mật khẩu ngay sau khi đăng nhập thành công để bảo mật tài khoản.",
      key: key,
      claimed_at: nowFormatted
    }
  };
}

/**
 * Lấy lịch sử nhận gần nhất
 */
function getRecentClaimsLog(limit) {
  limit = limit || 10;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  if (!sheetAcc) return [];
  
  const lastRow = sheetAcc.getLastRow();
  if (lastRow < 2) return [];
  
  const data = sheetAcc.getRange(2, 1, lastRow - 1, 8).getValues();
  const results = [];
  
  for (let i = data.length - 1; i >= 0; i--) {
    const status = String(data[i][4] || "").trim();
    if (status.includes("ĐÃ PHÁT")) {
      let u = String(data[i][1] || "");
      let maskedUser = u.length > 5 ? u.substring(0, 3) + "***" + u.substring(u.length - 2) : u.substring(0, 1) + "***";
      results.push({
        time: data[i][6] || "Vừa xong",
        category: data[i][3] || "Acc Game VIP",
        masked_user: maskedUser
      });
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
