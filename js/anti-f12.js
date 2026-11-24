/**
 * ====================================================================
 * MA GIÁO AOV - HỆ THỐNG BẢO VỆ CHỐNG F12 & SOI MÃ NGUỒN CẤP ĐỘ CAO NHẤT
 * ====================================================================
 * - Chặn F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K
 * - Chặn Ctrl+U (Xem nguồn), Ctrl+S (Lưu trang), Ctrl+P (In trang)
 * - Chặn macOS: Cmd+Option+I/J/C/U
 * - Chặn chuột phải (Context Menu) - vẫn cho phép nhập liệu trong input/textarea
 * - Chặn kéo thả hình ảnh (Anti-drag)
 * - PHÁT HIỆN DEVTOOLS MỞ SẴN KỂ CẢ KHI DÁN LINK VÀO SAU
 * - Tự động ghi đè giao diện bằng màn hình cảnh báo đỏ (Lockout Screen)
 * - Đóng băng luồng thực thi (Debugger Freeze Loop)
 */

(function () {
    'use strict';

    let isBlocked = false;

    // GIAO DIỆN KHÓA TOÀN BỘ TRANG WEB KHI PHÁT HIỆN F12 / DEVTOOLS
    function triggerSecurityLockout() {
        if (isBlocked) return;
        isBlocked = true;

        try {
            document.title = "⛔ CẢNH BÁO BẢO MẬT • MA GIÁO AOV";
            document.documentElement.innerHTML = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>⛔ CẢNH BÁO BẢO MẬT • MA GIÁO AOV</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        background: #060913;
                        color: #f8fafc;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        height: 100vh;
                        width: 100vw;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        padding: 20px;
                    }
                    .lock-card {
                        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.99));
                        border: 2px solid #f43f5e;
                        border-radius: 24px;
                        padding: 40px 30px;
                        max-width: 520px;
                        box-shadow: 0 0 60px rgba(244, 63, 94, 0.45), 0 25px 50px -12px rgba(0, 0, 0, 0.8);
                        animation: shake 0.5s ease-in-out;
                    }
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        20%, 60% { transform: translateX(-8px); }
                        40%, 80% { transform: translateX(8px); }
                    }
                    .icon-shield {
                        font-size: 64px;
                        margin-bottom: 20px;
                        display: inline-block;
                        filter: drop-shadow(0 0 15px rgba(244, 63, 94, 0.6));
                    }
                    h1 {
                        font-size: 22px;
                        font-weight: 900;
                        color: #f43f5e;
                        letter-spacing: 0.5px;
                        margin-bottom: 14px;
                        text-transform: uppercase;
                    }
                    p {
                        font-size: 14.5px;
                        line-height: 1.7;
                        color: #cbd5e1;
                        margin-bottom: 25px;
                    }
                    .highlight {
                        color: #fbbf24;
                        font-weight: 700;
                    }
                    .btn-action {
                        display: inline-block;
                        background: linear-gradient(135deg, #f43f5e, #e11d48);
                        color: #ffffff;
                        font-weight: 800;
                        font-size: 14px;
                        padding: 13px 28px;
                        border-radius: 12px;
                        border: none;
                        cursor: pointer;
                        box-shadow: 0 10px 20px -5px rgba(244, 63, 94, 0.5);
                        transition: all 0.2s ease;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .btn-action:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 15px 25px -5px rgba(244, 63, 94, 0.65);
                    }
                </style>
            </head>
            <body>
                <div class="lock-card">
                    <div class="icon-shield">⛔</div>
                    <h1>CẢNH BÁO AN NINH HỆ THỐNG</h1>
                    <p>Hệ thống phát hiện bạn đang bật <span class="highlight">F12 / Công Cụ Nhà Phát Triển (DevTools)</span>.<br><br>
                    Để bảo vệ bản quyền phần mềm và kho tài nguyên Acc, toàn bộ nội dung đã được tự động ẩn.<br><br>
                    👉 <b>Vui lòng ĐÓNG F12 / DevTools và bấm nút bên dưới để tải lại trang!</b></p>
                    <button class="btn-action" onclick="window.location.reload()">ĐÃ ĐÓNG F12 - TẢI LẠI TRANG</button>
                </div>
            </body>
            </html>
            `;
        } catch (err) {}

        // Kích hoạt bẫy debugger đóng băng liên tục
        setInterval(function () {
            (function () { return false; }['constructor']('debugger')());
        }, 50);
    }

    // 1. CẢNH BÁO TRÊN CONSOLE
    try {
        console.clear();
        console.log('%c⚡ MA GIÁO AOV • HỆ THỐNG AN NINH BẢO MẬT ⚡', 'color: #f43f5e; font-size: 24px; font-weight: 900;');
        console.log('%c⛔ KHU VỰC ĐƯỢC BẢO VỆ NGHIÊM NGẶT! Vui lòng đóng DevTools.', 'color: #38bdf8; font-size: 14px; font-weight: bold;');
    } catch (e) {}

    // 2. PHÁT HIỆN DEVTOOLS BẰNG TIMING TRICK (CỰC NHẠY KHI MỞ SẴN)
    function checkTimingDebugger() {
        const start = performance.now();
        (function () { return false; }['constructor']('debugger')());
        const end = performance.now();
        if (end - start > 100) {
            triggerSecurityLockout();
        }
    }

    // 3. PHÁT HIỆN DEVTOOLS BẰNG CHÊNH LỆCH KÍCH THƯỚC (DOCK TRÁI/PHẢI/DƯỚI)
    function checkWindowSizeDiff() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        if (widthThreshold || heightThreshold) {
            triggerSecurityLockout();
        }
    }

    // 4. KHỞI CHẠY DISABLE-DEVTOOL NẾU ĐÃ NẠP
    function initDisableDevtoolLibrary() {
        if (typeof window.DisableDevtool === 'function') {
            try {
                window.DisableDevtool({
                    ondevtoolopen: function () {
                        triggerSecurityLockout();
                    },
                    interval: 400,
                    disableMenu: true,
                    clearLog: true,
                    disableSelect: false,
                    disableCopy: false,
                    disableCut: false,
                    disablePaste: false,
                    detectors: [0, 1, 2, 3, 4, 5, 6, 7]
                });
            } catch (err) {}
        }
    }

    // Chạy kiểm tra ngay lập tức khi script vừa được load
    checkTimingDebugger();
    checkWindowSizeDiff();
    initDisableDevtoolLibrary();

    // Vòng lặp kiểm tra liên tục
    setInterval(function () {
        checkTimingDebugger();
        checkWindowSizeDiff();
    }, 600);

    // Chờ window load để thử lại thư viện nếu tải bất đồng bộ
    window.addEventListener('DOMContentLoaded', function () {
        initDisableDevtoolLibrary();
        checkTimingDebugger();
        checkWindowSizeDiff();
    });

    // 5. CHẶN CHUỘT PHẢI (VẪN CHO PHÉP TRONG INPUT/TEXTAREA)
    document.addEventListener('contextmenu', function (e) {
        const tagName = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { capture: true, passive: false });

    // 6. CHẶN KÉO THẢ ẢNH
    document.addEventListener('dragstart', function (e) {
        if (e.target && e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // 7. CHẶN CÁC PHÍM TẮT MỞ DEVTOOLS / SOI CODE
    window.addEventListener('keydown', function (e) {
        const key = e.key;
        const keyCode = e.keyCode || e.which;
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;
        const alt = e.altKey;

        // F12
        if (keyCode === 123 || key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            triggerSecurityLockout();
            return false;
        }

        // Ctrl + Shift + I/J/C/K
        if (ctrl && shift && (
            keyCode === 73 || key === 'I' || key === 'i' ||
            keyCode === 74 || key === 'J' || key === 'j' ||
            keyCode === 67 || key === 'C' || key === 'c' ||
            keyCode === 75 || key === 'K' || key === 'k'
        )) {
            e.preventDefault();
            e.stopPropagation();
            triggerSecurityLockout();
            return false;
        }

        // Ctrl + U
        if (ctrl && (keyCode === 85 || key === 'u' || key === 'U')) {
            e.preventDefault();
            e.stopPropagation();
            triggerSecurityLockout();
            return false;
        }

        // Ctrl + S, Ctrl + P
        if (ctrl && (keyCode === 83 || key === 's' || key === 'S' || keyCode === 80 || key === 'p' || key === 'P')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // macOS: Cmd + Alt + I/J/U
        if (ctrl && alt && (
            keyCode === 73 || key === 'I' || key === 'i' ||
            keyCode === 74 || key === 'J' || key === 'j' ||
            keyCode === 85 || key === 'U' || key === 'u'
        )) {
            e.preventDefault();
            e.stopPropagation();
            triggerSecurityLockout();
            return false;
        }
    }, { capture: true, passive: false });

})();
