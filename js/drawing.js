// 确保模块名称与index.html中定义的一致
window.settings = window.settings || {};
window.settings.setup = function() {
  // 原来的setup内容
const drawing = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    tileCount: 0,

    // 初始化绘图环境
    init: function() {
        try {
            this.canvas = document.getElementById('gameCanvas');
            if (!this.canvas) {
                throw new Error('Canvas元素未找到');
            }
            
            // 设置Canvas尺寸
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            
            this.ctx = this.canvas.getContext('2d');
            return true;
        } catch (e) {
            console.error('绘图初始化失败:', e);
            return false;
        }
    },
    
    // 调整画布大小
    resizeCanvas: function() {
        const size = Math.min(window.innerWidth * 0.9, 600);
        this.canvas.width = size;
        this.canvas.height = size;
        this.tileCount = size / this.gridSize;
    },

    // 默认绘制蛇头函数
    drawDefaultSnakeHead: function(x, y, width, height) {
        const ctx = this.ctx;
        ctx.fillStyle = '#2e8b57';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + width/3, y + height/3, width/8, 0, Math.PI * 2);
        ctx.arc(x + 2*width/3, y + height/3, width/8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x + width/3, y + height/3, width/12, 0, Math.PI * 2);
        ctx.arc(x + 2*width/3, y + height/3, width/12, 0, Math.PI * 2);
        ctx.fill();
    },

    // 默认绘制蛇身函数
    drawDefaultSnakeBody: function(x, y, width, height, index, total) {
        const ctx = this.ctx;
        // 创建渐变效果 - 从深绿到浅绿
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, '#2e8b57');
        gradient.addColorStop(1, '#3cb371');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, width/4);
        ctx.fill();
    },

    // 默认绘制食物函数
    drawDefaultFood: function(x, y, width, height) {
        const ctx = this.ctx;
        // 苹果主体
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 苹果叶子
        ctx.fillStyle = '#3cb371';
        ctx.beginPath();
        ctx.moveTo(x + width/2, y + height/4);
        ctx.lineTo(x + width/3, y + height/6);
        ctx.lineTo(x + width/2, y + height/3);
        ctx.fill();
    },

    // 绘制游戏
    draw: function(snake, food, score, length, speedLevel) {
        if (!this.ctx) return;
        
        try {
            // 清空画布
            this.ctx.fillStyle = 'rgba(0, 20, 40, 0.9)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制网格
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            this.ctx.lineWidth = 0.5;
            for (let i = 0; i < this.tileCount; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.gridSize, 0);
                this.ctx.lineTo(i * this.gridSize, this.canvas.height);
                this.ctx.stroke();
                
                this.ctx.beginPath();
                this.ctx.moveTo(0, i * this.gridSize);
                this.ctx.lineTo(this.canvas.width, i * this.gridSize);
                this.ctx.stroke();
            }
            
            // 绘制食物
            if (settings.foodImg) {
                this.ctx.drawImage(settings.foodImg, food.x * this.gridSize, food.y * this.gridSize, this.gridSize, this.gridSize);
            } else {
                this.drawDefaultFood(food.x * this.gridSize, food.y * this.gridSize, this.gridSize, this.gridSize);
            }
            
            // 绘制蛇 - 从尾部到头部（确保头部在顶部）
            for (let i = snake.length - 1; i >= 0; i--) {
                // 计算每个身体部分的宽度（从头部到尾部逐渐变窄）
                const widthFactor = 0.2 + (0.8 * (i / snake.length));
                const segmentWidth = this.gridSize * widthFactor;
                const segmentHeight = this.gridSize * widthFactor;
                
                const offsetX = (this.gridSize - segmentWidth) / 2;
                const offsetY = (this.gridSize - segmentHeight) / 2;
                
                if (i === 0) { // 蛇头
                    if (settings.snakeHeadImg) {
                        this.ctx.drawImage(settings.snakeHeadImg, 
                            snake[i].x * this.gridSize + offsetX, 
                            snake[i].y * this.gridSize + offsetY, 
                            segmentWidth, 
                            segmentHeight);
                    } else {
                        this.drawDefaultSnakeHead(
                            snake[i].x * this.gridSize + offsetX, 
                            snake[i].y * this.gridSize + offsetY, 
                            segmentWidth, 
                            segmentHeight
                        );
                    }
                } else { // 蛇身
                    if (settings.snakeBodyImg) {
                        this.ctx.drawImage(settings.snakeBodyImg, 
                            snake[i].x * this.gridSize + offsetX, 
                            snake[i].y * this.gridSize + offsetY, 
                            segmentWidth, 
                            segmentHeight);
                    } else {
                        this.drawDefaultSnakeBody(
                            snake[i].x * this.gridSize + offsetX, 
                            snake[i].y * this.gridSize + offsetY, 
                            segmentWidth, 
                            segmentHeight,
                            i,
                            snake.length
                        );
                    }
                }
            }
        } catch (e) {
            console.error('绘图错误:', e);
        }
    },
    
    // 显示游戏结束画面
    showGameOver: function(score) {
        const gameOver = document.getElementById('gameOver');
        const finalScore = document.getElementById('finalScore');
        
        if (gameOver && finalScore) {
            finalScore.textContent = score;
            gameOver.style.display = 'flex';
        }
    },
    
    // 隐藏游戏结束画面
    hideGameOver: function() {
        const gameOver = document.getElementById('gameOver');
        if (gameOver) {
            gameOver.style.display = 'none';
        }
    },
    
    // 更新统计信息
    updateStats: function(score, length, speedLevel) {
        const scoreEl = document.getElementById('score');
        const lengthEl = document.getElementById('length');
        const speedEl = document.getElementById('speed');
        
        if (scoreEl) scoreEl.textContent = score;
        if (lengthEl) lengthEl.textContent = length;
        if (speedEl) speedEl.textContent = speedLevel;
    }
};

// 暴露到全局
window.drawing = drawing;
