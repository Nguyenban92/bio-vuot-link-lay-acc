/**
 * ==============================================================================
 * MA GIÁO AOV - HỆ THỐNG QUẢN LÝ 2 KHO ACC RIÊNG BIỆT & QUẢN TRỊ DUYỆT ĐỘ HOT
 * - Quản lý độc lập: 💎 Kho Acc 100-300 Skin & 👑 Kho Acc Chung Sức
 * - Tự động loại bỏ hoàn toàn trang kho acc chung (KHO_ACC) không cần thiết
 * - Nạp trực tiếp từ file .txt hoặc dán text (User|Pass hoặc User:Pass)
 * - Vượt link rút gọn xong sẽ ra trang cấp Key
 * - Khách nhập Key vào Bio kích hoạt nhận đúng loại Acc theo yêu cầu
 * - Quản lý duyệt buff Like & Độ Hot Liên Quân tự động
 * ==============================================================================
 */

const TAB_KHO_SKIN = "KHO_ACC_SKIN";          // Kho riêng 1: Acc 100-300 Skin
const TAB_KHO_CHUNG_SUC = "KHO_ACC_CHUNG_SUC";// Kho riêng 2: Acc Chung Sức
const TAB_KHO_KEY = "KHO_KEY";                // Kho Mã Key kích hoạt
const TAB_CAU_HINH = "CẤU HÌNH HỆ THỐNG";     // Cấu hình tên, PIN, link rút gọn
const TAB_LIKE_HOT = "LIKE_HOT_LQ";           // Quản lý yêu cầu Like & Độ Hot LQ

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("⚡ MA GIÁO AOV - HỆ THỐNG 2 KHO ACC & KEY")
    .addItem("🚀 Khởi Tạo Hệ Thống Bảng Tính (1-Click)", "setupFullSystem")
    .addSeparator()
    .addItem("💎 Nạp Acc 100-300 Skin (Dán Text)", "showQuickAddSkinModal")
    .addItem("👑 Nạp Acc Chung Sức (Dán Text)", "showQuickAddChungSucModal")
    .addSeparator()
    .addItem("🔥 Quản Lý Yêu Cầu Like & Độ Hot LQ", "showHotStats")
    .addItem("🧹 Xóa Acc Mẫu Demo (Chỉ Giữ Acc Thật)", "clearSampleAccounts")
    .addItem("🛠️ Sửa Lỗi Xác Thực Cột H (Data Validation)", "fixDataValidation")
    .addItem("🎲 Tạo Thêm 20 Key Dự Phòng", "generateBatchKeys")
    .addSeparator()
    .addItem("📊 Xem Báo Cáo Thống Kê 2 Kho Acc & Key", "showStockStats")
    .addItem("🔄 Reset Toàn Bộ Acc Về Chưa Phát (Test)", "resetAllAccToAvailable")
    .addToUi();
}

/**
 * Khởi tạo toàn diện 2 kho Acc riêng biệt và xóa bỏ hoàn toàn Tab KHO_ACC cũ
 */
function setupFullSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. TAB KHO_ACC_SKIN: Quản lý riêng Acc 100-300 Skin
  initAccSheet(ss, TAB_KHO_SKIN, "💎 KHO ACC 100-300 SKIN", "#0f172a", "#38bdf8", [
    [1, "skin_vip_01", "MagiaoSkin@2026A", "Acc 150 Skin SSS, Full Tướng", "🟢 CHƯA PHÁT", "", "", ""],
    [2, "skin_vip_02", "MagiaoSkin@2026B", "Acc 280 Skin, Nakroth Thứ Nguyên", "🟢 CHƯA PHÁT", "", "", ""]
  ]);

  // 2. TAB KHO_ACC_CHUNG_SUC: Quản lý riêng Acc Chung Sức
  initAccSheet(ss, TAB_KHO_CHUNG_SUC, "👑 KHO ACC CHUNG SỨC", "#1e1b4b", "#c084fc", [
    [1, "chungsuc_01", "ChungSuc@2026A", "Acc Chung Sức Sự Kiện VIP", "🟢 CHƯA PHÁT", "", "", ""],
    [2, "chungsuc_02", "ChungSuc@2026B", "Acc Chung Sức Đổi Pass Ngay", "🟢 CHƯA PHÁT", "", "", ""]
  ]);

  // Tự động dọn dẹp và xóa bỏ hoàn toàn Tab KHO_ACC cũ để không gây dư thừa
  try {
    const oldAccSheet = ss.getSheetByName("KHO_ACC");
    if (oldAccSheet) {
      if (oldAccSheet.getLastRow() >= 2) {
        const oldData = oldAccSheet.getRange(2, 1, oldAccSheet.getLastRow() - 1, 8).getValues();
        const realAccs = oldData.filter(r => {
          const u = String(r[1] || "").toLowerCase();
          return u && !u.includes("garena_vip") && !u.includes("garena_trang") && !u.includes("garena_rank") && !u.includes("freefire_vip") && !u.includes("random_nick") && !u.includes("garena_sample");
        });
        if (realAccs.length > 0) {
          const skinSheet = ss.getSheetByName(TAB_KHO_SKIN);
          if (skinSheet) {
            skinSheet.getRange(skinSheet.getLastRow() + 1, 1, realAccs.length, 8).setValues(realAccs);
          }
        }
      }
      ss.deleteSheet(oldAccSheet);
    }
  } catch (eDel) {}

  // 3. TAB KHO_KEY
  let sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheetKey) {
    sheetKey = ss.insertSheet(TAB_KHO_KEY);
  } else {
    sheetKey.clear();
  }
  
  const headersKey = ["MÃ KEY", "TRẠNG THÁI", "THỜI GIAN TẠO", "ACC / DỊCH VỤ CẤP", "THỜI GIAN KÍCH HOẠT", "IP / THIẾT BỊ"];
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
  sheetKey.setColumnWidth(4, 200);
  sheetKey.setColumnWidth(5, 160);
  sheetKey.setColumnWidth(6, 180);

  // 4. TAB LIKE_HOT_LQ (Độ Hot & Like Profile)
  getOrCreateLikeHotSheet(ss);

  // 5. TAB CẤU HÌNH
  let sheetConfig = ss.getSheetByName(TAB_CAU_HINH);
  if (!sheetConfig) {
    sheetConfig = ss.insertSheet(TAB_CAU_HINH);
  } else {
    sheetConfig.clear();
  }
  
  const configHeaders = ["THÔNG SỐ", "GIÁ TRỊ", "HƯỚNG DẪN"];
  sheetConfig.getRange(1, 1, 1, configHeaders.length).setValues([configHeaders]);
  formatHeaderRange(sheetConfig.getRange(1, 1, 1, configHeaders.length), "#0f172a", "#fbbf24");
  sheetConfig.setRowHeight(1, 42);
  sheetConfig.setFrozenRows(1);
  
  const configRows = [
    ["Tên Thương Hiệu Bio", "MA GIÁO AOV", "Tên hiển thị"],
    ["Mã PIN Admin Nạp Acc", "123456", "Mã PIN đăng nhập trang admin.html"],
    ["Link Rút Gọn Của Admin", "https://link4m.net/nSRfjk", "Link rút gọn dẫn đến trang key.html"]
  ];
  sheetConfig.getRange(2, 1, configRows.length, configHeaders.length).setValues(configRows);
  sheetConfig.setColumnWidth(1, 240);
  sheetConfig.setColumnWidth(2, 360);
  sheetConfig.setColumnWidth(3, 360);

  SpreadsheetApp.getUi().alert("🎉 KHỞI TẠO THÀNH CÔNG: Đã phân chia riêng biệt 2 Kho Acc (100-300 Skin & Chung Sức), tự động loại bỏ trang KHO_ACC cũ!");
}

function initAccSheet(ss, tabName, label, bgColor, fontColor, sampleRows) {
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
  } else {
    sheet.clear();
  }
  
  sheet.getRange("F1:H3000").clearDataValidations();
  
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
  sheet.getRange(1, 1, 1, headersAcc.length).setValues([headersAcc]);
  formatHeaderRange(sheet.getRange(1, 1, 1, headersAcc.length), bgColor, fontColor);
  sheet.setRowHeight(1, 42);
  sheet.setFrozenRows(1);
  
  if (sampleRows && sampleRows.length > 0) {
    sheet.getRange(2, 1, sampleRows.length, headersAcc.length).setValues(sampleRows);
  }
  
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["🟢 CHƯA PHÁT", "🔴 ĐÃ PHÁT"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("E2:E2000").setDataValidation(statusRule);
  
  sheet.setColumnWidth(1, 55);
  sheet.setColumnWidth(2, 190);
  sheet.setColumnWidth(3, 190);
  sheet.setColumnWidth(4, 280);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 180);
  sheet.setColumnWidth(7, 160);
  sheet.setColumnWidth(8, 180);
  return sheet;
}

function formatHeaderRange(range, bgColor, fontColor) {
  range.setBackground(bgColor)
       .setFontColor(fontColor)
       .setFontWeight("bold")
       .setFontSize(11)
       .setHorizontalAlignment("center")
       .setVerticalAlignment("middle");
}

function fixDataValidation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = [
    ss.getSheetByName(TAB_KHO_SKIN),
    ss.getSheetByName(TAB_KHO_CHUNG_SUC)
  ].filter(Boolean);

  sheets.forEach(sh => {
    sh.getRange("F2:H3000").clearDataValidations();
  });

  SpreadsheetApp.getUi().alert("✅ ĐÃ SỬA LỖI THÀNH CÔNG!\nĐã gỡ bỏ toàn bộ quy tắc xác thực cũ trên cột H ở cả 2 kho Acc.");
}

function clearSampleAccounts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let deleteTotal = 0;

  // Xóa sheet KHO_ACC cũ nếu còn sót lại
  try {
    const oldSheet = ss.getSheetByName("KHO_ACC");
    if (oldSheet) ss.deleteSheet(oldSheet);
  } catch (e) {}

  const sheetsToClean = [
    ss.getSheetByName(TAB_KHO_SKIN),
    ss.getSheetByName(TAB_KHO_CHUNG_SUC)
  ].filter(Boolean);

  sheetsToClean.forEach(sheet => {
    if (sheet.getLastRow() < 2) return;
    const lastR = sheet.getLastRow();
    for (let r = lastR; r >= 2; r--) {
      const u = String(sheet.getRange(r, 2).getValue() || "").toLowerCase();
      if (u.includes("garena_vip") || u.includes("garena_trang") || u.includes("garena_rank") || 
          u.includes("freefire_vip") || u.includes("random_nick") || u.includes("garena_sample") ||
          u.includes("skin_vip_") || u.includes("chungsuc_0")) {
        sheet.deleteRow(r);
        deleteTotal++;
      }
    }
    const newLastR = sheet.getLastRow();
    if (newLastR >= 2) {
      for (let r = 2; r <= newLastR; r++) {
        sheet.getRange(r, 1).setValue(r - 1);
      }
    }
  });

  SpreadsheetApp.getUi().alert(`✅ ĐÃ XÓA ${deleteTotal} ACC MẪU DEMO!\nHiện hệ thống chỉ còn toàn bộ Acc thật do bạn nạp.`);
}

/**
 * Modal nạp nhanh từ menu Trang Tính: Kho Acc 100-300 Skin
 */
function showQuickAddSkinModal() {
  const ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt(
    "💎 NẠP ACC 100-300 SKIN (DÁN TEXT)",
    "Dán danh sách Acc 100-300 Skin (User|Pass hoặc User:Pass, mỗi dòng 1 Acc):\nVí dụ:\ngarena_skin01|Pass@123|180 Skin SSS\ngarena_skin02:Pass@456",
    ui.ButtonSet.OK_CANCEL
  );
  if (prompt.getSelectedButton() !== ui.Button.OK) return;
  const input = prompt.getResponseText();
  if (!input || !input.trim()) return;
  
  const result = parseAndAppendAccounts(input, "skin");
  ui.alert(`✅ ĐÃ NẠP THÀNH CÔNG ${result.count} ACC VÀO KHO 100-300 SKIN!`);
}

/**
 * Modal nạp nhanh từ menu Trang Tính: Kho Acc Chung Sức
 */
function showQuickAddChungSucModal() {
  const ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt(
    "👑 NẠP ACC CHUNG SỨC (DÁN TEXT)",
    "Dán danh sách Acc Chung Sức (User|Pass hoặc User:Pass, mỗi dòng 1 Acc):\nVí dụ:\ngarena_chungsuc01|Pass@123|Acc Chung Sức VIP\ngarena_chungsuc02:Pass@456",
    ui.ButtonSet.OK_CANCEL
  );
  if (prompt.getSelectedButton() !== ui.Button.OK) return;
  const input = prompt.getResponseText();
  if (!input || !input.trim()) return;
  
  const result = parseAndAppendAccounts(input, "chung_suc");
  ui.alert(`✅ ĐÃ NẠP THÀNH CÔNG ${result.count} ACC VÀO KHO CHUNG SỨC!`);
}

/**
 * Hàm phân tích văn bản .txt và tự động nạp vào Tab tương ứng (Skin hoặc Chung Sức)
 */
function parseAndAppendAccounts(rawText, accType) {
  accType = String(accType || "skin").toLowerCase().trim();
  const isChungSuc = (accType === "chung_suc" || accType === "chungsuc");
  const targetSheetName = isChungSuc ? TAB_KHO_CHUNG_SUC : TAB_KHO_SKIN;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(targetSheetName);
  if (!sheet) {
    if (isChungSuc) {
      sheet = initAccSheet(ss, TAB_KHO_CHUNG_SUC, "👑 KHO ACC CHUNG SỨC", "#1e1b4b", "#c084fc", []);
    } else {
      sheet = initAccSheet(ss, TAB_KHO_SKIN, "💎 KHO ACC 100-300 SKIN", "#0f172a", "#38bdf8", []);
    }
  }

  try { sheet.getRange("F2:H3000").clearDataValidations(); } catch (e) {}

  const lines = rawText.trim().split("\n");
  const lastRow = sheet.getLastRow();
  let nextSTT = lastRow > 1 ? lastRow : 1;

  const defaultNote = isChungSuc ? "Acc Chung Sức VIP" : "Acc Liên Quân 100-300 Skin";
  let addedRows = [];

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    
    let parts = [];
    if (line.includes("|")) parts = line.split("|");
    else if (line.includes(":")) parts = line.split(":");
    else if (line.includes("\t")) parts = line.split("\t");
    else if (line.includes(" - ")) parts = line.split(" - ");
    else parts = line.split(/\s+/);
    
    const user = parts[0] ? parts[0].trim() : "";
    const pass = parts[1] ? parts[1].trim() : "";
    const note = parts.slice(2).join(" | ").trim() || defaultNote;
    
    if (user && pass) {
      addedRows.push([
        nextSTT++,
        user,
        pass,
        note,
        "🟢 CHƯA PHÁT",
        "",
        "",
        ""
      ]);
    }
  });

  if (addedRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, addedRows.length, 8).setValues(addedRows);
  }

  return {
    success: true,
    count: addedRows.length,
    acc_type: isChungSuc ? "chung_suc" : "skin",
    sheet_name: sheet.getName(),
    type_name: isChungSuc ? "Acc Chung Sức" : "Acc 100-300 Skin"
  };
}

function generateBatchKeys() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheet) return;
  
  const nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm");
  for (let i = 0; i < 20; i++) {
    sheet.appendRow([generateUniqueKey(), "🟢 CHƯA DÙNG", nowStr, "", "", ""]);
  }
  SpreadsheetApp.getUi().alert("🎲 ĐÃ TẠO THÊM 20 MÃ KEY VÀO TAB KHO_KEY!");
}

function resetAllAccToAvailable() {
  const ui = SpreadsheetApp.getUi();
  const confirm = ui.alert("⚠️ CẢNH BÁO RESET", "Bạn có muốn đặt lại toàn bộ Acc (Skin & Chung Sức) về CHƯA PHÁT và Key về CHƯA DÙNG không?", ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetsToReset = [
    ss.getSheetByName(TAB_KHO_SKIN),
    ss.getSheetByName(TAB_KHO_CHUNG_SUC)
  ].filter(Boolean);
  
  sheetsToReset.forEach(sheetAcc => {
    if (sheetAcc.getLastRow() >= 2) {
      for (let r = 2; r <= sheetAcc.getLastRow(); r++) {
        sheetAcc.getRange(r, 5).setValue("🟢 CHƯA PHÁT");
        sheetAcc.getRange(r, 6).setValue("");
        sheetAcc.getRange(r, 7).setValue("");
        sheetAcc.getRange(r, 8).setValue("");
      }
    }
  });

  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  if (sheetKey && sheetKey.getLastRow() >= 2) {
    for (let r = 2; r <= sheetKey.getLastRow(); r++) {
      sheetKey.getRange(r, 2).setValue("🟢 CHƯA DÙNG");
      sheetKey.getRange(r, 4).setValue("");
      sheetKey.getRange(r, 5).setValue("");
      sheetKey.getRange(r, 6).setValue("");
    }
  }
  ui.alert("✅ ĐÃ RESET TOÀN BỘ VỀ TRẠNG THÁI CHƯA DÙNG!");
}

function generateUniqueKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  function randPart(len) {
    let s = "";
    for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  }
  return `MG-KEY-${randPart(4)}-${randPart(4)}`;
}

function calculateStockStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let skinStats = { total: 0, available: 0, claimed: 0 };
  let chungSucStats = { total: 0, available: 0, claimed: 0 };

  // 1. Quét Tab KHO_ACC_SKIN
  let sheetSkin = ss.getSheetByName(TAB_KHO_SKIN);
  if (sheetSkin && sheetSkin.getLastRow() >= 2) {
    const data = sheetSkin.getRange(2, 5, sheetSkin.getLastRow() - 1, 1).getValues();
    skinStats.total = data.length;
    data.forEach(r => {
      const status = String(r[0] || "").trim();
      if (status.includes("CHƯA PHÁT")) skinStats.available++;
      else if (status.includes("ĐÃ PHÁT")) skinStats.claimed++;
    });
  }

  // 2. Quét Tab KHO_ACC_CHUNG_SUC
  let sheetChungSuc = ss.getSheetByName(TAB_KHO_CHUNG_SUC);
  if (sheetChungSuc && sheetChungSuc.getLastRow() >= 2) {
    const data = sheetChungSuc.getRange(2, 5, sheetChungSuc.getLastRow() - 1, 1).getValues();
    chungSucStats.total = data.length;
    data.forEach(r => {
      const status = String(r[0] || "").trim();
      if (status.includes("CHƯA PHÁT")) chungSucStats.available++;
      else if (status.includes("ĐÃ PHÁT")) chungSucStats.claimed++;
    });
  }

  return {
    skin: skinStats,
    chung_suc: chungSucStats,
    total_acc: skinStats.total + chungSucStats.total,
    available_acc: skinStats.available + chungSucStats.available,
    claimed_acc: skinStats.claimed + chungSucStats.claimed
  };
}

function showStockStats() {
  const s = calculateStockStats();
  SpreadsheetApp.getUi().alert(
    `📊 THỐNG KÊ CHI TIẾT 2 KHO ACC MA GIÁO AOV:\n\n` +
    `💎 KHO ACC 100-300 SKIN:\n` +
    ` • Tổng: ${s.skin.total} Acc\n` +
    ` • 🟢 Chưa phát: ${s.skin.available} Acc\n` +
    ` • 🔴 Đã phát: ${s.skin.claimed} Acc\n\n` +
    `👑 KHO ACC CHUNG SỨC:\n` +
    ` • Tổng: ${s.chung_suc.total} Acc\n` +
    ` • 🟢 Chưa phát: ${s.chung_suc.available} Acc\n` +
    ` • 🔴 Đã phát: ${s.chung_suc.claimed} Acc\n\n` +
    `📦 TOÀN HỆ THỐNG: ${s.total_acc} Acc (Sẵn sàng: ${s.available_acc} | Đã phát: ${s.claimed_acc})`
  );
}

/**
 * ==============================================================================
 * API ENGINE: HỖ TRỢ NẠP ACC TỪ FILE TXT VÀ WEB ADMIN
 * ==============================================================================
 */

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ success: false, error: "SERVER_BUSY", message: "Hệ thống đang bận, vui lòng thử lại sau vài giây!" });
  }
  
  try {
    // Tự động gỡ bỏ Data Validation cũ
    try {
      const ssAuto = SpreadsheetApp.getActiveSpreadsheet();
      [ssAuto.getSheetByName(TAB_KHO_SKIN), ssAuto.getSheetByName(TAB_KHO_CHUNG_SUC)].forEach(sh => {
        if (sh) sh.getRange("F2:H3000").clearDataValidations();
      });
    } catch (eClean) {}

    const params = (e && e.parameter) ? e.parameter : {};
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      try { postData = JSON.parse(e.postData.contents); } catch (ex) {}
    }
    
    const action = params.action || postData.action || "get_stats";
    
    // 0. ACTION: SỬA LỖI XÁC THỰC CỘT H (TỰ ĐỘNG)
    if (action === "fix_validation" || action === "fix_column_h") {
      fixDataValidation();
      return jsonResponse({ success: true, message: "Đã gỡ bỏ toàn bộ quy tắc xác thực gây lỗi trên Cột H thành công!" });
    }

    // 0.1 ACTION: XÓA ACC MẪU DEMO (CHỈ GIỮ LẠI ACC THẬT CỦA ADMIN)
    if (action === "clear_samples") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const targetCategory = (params.acc_type || postData.acc_type || "").trim().toLowerCase();
      let deleteCount = 0;

      let sheetsToClean = [];
      if (targetCategory === "skin") {
        sheetsToClean = [ss.getSheetByName(TAB_KHO_SKIN)].filter(Boolean);
      } else if (targetCategory === "chung_suc" || targetCategory === "chungsuc") {
        sheetsToClean = [ss.getSheetByName(TAB_KHO_CHUNG_SUC)].filter(Boolean);
      } else {
        sheetsToClean = [ss.getSheetByName(TAB_KHO_SKIN), ss.getSheetByName(TAB_KHO_CHUNG_SUC)].filter(Boolean);
      }

      sheetsToClean.forEach(sheet => {
        if (sheet.getLastRow() < 2) return;
        const lastR = sheet.getLastRow();
        for (let r = lastR; r >= 2; r--) {
          const u = String(sheet.getRange(r, 2).getValue() || "").toLowerCase();
          if (u.includes("garena_vip") || u.includes("garena_trang") || u.includes("garena_rank") || 
              u.includes("freefire_vip") || u.includes("random_nick") || u.includes("garena_sample") ||
              u.includes("skin_vip_") || u.includes("chungsuc_0")) {
            sheet.deleteRow(r);
            deleteCount++;
          }
        }
        const newLastR = sheet.getLastRow();
        if (newLastR >= 2) {
          for (let r = 2; r <= newLastR; r++) {
            sheet.getRange(r, 1).setValue(r - 1);
          }
        }
      });
      
      const curStats = calculateStockStats();
      return jsonResponse({
        success: true,
        count: deleteCount,
        available: curStats.available_acc,
        stats: curStats,
        message: `Đã xóa thành công ${deleteCount} Acc mẫu demo! Kho hiện chỉ còn ${curStats.available_acc} Acc thật sẵn sàng phát theo thứ tự.`
      });
    }

    // 1. ACTION: LẤY THỐNG KÊ KHO
    if (action === "get_stats") {
      const stats = calculateStockStats();
      const recentClaims = getRecentClaimsLog(10);
      return jsonResponse({
        success: true,
        stats: stats,
        recent_claims: recentClaims
      });
    }
    
    // 2. ACTION: NẠP ACC HÀNG LOẠT VÀO KHO TƯƠNG ỨNG (SKIN HOẶC CHUNG SỨC)
    if (action === "import_txt" || action === "add_bulk_acc") {
      const rawText = params.text || postData.text || "";
      const accType = (params.acc_type || postData.acc_type || "skin").trim();
      if (!rawText || !rawText.trim()) {
        return jsonResponse({ success: false, message: "Nội dung văn bản trống!" });
      }
      const res = parseAndAppendAccounts(rawText, accType);
      const currentStats = calculateStockStats();
      const typeAvail = (res.acc_type === "chung_suc") ? currentStats.chung_suc.available : currentStats.skin.available;
      
      return jsonResponse({
        success: true,
        added_count: res.count,
        acc_type: res.acc_type,
        type_name: res.type_name,
        sheet_name: res.sheet_name,
        total_available: currentStats.available_acc,
        type_available: typeAvail,
        stats: currentStats,
        message: `Đã nạp thành công ${res.count} Acc vào ${res.type_name} (${res.sheet_name})! Hiện loại này có ${typeAvail} Acc sẵn sàng phát.`
      });
    }
    
    // 2.1 ACTION: ĐĂNG KÝ PHIÊN VƯỢT LINK TỪ BIO (BẮT BUỘC ĐỂ ĐƯỢC CẤP KEY)
    if (action === "start_bypass_session" || action === "init_bypass") {
      const sessionId = (params.session_id || postData.session_id || "").trim();
      if (!sessionId) {
        return jsonResponse({ success: false, error: "MISSING_SESSION", message: "Thiếu session_id hợp lệ!" });
      }
      const cache = CacheService.getScriptCache();
      const sessionData = {
        session_id: sessionId,
        status: "PENDING",
        created_at: new Date().getTime(),
        client_info: params.client_info || postData.client_info || "Web"
      };
      cache.put("BYPASS_" + sessionId, JSON.stringify(sessionData), 3600); // Hiệu lực 60 phút
      return jsonResponse({ success: true, session_id: sessionId, message: "Đã khởi tạo phiên vượt link thành công!" });
    }

    // 3. ACTION: CẤP 1 KEY CHO TRANG key.html (CHỈ CẤP DUY NHẤT 1 LẦN CHO MỖI PHIÊN VƯỢT LINK)
    if (action === "get_key" || action === "claim_bypass_key" || action === "generate_key") {
      const sessionId = (params.session_id || postData.session_id || "").trim();
      const clientInfo = params.client_info || postData.client_info || "Vừa vượt link";
      
      if (!sessionId) {
        return jsonResponse({
          success: false,
          error: "UNAUTHORIZED_ACCESS",
          message: "Truy cập không hợp lệ! Vui lòng hoàn thành vượt link từ trang Bio để lấy Key."
        });
      }
      
      const cache = CacheService.getScriptCache();
      const cachedSession = cache.get("BYPASS_" + sessionId);
      
      if (!cachedSession) {
        return jsonResponse({
          success: false,
          error: "INVALID_SESSION",
          message: "Phiên vượt link không tồn tại hoặc đã hết hạn! Vui lòng quay lại Bio để vượt link mới."
        });
      }
      
      const sessionObj = JSON.parse(cachedSession);
      
      if (sessionObj.status === "CLAIMED" && sessionObj.issued_key) {
        return jsonResponse({
          success: true,
          key: sessionObj.issued_key,
          is_reused: true,
          issued_at: sessionObj.issued_at,
          message: "Mã Key của phiên vượt link này đã được cấp trước đó."
        });
      }
      
      const keyData = issueUniqueKey(clientInfo);
      if (keyData && keyData.success && keyData.key) {
        sessionObj.status = "CLAIMED";
        sessionObj.issued_key = keyData.key;
        sessionObj.issued_at = keyData.issued_at;
        cache.put("BYPASS_" + sessionId, JSON.stringify(sessionObj), 3600);
      }
      
      return jsonResponse(keyData);
    }
    
    // 4. ACTION: KÍCH HOẠT KEY & TRẢ ACC VỀ CHO KHÁCH (CHÍNH XÁC THEO ACC_TYPE)
    if (action === "activate_key" || action === "claim_with_key") {
      const key = (params.key || postData.key || "").trim().toUpperCase();
      const clientInfo = params.client_info || postData.client_info || "Web Browser";
      const accType = (params.acc_type || postData.acc_type || "skin").trim();
      const result = processActivateKey(key, clientInfo, accType);
      return jsonResponse(result);
    }
    
    // 5. ACTION: LẤY DANH SÁCH ACC CHO TRANG ADMIN XEM (TRẢ VỀ TÁCH BIỆT SKIN VÀ CHUNG SỨC)
    if (action === "admin_get_list") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let skinList = [];
      let chungSucList = [];

      // 1. Quét Tab KHO_ACC_SKIN
      let sheetSkin = ss.getSheetByName(TAB_KHO_SKIN);
      if (sheetSkin && sheetSkin.getLastRow() >= 2) {
        const dataSkin = sheetSkin.getRange(2, 1, sheetSkin.getLastRow() - 1, 8).getValues();
        dataSkin.forEach(r => {
          skinList.push({
            stt: r[0],
            user: r[1],
            pass: r[2],
            note: r[3],
            status: r[4],
            key: r[5],
            time: r[6],
            acc_type: "skin",
            type_label: "100-300 Skin",
            sheet: TAB_KHO_SKIN
          });
        });
      }

      // 2. Quét Tab KHO_ACC_CHUNG_SUC
      let sheetChungSuc = ss.getSheetByName(TAB_KHO_CHUNG_SUC);
      if (sheetChungSuc && sheetChungSuc.getLastRow() >= 2) {
        const dataCS = sheetChungSuc.getRange(2, 1, sheetChungSuc.getLastRow() - 1, 8).getValues();
        dataCS.forEach(r => {
          chungSucList.push({
            stt: r[0],
            user: r[1],
            pass: r[2],
            note: r[3],
            status: r[4],
            key: r[5],
            time: r[6],
            acc_type: "chung_suc",
            type_label: "Chung Sức",
            sheet: TAB_KHO_CHUNG_SUC
          });
        });
      }

      const allList = skinList.concat(chungSucList);
      const stats = calculateStockStats();
      return jsonResponse({
        success: true,
        skin_list: skinList,
        chungsuc_list: chungSucList,
        list: allList,
        stats: stats
      });
    }

    // 6. ACTION: GỬI YÊU CẦU TẶNG LIKE & ĐỘ HOT LIÊN QUÂN (DÙNG MÃ KEY)
    if (action === "submit_hot_request" || action === "claim_hot") {
      const key = (params.key || postData.key || "").trim().toUpperCase();
      const uid = (params.uid || postData.uid || "").trim();
      const buffType = (params.buff_type || postData.buff_type || "Tăng 200 Like Profile").trim();
      const clientInfo = params.client_info || postData.client_info || "Web";

      if (!key) return jsonResponse({ success: false, error: "EMPTY_KEY", message: "Vui lòng nhập mã Key kích hoạt!" });
      if (!uid) return jsonResponse({ success: false, error: "EMPTY_UID", message: "Vui lòng nhập UID hoặc Tên nhân vật Liên Quân!" });

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
      const sheetHot = getOrCreateLikeHotSheet(ss);

      if (!sheetKey || sheetKey.getLastRow() < 2) {
        return jsonResponse({ success: false, error: "NO_KEYS", message: "Hệ thống chưa thiết lập kho Key!" });
      }

      const keyData = sheetKey.getRange(2, 1, sheetKey.getLastRow() - 1, 5).getValues();
      let foundIndex = -1;
      let targetKeyRow = null;

      for (let i = 0; i < keyData.length; i++) {
        if (String(keyData[i][0] || "").trim().toUpperCase() === key) {
          foundIndex = i + 2;
          targetKeyRow = keyData[i];
          break;
        }
      }

      if (!targetKeyRow || foundIndex === -1) {
        return jsonResponse({ success: false, error: "INVALID_KEY", message: `Mã Key '${key}' không chính xác hoặc không tồn tại!` });
      }

      if (String(targetKeyRow[1] || "").includes("ĐÃ DÙNG")) {
        return jsonResponse({ success: false, error: "ALREADY_USED", message: `Mã Key '${key}' này đã được sử dụng trước đó!` });
      }

      const now = new Date();
      const nowFormatted = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

      // Khóa Key vĩnh viễn
      try {
        sheetKey.getRange(foundIndex, 2).setValue("🔴 ĐÃ DÙNG");
        sheetKey.getRange(foundIndex, 4).setValue("🔥 Buff 200 Like: " + uid);
        sheetKey.getRange(foundIndex, 5).setValue(nowFormatted);
        sheetKey.getRange(foundIndex, 6).setValue(clientInfo);
      } catch (eKey) {}

      // Ghi yêu cầu vào TAB_LIKE_HOT
      const nextSTT = sheetHot.getLastRow();
      sheetHot.appendRow([
        nextSTT,
        uid,
        key,
        buffType,
        nowFormatted,
        "🟡 ĐANG CHỜ BUFF",
        "",
        clientInfo
      ]);

      return jsonResponse({
        success: true,
        message: "🎉 Gửi yêu cầu tăng 200 Like thành công! Admin sẽ vào game buff cho bạn sớm nhất.",
        data: {
          stt: nextSTT,
          uid: uid,
          key: key,
          buff_type: buffType,
          time: nowFormatted,
          status: "🟡 ĐANG CHỜ BUFF"
        }
      });
    }

    // 7. ACTION: LẤY DANH SÁCH YÊU CẦU LIKE & ĐỘ HOT CHO ADMIN
    if (action === "admin_get_hot_list") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetHot = getOrCreateLikeHotSheet(ss);
      if (sheetHot.getLastRow() < 2) return jsonResponse({ success: true, list: [] });
      const data = sheetHot.getRange(2, 1, sheetHot.getLastRow() - 1, 8).getValues();
      const list = data.map((r, idx) => ({
        rowIndex: idx + 2,
        stt: r[0],
        uid: String(r[1] || "").trim(),
        key: String(r[2] || "").trim(),
        buff_type: String(r[3] || "").trim(),
        time: r[4],
        status: String(r[5] || "🟡 ĐANG CHỜ BUFF").trim(),
        note: String(r[6] || "").trim(),
        device: String(r[7] || "").trim()
      }));
      return jsonResponse({ success: true, list: list });
    }

    // 8. ACTION: ADMIN CẬP NHẬT TRẠNG THÁI BUFF ĐỘ HOT (ĐÃ BUFF / CHỜ BUFF)
    if (action === "admin_update_hot_status") {
      const rowIndex = parseInt(params.row_index || postData.row_index);
      const newStatus = (params.status || postData.status || "🟢 ĐÃ BUFF XONG").trim();
      if (!rowIndex || rowIndex < 2) return jsonResponse({ success: false, message: "Thiếu rowIndex hợp lệ!" });
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetHot = getOrCreateLikeHotSheet(ss);
      sheetHot.getRange(rowIndex, 6).setValue(newStatus);
      return jsonResponse({ success: true, message: "Đã cập nhật trạng thái thành công!", status: newStatus });
    }
    
    return jsonResponse({ success: false, error: "INVALID_ACTION", message: "Yêu cầu không hợp lệ." });
    
  } catch (error) {
    return jsonResponse({ success: false, error: "INTERNAL_ERROR", message: "Lỗi máy chủ: " + error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function issueUniqueKey(clientInfo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheetKey) {
    sheetKey = ss.insertSheet(TAB_KHO_KEY);
  }
  
  const nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm");
  const newKey = generateUniqueKey();
  sheetKey.appendRow([newKey, "🟢 CHƯA DÙNG", nowStr, "", "", clientInfo || "Vừa vượt link"]);
  
  return { success: true, key: newKey, issued_at: nowStr };
}

/**
 * Xử lý kích hoạt mã Key nhận Acc theo đúng loại yêu cầu (100-300 Skin hoặc Chung Sức)
 */
function processActivateKey(key, clientInfo, accType) {
  if (!key) return { success: false, error: "EMPTY_KEY", message: "Vui lòng nhập mã Key!" };
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheetKey || sheetKey.getLastRow() < 2) return { success: false, error: "INVALID_KEY", message: "Mã Key không tồn tại!" };

  accType = String(accType || "skin").toLowerCase().trim();
  const isChungSucReq = (accType === "chung_suc" || accType === "chungsuc");

  const keyLastRow = sheetKey.getLastRow();
  const keyData = sheetKey.getRange(2, 1, keyLastRow - 1, 5).getValues();
  let foundKeyIndex = -1, keyRow = null;

  for (let i = 0; i < keyData.length; i++) {
    if (String(keyData[i][0] || "").trim().toUpperCase() === key) {
      foundKeyIndex = i + 2;
      keyRow = keyData[i];
      break;
    }
  }

  if (!keyRow || foundKeyIndex === -1) {
    return { success: false, error: "NOT_FOUND", message: `Mã Key '${key}' không chính xác hoặc không tồn tại!` };
  }

  if (String(keyRow[1] || "").includes("ĐÃ DÙNG")) {
    return { success: false, error: "ALREADY_USED", message: `Mã Key '${key}' này đã được sử dụng trước đó!` };
  }

  let targetSheet = null;
  let foundAccIndex = -1;
  let targetAcc = null;

  if (isChungSucReq) {
    // TÌM TRONG TAB KHO_ACC_CHUNG_SUC
    let sheetCS = ss.getSheetByName(TAB_KHO_CHUNG_SUC);
    if (sheetCS && sheetCS.getLastRow() >= 2) {
      try { sheetCS.getRange("F2:H3000").clearDataValidations(); } catch (e) {}
      const dataCS = sheetCS.getRange(2, 1, sheetCS.getLastRow() - 1, 8).getValues();
      for (let i = 0; i < dataCS.length; i++) {
        if (String(dataCS[i][4] || "").includes("CHƯA PHÁT")) {
          targetSheet = sheetCS;
          foundAccIndex = i + 2;
          targetAcc = dataCS[i];
          break;
        }
      }
    }

    if (!targetAcc) {
      return {
        success: false,
        error: "OUT_OF_STOCK_CHUNG_SUC",
        message: "Kho Acc Chung Sức hiện đang tạm hết, vui lòng giữ mã Key và báo Admin nạp thêm nhé!"
      };
    }

  } else {
    // YÊU CẦU ACC 100-300 SKIN: TÌM TRONG TAB KHO_ACC_SKIN
    let sheetSkin = ss.getSheetByName(TAB_KHO_SKIN);
    if (sheetSkin && sheetSkin.getLastRow() >= 2) {
      try { sheetSkin.getRange("F2:H3000").clearDataValidations(); } catch (e) {}
      const dataSkin = sheetSkin.getRange(2, 1, sheetSkin.getLastRow() - 1, 8).getValues();
      for (let i = 0; i < dataSkin.length; i++) {
        if (String(dataSkin[i][4] || "").includes("CHƯA PHÁT")) {
          targetSheet = sheetSkin;
          foundAccIndex = i + 2;
          targetAcc = dataSkin[i];
          break;
        }
      }
    }

    if (!targetAcc) {
      return {
        success: false,
        error: "OUT_OF_STOCK_SKIN",
        message: "Kho Acc 100-300 Skin hiện đang tạm hết, vui lòng giữ mã Key và báo Admin nạp thêm nhé!"
      };
    }
  }

  const now = new Date();
  const nowFormatted = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  const user = String(targetAcc[1] || "").trim();
  const pass = String(targetAcc[2] || "").trim();
  const note = String(targetAcc[3] || "").trim();
  const displayCategory = isChungSucReq ? (note || "Acc Chung Sức Liên Quân VIP") : (note || "Acc Liên Quân 100-300 Skin");

  // Cập nhật trạng thái Acc vào Sheet tương ứng
  try {
    targetSheet.getRange(foundAccIndex, 5).setValue("🔴 ĐÃ PHÁT");
    targetSheet.getRange(foundAccIndex, 6).setValue(key);
    targetSheet.getRange(foundAccIndex, 7).setValue(nowFormatted);
    targetSheet.getRange(foundAccIndex, 8).clearDataValidations().setValue(clientInfo || "Web");
  } catch (errAcc) {}

  // Khóa Key vĩnh viễn
  try {
    sheetKey.getRange(foundKeyIndex, 2).setValue("🔴 ĐÃ DÙNG");
    sheetKey.getRange(foundKeyIndex, 4).setValue((isChungSucReq ? "[Chung Sức] " : "[Skin] ") + user);
    sheetKey.getRange(foundKeyIndex, 5).setValue(nowFormatted);
    sheetKey.getRange(foundKeyIndex, 6).setValue(clientInfo || "Web");
  } catch (errKey) {}

  const targetSTT = targetAcc[0] || (foundAccIndex - 1);
  return {
    success: true,
    message: "🎉 CHÚC MỪNG BẠN! KÍCH HOẠT KEY THÀNH CÔNG!",
    data: {
      stt: targetSTT,
      category: displayCategory,
      acc_type: isChungSucReq ? "chung_suc" : "skin",
      username: user,
      password: pass,
      note: note || "Đổi mật khẩu ngay sau khi đăng nhập thành công để bảo mật tài khoản.",
      key: key,
      claimed_at: nowFormatted
    }
  };
}

function getRecentClaimsLog(limit) {
  limit = limit || 10;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetSkin = ss.getSheetByName(TAB_KHO_SKIN);
  if (!sheetSkin || sheetSkin.getLastRow() < 2) return [];
  
  const data = sheetSkin.getRange(2, 1, sheetSkin.getLastRow() - 1, 8).getValues();
  const results = [];
  for (let i = data.length - 1; i >= 0; i--) {
    if (String(data[i][4] || "").includes("ĐÃ PHÁT")) {
      let u = String(data[i][1] || "");
      let maskedUser = u.length > 5 ? u.substring(0, 3) + "***" + u.substring(u.length - 2) : u.substring(0, 1) + "***";
      results.push({ time: data[i][6] || "Vừa xong", category: data[i][3] || "Acc Game VIP", masked_user: maskedUser });
      if (results.length >= limit) break;
    }
  }
  return results;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateLikeHotSheet(ss) {
  let sheet = ss.getSheetByName(TAB_LIKE_HOT);
  if (!sheet) {
    sheet = ss.insertSheet(TAB_LIKE_HOT);
    const headers = ["STT", "UID / TÊN NHÂN VẬT", "MÃ KEY", "LOẠI BUFF", "THỜI GIAN GỬI", "TRẠNG THÁI", "GHI CHÚ / ADMIN", "IP / THIẾT BỊ"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeaderRange(sheet.getRange(1, 1, 1, headers.length), "#3b0764", "#f43f5e");
    sheet.setRowHeight(1, 40);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 55);
    sheet.setColumnWidth(2, 240);
    sheet.setColumnWidth(3, 190);
    sheet.setColumnWidth(4, 220);
    sheet.setColumnWidth(5, 170);
    sheet.setColumnWidth(6, 170);
    sheet.setColumnWidth(7, 200);
    sheet.setColumnWidth(8, 160);
  }
  return sheet;
}

function showHotStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetHot = getOrCreateLikeHotSheet(ss);
  let total = 0, pending = 0, done = 0;
  if (sheetHot.getLastRow() >= 2) {
    const data = sheetHot.getRange(2, 6, sheetHot.getLastRow() - 1, 1).getValues();
    total = data.length;
    data.forEach(r => {
      const st = String(r[0] || "").trim();
      if (st.includes("CHỜ")) pending++;
      else if (st.includes("BUFF XONG") || st.includes("HOÀN THÀNH")) done++;
    });
  }
  SpreadsheetApp.getUi().alert(`🔥 THỐNG KÊ YÊU CẦU LIKE & ĐỘ HOT LQ:\n• Tổng yêu cầu: ${total}\n• 🟡 Đang chờ buff: ${pending}\n• 🟢 Đã hoàn thành: ${done}`);
}
