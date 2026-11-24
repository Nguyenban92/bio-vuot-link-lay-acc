/**
 * ====================================================================
 * MA GIÁO AOV - HỆ THỐNG BẢO VỆ CHỐNG F12 & SOI MÃ NGUỒN (ANTI-DEVTOOLS)
 * ====================================================================
 * - Chặn F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K
 * - Chặn Ctrl+U (Xem nguồn), Ctrl+S (Lưu trang), Ctrl+P (In trang)
 * - Chặn macOS: Cmd+Option+I/J/C/U
 * - Chặn chuột phải (Context Menu) - vẫn cho phép chuột phải trong ô input/textarea
 * - Chặn kéo thả hình ảnh (Anti-drag images)
 * - Bẫy Debugger tự động đóng băng khi DevTools bị mở lén
 * - Toast cảnh báo giao diện Cyberpunk sang trọng
 */

(function () {
    'use strict';

    // 1. CẢNH BÁO TRÊN CONSOLE NẾU CỐ TÌNH MỞ
    try {
        const titleStyle = 'color: #f43f5e; font-size: 24px; font-weight: 900; text-shadow: 0 0 10px rgba(244,63,94,0.5);';
        const subStyle = 'color: #38bdf8; font-size: 13.5px; font-weight: bold; line-height: 1.6;';
        const warnStyle = 'color: #fbbf24; font-size: 12.5px; font-style: italic;';
        
        console.clear();
        console.log('%c⚡ MA GIÁO AOV • HỆ THỐNG AN NINH BẢO MẬT ⚡', titleStyle);
        console.log('%c⛔ CẢNH BÁO BẢN QUYỀN: Khu vực này được bảo vệ nghiêm ngặt!\nToàn bộ mã nguồn, API và tài nguyên đã được mã hóa và kiểm soát từ xa.', subStyle);
        console.log('%c⚠️ Mọi hành vi cố tình dịch ngược, trích xuất dữ liệu trái phép sẽ bị ghi log và từ chối phục vụ.', warnStyle);
    } catch (e) {}

    // 2. TẠO HỘP TOAST CẢNH BÁO HIỆN ĐẠI
    let toastTimeout = null;
    function showAntiWarnToast(msg) {
        let toast = document.getElementById('antiF12Toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'antiF12Toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 25px;
                left: 50%;
                transform: translateX(-50%) translateY(50px);
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.98));
                border: 1px solid rgba(244, 63, 94, 0.6);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.75), 0 0 20px rgba(244, 63, 94, 0.35);
                color: #f8fafc;
                padding: 12px 22px;
                border-radius: 999px;
                font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 13.5px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 99999999;
                opacity: 0;
                pointer-events: none;
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
                white-space: nowrap;
                max-width: 90vw;
            `;
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<i class="fa-solid fa-shield-halved" style="color: #f43f5e; font-size: 16px;"></i> <span>${msg || 'Chức năng này đã bị khóa để bảo vệ bản quyền!'}</span>`;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            if (toast) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(50px)';
            }
        }, 2200);
    }

    // 3. CHẶN CHUỘT PHẢI (CONTEXT MENU)
    document.addEventListener('contextmenu', function (e) {
        // Cho phép click chuột phải trên các ô nhập liệu input/textarea để Paste hoặc Copy
        const tagName = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        showAntiWarnToast('Đã vô hiệu hóa chuột phải để bảo vệ mã nguồn!');
        return false;
    }, { capture: true, passive: false });

    // 4. CHẶN KÉO THẢ HÌNH ẢNH (ANTI-DRAG)
    document.addEventListener('dragstart', function (e) {
        if (e.target && e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // 5. CHẶN CÁC PHÍM TẮT SOI CODE & MỞ DEVTOOLS
    window.addEventListener('keydown', function (e) {
        const key = e.key;
        const keyCode = e.keyCode || e.which;
        const ctrl = e.ctrlKey || e.metaKey; // Windows Ctrl hoặc macOS Cmd
        const shift = e.shiftKey;
        const alt = e.altKey;

        // F12 (123)
        if (keyCode === 123 || key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            showAntiWarnToast('Phím F12 (Kiểm tra phần tử) đã bị vô hiệu hóa!');
            return false;
        }

        // Ctrl + Shift + I (Inspect)
        // Ctrl + Shift + J (Console)
        // Ctrl + Shift + C (Inspect Cursor)
        // Ctrl + Shift + K (Firefox Console)
        if (ctrl && shift && (
            keyCode === 73 || key === 'I' || key === 'i' ||
            keyCode === 74 || key === 'J' || key === 'j' ||
            keyCode === 67 || key === 'C' || key === 'c' ||
            keyCode === 75 || key === 'K' || key === 'k'
        )) {
            e.preventDefault();
            e.stopPropagation();
            showAntiWarnToast('Tổ hợp phím DevTools đã bị vô hiệu hóa!');
            return false;
        }

        // Ctrl + U (View Source)
        if (ctrl && (keyCode === 85 || key === 'u' || key === 'U')) {
            e.preventDefault();
            e.stopPropagation();
            showAntiWarnToast('Xem mã nguồn trang web đã bị vô hiệu hóa!');
            return false;
        }

        // Ctrl + S (Lưu trang web về máy)
        if (ctrl && (keyCode === 83 || key === 's' || key === 'S')) {
            e.preventDefault();
            e.stopPropagation();
            showAntiWarnToast('Chức năng lưu trang web đã bị khóa!');
            return false;
        }

        // Ctrl + P (In trang web)
        if (ctrl && (keyCode === 80 || key === 'p' || key === 'P')) {
            e.preventDefault();
            e.stopPropagation();
            showAntiWarnToast('Chức năng in trang web đã bị khóa!');
            return false;
        }

        // macOS: Cmd + Alt + I, Cmd + Alt + J, Cmd + Alt + U
        if (ctrl && alt && (
            keyCode === 73 || key === 'I' || key === 'i' ||
            keyCode === 74 || key === 'J' || key === 'j' ||
            keyCode === 85 || key === 'U' || key === 'u'
        )) {
            e.preventDefault();
            e.stopPropagation();
            showAntiWarnToast('DevTools trên macOS đã bị vô hiệu hóa!');
            return false;
        }
    }, { capture: true, passive: false });

    // 6. BẪY DEBUGGER LOOP KHI DEVTOOLS BỊ MỞ
    // Khi DevTools đang mở, lệnh debugger sẽ làm đứng luồng thực thi để ngăn chặn can thiệp
    function debugTrap() {
        try {
            (function () {
                return false;
            }['constructor']('debugger')());
        } catch (err) {}
    }

    // Chạy nhẹ nhàng định kỳ
    let trapInterval = setInterval(debugTrap, 1500);

    window.addEventListener('beforeunload', function () {
        if (trapInterval) clearInterval(trapInterval);
    });

})();
