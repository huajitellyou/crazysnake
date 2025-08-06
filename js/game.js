const game = {
    snake: [],
    food: {},
    score: 0,
    speed: 150,
    baseSpeed: 150,
    speedLevel: 5,
    isPaused: false,
    gameLoop: null,
    
    // 初始化游戏
    init: function() {
        try {
            this.reset();
            
            // 生成食物
            this.generateFood();
            
            // 绘制初始状态
            drawing.draw(this.snake, this.food, this.score, this.snake.length, this.speedLevel);
            
            return true;
        } catch (e) {
            console.error('游戏初始化失败:', e);
            return false;
        }
    },
    
    // 重置游戏状态
    reset: function() {
        this.snake = [
            {x: Math.floor(drawing.tileCount/2), y: Math.floor(drawing.tileCount/2)}
        ];
        this.score = 0;
        input.velocityX = 0;
        input.velocityY = 0;
        this.speed = this.baseSpeed;
        this.speedLevel = 5;
        this.isPaused = false;
        
        // 更新UI状态
        drawing.updateStats(this.score, this.snake.length, this.speedLevel);
        drawing.hideGameOver();
    },
    
    // 开始游戏
    start: function() {
        // 如果游戏已结束，先重置
        if (this.snake.length <= 1) {
            this.reset();
        }
        
        input.isGameRunning = true;
        
        // 开始游戏循环
        this.runGameLoop();
    },
    
    // 运行游戏主循环
    runGameLoop: function() {
        clearTimeout(this.gameLoop);
        
        this.gameLoop = setTimeout(() => {
            if (!this.isPaused && input.isGameRunning) {
                this.update();
                this.runGameLoop();
            }
        }, this.speed);
    },
    
    // 切换暂停状态
    togglePause: function() {
        this.isPaused = !this.isPaused;
        
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.innerHTML = this.isPaused ? 
                '<i class="fas fa-play"></i> 继续' : 
                '<i class="fas fa-pause"></i> 暂停';
        }
        
        if (!this.isPaused) {
            this.runGameLoop();
        }
    },
    
    // 重新开始游戏
    restart: function() {
        this.reset();
        this.generateFood();
        input.isGameRunning = true;
        this.runGameLoop();
        drawing.hideGameOver();
    },
    
    // 更新游戏状态
    update: function() {
        // 移动蛇
        const head = {x: this.snake[0].x + input.velocityX, y: this.snake[0].y + input.velocityY};
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            
            // 如果开启了加速模式
            if (settings.speedToggle && this.speed > 60) {
                this.speed -= 5;
                this.speedLevel = Math.max(1, Math.floor((this.baseSpeed - this.speed) / 18) + 1);
            }
            
            this.generateFood();
        } else {
            this.snake.pop();
        }
        
        // 检查碰撞
        if (
            head.x < 0 || head.x >= drawing.tileCount || 
            head.y < 0 || head.y >= drawing.tileCount ||
            this.checkSelfCollision()
        ) {
            this.gameOver();
            return;
        }
        
        // 更新绘制
        drawing.draw(this.snake, this.food, this.score, this.snake.length, this.speedLevel);
        drawing.updateStats(this.score, this.snake.length, this.speedLevel);
    },
    
    // 检查蛇是否撞到自己
    checkSelfCollision: function() {
        const head = this.snake[0];
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                return true;
            }
        }
        return false;
    },
    
    // 生成食物
    generateFood: function() {
        let food;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 100; // 防止无限循环
        
        do {
            food = {
                x: Math.floor(Math.random() * drawing.tileCount),
                y: Math.floor(Math.random() * drawing.tileCount)
            };
            
            // 确保食物不会出现在蛇身上
            validPosition = true;
            for (let segment of this.snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    validPosition = false;
                    break;
                }
            }
            
            attempts++;
        } while (!validPosition && attempts < maxAttempts);
        
        this.food = food;
    },
    
    // 游戏结束处理
    gameOver: function() {
        clearTimeout(this.gameLoop);
        input.isGameRunning = false;
        this.isPaused = false;
        
        // 显示游戏结束画面
        drawing.showGameOver(this.score);
    }
};

// 暴露到全局
window.game = game;
