/**
 * ====================================================================
 * MA GIÁO AOV - HỆ THỐNG BẢO VỆ CHỐNG F12 & SOI MÃ NGUỒN (ANTI-DEVTOOLS)
 * ====================================================================
 * - Chặn F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K
 * - Chặn Ctrl+U (Xem nguồn), Ctrl+S (Lưu trang), Ctrl+P (In trang)
 * - Chặn chuột phải (Context Menu) - vẫn cho phép nhập liệu ô text
 * - Chặn kéo thả hình ảnh
 * - Nhận diện chính xác thiết bị di động (Mobile) để KHÔNG báo nhầm
 * - Khung cảnh báo tối giản, tinh tế, hiện đại
 */

(function () {
    'use strict';

    // 1. NHẬN DIỆN THIẾT BỊ DI ĐỘNG (MOBILE / TABLET)
    const isMobileDevice = (function () {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        const isTouch = (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
        const isSmallScreen = window.innerWidth <= 850;
        return mobileRegex.test(ua) || (isTouch && isSmallScreen);
    })();

    let isBlocked = false;

    // 2. GIAO DIỆN CẢNH BÁO TỐI GIẢN & TINH TẾ (MINIMALIST)
    function triggerSecurityLockout() {
        // Tuyệt đối không chặn trên thiết bị di động
        if (isMobileDevice) return;
        if (isBlocked) return;
        isBlocked = true;

        try {
            document.title = "Cảnh Báo Bảo Mật • MA GIÁO AOV";
            document.documentElement.innerHTML = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cảnh Báo Bảo Mật</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        background-color: #0b0f19;
                        color: #f1f5f9;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 16px;
                    }
                    .alert-card {
                        background: #111827;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-top: 3px solid #f43f5e;
                        border-radius: 16px;
                        padding: 32px 24px;
                        max-width: 380px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                    }
                    .alert-icon {
                        width: 52px;
                        height: 52px;
                        background: rgba(244, 63, 94, 0.12);
                        color: #f43f5e;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        margin: 0 auto 16px auto;
                    }
                    h2 {
                        font-size: 18px;
                        font-weight: 700;
                        color: #ffffff;
                        margin-bottom: 10px;
                    }
                    p {
                        font-size: 13.5px;
                        line-height: 1.6;
                        color: #94a3b8;
                        margin-bottom: 22px;
                    }
                    .btn-reload {
                        display: inline-block;
                        width: 100%;
                        padding: 11px 0;
                        background: #f43f5e;
                        color: #ffffff;
                        font-size: 13.5px;
                        font-weight: 600;
                        border-radius: 10px;
                        border: none;
                        cursor: pointer;
                        transition: background 0.2s ease;
                    }
                    .btn-reload:hover {
                        background: #e11d48;
                    }
                </style>
            </head>
            <body>
                <div class="alert-card">
                    <div class="alert-icon">⚠️</div>
                    <h2>Cảnh Báo Bảo Mật</h2>
                    <p>Phát hiện <b>F12 / DevTools</b> đang mở.<br>Vui lòng tắt để tiếp tục truy cập trang web.</p>
                    <button class="btn-reload" onclick="window.location.reload()">Đã Tắt F12 - Tải Lại Trang</button>
                </div>
            </body>
            </html>
            `;
        } catch (err) {}

        // Bẫy ngắt nhẹ
        setInterval(function () {
            (function () { return false; }['constructor']('debugger')());
        }, 300);
    }

    // NẾU LÀ ĐIỆN THOẠI: Bỏ qua toàn bộ bẫy DevTools để người dùng lướt mượt 100%
    if (!isMobileDevice) {
        // 3. KHỞI CHẠY DISABLE-DEVTOOL (Chỉ trên máy tính / Laptop)
        function initDevtoolDetect() {
            if (typeof window.DisableDevtool === 'function') {
                try {
                    window.DisableDevtool({
                        ondevtoolopen: function () {
                            triggerSecurityLockout();
                        },
                        interval: 600,
                        disableMenu: true,
                        clearLog: true,
                        disableSelect: false,
                        disableCopy: false,
                        disableCut: false,
                        disablePaste: false,
                        // KHÔNG dùng detector 2 (Size) để tránh báo nhầm khi zoom màn hình
                        detectors: [0, 1, 3, 4, 5, 6, 7]
                    });
                } catch (err) {}
            }
        }

        initDevtoolDetect();
        window.addEventListener('DOMContentLoaded', initDevtoolDetect);

        // 4. KIỂM TRA ĐỘ TRỄ TIMING (Chỉ trên máy tính)
        function checkTiming() {
            const t0 = performance.now();
            (function () { return false; }['constructor']('debugger')());
            const t1 = performance.now();
            if (t1 - t0 > 100) {
                triggerSecurityLockout();
            }
        }

        checkTiming();
        setInterval(checkTiming, 800);
    }

    // 5. CHẶN CHUỘT PHẢI (Áp dụng chung, nhưng cho phép trong input/textarea)
    document.addEventListener('contextmenu', function (e) {
        const tagName = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { capture: true, passive: false });

    // 6. CHẶN KÉO THẢ HÌNH ẢNH
    document.addEventListener('dragstart', function (e) {
        if (e.target && e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // 7. CHẶN PHÍM TẮT TRÊN BÀN PHÍM
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

        // macOS Cmd + Alt + I/J/U
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
