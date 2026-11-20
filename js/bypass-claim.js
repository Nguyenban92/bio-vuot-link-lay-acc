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

        this.taskState = JSON.parse(localStorage.getItem("mg_tasks_status") || "{}");
        
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

    // Render 3 nhiệm vụ gọn gàng
    renderTasks() {
        const container = document.getElementById("tasksListContainer");
        if (!container) return;

        container.innerHTML = CONFIG.tasks.map((task, index) => {
            const isDone = !!this.taskState[task.id];
            return `
                <div class="task-compact-item ${isDone ? 'is-completed' : ''}" id="taskCard_${task.id}">
                    <div class="task-compact-left">
                        <div class="task-compact-icon" style="color: ${task.color}; border-color: ${task.color}35;">
                            <i class="${task.icon}"></i>
                        </div>
                        <div class="task-compact-name">${task.name}</div>
                    </div>
                    <button type="button" class="btn-compact-task ${isDone ? 'btn-task-done' : ''}" id="btnTask_${task.id}" data-task-id="${task.id}">
                        ${isDone ? '<i class="fa-solid fa-check"></i> Đã Xong' : `${task.actionText} <i class="fa-solid fa-arrow-up-right-from-square"></i>`}
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
        let countdown = task.verifySeconds || 5;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Chờ ${countdown}s`;

        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Chờ ${countdown}s`;
            } else {
                clearInterval(timer);
                this.taskState[task.id] = true;
                localStorage.setItem("mg_tasks_status", JSON.stringify(this.taskState));
                
                sounds.playSuccess();
                btn.disabled = false;
                btn.className = "btn-compact-task btn-task-done";
                btn.innerHTML = `<i class="fa-solid fa-check"></i> Đã Xong`;
                if (card) card.classList.add("is-completed");

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
                    <span>LẤY LINK VƯỢT (LẤY MÃ KEY)</span>
                    <i class="fa-solid fa-arrow-right"></i>
                `;
                if (bypassLockHint) {
                    bypassLockHint.innerHTML = `<span style="color:#10b981;"><i class="fa-solid fa-circle-check"></i> Đã mở khóa! Bấm nút để mở link vượt và lấy mã Key.</span>`;
                }
            } else {
                bypassBtn.classList.add("is-locked");
                bypassBtn.classList.remove("is-unlocked");
                bypassBtn.disabled = true;
                bypassBtn.innerHTML = `
                    <i class="fa-solid fa-lock"></i>
                    <span>HOÀN THÀNH 3 NHIỆM VỤ ĐỂ MỞ LINK</span>
                `;
                if (bypassLockHint) {
                    bypassLockHint.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Vui lòng hoàn thành đủ 3 nhiệm vụ phía trên để mở link!`;
                }
            }
        }
    }

    bindEvents() {
        // Nút mở link vượt
        const bypassBtn = document.getElementById("btnMainBypass");
        if (bypassBtn) {
            bypassBtn.addEventListener("click", () => {
                sounds.playClick();
                // Nếu Admin đã điền link rút gọn kiếm tiền thì mở link rút gọn, nếu chưa thì mở key.html
                const targetUrl = this.shortenedUrl || "key.html";
                this.openBypassConfirmModal(targetUrl);
            });
        }

        // Nút Kích hoạt mã Key
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

    // Tự động kích hoạt nếu URL có ?key=... (từ trang key.html chuyển về)
    checkUrlForActivationKey() {
        const urlParams = new URLSearchParams(window.location.search);
        const key = urlParams.get("key") || urlParams.get("claim_key");

        if (key && key.trim()) {
            const inputKey = document.getElementById("inputActivationKey");
            if (inputKey) inputKey.value = key.trim();

            setTimeout(() => {
                this.executeActivateKey(key.trim(), true);
            }, 600);
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
});
