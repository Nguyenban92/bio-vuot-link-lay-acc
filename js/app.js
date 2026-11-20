/**
 * ==============================================================================
 * MA GIÁO AOV - MAIN APPLICATION CONTROLLER
 * Tối ưu hóa UI/UX: Hiệu ứng hạt Canvas, Player nhạc, Clock, Liên hệ & Modals
 * ==============================================================================
 */

(function () {
    'use strict';

    let isMusicPlaying = false;
    let bgAudio = null;

    /* ================= 1. HELPER FUNCTIONS ================= */

    // Sao chép văn bản vào Clipboard kèm hiệu ứng Toast & Sound
    window.copyToClipboard = function (text, message = "Đã sao chép vào bộ nhớ tạm!") {
        if (!text) return;
        sounds.playCopy();

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (window.bypassManager) {
                    window.bypassManager.showToast(message, "success");
                }
            }).catch(() => fallbackCopy(text, message));
        } else {
            fallbackCopy(text, message);
        }
    };

    function fallbackCopy(text, message) {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        try {
            document.execCommand("copy");
            if (window.bypassManager) {
                window.bypassManager.showToast(message, "success");
            }
        } catch (e) {
            alert("Không thể sao chép, vui lòng copy thủ công!");
        }
        document.body.removeChild(temp);
    }

    // Sao chép toàn bộ thông tin Acc (User + Pass + Note)
    window.copyFullAccCredentials = function () {
        const u = document.getElementById("accDisplayUser") ? document.getElementById("accDisplayUser").value : "";
        const p = document.getElementById("accDisplayPass") ? document.getElementById("accDisplayPass").value : "";
        const n = document.getElementById("accDisplayNote") ? document.getElementById("accDisplayNote").textContent : "";
        const cat = document.getElementById("accDisplayCat") ? document.getElementById("accDisplayCat").textContent : "";

        const fullText = `MA GIÁO AOV • TÀI KHOẢN GAME\n` +
                         `Tài khoản: ${u}\n` +
                         `Mật khẩu: ${p}\n` +
                         (n && n.trim() && !n.includes("...") ? `Ghi chú: ${n.trim()}` : "");
        window.copyToClipboard(fullText.trim(), "Đã sao chép toàn bộ thông tin Acc!");
    };

    /* ================= 2. ĐỒNG HỒ & LỜI CHÀO REAL-TIME ================= */

    function initClock() {
        const clockEl = document.getElementById('clockText');
        const greetingEl = document.getElementById('greetingText');
        if (!clockEl) return;

        function update() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `${h}:${m}:${s}`;

            if (greetingEl) {
                const hour = now.getHours();
                if (hour >= 5 && hour < 11) greetingEl.textContent = "Chào buổi sáng ☀️";
                else if (hour >= 11 && hour < 14) greetingEl.textContent = "Chào buổi trưa 🍱";
                else if (hour >= 14 && hour < 18) greetingEl.textContent = "Chào buổi chiều 🌤️";
                else if (hour >= 18 && hour < 22) greetingEl.textContent = "Chào buổi tối 🌙";
                else greetingEl.textContent = "Cú đêm leo rank 🦉";
            }
        }
        update();
        setInterval(update, 1000);
    }

    /* ================= 3. TRÌNH PHÁT NHẠC NỀN & SÓNG ÂM THANH ================= */

    function initAudioPlayer() {
        const playerBtn = document.getElementById('musicToggleBtn');
        const vinylDisc = document.getElementById('musicVinylDisc');
        const eqBars = document.querySelectorAll('.eq-bar');
        const soundMuteBtn = document.getElementById('soundMuteBtn');

        bgAudio = new Audio(CONFIG.music.streamUrl);
        bgAudio.loop = CONFIG.music.loop;
        bgAudio.volume = 0.5;

        if (playerBtn) {
            playerBtn.addEventListener('click', () => {
                sounds.playClick();
                if (isMusicPlaying) {
                    bgAudio.pause();
                    isMusicPlaying = false;
                    playerBtn.classList.remove('is-playing');
                    if (vinylDisc) vinylDisc.classList.remove('spinning');
                    eqBars.forEach(b => b.classList.remove('animating'));
                } else {
                    bgAudio.play().then(() => {
                        isMusicPlaying = true;
                        playerBtn.classList.add('is-playing');
                        if (vinylDisc) vinylDisc.classList.add('spinning');
                        eqBars.forEach(b => b.classList.add('animating'));
                    }).catch(err => {
                        console.log("Audio play blocked by browser:", err);
                    });
                }
            });
        }

        if (soundMuteBtn) {
            const updateSoundBtnIcon = () => {
                soundMuteBtn.innerHTML = sounds.isMuted 
                    ? `<i class="fa-solid fa-volume-xmark"></i>` 
                    : `<i class="fa-solid fa-volume-high"></i>`;
                soundMuteBtn.setAttribute("title", sounds.isMuted ? "Bật âm thanh" : "Tắt âm thanh");
            };
            updateSoundBtnIcon();

            soundMuteBtn.addEventListener('click', () => {
                const muted = sounds.toggleMute();
                updateSoundBtnIcon();
                if (window.bypassManager) {
                    window.bypassManager.showToast(muted ? "Đã tắt hiệu ứng âm thanh" : "Đã bật hiệu ứng âm thanh", "info");
                }
            });
        }
    }

    /* ================= 4. CANVAS HIỆU ỨNG HẠT ÁNH SAO (STARDUST MESH) ================= */

    function initParticleCanvas() {
        const canvas = document.getElementById('fxCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const count = Math.min(width < 768 ? 28 : 55, 70);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.6,
                alpha: Math.random() * 0.6 + 0.2,
                color: Math.random() > 0.4 ? '#a855f7' : (Math.random() > 0.5 ? '#38bdf8' : '#fbbf24')
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.shadowBlur = 6;
                ctx.shadowColor = p.color;
                ctx.fill();
            }

            ctx.globalAlpha = 0.08;
            ctx.strokeStyle = '#a855f7';
            ctx.shadowBlur = 0;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 85) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(render);
        }
        render();
    }

    /* ================= 5. RENDER HỒ SƠ & Ô THÔNG TIN LIÊN HỆ ================= */

    function initProfileAndContacts() {
        const brand = CONFIG.brand;
        if (!brand) return;

        const nameEl = document.getElementById('profileName');
        if (nameEl) nameEl.textContent = brand.name;

        const handleEl = document.getElementById('profileHandle');
        if (handleEl) handleEl.textContent = brand.handle;

        const badgeEl = document.getElementById('profileBadgeText');
        if (badgeEl) badgeEl.textContent = brand.verifiedBadge;

        const avatarImg = document.getElementById('profileAvatar');
        if (avatarImg && brand.avatar) avatarImg.src = brand.avatar;

        const descEl = document.getElementById('profileDesc');
        if (descEl) descEl.textContent = brand.description;

        // Render 3 Icon mạng xã hội xếp hàng ngang
        const contactsContainer = document.getElementById('contactsGrid');
        if (contactsContainer && CONFIG.contacts) {
            contactsContainer.innerHTML = CONFIG.contacts.map(c => `
                <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="contact-hbtn" style="--c-accent: ${c.color};" title="${c.name}">
                    <div class="contact-hbtn-icon">
                        <i class="${c.icon}"></i>
                    </div>
                    <span class="contact-hbtn-name">${c.name}</span>
                </a>
            `).join("");
        }

        // Animated Counters
        animateCount('statVisitors', brand.visitorsBase, 1500);
        animateCount('statViews', brand.viewsBase, 1800);
        animateCount('statOnline', brand.onlineBase, 1200);
    }

    function animateCount(id, target, duration) {
        const el = document.getElementById(id);
        if (!el) return;
        let start = 0;
        const step = Math.ceil(target / (duration / 25));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            el.textContent = start.toLocaleString('vi-VN');
        }, 25);
    }

    /* ================= 6. MODAL ĐÓNG/MỞ TOÀN DIỆN ================= */

    window.closeAllModals = function () {
        if (typeof sounds !== 'undefined' && sounds.playClick) sounds.playClick();
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('is-active');
        });
        document.body.style.overflow = '';
    };

    function initModals() {
        document.addEventListener('click', (e) => {
            // Bấm nút đóng (x) hoặc nút Đóng
            if (e.target.closest('.modal-close-trigger') || e.target.closest('.btn-close-modal') || e.target.closest('.btn-sub-action')) {
                window.closeAllModals();
                return;
            }
            // Bấm vào vùng nền đen bên ngoài modal card
            if (e.target.classList && e.target.classList.contains('modal-overlay')) {
                window.closeAllModals();
            }
        });

        // Nhấn phím Escape đóng mọi cửa sổ
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.closeAllModals();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initClock();
        initParticleCanvas();
        initProfileAndContacts();
        initAudioPlayer();
        initModals();
    });

})();
