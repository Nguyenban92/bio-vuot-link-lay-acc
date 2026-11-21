/**
 * ==============================================================================
 * MA GIÁO AOV - MODULE XỬ LÝ VƯỢT LINK LẤY KEY & KÍCH HOẠT NHẬN ACC
 * - 3 Bước: Làm nhiệm vụ -> Mở link vượt -> Lấy Key về nhập kích hoạt
 * - Mỗi Key chỉ dùng được 1 lần, Google Sheet tự bốc 1 Acc gửi về
 * ==============================================================================
 */

class BypassClaimManager {
    constructor() {
        this.apiUrl = (CONFIG.GOOGLE_SHEET_API_URL || "").trim();
        this.shortenedUrl = (CONFIG.SHORTENED_BYPASS_URL || "").trim();
        this.isProcessing = false;

        // Luôn làm mới trạng thái nhiệm vụ khi F5 hoặc mở lại trang để có thể làm lại tiếp
        this.taskState = {};
        try { localStorage.removeItem("mg_tasks_status"); } catch (e) {}
        
        this.mockStock = {
            total_ready: 25,
            recent_claims: [
                { time: "2 phút trước", category: "Liên Quân VIP", masked_user: "gar***91" },
                { time: "6 phút trước", category: "Trắng Thông Tin", masked_user: "nga***22" },
                { time: "12 phút trước", category: "Rank Cao Thủ", masked_user: "mag***68" },
                { time: "19 phút trước", category: "Free Fire VIP", masked_user: "pro***ff" }
            ]
        };

        this.init();
    }

    init() {
        this.renderTasks();
        this.bindEvents();
        this.fetchStockStats();
        this.updateTaskProgressUI();
        this.checkUrlForActivationKey();
    }

    // Render 3 nhiệm vụ 1 hàng ngang với Logo lớn và nút nằm dưới
    renderTasks() {
        const container = document.getElementById("tasksListContainer");
        if (!container) return;

        container.innerHTML = CONFIG.tasks.map((task, index) => {
            const isDone = !!this.taskState[task.id];
            const platformName = task.platform || (index === 0 ? "TikTok" : index === 1 ? "Telegram" : "YouTube");
            const actionLabel = task.actionLabel || (index === 0 ? "Follow Kênh" : index === 1 ? "Vào Nhóm" : "Đăng Ký");

            return `
                <div class="task-grid-card ${isDone ? 'is-completed' : ''}" id="taskCard_${task.id}" style="--brand-color: ${task.color};">
                    <div class="task-card-header">
                        <span class="task-badge-step">${isDone ? '<i class="fa-solid fa-check"></i>' : `#0${index + 1}`}</span>
                        <span class="task-badge-platform">${platformName}</span>
                    </div>

                    <div class="task-logo-large" style="color: ${task.color}; border-color: ${task.color}45;">
                        <i class="${task.icon}"></i>
                    </div>

                    <div class="task-info-block">
                        <div class="task-action-title">${actionLabel}</div>
                    </div>

                    <button type="button" class="btn-grid-action ${isDone ? 'is-done' : ''}" id="btnTask_${task.id}" data-task-id="${task.id}">
                        ${isDone 
                            ? `<i class="fa-solid fa-circle-check"></i> <span>Hoàn Thành</span>` 
                            : `<span>${task.actionText || 'Thực Hiện'}</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>`}
                    </button>
                </div>
            `;
        }).join("");

        CONFIG.tasks.forEach(task => {
            const btn = document.getElementById(`btnTask_${task.id}`);
            if (btn) {
                btn.addEventListener("click", () => this.handleTaskClick(task));
            }
        });
    }

    handleTaskClick(task) {
        if (this.taskState[task.id]) {
            sounds.playClick();
            window.open(task.url, "_blank");
            return;
        }

        sounds.playClick();
        window.open(task.url, "_blank");

        const btn = document.getElementById(`btnTask_${task.id}`);
        const card = document.getElementById(`taskCard_${task.id}`);
        if (!btn) return;

        btn.disabled = true;
        btn.classList.add("is-waiting");
        let countdown = task.verifySeconds || 5;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Chờ ${countdown}s</span>`;

        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Chờ ${countdown}s</span>`;
            } else {
                clearInterval(timer);
                this.taskState[task.id] = true;
                
                sounds.playSuccess();
                btn.disabled = false;
                btn.classList.remove("is-waiting");
                btn.classList.add("is-done");
                btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Hoàn Thành</span>`;
                if (card) {
                    card.classList.add("is-completed");
                    const stepBadge = card.querySelector(".task-badge-step");
                    if (stepBadge) stepBadge.innerHTML = `<i class="fa-solid fa-check"></i>`;
                }

                this.showToast(`Đã hoàn thành: ${task.name}!`, "success");
                this.updateTaskProgressUI();
            }
        }, 1000);
    }

    updateTaskProgressUI() {
        const total = CONFIG.tasks.length;
        let completed = 0;
        CONFIG.tasks.forEach(t => {
            if (this.taskState[t.id]) completed++;
        });

        const percent = Math.round((completed / total) * 100);
        
        const pillText = document.getElementById("taskProgressPill");
        const fillBar = document.getElementById("taskProgressFill");

        if (pillText) pillText.textContent = `${completed}/${total} Hoàn thành`;
        if (fillBar) fillBar.style.width = `${percent}%`;

        const bypassBtn = document.getElementById("btnMainBypass");
        const bypassLockHint = document.getElementById("bypassLockHint");

        if (bypassBtn) {
            if (completed >= total) {
                bypassBtn.classList.remove("is-locked");
                bypassBtn.classList.add("is-unlocked");
                bypassBtn.disabled = false;
                bypassBtn.innerHTML = `
                    <i class="fa-solid fa-bolt"></i>
                    <span>VƯỢT LINK LẤY KEY</span>
                    <i class="fa-solid fa-arrow-right"></i>
                `;
            } else {
                bypassBtn.classList.add("is-locked");
                bypassBtn.classList.remove("is-unlocked");
                bypassBtn.disabled = true;
                bypassBtn.innerHTML = `
                    <i class="fa-solid fa-lock"></i>
                    <span>HOÀN THÀNH 3 NHIỆM VỤ ĐỂ MỞ LINK</span>
                `;
            }
        }
    }

    bindEvents() {
        // Chuyển đổi giữa 2 Tab Dịch Vụ: Nhận Acc Free vs Tặng Độ HOT Free
        const tabBtnAcc = document.getElementById("tabBtnAcc");
        const tabBtnHot = document.getElementById("tabBtnHot");

        if (tabBtnAcc && tabBtnHot) {
            tabBtnAcc.addEventListener("click", () => {
                sounds.playClick();
                this.switchTab("tab-acc");
            });

            tabBtnHot.addEventListener("click", () => {
                sounds.playClick();
                this.switchTab("tab-hot");
            });
        }

        // Nút mở link vượt - mở thẳng tab mới ngay lập tức
        const bypassBtn = document.getElementById("btnMainBypass");
        if (bypassBtn) {
            bypassBtn.addEventListener("click", () => {
                sounds.playLootboxOpen();
                
                // 1. Tạo Session ID duy nhất cho phiên vượt link này (1-Time Session)
                const sessionId = "BPS_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8).toUpperCase();
                
                // 2. Lưu vào localStorage để trang key.html nhận diện phiên hợp lệ
                localStorage.setItem("mg_active_bypass_session", sessionId);
                localStorage.setItem("mg_bypass_start_time", Date.now());
                
                // 3. Đăng ký session lên Google Apps Script Web App (Chống F5 và chống tạo key ảo)
                if (this.apiUrl) {
                    fetch(`${this.apiUrl}?action=start_bypass_session&session_id=${encodeURIComponent(sessionId)}&client_info=${encodeURIComponent(navigator.userAgent)}`)
                        .catch(err => console.warn("Lỗi đăng ký session:", err));
                }
                
                // 4. Mở link vượt link
                const targetUrl = this.shortenedUrl || `key.html?sid=${encodeURIComponent(sessionId)}`;
                window.open(targetUrl, "_blank");
            });
        }

        // Nút Kích hoạt mã Key (Tab 1: Nhận Acc)
        const btnActivate = document.getElementById("btnActivateKey");
        const inputKey = document.getElementById("inputActivationKey");

        if (btnActivate && inputKey) {
            btnActivate.addEventListener("click", () => {
                const keyVal = inputKey.value.trim();
                if (!keyVal) {
                    sounds.playError();
                    this.showToast("Vui lòng dán mã Key vào ô để kích hoạt!", "warning");
                    inputKey.focus();
                    return;
                }
                this.executeActivateKey(keyVal);
            });

            inputKey.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    btnActivate.click();
                }
            });
        }

        // Nút Gửi Yêu Cầu Tăng Độ Hot (Tab 2: Tặng Độ HOT Liên Quân)
        const btnSubmitHot = document.getElementById("btnSubmitHot");
        const inputHotKey = document.getElementById("inputHotKey");
        const inputHotUid = document.getElementById("inputHotUid");
        const selectHotPackage = document.getElementById("selectHotPackage");

        if (btnSubmitHot && inputHotKey && inputHotUid) {
            btnSubmitHot.addEventListener("click", () => {
                const keyVal = inputHotKey.value.trim();
                const uidVal = inputHotUid.value.trim();
                const pkgVal = selectHotPackage ? selectHotPackage.value : "Tăng +500 Độ Hot & Like Profile";

                if (!keyVal) {
                    sounds.playError();
                    this.showToast("Vui lòng dán mã Key vừa vượt link vào ô 1!", "warning");
                    inputHotKey.focus();
                    return;
                }

                if (!uidVal) {
                    sounds.playError();
                    this.showToast("Vui lòng nhập UID hoặc Tên nhân vật game vào ô 2!", "warning");
                    inputHotUid.focus();
                    return;
                }

                this.executeSubmitHot(keyVal, uidVal, pkgVal);
            });

            inputHotUid.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    btnSubmitHot.click();
                }
            });

            inputHotKey.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    inputHotUid.focus();
                }
            });
        }
    }

    switchTab(tabId) {
        const tabBtnAcc = document.getElementById("tabBtnAcc");
        const tabBtnHot = document.getElementById("tabBtnHot");
        const headerPanelAcc = document.getElementById("headerPanelAcc");
        const headerPanelHot = document.getElementById("headerPanelHot");
        const formPanelAcc = document.getElementById("formPanelAcc");
        const formPanelHot = document.getElementById("formPanelHot");

        if (tabId === "tab-hot") {
            if (tabBtnHot) tabBtnHot.classList.add("is-active");
            if (tabBtnAcc) tabBtnAcc.classList.remove("is-active");
            if (headerPanelHot) headerPanelHot.style.display = "block";
            if (headerPanelAcc) headerPanelAcc.style.display = "none";
            if (formPanelHot) formPanelHot.style.display = "block";
            if (formPanelAcc) formPanelAcc.style.display = "none";
        } else {
            if (tabBtnAcc) tabBtnAcc.classList.add("is-active");
            if (tabBtnHot) tabBtnHot.classList.remove("is-active");
            if (headerPanelAcc) headerPanelAcc.style.display = "block";
            if (headerPanelHot) headerPanelHot.style.display = "none";
            if (formPanelAcc) formPanelAcc.style.display = "block";
            if (formPanelHot) formPanelHot.style.display = "none";
        }
    }

    openBypassConfirmModal(url) {
        sounds.playClick();
        const modal = document.getElementById("bypassConfirmModal");
        if (!modal) return;

        const linkBtn = document.getElementById("btnGoToBypassLink");
        if (linkBtn) {
            linkBtn.href = url;
            linkBtn.onclick = () => {
                sounds.playLootboxOpen();
                this.closeModal("bypassConfirmModal");
            };
        }

        this.openModal("bypassConfirmModal");
    }

    // Tự động điền mã Key khi từ trang key.html chuyển về (?key=...)
    checkUrlForActivationKey() {
        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get("key") || urlParams.get("claim_key");
        const tabParam = urlParams.get("tab");

        if (key && key.trim()) {
            const trimmedKey = key.trim();
            const inputAcc = document.getElementById("inputActivationKey");
            const inputHot = document.getElementById("inputHotKey");

            if (inputAcc) inputAcc.value = trimmedKey;
            if (inputHot) inputHot.value = trimmedKey;

            if (tabParam === "hot") {
                this.switchTab("tab-hot");
            }

            sounds.playSuccess();
            this.showToast("Đã nạp mã Key! Bạn có thể chọn Nhận Acc hoặc Buff Độ Hot bên dưới.", "success");
        }
    }

    // THỰC THI GỬI YÊU CẦU BUFF ĐỘ HOT LIÊN QUÂN (DÙNG MÃ KEY)
    async executeSubmitHot(key, uid, buffType) {
        if (!key || !uid || this.isProcessing) return;
        this.isProcessing = true;

        const btnSubmit = document.getElementById("btnSubmitHot");
        const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : "";
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Đang xác minh Key & Gửi dữ liệu...</span>`;
        }

        try {
            let result = null;

            if (this.apiUrl) {
                const resp = await fetch(`${this.apiUrl}?action=submit_hot_request&key=${encodeURIComponent(key)}&uid=${encodeURIComponent(uid)}&buff_type=${encodeURIComponent(buffType)}&client_info=${encodeURIComponent(navigator.userAgent)}`);
                const textResp = await resp.text();
                try {
                    result = JSON.parse(textResp);
                } catch (parseErr) {
                    console.error("Lỗi phản hồi Google Apps Script:", textResp);
                    result = {
                        success: false,
                        message: "Máy chủ Google Apps Script đang bận hoặc phản hồi không đúng định dạng. Vui lòng thử lại sau vài giây!"
                    };
                }
            } else {
                // Mô phỏng Demo
                await new Promise(r => setTimeout(r, 1200));
                result = {
                    success: true,
                    message: "🎉 Gửi yêu cầu tăng Độ Hot thành công! Admin sẽ vào game buff cho bạn sớm nhất.",
                    data: {
                        stt: 1,
                        uid: uid,
                        key: key,
                        buff_type: buffType,
                        time: new Date().toLocaleTimeString("vi-VN") + " - " + new Date().toLocaleDateString("vi-VN"),
                        status: "🟡 ĐANG CHỜ BUFF"
                    }
                };
            }

            if (result && result.success && result.data) {
                sounds.playSuccess();

                // Điền thông tin vào Modal Xác Nhận
                const modalPkg = document.getElementById("hotModalPackage");
                const modalUid = document.getElementById("hotModalUid");
                const modalKey = document.getElementById("hotModalKey");
                const modalTime = document.getElementById("hotModalTime");

                if (modalPkg) modalPkg.textContent = result.data.buff_type || buffType;
                if (modalUid) modalUid.value = result.data.uid || uid;
                if (modalKey) modalKey.textContent = result.data.key || key;
                if (modalTime) modalTime.textContent = result.data.time || (new Date().toLocaleTimeString("vi-VN") + " - " + new Date().toLocaleDateString("vi-VN"));

                this.openModal("hotRequestSuccessModal");

                // Xóa ô nhập để tránh gửi lặp
                const inputHotKey = document.getElementById("inputHotKey");
                const inputHotUid = document.getElementById("inputHotUid");
                const inputAccKey = document.getElementById("inputActivationKey");
                if (inputHotKey) inputHotKey.value = "";
                if (inputHotUid) inputHotUid.value = "";
                if (inputAccKey) inputAccKey.value = "";

                // Đánh dấu Key này đã dùng trong localStorage
                localStorage.setItem("mg_claimed_key_" + key, "true");
                localStorage.removeItem("mg_active_bypass_session");
                localStorage.removeItem("mg_bypass_start_time");

                // Reset nhiệm vụ
                this.taskState = {};
                localStorage.removeItem("mg_tasks_status");
                this.renderTasks();
                this.updateTaskProgressUI();

                this.showToast("🎉 Gửi yêu cầu tăng Độ Hot thành công!", "success");

            } else {
                sounds.playError();
                this.showToast(result.message || "Mã Key không hợp lệ hoặc đã được sử dụng!", "error");
            }

        } catch (err) {
            sounds.playError();
            this.showToast((err && err.message) || "Lỗi kết nối máy chủ Google Sheets!", "error");
        } finally {
            this.isProcessing = false;
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnHtml;
            }
        }
    }

    // THỰC THI KÍCH HOẠT KEY & NHẬN ACC TỪ GOOGLE SHEETS
    async executeActivateKey(key, isFromUrl = false) {
        if (!key || this.isProcessing) return;
        this.isProcessing = true;

        this.openModal("lootboxRewardModal");
        sounds.playLootboxOpen();

        const decryptBox = document.getElementById("lootboxDecrypting");
        const rewardBox = document.getElementById("lootboxRewardContent");
        const errorBox = document.getElementById("lootboxErrorContent");

        if (decryptBox) decryptBox.style.display = "flex";
        if (rewardBox) rewardBox.style.display = "none";
        if (errorBox) errorBox.style.display = "none";

        const tokenDisplay = document.getElementById("decryptTokenText");
        if (tokenDisplay) tokenDisplay.textContent = key;

        try {
            let result = null;

            if (this.apiUrl) {
                // Gọi Google Apps Script Web App
                const resp = await fetch(`${this.apiUrl}?action=activate_key&key=${encodeURIComponent(key)}&client_info=${encodeURIComponent(navigator.userAgent)}`);
                const textResp = await resp.text();
                try {
                    result = JSON.parse(textResp);
                } catch (parseErr) {
                    console.error("Lỗi phản hồi Google Apps Script:", textResp);
                    if (textResp.includes("vi phạm các quy tắc xác thực")) {
                        result = {
                            success: false,
                            message: "Lỗi Google Sheet: Cột H đang bị dính quy tắc Xác thực dữ liệu cũ. Vui lòng mở Google Sheet và xóa Xác thực dữ liệu ở Cột H!"
                        };
                    } else {
                        result = {
                            success: false,
                            message: "Máy chủ Google Apps Script đang bận hoặc phản hồi không đúng định dạng. Vui lòng thử lại sau vài giây!"
                        };
                    }
                }
            } else {
                // Mô phỏng Demo khi chưa kết nối
                await new Promise(r => setTimeout(r, 1600));
                result = {
                    success: true,
                    message: "Chúc mừng bạn! Kích hoạt Key thành công!",
                    data: {
                        category: "Liên Quân VIP Thách Đấu",
                        username: "magiao_vip_" + Math.floor(1000 + Math.random() * 9000),
                        password: "Pass" + Math.floor(100000 + Math.random() * 900000) + "@AOV",
                        note: "Acc Trắng Thông Tin 100%, có Florentino Tinh Hệ. Đổi mật khẩu ngay!",
                        key: key,
                        claimed_at: new Date().toLocaleTimeString("vi-VN") + " - " + new Date().toLocaleDateString("vi-VN")
                    }
                };
            }

            if (decryptBox) decryptBox.style.display = "none";

            if (result && result.success && result.data) {
                // KÍCH HOẠT THÀNH CÔNG -> HIỂN THỊ ACC
                sounds.playSuccess();
                if (rewardBox) {
                    rewardBox.style.display = "block";
                    const sttBadge = result.data.stt ? `[ACC #${result.data.stt}] ` : "";
                    document.getElementById("accDisplayCat").textContent = `${sttBadge}${result.data.category || "Acc Game VIP"}`;
                    document.getElementById("accDisplayUser").value = result.data.username || "";
                    document.getElementById("accDisplayPass").value = result.data.password || "";
                    document.getElementById("accDisplayNote").textContent = result.data.note || "Đổi mật khẩu ngay sau khi đăng nhập.";
                    document.getElementById("accDisplayTime").textContent = result.data.claimed_at || "Vừa xong";
                    document.getElementById("accDisplayToken").textContent = result.data.key || key;
                }

                // Xóa query param ?key=... khỏi URL
                if (isFromUrl && window.history && window.history.replaceState) {
                    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
                }

                // Đánh dấu Key này đã được nhận Acc thành công trong localStorage (Chống dùng lại / F5)
                localStorage.setItem("mg_claimed_key_" + key, "true");
                localStorage.setItem("mg_latest_claimed_key", key);

                // Hủy session vượt link hiện tại để không thể tái sử dụng
                localStorage.removeItem("mg_active_bypass_session");
                localStorage.removeItem("mg_bypass_start_time");

                // Reset lại nhiệm vụ để lượt sau bắt buộc phải hoàn thành nhiệm vụ mới để vượt link nhận acc tiếp theo
                this.taskState = {};
                localStorage.removeItem("mg_tasks_status");
                this.renderTasks();
                this.updateTaskProgressUI();

                // Cập nhật lại số lượng kho
                this.fetchStockStats();

            } else {
                // LỖI (Key sai hoặc đã dùng)
                sounds.playError();
                if (errorBox) {
                    errorBox.style.display = "block";
                    document.getElementById("lootboxErrorMsg").textContent = result.message || "Mã Key không hợp lệ hoặc đã được sử dụng!";
                }
            }

        } catch (err) {
            sounds.playError();
            if (decryptBox) decryptBox.style.display = "none";
            if (errorBox) {
                errorBox.style.display = "block";
                document.getElementById("lootboxErrorMsg").textContent = (err && err.message) ? err.message : "Lỗi kết nối máy chủ Google Sheets. Vui lòng kiểm tra lại đường truyền!";
            }
        } finally {
            this.isProcessing = false;
        }
    }

    async fetchStockStats() {
        if (!this.apiUrl) {
            this.applyStatsToUI(this.mockStock);
            return;
        }

        try {
            const resp = await fetch(`${this.apiUrl}?action=get_stats`);
            const data = await resp.json();
            if (data && data.success) {
                this.applyStatsToUI({
                    total_ready: data.stats.available,
                    recent_claims: data.recent_claims
                });
            }
        } catch (err) {
            this.applyStatsToUI(this.mockStock);
        }
    }

    applyStatsToUI(data) {
        const totalStockEl = document.getElementById("stockCountReady");
        if (totalStockEl) totalStockEl.textContent = data.total_ready || 0;

        this.renderLiveTicker(data.recent_claims || []);
    }

    renderLiveTicker(claims) {
        const ticker = document.getElementById("liveClaimTicker");
        if (!ticker || !claims || claims.length === 0) return;

        const itemsHtml = claims.map(c => `
            <div class="ticker-item">
                <i class="fa-solid fa-gift text-warning"></i>
                <span class="ticker-time">${c.time || "Vừa xong"}</span>
                <span class="ticker-user">${c.masked_user || "Khách"}</span>
                <span class="badge-success-mini"><i class="fa-solid fa-check"></i> Kích hoạt Acc thành công</span>
            </div>
        `).join("");

        ticker.innerHTML = `<div class="ticker-track">${itemsHtml}${itemsHtml}</div>`;
    }

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add("is-active");
            document.body.style.overflow = "hidden";
        }
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove("is-active");
            document.body.style.overflow = "";
        }
    }

    showToast(message, type = "info") {
        let toastContainer = document.getElementById("toastContainer");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toastContainer";
            toastContainer.className = "toast-container";
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = `toast-pill toast-${type}`;
        
        let icon = "fa-circle-info";
        if (type === "success") icon = "fa-circle-check";
        if (type === "warning") icon = "fa-triangle-exclamation";
        if (type === "error") icon = "fa-circle-xmark";

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 10);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
}

let bypassManager = null;
document.addEventListener("DOMContentLoaded", () => {
    bypassManager = new BypassClaimManager();
    window.bypassManager = bypassManager;
});
