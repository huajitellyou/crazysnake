// 确保模块名称与index.html中定义的一致
window.settings = window.settings || {};
window.settings.setup = function() {
  // 原来的setup内容
const input = {
    velocityX: 0,
    velocityY: 0,
    isGameRunning: false,

    // 设置事件监听
    setup: function() {
        try {
            // 键盘控制
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            
            // 移动端控制按钮
            this.setupMobileControls();
            
            // 游戏控制按钮
            this.setupGameControls();
            
            return true;
        } catch (e) {
            console.error('输入模块初始化失败:', e);
            return false;
        }
    },

    // 键盘事件处理
    handleKeyDown: function(e) {
        if (!this.isGameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.velocityY !== 1) {
                    this.velocityX = 0;
                    this.velocityY = -1;
                }
                break;
            case 'ArrowDown':
                if (this.velocityY !== -1) {
                    this.velocityX = 0;
                    this.velocityY = 1;
                }
                break;
            case 'ArrowLeft':
                if (this.velocityX !== 1) {
                    this.velocityX = -1;
                    this.velocityY = 0;
                }
                break;
            case 'ArrowRight':
                if (this.velocityX !== -1) {
                    this.velocityX = 1;
                    this.velocityY = 0;
                }
                break;
        }
    },

    // 设置移动端控制
    setupMobileControls: function() {
        try {
            const upBtn = document.getElementById('upBtn');
            const downBtn = document.getElementById('downBtn');
            const leftBtn = document.getElementById('leftBtn');
            const rightBtn = document.getElementById('rightBtn');
            
            if (upBtn && downBtn && leftBtn && rightBtn) {
                // 在移动端显示控制按钮
                if (window.innerWidth <= 768) {
                    document.querySelector('.mobile-controls').style.display = 'grid';
                }
                
                upBtn.addEventListener('click', () => {
                    if (this.velocityY !== 1 && this.isGameRunning) {
                        this.velocityX = 0;
                        this.velocityY = -1;
                    }
                });
                
                downBtn.addEventListener('click', () => {
                    if (this.velocityY !== -1 && this.isGameRunning) {
                        this.velocityX = 0;
                        this.velocityY = 1;
                    }
                });
                
                leftBtn.addEventListener('click', () => {
                    if (this.velocityX !== 1 && this.isGameRunning) {
                        this.velocityX = -1;
                        this.velocityY = 0;
                    }
                });
                
                rightBtn.addEventListener('click', () => {
                    if (this.velocityX !== -1 && this.isGameRunning) {
                        this.velocityX = 1;
                        this.velocityY = 0;
                    }
                });
            }
        } catch (e) {
            console.error('移动端控制初始化失败:', e);
        }
    },

    // 设置游戏控制按钮
    setupGameControls: function() {
        try {
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            const resetBtn = document.getElementById('resetBtn');
            const restartBtn = document.getElementById('restartBtn');
            
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.isGameRunning = true;
                    window.game.start();
                });
            }
            
            if (pauseBtn) {
                pauseBtn.addEventListener('click', () => {
                    if (window.game) {
                        window.game.togglePause();
                    }
                });
            }
            
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    if (window.game) {
                        window.game.reset();
                    }
                });
            }
            
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    if (window.game) {
                        window.game.restart();
                    }
                });
            }
        } catch (e) {
            console.error('游戏控制初始化失败:', e);
        }
    }
};

// 暴露到全局
window.input = input;
