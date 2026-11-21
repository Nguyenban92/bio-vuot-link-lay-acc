/**
 * ==============================================================================
 * MA GIÁO AOV - HỆ THỐNG QUẢN LÝ KHO ACC & KEY (HỖ TRỢ NẠP BẰNG FILE .TXT)
 * - Nạp trực tiếp từ file .txt hoặc dán text (User|Pass hoặc User:Pass)
 * - Vượt link rút gọn xong sẽ ra trang cấp Key
 * - Khách nhập Key vào Bio kích hoạt gửi Acc về
 * ==============================================================================
 */

const TAB_KHO_ACC = "KHO_ACC";
const TAB_KHO_KEY = "KHO_KEY";
const TAB_CAU_HINH = "CẤU HÌNH HỆ THỐNG";
const TAB_LIKE_HOT = "LIKE_HOT_LQ";

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("⚡ MA GIÁO AOV - KHO ACC & KEY")
    .addItem("🚀 Khởi Tạo Hệ Thống Bảng Tính (1-Click)", "setupFullSystem")
    .addSeparator()
    .addItem("🔥 Quản Lý Yêu Cầu Like & Độ Hot LQ", "showHotStats")
    .addItem("🧹 Xóa 11 Acc Mẫu Demo (Chỉ Giữ Acc Thật)", "clearSampleAccounts")
    .addItem("🛠️ Sửa Lỗi Xác Thực Cột H (Data Validation)", "fixDataValidation")
    .addItem("➕ Nạp Acc Hàng Loạt Vào Kho (Dán Text)", "showQuickAddAccModal")
    .addItem("🎲 Tạo Thêm 20 Key Dự Phòng", "generateBatchKeys")
    .addSeparator()
    .addItem("📊 Xem Báo Cáo Thống Kê Kho Acc & Key", "showStockStats")
    .addItem("🔄 Reset Toàn Bộ Acc Về Chưa Phát (Test)", "resetAllAccToAvailable")
    .addToUi();
}

function clearSampleAccounts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  if (!sheetAcc || sheetAcc.getLastRow() < 2) return;
  
  const lastR = sheetAcc.getLastRow();
  let deleteCount = 0;
  for (let r = lastR; r >= 2; r--) {
    const u = String(sheetAcc.getRange(r, 2).getValue() || "").toLowerCase();
    if (u.includes("garena_vip") || u.includes("garena_trang") || u.includes("garena_rank") || u.includes("freefire_vip") || u.includes("random_nick") || u.includes("garena_sample")) {
      sheetAcc.deleteRow(r);
      deleteCount++;
    }
  }
  
  const newLastR = sheetAcc.getLastRow();
  if (newLastR >= 2) {
    for (let r = 2; r <= newLastR; r++) {
      sheetAcc.getRange(r, 1).setValue(r - 1);
    }
  }
  
  SpreadsheetApp.getUi().alert(`✅ ĐÃ XÓA ${deleteCount} ACC MẪU DEMO!\nHiện kho chỉ còn toàn bộ Acc thật do bạn nạp, phát lần lượt từ trên xuống dưới.`);
}

function fixDataValidation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  if (sheetAcc) {
    sheetAcc.getRange("F2:H3000").clearDataValidations();
    SpreadsheetApp.getUi().alert("✅ ĐÃ SỬA LỖI THÀNH CÔNG!\nĐã gỡ bỏ toàn bộ quy tắc xác thực cũ trên cột H. Khách nhập Key sẽ nhận Acc bình thường!");
  }
}

/**
 * Khởi tạo toàn diện 3 Tab
 */
function setupFullSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. TAB KHO_ACC
  let sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  if (!sheetAcc) {
    sheetAcc = ss.insertSheet(TAB_KHO_ACC);
  } else {
    sheetAcc.clear();
  }
  
  // Đảm bảo không còn Data Validation cũ ở các cột F, G, H
  sheetAcc.getRange("F1:H3000").clearDataValidations();
  
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
  
  const sampleAccs = [
    [1, "garena_vip_01", "MagiaoPass@2026A", "Liên Quân VIP 105 Tướng, 120 Skin SSS", "🟢 CHƯA PHÁT", "", "", ""],
    [2, "garena_trang_02", "MagiaoPass@2026B", "Acc Trắng Thông Tin 100%, Đổi pass ngay", "🟢 CHƯA PHÁT", "", "", ""],
    [3, "garena_rank_03", "MagiaoPass@2026C", "Rank Cao Thủ 25 Sao, Florentino Tinh Hệ", "🟢 CHƯA PHÁT", "", "", ""],
    [4, "freefire_vip_04", "FFPass@2026D", "Free Fire VIP Quỷ Dạ Xoa, AK Rồng Xanh", "🟢 CHƯA PHÁT", "", "", ""]
  ];
  sheetAcc.getRange(2, 1, sampleAccs.length, headersAcc.length).setValues(sampleAccs);
  
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["🟢 CHƯA PHÁT", "🔴 ĐÃ PHÁT"], true)
    .setAllowInvalid(false)
    .build();
  sheetAcc.getRange("E2:E2000").setDataValidation(statusRule);
  
  sheetAcc.setColumnWidth(1, 55);
  sheetAcc.setColumnWidth(2, 190);
  sheetAcc.setColumnWidth(3, 190);
  sheetAcc.setColumnWidth(4, 280);
  sheetAcc.setColumnWidth(5, 140);
  sheetAcc.setColumnWidth(6, 180);
  sheetAcc.setColumnWidth(7, 160);
  sheetAcc.setColumnWidth(8, 180);
  
  // 2. TAB KHO_KEY
  let sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  if (!sheetKey) {
    sheetKey = ss.insertSheet(TAB_KHO_KEY);
  } else {
    sheetKey.clear();
  }
  
  const headersKey = ["MÃ KEY", "TRẠNG THÁI", "THỜI GIAN TẠO", "ACC ĐÃ CẤP", "THỜI GIAN KÍCH HOẠT", "IP / THIẾT BỊ"];
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
  
  // 3. TAB CẤU HÌNH
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
    ["Link Rút Gọn Của Admin", "https://link4m.co/xxx", "Link rút gọn dẫn đến trang key.html"]
  ];
  sheetConfig.getRange(2, 1, configRows.length, configHeaders.length).setValues(configRows);
  sheetConfig.setColumnWidth(1, 240);
  sheetConfig.setColumnWidth(2, 360);
  sheetConfig.setColumnWidth(3, 360);

  SpreadsheetApp.getUi().alert("🎉 KHỞI TẠO THÀNH CÔNG HỆ THỐNG KHO ACC & KEY!");
}

function formatHeaderRange(range, bgColor, fontColor) {
  range.setBackground(bgColor)
       .setFontColor(fontColor)
       .setFontWeight("bold")
       .setFontSize(11)
       .setHorizontalAlignment("center")
       .setVerticalAlignment("middle");
}

function showQuickAddAccModal() {
  const ui = SpreadsheetApp.getUi();
  const prompt = ui.prompt(
    "➕ NẠP ACC BẰNG NỘI DUNG TỆP .TXT",
    "Dán danh sách Acc (User|Pass hoặc User:Pass, mỗi dòng 1 Acc):\nVí dụ:\ngarena_vip10|Pass@123|Liên Quân 90 skin\ngarena_vip11:Pass@456",
    ui.ButtonSet.OK_CANCEL
  );
  if (prompt.getSelectedButton() !== ui.Button.OK) return;
  const input = prompt.getResponseText();
  if (!input || !input.trim()) return;
  
  const result = parseAndAppendAccounts(input);
  ui.alert(`✅ ĐÃ NẠP THÀNH CÔNG ${result.count} ACC VÀO KHO!`);
}

/**
 * Hàm phân tích văn bản .txt và tự động nạp vào Tab KHO_ACC
 * Hỗ trợ các định dạng: User|Pass|Note, User:Pass, User/Pass, User  Pass
 */
function parseAndAppendAccounts(rawText) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TAB_KHO_ACC);
  if (!sheet) return { success: false, count: 0, message: "Chưa tạo bảng KHO_ACC" };
  
  const lines = rawText.trim().split("\n");
  const lastRow = sheet.getLastRow();
  let nextSTT = lastRow > 1 ? lastRow : 1;
  
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
    const note = parts.slice(2).join(" | ").trim() || "Acc Game VIP (Nạp từ txt)";
    
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
  
  return { success: true, count: addedRows.length };
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
  const confirm = ui.alert("⚠️ CẢNH BÁO RESET", "Bạn có muốn đặt lại toàn bộ Acc về CHƯA PHÁT và Key về CHƯA DÙNG không?", ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  
  if (sheetAcc && sheetAcc.getLastRow() >= 2) {
    for (let r = 2; r <= sheetAcc.getLastRow(); r++) {
      sheetAcc.getRange(r, 5).setValue("🟢 CHƯA PHÁT");
      sheetAcc.getRange(r, 6).setValue("");
      sheetAcc.getRange(r, 7).setValue("");
      sheetAcc.getRange(r, 8).setValue("");
    }
  }
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
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  
  let totalAcc = 0, availableAcc = 0, claimedAcc = 0;
  if (sheetAcc && sheetAcc.getLastRow() >= 2) {
    const dataAcc = sheetAcc.getRange(2, 5, sheetAcc.getLastRow() - 1, 1).getValues();
    totalAcc = dataAcc.length;
    dataAcc.forEach(r => {
      const st = String(r[0] || "").trim();
      if (st.includes("CHƯA PHÁT")) availableAcc++;
      else if (st.includes("ĐÃ PHÁT")) claimedAcc++;
    });
  }
  return { total_acc: totalAcc, available_acc: availableAcc, claimed_acc: claimedAcc };
}

function showStockStats() {
  const s = calculateStockStats();
  SpreadsheetApp.getUi().alert(`📊 THỐNG KÊ:\n• Tổng Acc: ${s.total_acc}\n• Sẵn sàng (Chưa phát): ${s.available_acc}\n• Đã phát: ${s.claimed_acc}`);
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
    // Tự động gỡ bỏ mọi ràng buộc Data Validation cũ trên Cột F, G, H nếu có
    try {
      const ssAuto = SpreadsheetApp.getActiveSpreadsheet();
      const sheetAccAuto = ssAuto.getSheetByName(TAB_KHO_ACC);
      if (sheetAccAuto) {
        sheetAccAuto.getRange("F2:H3000").clearDataValidations();
      }
    } catch (eClean) {}

    const params = (e && e.parameter) ? e.parameter : {};
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      try { postData = JSON.parse(e.postData.contents); } catch (ex) {}
    }
    
    const action = params.action || postData.action || "get_stats";
    
    // 0. ACTION: SỬA LỖI XÁC THỰC CỘT H (TỰ ĐỘNG)
    if (action === "fix_validation" || action === "fix_column_h") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
      if (sheetAcc) {
        sheetAcc.getRange("F2:H3000").clearDataValidations();
      }
      return jsonResponse({ success: true, message: "Đã gỡ bỏ toàn bộ quy tắc xác thực gây lỗi trên Cột H thành công!" });
    }

    // 0.1 ACTION: XÓA ACC MẪU DEMO (CHỈ GIỮ LẠI ACC THẬT CỦA ADMIN)
    if (action === "clear_samples") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
      if (!sheetAcc || sheetAcc.getLastRow() < 2) return jsonResponse({ success: false, message: "Kho trống!" });
      
      const lastR = sheetAcc.getLastRow();
      let deleteCount = 0;
      for (let r = lastR; r >= 2; r--) {
        const u = String(sheetAcc.getRange(r, 2).getValue() || "").toLowerCase();
        if (u.includes("garena_vip") || u.includes("garena_trang") || u.includes("garena_rank") || u.includes("freefire_vip") || u.includes("random_nick") || u.includes("garena_sample")) {
          sheetAcc.deleteRow(r);
          deleteCount++;
        }
      }
      
      const newLastR = sheetAcc.getLastRow();
      if (newLastR >= 2) {
        for (let r = 2; r <= newLastR; r++) {
          sheetAcc.getRange(r, 1).setValue(r - 1);
        }
      }
      
      const curStats = calculateStockStats();
      return jsonResponse({
        success: true,
        count: deleteCount,
        available: curStats.available_acc,
        message: `Đã xóa thành công ${deleteCount} Acc mẫu demo! Kho hiện chỉ còn ${curStats.available_acc} Acc thật sẵn sàng phát theo thứ tự.`
      });
    }

    // 1. ACTION: LẤY THỐNG KÊ KHO
    if (action === "get_stats") {
      const stats = calculateStockStats();
      const recentClaims = getRecentClaimsLog(10);
      return jsonResponse({
        success: true,
        stats: { total: stats.total_acc, available: stats.available_acc, claimed: stats.claimed_acc },
        recent_claims: recentClaims
      });
    }
    
    // 2. ACTION: NẠP ACC HÀNG LOẠT TỪ VĂN BẢN .TXT HOẶC WEB ADMIN
    if (action === "import_txt" || action === "add_bulk_acc") {
      const rawText = params.text || postData.text || "";
      if (!rawText || !rawText.trim()) {
        return jsonResponse({ success: false, message: "Nội dung văn bản trống!" });
      }
      const res = parseAndAppendAccounts(rawText);
      const currentStats = calculateStockStats();
      return jsonResponse({
        success: true,
        added_count: res.count,
        total_available: currentStats.available_acc,
        message: `Đã nạp thành công ${res.count} Acc vào kho! Hiện kho có ${currentStats.available_acc} Acc sẵn sàng phát.`
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
      
      // Bắt buộc phải có session_id hợp lệ -> Khóa triệt để mọi truy cập trực tiếp
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
        // Không tìm thấy phiên hoặc phiên đã quá hạn
        return jsonResponse({
          success: false,
          error: "INVALID_SESSION",
          message: "Phiên vượt link không tồn tại hoặc đã hết hạn! Vui lòng quay lại Bio để vượt link mới."
        });
      }
      
      const sessionObj = JSON.parse(cachedSession);
      
      // NẾU PHIÊN NÀY ĐÃ ĐƯỢC CẤP KEY TRƯỚC ĐÓ (F5 HOẶC MỞ LẠI):
      // TUYỆT ĐỐI KHÔNG TẠO THÊM KEY MỚI! CHỈ TRẢ VỀ ĐÚNG MÃ KEY CŨ!
      if (sessionObj.status === "CLAIMED" && sessionObj.issued_key) {
        return jsonResponse({
          success: true,
          key: sessionObj.issued_key,
          is_reused: true,
          issued_at: sessionObj.issued_at,
          message: "Mã Key của phiên vượt link này đã được cấp trước đó."
        });
      }
      
      // NẾU LÀ PHIÊN HỢP LỆ VÀ ĐANG CHỜ (PENDING):
      // Sinh 1 Key DUY NHẤT và khóa vĩnh viễn phiên này sang trạng thái CLAIMED!
      const keyData = issueUniqueKey(clientInfo);
      if (keyData && keyData.success && keyData.key) {
        sessionObj.status = "CLAIMED";
        sessionObj.issued_key = keyData.key;
        sessionObj.issued_at = keyData.issued_at;
        cache.put("BYPASS_" + sessionId, JSON.stringify(sessionObj), 3600);
      }
      
      return jsonResponse(keyData);
    }
    
    // 4. ACTION: KÍCH HOẠT KEY & TRẢ ACC VỀ CHO KHÁCH
    if (action === "activate_key" || action === "claim_with_key") {
      const key = (params.key || postData.key || "").trim().toUpperCase();
      const clientInfo = params.client_info || postData.client_info || "Web Browser";
      const accType = (params.acc_type || postData.acc_type || "skin").trim();
      const result = processActivateKey(key, clientInfo, accType);
      return jsonResponse(result);
    }
    
    // 5. ACTION: DANH SÁCH ACC CHO TRANG ADMIN XEM
    if (action === "admin_get_list") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
      if (!sheetAcc || sheetAcc.getLastRow() < 2) return jsonResponse({ success: true, list: [] });
      const data = sheetAcc.getRange(2, 1, sheetAcc.getLastRow() - 1, 8).getValues();
      const list = data.map(r => ({
        stt: r[0],
        user: r[1],
        pass: r[2],
        note: r[3],
        status: r[4],
        key: r[5],
        time: r[6]
      }));
      return jsonResponse({ success: true, list: list });
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

      // 1. Khóa vĩnh viễn Key sang trạng thái ĐÃ DÙNG (Không thể dùng lại cho Acc hay Like)
      try {
        sheetKey.getRange(foundIndex, 2).setValue("🔴 ĐÃ DÙNG");
        sheetKey.getRange(foundIndex, 4).setValue("🔥 Buff 200 Like: " + uid);
        sheetKey.getRange(foundIndex, 5).setValue(nowFormatted);
        sheetKey.getRange(foundIndex, 6).setValue(clientInfo);
      } catch (eKey) {}

      // 2. Ghi yêu cầu vào TAB_LIKE_HOT
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

function processActivateKey(key, clientInfo, accType) {
  if (!key) return { success: false, error: "EMPTY_KEY", message: "Vui lòng nhập mã Key!" };
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetKey = ss.getSheetByName(TAB_KHO_KEY);
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  
  if (!sheetKey || !sheetAcc) return { success: false, message: "Hệ thống chưa được thiết lập!" };
  
  // Đảm bảo không bị Data Validation cũ chặn ghi dữ liệu
  try {
    sheetAcc.getRange("F2:H3000").clearDataValidations();
  } catch (eVal) {}

  const keyLastRow = sheetKey.getLastRow();
  if (keyLastRow < 2) return { success: false, error: "INVALID_KEY", message: "Mã Key không tồn tại!" };
  
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
  
  // Tìm Acc còn trống
  const accLastRow = sheetAcc.getLastRow();
  if (accLastRow < 2) return { success: false, error: "OUT_OF_STOCK", message: "Kho hiện đang hết Acc, vui lòng nhắn Admin nạp thêm!" };
  
  const accData = sheetAcc.getRange(2, 1, accLastRow - 1, 8).getValues();
  let foundAccIndex = -1, targetAcc = null;
  
  // Nếu chọn nhận Acc Chung Sức: Ưu tiên lọc tìm Acc có ghi chú Chung Sức
  if (accType === "chung_suc") {
    for (let i = 0; i < accData.length; i++) {
      const status = String(accData[i][4] || "").trim();
      const noteText = String(accData[i][3] || "").toLowerCase();
      if (status.includes("CHƯA PHÁT") && (noteText.includes("chung sức") || noteText.includes("chungsuc"))) {
        foundAccIndex = i + 2;
        targetAcc = accData[i];
        break;
      }
    }
  }

  // Nếu không tìm thấy hoặc người dùng chọn Acc 100-300 Skin: Lấy Acc chưa phát đầu tiên
  if (!targetAcc) {
    for (let i = 0; i < accData.length; i++) {
      if (String(accData[i][4] || "").includes("CHƯA PHÁT")) {
        foundAccIndex = i + 2;
        targetAcc = accData[i];
        break;
      }
    }
  }
  
  if (!targetAcc || foundAccIndex === -1) {
    return { success: false, error: "OUT_OF_STOCK", message: "Kho hiện đang hết Acc! Vui lòng giữ mã Key và báo Admin nạp thêm nhé." };
  }
  
  const now = new Date();
  const nowFormatted = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  const user = String(targetAcc[1] || "").trim();
  const pass = String(targetAcc[2] || "").trim();
  const note = String(targetAcc[3] || "").trim();
  const displayCategory = note || (accType === "chung_suc" ? "Acc Chung Sức VIP" : "Acc Liên Quân 100-300 Skin");
  
  // Cập nhật trạng thái an toàn tuyệt đối
  try {
    sheetAcc.getRange(foundAccIndex, 5).setValue("🔴 ĐÃ PHÁT");
    sheetAcc.getRange(foundAccIndex, 6).setValue(key);
    sheetAcc.getRange(foundAccIndex, 7).setValue(nowFormatted);
  } catch (errAcc) {}

  try {
    sheetAcc.getRange(foundAccIndex, 8).clearDataValidations().setValue(clientInfo || "Web");
  } catch (errH) {}
  
  try {
    sheetKey.getRange(foundKeyIndex, 2).setValue("🔴 ĐÃ DÙNG");
    sheetKey.getRange(foundKeyIndex, 4).setValue(user);
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
  const sheetAcc = ss.getSheetByName(TAB_KHO_ACC);
  if (!sheetAcc || sheetAcc.getLastRow() < 2) return [];
  
  const data = sheetAcc.getRange(2, 1, sheetAcc.getLastRow() - 1, 8).getValues();
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
