document.addEventListener('DOMContentLoaded', () => {
    // Shared feedback helpers: lightweight toast plus a reusable burst effect.
    function showToast(message, durationMs = 2200) {
        const toast = document.querySelector('.toast');
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add('is-visible');

        window.clearTimeout(showToast._timerId);
        showToast._timerId = window.setTimeout(() => {
            toast.classList.remove('is-visible');
        }, durationMs);
    }

    function triggerEasterEgg(message = 'Gold sequence unlocked') {
        document.body.classList.remove('easter-active');
        void document.body.offsetWidth;
        document.body.classList.add('easter-active');
        showToast(message, 2600);

        window.clearTimeout(triggerEasterEgg._timerId);
        triggerEasterEgg._timerId = window.setTimeout(() => {
            document.body.classList.remove('easter-active');
        }, 1200);
    }

    // Pointer-driven polish is isolated so touch devices can skip it cleanly.
    function initCustomCursor() {
        const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (!supportsFinePointer || !cursor || !follower) return;

        document.body.classList.add('has-custom-cursor');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let followerX = mouseX;
        let followerY = mouseY;
        let hoveringInteractive = false;

        function render() {
            const cursorScale = hoveringInteractive ? 1.45 : 1;
            const followerScale = hoveringInteractive ? 1.9 : 1;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(${cursorScale})`;
            follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%) scale(${followerScale})`;
        }

        function animate() {
            cursorX += (mouseX - cursorX) * 0.22;
            cursorY += (mouseY - cursorY) * 0.22;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            render();
            window.requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            cursor.style.opacity = '1';
            follower.style.opacity = '0.85';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '0.85';
        });

        document.querySelectorAll('a, button, input, textarea, .project-card, .copyable').forEach((element) => {
            element.addEventListener('mouseenter', () => {
                hoveringInteractive = true;
            });

            element.addEventListener('mouseleave', () => {
                hoveringInteractive = false;
            });
        });

        animate();
    }

    function initSpotlight() {
        const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const spotlight = document.querySelector('.spotlight');
        if (!supportsFinePointer || !spotlight) return;

        document.body.classList.add('has-spotlight');

        document.addEventListener('mousemove', (event) => {
            const x = `${event.clientX}px`;
            const y = `${event.clientY}px`;
            spotlight.style.setProperty('--spotlight-x', x);
            spotlight.style.setProperty('--spotlight-y', y);
        }, { passive: true });
    }

    // Cards expose their tilt and shine angle through CSS variables so the
    // visual math stays in JS while the rendering stays in CSS.
    function initProjectTilt() {
        const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!supportsFinePointer) return;

        const cards = Array.from(document.querySelectorAll('.project-card'));
        cards.forEach((card) => {
            function resetTilt() {
                card.classList.remove('is-tilting');
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
                card.style.setProperty('--shine-x', '50%');
                card.style.setProperty('--shine-y', '50%');
            }

            card.addEventListener('pointermove', (event) => {
                if (event.pointerType === 'touch') return;

                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const rotateY = ((x / rect.width) - 0.5) * 16;
                const rotateX = ((0.5 - (y / rect.height)) * 16);

                card.classList.add('is-tilting');
                card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
                card.style.setProperty('--shine-x', `${((x / rect.width) * 100).toFixed(2)}%`);
                card.style.setProperty('--shine-y', `${((y / rect.height) * 100).toFixed(2)}%`);
            });

            card.addEventListener('pointerleave', resetTilt);
            card.addEventListener('pointercancel', resetTilt);
        });
    }

    // The slot machine is presentation only: each spin chooses one of the four
    // learning categories with equal probability, then reveals themed symbols.
    function initProjectSlotMachine() {
        const machine = document.querySelector('.slot-machine');
        if (!machine) return;

        const reels = Array.from(machine.querySelectorAll('.slot-reel'));
        const spinButton = machine.querySelector('.slot-spin');
        const result = machine.querySelector('.slot-result');
        if (reels.length === 0 || !spinButton || !result) return;

        const symbols = ['LOGIC', 'STL', 'CODE', 'BUILD', 'FTC', 'TEST', 'AI', 'DATA', 'FIX', 'SCI', 'BIO', 'PHY'];
        const picks = [
            {
                key: 'logic',
                symbols: ['LOGIC', 'STL', 'CODE'],
                title: '\u908f\u8f2f\u63a8\u7406\uff5cSTL \u7a0b\u5f0f\u5b78\u7fd2\u6210\u679c',
                reason: '\u9069\u5408\u67e5\u770b C++ STL\u3001\u8cc7\u6599\u7d50\u69cb\u8207\u6f14\u7b97\u6cd5\u601d\u8def\u3002'
            },
            {
                key: 'build',
                symbols: ['BUILD', 'FTC', 'TEST'],
                title: '\u52d5\u624b\u5be6\u4f5c\uff5cFTC \u6a5f\u5668\u4eba\u5c08\u984c',
                reason: '\u9069\u5408\u67e5\u770b\u6a5f\u5668\u4eba\u8a2d\u8a08\u3001\u7d44\u88dd\u3001\u6e2c\u8a66\u8207\u8abf\u6574\u3002'
            },
            {
                key: 'solve',
                symbols: ['AI', 'DATA', 'FIX'],
                title: '\u89e3\u6c7a\u554f\u984c\uff5cAI \u8a13\u7df4\u5b78\u7fd2\u6210\u679c',
                reason: '\u9069\u5408\u67e5\u770b AI \u8a13\u7df4\u3001\u8f38\u51fa\u89c0\u5bdf\u8207\u53cd\u8986\u6539\u9032\u7684\u904e\u7a0b\u3002'
            },
            {
                key: 'science',
                symbols: ['SCI', 'BIO', 'PHY'],
                title: '\u79d1\u5b78\u80fd\u529b\uff5c\u751f\u7269\u8207\u7269\u7406\u63a2\u7a76',
                reason: '\u9069\u5408\u67e5\u770b\u89c0\u5bdf\u3001\u5047\u8a2d\u3001\u8b8a\u56e0\u63a7\u5236\u8207\u6578\u64da\u5224\u8b80\u3002'
            }
        ];

        let isSpinning = false;

        function randomSymbol() {
            return symbols[Math.floor(Math.random() * symbols.length)];
        }

        function choosePick() {
            return picks[Math.floor(Math.random() * picks.length)];
        }

        function clearRecommendation() {
            document.querySelectorAll('.project-card.is-recommended').forEach((card) => {
                card.classList.remove('is-recommended');
            });
        }

        function highlightPick(key) {
            clearRecommendation();
            const card = document.querySelector(`.project-card[data-slot-key="${key}"]`);
            if (!card) return;

            card.classList.add('is-recommended');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        spinButton.addEventListener('click', () => {
            if (isSpinning) return;

            isSpinning = true;
            spinButton.disabled = true;
            result.textContent = '\u8f49\u52d5\u4e2d...';
            clearRecommendation();
            reels.forEach((reel) => reel.classList.add('is-spinning'));

            let ticks = 0;
            const maxTicks = 22 + Math.floor(Math.random() * 8);
            const timerId = window.setInterval(() => {
                ticks += 1;
                reels.forEach((reel) => {
                    reel.textContent = randomSymbol();
                });

                if (ticks < maxTicks) return;

                window.clearInterval(timerId);
                const pick = choosePick();
                // We stop on a deterministic trio so the final result clearly
                // matches the highlighted portfolio card.
                const finalSymbols = pick.symbols;
                reels.forEach((reel, index) => {
                    reel.textContent = finalSymbols[index];
                    reel.classList.remove('is-spinning');
                });

                result.textContent = `\u63a8\u85a6\u6210\u679c\uff1a${pick.title} - ${pick.reason}`;
                spinButton.disabled = false;
                isSpinning = false;
                highlightPick(pick.key);
                showToast(`\u63a8\u85a6\u6210\u679c\uff1a${pick.title}`);
            }, 70);
        });
    }

    // Ambient particles live on a canvas so they stay cheap even with dozens of
    // moving dots and connection lines.
    function initParticles() {
        const canvas = document.querySelector('.particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const pointer = { x: -9999, y: -9999, active: false };
        let particles = [];
        let width = 0;
        let height = 0;
        let animationId = 0;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const baseCount = width < 720 ? 20 : 42;
            const count = reduceMotion ? Math.floor(baseCount * 0.45) : baseCount;
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,
                r: Math.random() * 1.9 + 1,
                glow: Math.random() * 0.5 + 0.45
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((particle, index) => {
                if (!reduceMotion) {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                }

                if (particle.x < -20) particle.x = width + 20;
                if (particle.x > width + 20) particle.x = -20;
                if (particle.y < -20) particle.y = height + 20;
                if (particle.y > height + 20) particle.y = -20;

                if (pointer.active) {
                    const dx = particle.x - pointer.x;
                    const dy = particle.y - pointer.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < 120 && distance > 0) {
                        const force = (120 - distance) / 120;
                        particle.x += (dx / distance) * force * 1.4;
                        particle.y += (dy / distance) * force * 1.4;
                    }
                }

                ctx.beginPath();
                ctx.fillStyle = `rgba(246, 223, 170, ${0.16 + particle.glow * 0.24})`;
                ctx.shadowColor = 'rgba(216, 180, 106, 0.5)';
                ctx.shadowBlur = 10;
                ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
                    const next = particles[nextIndex];
                    const dx = particle.x - next.x;
                    const dy = particle.y - next.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance > 115) continue;

                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(216, 180, 106, ${0.11 * (1 - distance / 115)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(next.x, next.y);
                    ctx.stroke();
                }
            });

            animationId = window.requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize, { passive: true });
        document.addEventListener('mousemove', (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = true;
        }, { passive: true });
        document.addEventListener('mouseleave', () => {
            pointer.active = false;
        });

        resize();
        draw();

        window.addEventListener('beforeunload', () => {
            window.cancelAnimationFrame(animationId);
        });
    }

    // Command palette reuses the same section anchors as the main navigation,
    // so search and click navigation always stay in sync.
    function initCommandPalette() {
        const palette = document.querySelector('.command-palette');
        const input = document.querySelector('#command-input');
        const list = document.querySelector('.command-palette__list');
        const empty = document.querySelector('.command-palette__empty');
        if (!palette || !input || !list || !empty) return;

        let selectedIndex = 0;
        let filteredCommands = [];

        function goToSection(selector) {
            closePalette();
            const navLink = document.querySelector(`.site-nav a[href="${selector}"]`);
            if (navLink) {
                navLink.click();
                return;
            }

            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const commands = [
            {
                title: '\u524d\u5f80\u9996\u9801',
                desc: '\u56de\u5230\u9996\u9801\u5340\u584a',
                icon: 'fa-house',
                keys: 'H',
                keywords: 'home hero start top \u9996\u9801',
                action: () => goToSection('#home')
            },
            {
                title: '前往關於我',
                desc: '閱讀自我介紹與申請主軸',
                icon: 'fa-user',
                keys: 'A',
                keywords: 'about profile intro 關於我 自我介紹',
                action: () => goToSection('#about')
            },
            {
                title: '前往 C++ STL',
                desc: '查看自學過程、工具選擇與能力改變',
                icon: 'fa-code',
                keys: 'S',
                keywords: 'cpp c++ stl vector set stack map priority_queue 程式 自學',
                action: () => goToSection('#cpp-stl')
            },
            {
                title: '前往網站製作',
                desc: '查看學習歷程網站與互動設計',
                icon: 'fa-window-restore',
                keys: 'W',
                keywords: 'website web html css javascript 網站 製作',
                action: () => goToSection('#programming')
            },
            {
                title: '前往機器人實作',
                desc: '查看 FTC 策略、設計與控制經驗',
                icon: 'fa-robot',
                keys: 'P',
                keywords: 'robot ftc robotics 機器人 實作',
                action: () => goToSection('#robotics')
            },
            {
                title: '前往生物探究',
                desc: '查看浮葉綠碇與植物觀察實驗',
                icon: 'fa-seedling',
                keys: 'B',
                keywords: 'biology bio plant leaf 生物 探究 浮葉綠碇',
                action: () => goToSection('#biology')
            },
            {
                title: '前往物理探究',
                desc: '查看溶液加熱、鋁罐平衡與吹泡泡實驗',
                icon: 'fa-atom',
                keys: 'PHY',
                keywords: 'physics physical experiment 物理 探究 鋁罐 平衡',
                action: () => goToSection('#physics')
            },
            {
                title: '前往電資營',
                desc: '查看 FPGA、Verilog 與麵包板實作',
                icon: 'fa-flask',
                keys: 'E',
                keywords: 'experiment hardware fpga verilog 電資營 硬體',
                action: () => goToSection('#experiment')
            },
            {
                title: '前往 AI 訓練',
                desc: '查看 LEGO 分類模型、訓練流程與反思',
                icon: 'fa-brain',
                keys: 'AI',
                keywords: 'ai teachable machine lego model training 人工智慧 訓練',
                action: () => goToSection('#ai-training')
            },
            {
                title: '前往逢甲 PSD',
                desc: '查看我的經驗與精密系統設計學程的連結',
                icon: 'fa-diagram-project',
                keys: 'PSD',
                keywords: 'feng chia psd 逢甲 精密系統',
                action: () => goToSection('#psd')
            },
            {
                title: '前往未來規劃',
                desc: '查看大學學習與職涯方向',
                icon: 'fa-route',
                keys: 'F',
                keywords: 'future plan career 未來 規劃',
                action: () => goToSection('#future')
            },
            {
                title: '\u5207\u63db\u4e3b\u984c',
                desc: '\u5207\u63db\u6df1\u8272\u6216\u6dfa\u8272\u6a21\u5f0f',
                icon: 'fa-circle-half-stroke',
                keys: 'T',
                keywords: 'theme light dark mode switch \u4e3b\u984c',
                action: () => {
                    closePalette();
                    document.querySelector('.theme-toggle')?.click();
                }
            },
            {
                title: '\u89f8\u767c GOLD \u5f69\u86cb',
                desc: '\u555f\u52d5\u96b1\u85cf\u91d1\u8272\u6548\u679c',
                icon: 'fa-wand-magic-sparkles',
                keys: 'GOLD',
                keywords: 'gold secret easter egg magic surprise',
                action: () => {
                    closePalette();
                    triggerEasterEgg('\u96b1\u85cf\u91d1\u8272\u6548\u679c\u5df2\u555f\u52d5');
                }
            }
        ];

        function renderCommands() {
            const query = input.value.trim().toLowerCase();
            filteredCommands = commands.filter((command) => {
                const haystack = `${command.title} ${command.desc} ${command.keywords}`.toLowerCase();
                return haystack.includes(query);
            });

            selectedIndex = Math.min(selectedIndex, Math.max(filteredCommands.length - 1, 0));
            list.innerHTML = '';
            empty.classList.toggle('is-visible', filteredCommands.length === 0);

            filteredCommands.forEach((command, index) => {
                const button = document.createElement('button');
                button.className = `command-item${index === selectedIndex ? ' is-active' : ''}`;
                button.type = 'button';
                button.setAttribute('role', 'option');
                button.setAttribute('aria-selected', String(index === selectedIndex));
                button.innerHTML = `
                    <span class="command-item__icon"><i class="fas ${command.icon}" aria-hidden="true"></i></span>
                    <span>
                        <span class="command-item__title">${command.title}</span>
                        <span class="command-item__desc">${command.desc}</span>
                    </span>
                    <span class="command-item__key">${command.keys}</span>
                `;
                button.addEventListener('mouseenter', () => {
                    selectedIndex = index;
                    renderCommands();
                });
                button.addEventListener('click', () => command.action());
                list.appendChild(button);
            });
        }

        function openPalette() {
            palette.classList.add('is-open');
            palette.setAttribute('aria-hidden', 'false');
            document.body.classList.add('command-open');
            input.value = '';
            selectedIndex = 0;
            renderCommands();
            window.setTimeout(() => input.focus(), 0);
        }

        function closePalette() {
            palette.classList.remove('is-open');
            palette.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('command-open');
        }

        input.addEventListener('input', () => {
            selectedIndex = 0;
            renderCommands();
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
                renderCommands();
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                renderCommands();
            }

            if (event.key === 'Enter' && filteredCommands[selectedIndex]) {
                event.preventDefault();
                filteredCommands[selectedIndex].action();
            }

            if (event.key === 'Escape') {
                closePalette();
            }
        });

        palette.addEventListener('click', (event) => {
            if (event.target.closest('[data-command-close]')) {
                closePalette();
            }
        });

        document.addEventListener('keydown', (event) => {
            const isCommandK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
            if (!isCommandK) return;

            event.preventDefault();
            if (palette.classList.contains('is-open')) {
                closePalette();
            } else {
                openPalette();
            }
        });

        renderCommands();
    }

    // Hidden codes are captured globally, except while typing in form fields.
    function initEasterEgg() {
        let sequence = '';
        const secrets = new Map([
            ['GOLD', 'GOLD \u6a21\u5f0f\u5df2\u555f\u52d5'],
            ['LIU', 'LiuKai \u7c3d\u540d\u5f69\u86cb\u5df2\u89e3\u9396']
        ]);

        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
            if (event.key.length !== 1) return;

            sequence = `${sequence}${event.key.toUpperCase()}`.slice(-8);
            secrets.forEach((message, code) => {
                if (sequence.endsWith(code)) {
                    triggerEasterEgg(message);
                    sequence = '';
                }
            });
        });
    }

    // Skill bars only need a CSS custom property; CSS handles the fill animation.
    function initSkillBars() {
        document.querySelectorAll('.skill-bar').forEach((bar) => {
            const level = bar.getAttribute('data-level') || '0%';
            bar.style.setProperty('--skill-level', level);
        });
    }

    function initSkillFilters() {
        const buttons = Array.from(document.querySelectorAll('.filter-btn'));
        const categories = Array.from(document.querySelectorAll('.skill-category'));
        if (buttons.length === 0 || categories.length === 0) return;

        function setActiveButton(activeButton) {
            buttons.forEach((button) => {
                const isActive = button === activeButton;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-selected', String(isActive));
            });
        }

        function applyFilter(filter) {
            categories.forEach((category) => {
                const current = category.getAttribute('data-category');
                const isVisible = filter === 'all' || current === filter;
                category.classList.toggle('is-hidden', !isVisible);
            });
        }

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter') || 'all';
                setActiveButton(button);
                applyFilter(filter);
            });
        });
    }

    function initRobotSystem() {
        const controls = Array.from(document.querySelectorAll('.robot-part'));
        const detail = document.querySelector('.robot-detail');
        if (controls.length === 0 || !detail) return;

        const content = {
            base: {
                label: '底盤程式',
                title: '用搖桿輸入控制麥克納姆輪全向移動',
                points: [
                    ['Input', '讀取搖桿值', '用左搖桿的 Y 軸控制前後移動，左搖桿的 X 軸控制左右平移，右搖桿的 X 軸控制旋轉。'],
                    ['Formula', '麥克納姆輪公式', '把前後、平移與旋轉三種動作混合，分別計算前右、前左、後右、後左四顆馬達的輸出值。'],
                    ['Scale', '功率縮放', '當四顆馬達計算後的輸出超過最大功率時，使用 scaling_power 統一縮放，避免某顆馬達輸出超出範圍。'],
                    ['Output', '輸出到四顆馬達', '最後把縮放後的數值輸出到 FR、FL、BR、BL 四顆馬達，讓底盤完成全向移動。']
                ],
                flow: [
                    ['Input', '搖桿輸入', 'drive / turn / strafe'],
                    ['Mix', '輪速混合', 'mecanum formula'],
                    ['Scale', '功率縮放', 'avoid over power'],
                    ['Output', '馬達輸出', 'FR / FL / BR / BL']
                ],
                codeTitle: 'Mecanum drive control',
                code: [
                    '// 讀取搖桿值',
                    'drive  = -gamepad2.left_stick_y;   // 前後移動',
                    'turn   =  gamepad2.right_stick_x;  // 旋轉',
                    'strafe = -gamepad2.left_stick_x;   // 左右平移',
                    '',
                    '// 麥克納姆輪公式',
                    'fr = drive - turn - strafe;',
                    'fl = drive + turn + strafe;',
                    'br = drive - turn + strafe;',
                    'bl = drive + turn - strafe;',
                    '',
                    '// 計算縮放，避免超過最大功率',
                    'scale = scaling_power(fr, fl, br, bl);',
                    '',
                    '// 輸出到底盤四顆馬達',
                    'FR.setPower(fr / scale);',
                    'FL.setPower(fl / scale);',
                    'BR.setPower(br / scale);',
                    'BL.setPower(bl / scale);'
                ]
            },
            arm: {
                label: '手臂程式',
                title: '以抽象變數解決重力問題',
                points: [
                    ['Initial', '原本問題', '如果只用固定秒數控制手臂，馬達停止後容易因重力下墜，無法穩定停在指定高度。'],
                    ['Control', '控制核心', '我改用 armTargetPosition 記錄目標位置，按鍵只負責調整目標值，再讓馬達用 RUN_TO_POSITION 持續校正。'],
                    ['Safety', '安全與穩定', '加入最小與最大角度限制，並讓兩顆馬達同步套用同一個目標位置，避免超出安全範圍。']
                ],
                codeTitle: 'Arm target position control',
                code: [
                    '// 手臂位置範圍與目標位置',
                    'final int ARM_MIN_POSITION = 0;',
                    'final int ARM_MAX_POSITION = 500;',
                    'int armTargetPosition = 0;',
                    '',
                    '// 按鍵調整目標位置',
                    'if (gamepad1.right_bumper) armTargetPosition -= 1;',
                    'else if (gamepad1.left_bumper) armTargetPosition += 1;',
                    '',
                    '// A 鍵平滑移動到固定位置',
                    'if (gamepad1.a) {',
                    '    armTargetPosition = moveToward(armTargetPosition, 280, 1.5);',
                    '}',
                    '',
                    '// 限制安全範圍',
                    'armTargetPosition = Math.max(ARM_MIN_POSITION, armTargetPosition);',
                    'armTargetPosition = Math.min(ARM_MAX_POSITION, armTargetPosition);',
                    '',
                    '// 兩顆馬達同步跑到目標位置',
                    'motor.setTargetPosition(armTargetPosition);',
                    'motor2.setTargetPosition(armTargetPosition);',
                    'motor.setPower(0.5);',
                    'motor2.setPower(0.5);'
                ]
            },
            claw: {
                label: '夾子',
                title: '從雙伺服改成齒輪聯動單伺服',
                points: [
                    ['Initial', '初代問題', '鋁製結構過重，兩顆伺服馬達無法同步，導致 Sample 夾不緊。'],
                    ['Improve', '改良方式', '改用壓克力材質，使用 SolidWorks 設計切割，並利用齒輪狀連動縮減至一顆伺服馬達。'],
                    ['Gain', '學到的能力', '機構設計不能只看功能，也要考慮重量、同步性與馬達負載。']
                ],
                iteration: {
                    before: ['鋁製結構過重', '兩顆伺服馬達無法同步', 'Sample 夾不緊'],
                    after: ['改用壓克力材質減輕重量', '使用 SolidWorks 設計切割', '利用齒輪狀連動縮減至一顆伺服馬達']
                }
            },
            box: {
                label: '載物盒',
                title: '從鋁製結構改成塑膠盒單伺服投放',
                points: [
                    ['Initial', '初代問題', '初代載物盒使用純鋁構造，重量較高；同時以兩顆伺服馬達控制時，難以做到精準同步。'],
                    ['Improve', '改良方式', '後來改用塑膠材質，使用文具店塑膠盒加工，並以一顆伺服馬達控制傾斜投放，讓結構更輕、控制也更單純。'],
                    ['Gain', '學到的能力', '我理解到機構設計不一定要追求複雜，能降低重量、減少控制變數，反而更容易讓系統穩定運作。']
                ],
                iteration: {
                    before: ['使用純鋁構造', '兩顆伺服馬達難以精準同步'],
                    after: ['改用塑膠材質', '使用文具店塑膠盒加工', '以一顆伺服馬達控制傾斜投放']
                }
            },
            rail: {
                label: '滑軌',
                title: '以壓克力連接件解決滑軌固定問題',
                points: [
                    ['Initial', '問題', '滑軌無法直接與底盤組裝，結構銜接出現困難。'],
                    ['Improve', '解法', '使用 SolidWorks 設計兩塊壓克力連接件，作為滑軌與底盤之間的固定結構。'],
                    ['Gain', '學到的能力', '我理解到機構設計不只是在零件本身，也包含零件之間如何穩定連接。']
                ],
                exploded: {
                    parts: [
                        ['底盤', '原本的固定基準，但無法直接與滑軌穩定接合。'],
                        ['壓克力連接件', '用 SolidWorks 設計兩片轉接結構，負責銜接底盤與滑軌。'],
                        ['滑軌', '透過連接件固定後，能作為升降機構的主體。']
                    ],
                    result: '我把問題從「滑軌裝不上去」重新理解成「缺少中間固定結構」，因此用兩片壓克力連接件建立底盤與滑軌之間的穩定接口。'
                }
            },
        };

        function escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function render(partKey) {
            const selected = content[partKey] || content.base;
            const visiblePoints = selected.iteration
                ? selected.points.filter(([label]) => label === 'Gain')
                : selected.flow
                    ? []
                : selected.points;
            detail.classList.toggle('is-crisis', Boolean(selected.isCrisis));
            detail.classList.toggle('has-code', Boolean(selected.code));
            detail.classList.toggle('has-iteration', Boolean(selected.iteration));
            detail.classList.toggle('has-exploded', Boolean(selected.exploded));
            detail.innerHTML = `
                <p class="robot-detail__label">${selected.label}</p>
                <h3>${selected.title}</h3>
                ${selected.flow ? `
                    <div class="drive-flow" aria-label="底盤程式控制流程">
                        ${selected.flow.map(([label, title, note], index) => `
                            <article>
                                <span>${escapeHtml(label)}</span>
                                <strong>${escapeHtml(title)}</strong>
                                <p>${escapeHtml(note)}</p>
                            </article>
                            ${index < selected.flow.length - 1 ? '<i aria-hidden="true"></i>' : ''}
                        `).join('')}
                    </div>
                ` : ''}
                ${selected.exploded ? `
                    <div class="exploded-rail">
                        <div class="exploded-rail__diagram" aria-label="滑軌連接件爆炸示意圖">
                            ${selected.exploded.parts.map(([name, desc], index) => `
                                <div class="rail-piece rail-piece--${index + 1}">
                                    <span>${String(index + 1).padStart(2, '0')}</span>
                                    <strong>${escapeHtml(name)}</strong>
                                </div>
                            `).join('')}
                            <i class="rail-connector rail-connector--one" aria-hidden="true"></i>
                            <i class="rail-connector rail-connector--two" aria-hidden="true"></i>
                        </div>
                        <div class="exploded-rail__notes">
                            ${selected.exploded.parts.map(([name, desc]) => `
                                <article>
                                    <strong>${escapeHtml(name)}</strong>
                                    <p>${escapeHtml(desc)}</p>
                                </article>
                            `).join('')}
                        </div>
                        <p class="exploded-rail__result">${escapeHtml(selected.exploded.result)}</p>
                    </div>
                ` : ''}
                ${selected.iteration ? `
                    <div class="diagnosis-panel">
                        <div class="diagnosis-tabs" role="tablist" aria-label="工程修正流程">
                            <button class="diagnosis-tab is-active" type="button" data-diagnosis="problem">問題</button>
                            <button class="diagnosis-tab" type="button" data-diagnosis="fix">修正</button>
                            <button class="diagnosis-tab" type="button" data-diagnosis="gain">收穫</button>
                        </div>
                        <div class="diagnosis-content">
                            <div class="diagnosis-view is-active" data-diagnosis-view="problem">
                                <span>01 / Problem</span>
                                <h4>初代設計遇到的問題</h4>
                                <ul>${selected.iteration.before.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                            </div>
                            <div class="diagnosis-view" data-diagnosis-view="fix">
                                <span>02 / Fix</span>
                                <h4>改良後的設計方式</h4>
                                <ul>${selected.iteration.after.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                            </div>
                            <div class="diagnosis-view" data-diagnosis-view="gain">
                                <span>03 / Result</span>
                                <h4>${escapeHtml(visiblePoints[0]?.[1] || '學到的能力')}</h4>
                                <p>${escapeHtml(visiblePoints[0]?.[2] || '')}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <div class="detail-grid ${selected.iteration || selected.exploded ? 'is-hidden' : ''}">
                    ${visiblePoints.map(([label, heading, body]) => `
                        <div class="detail-card">
                            <span>${label}</span>
                            <strong>${heading}</strong>
                            <p>${body}</p>
                        </div>
                    `).join('')}
                </div>
                ${selected.code ? `
                    <div class="robot-code-card">
                        <div class="robot-code-card__bar">
                            <span></span>
                            <span></span>
                            <span></span>
                            <strong>${escapeHtml(selected.codeTitle || 'Control logic')}</strong>
                        </div>
                        <pre><code>${selected.code.map(escapeHtml).join('\n')}</code></pre>
                    </div>
                ` : ''}
            `;

            const tabs = Array.from(detail.querySelectorAll('.diagnosis-tab'));
            const views = Array.from(detail.querySelectorAll('.diagnosis-view'));
            tabs.forEach((tab) => {
                tab.addEventListener('click', () => {
                    const target = tab.dataset.diagnosis;
                    tabs.forEach((item) => item.classList.toggle('is-active', item === tab));
                    views.forEach((view) => {
                        view.classList.toggle('is-active', view.dataset.diagnosisView === target);
                    });
                });
            });
        }

        controls.forEach((button) => {
            button.addEventListener('click', () => {
                controls.forEach((control) => control.classList.toggle('is-active', control === button));
                render(button.dataset.robotPart);
            });
        });

        const activeControl = controls.find((button) => button.classList.contains('is-active')) || controls[0];
        render(activeControl.dataset.robotPart);
    }

    function initPdfPlaceholder() {
        const button = document.querySelector('.pdf-placeholder');
        if (!button) return;

        button.addEventListener('click', () => {
            showToast('完整 PDF 檔案可以之後再放到 assets 資料夾或改成雲端連結');
        });
    }

    // Each full-screen section gets its own scene timing so the page feels
    // closer to a product-style presentation instead of one long document.
    function initScrollReveal() {
        const sections = Array.from(document.querySelectorAll('main section[id]'));
        if (sections.length === 0) return;

        const sceneMap = {
            home: [
                '.eyebrow',
                '.glitch-effect',
                '.hero-lead',
                '.typing-text',
                '.hero-actions',
                '.social-links',
                '.hero-panel',
                '.hero-stats li',
                '.scroll-indicator'
            ],
            about: [
                '.section-kicker',
                '.section-title',
                '.story-copy',
                '.metric-strip > div'
            ],
            'cpp-stl': [
                '.section-kicker',
                '.section-title',
                '.section-jump',
                '.ai-lab-intro',
                '.ai-class-grid div',
                '.ai-process article',
                '.ai-insight-panel'
            ],
            programming: [
                '.section-kicker',
                '.section-title',
                '.section-jump',
                '.split-panel article',
                '.capability-row article'
            ],
            robotics: [
                '.section-kicker',
                '.section-title',
                '.robot-hero',
                '.robot-flow',
                '.robot-copy',
                '.robot-system'
            ],
            biology: [
                '.section-kicker',
                '.section-title',
                '.section-jump',
                '.ai-lab-intro',
                '.ai-class-grid div',
                '.ai-process article',
                '.ai-insight-panel'
            ],
            physics: [
                '.section-kicker',
                '.section-title',
                '.story-copy',
                '.metric-strip > div',
                '.capability-row article'
            ],
            experiment: [
                '.section-kicker',
                '.section-title',
                '.timeline article'
            ],
            'ai-training': [
                '.section-kicker',
                '.section-title',
                '.ai-lab-intro',
                '.ai-class-grid div',
                '.ai-process article',
                '.ai-insight-panel'
            ],
            experience: [
                '.section-kicker',
                '.section-title',
                '.growth-grid article'
            ],
            psd: [
                '.section-kicker',
                '.section-title',
                '.story-copy',
                '.match-table div',
                '.capability-row article'
            ],
            future: [
                '.section-kicker',
                '.section-title',
                '.timeline article',
                '.closing-panel'
            ]
        };

        document.body.classList.add('has-scene-scroll');

        sections.forEach((section) => {
            const selectors = sceneMap[section.id] || [];
            let order = 0;

            selectors.forEach((selector) => {
                section.querySelectorAll(selector).forEach((target) => {
                    const delay = Math.min(order * 0.08, 0.72);
                    target.style.setProperty('--scene-delay', `${delay.toFixed(2)}s`);
                    order += 1;
                });
            });
        });

        let ticking = false;

        function syncVisibleScene() {
            const viewportCenter = window.innerHeight / 2;
            const activeSection = sections
                .map((section) => {
                    const rect = section.getBoundingClientRect();
                    const sectionCenter = rect.top + (rect.height / 2);
                    const containsViewportCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
                    const distance = Math.abs(sectionCenter - viewportCenter);

                    return {
                        section,
                        containsViewportCenter,
                        distance
                    };
                })
                .sort((entryA, entryB) => {
                    if (entryA.containsViewportCenter !== entryB.containsViewportCenter) {
                        return entryA.containsViewportCenter ? -1 : 1;
                    }

                    return entryA.distance - entryB.distance;
                })[0]?.section;

            sections.forEach((section) => {
                section.classList.toggle('is-visible', section === activeSection);
            });

            ticking = false;
        }

        function requestSync() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(syncVisibleScene);
        }

        window.addEventListener('scroll', requestSync, { passive: true });
        window.addEventListener('resize', requestSync);
        syncVisibleScene();
    }

    function initSmoothAnchorScroll() {
        const header = document.querySelector('.site-header');
        const getHeaderHeight = () => (header ? header.getBoundingClientRect().height : 0);

        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                event.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() + 6;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    }

    // Active nav follows the section whose center sits closest to the viewport center.
    function initActiveNav() {
        const sections = Array.from(document.querySelectorAll('main section[id]'));
        const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
        if (sections.length === 0 || navLinks.length === 0) return;

        const linkMap = new Map(navLinks.map((link) => [link.getAttribute('href')?.slice(1), link]));
        let ticking = false;

        function setActive(id) {
            navLinks.forEach((link) => link.classList.remove('is-active'));
            const activeLink = linkMap.get(id);
            if (activeLink) activeLink.classList.add('is-active');
        }

        function syncActiveLink() {
            const viewportCenter = window.innerHeight / 2;
            const bestMatch = sections
                .map((section) => {
                    const rect = section.getBoundingClientRect();
                    const sectionCenter = rect.top + (rect.height / 2);
                    const distance = Math.abs(sectionCenter - viewportCenter);
                    const isOnScreen = rect.bottom > 0 && rect.top < window.innerHeight;

                    return {
                        id: section.id,
                        distance,
                        isOnScreen
                    };
                })
                .sort((entryA, entryB) => {
                    if (entryA.isOnScreen !== entryB.isOnScreen) {
                        return entryA.isOnScreen ? -1 : 1;
                    }

                    return entryA.distance - entryB.distance;
                })[0];

            if (bestMatch) setActive(bestMatch.id);
            ticking = false;
        }

        function requestSync() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(syncActiveLink);
        }

        window.addEventListener('scroll', requestSync, { passive: true });
        window.addEventListener('resize', requestSync);
        syncActiveLink();
    }

    function initBackToTop() {
        const button = document.querySelector('.back-to-top');
        if (!button) return;

        function syncVisibility() {
            button.classList.toggle('is-visible', window.scrollY > 520);
        }

        window.addEventListener('scroll', syncVisibility, { passive: true });
        syncVisibility();

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Theme preference is persisted so reloads keep the same dark/light choice.
    function initThemeToggle() {
        const button = document.querySelector('.theme-toggle');
        if (!button) return;

        const icon = button.querySelector('i');
        const storageKey = 'portfolio_theme';

        function applyTheme(theme) {
            const isLight = theme === 'light';
            document.body.classList.toggle('theme-light', isLight);

            if (icon) {
                icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        const saved = localStorage.getItem(storageKey);
        if (saved === 'light' || saved === 'dark') {
            applyTheme(saved);
        }

        button.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
            localStorage.setItem(storageKey, nextTheme);
            applyTheme(nextTheme);
            showToast(nextTheme === 'light' ? '\u6dfa\u8272\u6a21\u5f0f\u5df2\u555f\u7528' : '\u6df1\u8272\u6a21\u5f0f\u5df2\u555f\u7528');
        });
    }

    function initScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        const nextSection = document.querySelector('#about');
        if (!indicator || !nextSection) return;

        indicator.addEventListener('click', () => {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Boot order matters a little: visuals first, then navigation/form helpers.
    initCustomCursor();
    initParticles();
    initSpotlight();
    initProjectTilt();
    initProjectSlotMachine();
    initCommandPalette();
    initEasterEgg();
    initSkillBars();
    initSkillFilters();
    initRobotSystem();
    initPdfPlaceholder();
    initScrollReveal();
    initSmoothAnchorScroll();
    initActiveNav();
    initBackToTop();
    initThemeToggle();
    initScrollIndicator();
});
