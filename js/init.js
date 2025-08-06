// =============== 全局变量初始化 ===============
window.GameApp = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    tileCount: 0,
    snake: [],
    food: {},
    score: 0,
    velocityX: 0,
    velocityY: 0,
    speed: 150,
    baseSpeed: 150,
    speedLevel: 5,
    isPaused: false,
    isGameRunning: false,
    gameLoop: null,
    snakeHeadImg: null,
    snakeBodyImg: null,
    foodImg: null,
    speedToggle: true,
    domRefs: {}
};

// =============== DOM 实用函数 ===============
function getElement(id, required = true) {
    const element = document.getElementById(id);
    if (!element && required) {
        console.error(`元素未找到: #${id}`);
    }
    return element;
}

// =============== 初始化函数 ===============
function initializeGame() {
    console.log("开始初始化游戏...");
    
    try {
        // 获取所有需要访问的DOM元素
        GameApp.domRefs = {
            startBtn: getElement('startBtn'),
            pauseBtn: getElement('pauseBtn'),
            resetBtn: getElement('resetBtn'),
            restartBtn: getElement('restartBtn'),
            speedToggle: getElement('speedToggle'),
            gameOver: getElement('gameOver'),
            score: getElement('score'),
            length: getElement('length'),
            speed: getElement('speed'),
            finalScore: getElement('finalScore'),
            gameCanvas: getElement('gameCanvas'),
            snakeHeadUpload: getElement('snakeHeadUpload'),
            snakeBodyUpload: getElement('snakeBodyUpload'),
            foodUpload: getElement('foodUpload'),
            snakeHeadPreview: getElement('snakeHeadPreview'),
            snakeBodyPreview: getElement('snakeBodyPreview'),
            foodPreview: getElement('foodPreview')
        };
        
        // 隐藏加载提示，显示游戏界面
        document.querySelector('.loader').style.display = 'none';
        document.querySelector('.header').style.display = 'block';
        document.querySelector('.game-container').style.display = 'flex';
        
        // 设置Canvas尺寸
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // 设置图片上传处理
        setupTextureUpload();
        
        // 设置事件监听
        setupEventListeners();
        
        // 初始化游戏状态
        resetGame();
        
        // 生成食物
        generateFood();
        
        // 绘制初始状态
        draw();
        
        console.log("游戏初始化成功！");
    } catch (e) {
        console.error("游戏初始化失败:", e);
        document.querySelector('.loader').innerHTML = '<p style="color: red;">初始化失败: ' + e.message + '</p>';
    }
}

// =============== 核心游戏函数 ===============

// 重置游戏状态
function resetGame() {
    const tileCount = Math.floor(GameApp.canvas.width / GameApp.gridSize);
    GameApp.snake = [
        {x: Math.floor(tileCount/2), y: Math.floor(tileCount/2)}
    ];
    GameApp.score = 0;
    GameApp.velocityX = 0;
    GameApp.velocityY = 0;
    GameApp.speed = GameApp.baseSpeed;
    GameApp.speedLevel = 5;
    GameApp.isPaused = false;
    GameApp.isGameRunning = false;
    
    // 更新UI状态
    GameApp.domRefs.gameOver.style.display = 'none';
    GameApp.domRefs.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
    updateStats();
}

// 生成食物
function generateFood() {
    const tileCount = Math.floor(GameApp.canvas.width / GameApp.gridSize);
    GameApp.food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // 确保食物不会出现在蛇身上
    for (let segment of GameApp.snake) {
        if (segment.x === GameApp.food.x && segment.y === GameApp.food.y) {
            return generateFood();
        }
    }
}

// 游戏主循环
function game() {
    if (GameApp.isPaused || !GameApp.isGameRunning) return;
    
    // 移动蛇
    const head = {x: GameApp.snake[0].x + GameApp.velocityX, y: GameApp.snake[0].y + GameApp.velocityY};
    GameApp.snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === GameApp.food.x && head.y === GameApp.food.y) {
        GameApp.score += 10;
        
        // 如果开启了加速模式
        if (GameApp.speedToggle && GameApp.speed > 60) {
            GameApp.speed -= 5;
            GameApp.speedLevel = Math.max(1, Math.floor((GameApp.baseSpeed - GameApp.speed) / 18) + 1);
        }
        
        generateFood();
    } else {
        GameApp.snake.pop();
    }
    
    // 检查碰撞
    const tileCount = Math.floor(GameApp.canvas.width / GameApp.gridSize);
    if (
        head.x < 0 || head.x >= tileCount || 
        head.y < 0 || head.y >= tileCount ||
        checkSelfCollision()
    ) {
        gameOver();
        return;
    }
    
    // 绘制游戏
    draw();
    
    // 继续游戏循环
    GameApp.gameLoop = setTimeout(game, GameApp.speed);
}

// 检查蛇是否撞到自己
function checkSelfCollision() {
    const head = GameApp.snake[0];
    for (let i = 1; i < GameApp.snake.length; i++) {
        if (GameApp.snake[i].x === head.x && GameApp.snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// 游戏结束
function gameOver() {
    clearTimeout(GameApp.gameLoop);
    GameApp.isGameRunning = false;
    GameApp.domRefs.finalScore.textContent = GameApp.score;
    GameApp.domRefs.gameOver.style.display = 'flex';
}

// =============== 绘制函数 ===============

// 调整画布大小
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, 600);
    GameApp.canvas.width = size;
    GameApp.canvas.height = size;
    GameApp.tileCount = size / GameApp.gridSize;
}

// 默认绘制蛇头函数
function drawDefaultSnakeHead(x, y, width, height) {
    const ctx = GameApp.ctx;
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
}

// 默认绘制蛇身函数
function drawDefaultSnakeBody(x, y, width, height, index, total) {
    const ctx = GameApp.ctx;
    // 创建渐变效果 - 从深绿到浅绿
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#2e8b57');
    gradient.addColorStop(1, '#3cb371');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, width/4);
    ctx.fill();
}

// 默认绘制食物函数
function drawDefaultFood(x, y, width, height) {
    const ctx = GameApp.ctx;
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
}

// 绘制游戏
function draw() {
    if (!GameApp.ctx) {
        GameApp.ctx = GameApp.canvas.getContext('2d');
    }
    
    // 清空画布
    GameApp.ctx.fillStyle = 'rgba(0, 20, 40, 0.9)';
    GameApp.ctx.fillRect(0, 0, GameApp.canvas.width, GameApp.canvas.height);
    
    // 绘制网格
    GameApp.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    GameApp.ctx.lineWidth = 0.5;
    for (let i = 0; i < GameApp.tileCount; i++) {
        GameApp.ctx.beginPath();
        GameApp.ctx.moveTo(i * GameApp.gridSize, 0);
        GameApp.ctx.lineTo(i * GameApp.gridSize, GameApp.canvas.height);
        GameApp.ctx.stroke();
        
        GameApp.ctx.beginPath();
        GameApp.ctx.moveTo(0, i * GameApp.gridSize);
        GameApp.ctx.lineTo(GameApp.canvas.width, i * GameApp.gridSize);
        GameApp.ctx.stroke();
    }
    
    // 绘制食物
    if (GameApp.foodImg) {
        GameApp.ctx.drawImage(
            GameApp.foodImg, 
            GameApp.food.x * GameApp.gridSize, 
            GameApp.food.y * GameApp.gridSize, 
            GameApp.gridSize, 
            GameApp.gridSize
        );
    } else {
        drawDefaultFood(
            GameApp.food.x * GameApp.gridSize, 
            GameApp.food.y * GameApp.gridSize, 
            GameApp.gridSize, 
            GameApp.gridSize
        );
    }
    
    // 绘制蛇 - 从尾部到头部（确保头部在顶部）
    for (let i = GameApp.snake.length - 1; i >= 0; i--) {
        // 计算每个身体部分的宽度（从头部到尾部逐渐变窄）
        const widthFactor = 0.2 + (0.8 * (i / GameApp.snake.length));
        const segmentWidth = GameApp.gridSize * widthFactor;
        const segmentHeight = GameApp.gridSize * widthFactor;
        
        const offsetX = (GameApp.gridSize - segmentWidth) / 2;
        const offsetY = (GameApp.gridSize - segmentHeight) / 2;
        
        if (i === 0) { // 蛇头
            if (GameApp.snakeHeadImg) {
                GameApp.ctx.drawImage(
                    GameApp.snakeHeadImg, 
                    GameApp.snake[i].x * GameApp.gridSize + offsetX, 
                    GameApp.snake[i].y * GameApp.gridSize + offsetY, 
                    segmentWidth, 
                    segmentHeight
                );
            } else {
                drawDefaultSnakeHead(
                    GameApp.snake[i].x * GameApp.gridSize + offsetX, 
                    GameApp.snake[i].y * GameApp.gridSize + offsetY, 
                    segmentWidth, 
                    segmentHeight
                );
            }
        } else { // 蛇身
            if (GameApp.snakeBodyImg) {
                GameApp.ctx.drawImage(
                    GameApp.snakeBodyImg, 
                    GameApp.snake[i].x * GameApp.gridSize + offsetX, 
                    GameApp.snake[i].y * GameApp.gridSize + offsetY, 
                    segmentWidth, 
                    segmentHeight
                );
            } else {
                drawDefaultSnakeBody(
                    GameApp.snake[i].x * GameApp.gridSize + offsetX, 
                    GameApp.snake[i].y * GameApp.gridSize + offsetY, 
                    segmentWidth, 
                    segmentHeight,
                    i,
                    GameApp.snake.length
                );
            }
        }
    }
    
    updateStats();
}

// 更新统计信息
function updateStats() {
    if (GameApp.domRefs.score) GameApp.domRefs.score.textContent = GameApp.score;
    if (GameApp.domRefs.length) GameApp.domRefs.length.textContent = GameApp.snake.length;
    if (GameApp.domRefs.speed) GameApp.domRefs.speed.textContent = GameApp.speedLevel;
}

// =============== 事件处理函数 ===============

// 设置图片上传
function setupTextureUpload() {
    function handleImageUpload(e, previewId) {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    if (previewId === 'snakeHeadPreview') {
                        GameApp.snakeHeadImg = img;
                    } else if (previewId === 'snakeBodyPreview') {
                        GameApp.snakeBodyImg = img;
                    } else if (previewId === 'foodPreview') {
                        GameApp.foodImg = img;
                    }
                    
                    const preview = document.getElementById(previewId);
                    if (preview) {
                        preview.innerHTML = '';
                        const previewImg = document.createElement('img');
                        previewImg.src = e.target.result;
                        preview.appendChild(previewImg);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (e) {
            console.error('图片上传失败:', e);
        }
    }
    
    if (GameApp.domRefs.snakeHeadUpload) {
        GameApp.domRefs.snakeHeadUpload.addEventListener('change', (e) => {
            handleImageUpload(e, 'snakeHeadPreview');
        });
    }
    
    if (GameApp.domRefs.snakeBodyUpload) {
        GameApp.domRefs.snakeBodyUpload.addEventListener('change', (e) => {
            handleImageUpload(e, 'snakeBodyPreview');
        });
    }
    
    if (GameApp.domRefs.foodUpload) {
        GameApp.domRefs.foodUpload.addEventListener('change', (e) => {
            handleImageUpload(e, 'foodPreview');
        });
    }
}

// 设置所有事件监听
function setupEventListeners() {
    // 速度开关
    if (GameApp.domRefs.speedToggle) {
        GameApp.domRefs.speedToggle.addEventListener('change', (e) => {
            GameApp.speedToggle = e.target.checked;
        });
    }
    
    // 键盘控制
    document.addEventListener('keydown', handleKeyDown);
    
    // 移动端控制
    setupMobileControls();
    
    // 游戏控制按钮
    setupGameControls();
}

// 键盘事件处理
function handleKeyDown(e) {
    if (!GameApp.isGameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (GameApp.velocityY !== 1) {
                GameApp.velocityX = 0;
                GameApp.velocityY = -1;
            }
            break;
        case 'ArrowDown':
            if (GameApp.velocityY !== -1) {
                GameApp.velocityX = 0;
                GameApp.velocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if (GameApp.velocityX !== 1) {
                GameApp.velocityX = -1;
                GameApp.velocityY = 0;
            }
            break;
        case 'ArrowRight':
            if (GameApp.velocityX !== -1) {
                GameApp.velocityX = 1;
                GameApp.velocityY = 0;
            }
            break;
    }
}

// 设置移动端控制
function setupMobileControls() {
    const upBtn = getElement('upBtn', false);
    const downBtn = getElement('downBtn', false);
    const leftBtn = getElement('leftBtn', false);
    const rightBtn = getElement('rightBtn', false);
    
    if (upBtn && downBtn && leftBtn && rightBtn) {
        // 在移动端显示控制按钮
        if (window.innerWidth <= 768) {
            document.querySelector('.mobile-controls').style.display = 'grid';
        }
        
        upBtn.addEventListener('click', () => {
            if (GameApp.velocityY !== 1 && GameApp.isGameRunning) {
                GameApp.velocityX = 0;
                GameApp.velocityY = -1;
            }
        });
        
        downBtn.addEventListener('click', () => {
            if (GameApp.velocityY !== -1 && GameApp.isGameRunning) {
                GameApp.velocityX = 0;
                GameApp.velocityY = 1;
            }
        });
        
        leftBtn.addEventListener('click', () => {
            if (GameApp.velocityX !== 1 && GameApp.isGameRunning) {
                GameApp.velocityX = -1;
                GameApp.velocityY = 0;
            }
        });
        
        rightBtn.addEventListener('click', () => {
            if (GameApp.velocityX !== -1 && GameApp.isGameRunning) {
                GameApp.velocityX = 1;
                GameApp.velocityY = 0;
            }
        });
    }
}

// 设置游戏控制按钮
function setupGameControls() {
    // 开始按钮
    if (GameApp.domRefs.startBtn) {
        GameApp.domRefs.startBtn.addEventListener('click', () => {
            if (!GameApp.isGameRunning) {
                GameApp.isGameRunning = true;
                GameApp.isPaused = false;
                if (GameApp.snake.length <= 1) {
                    resetGame();
                }
                game();
            }
        });
    }
    
    // 暂停按钮
    if (GameApp.domRefs.pauseBtn) {
        GameApp.domRefs.pauseBtn.addEventListener('click', () => {
            if (GameApp.isGameRunning) {
                GameApp.isPaused = !GameApp.isPaused;
                GameApp.domRefs.pauseBtn.innerHTML = GameApp.isPaused ? 
                    '<i class="fas fa-play"></i> 继续' : 
                    '<i class="fas fa-pause"></i> 暂停';
                
                if (!GameApp.isPaused) {
                    game();
                }
            }
        });
    }
    
    // 重新开始按钮
    if (GameApp.domRefs.resetBtn) {
        GameApp.domRefs.resetBtn.addEventListener('click', () => {
            clearTimeout(GameApp.gameLoop);
            GameApp.isGameRunning = false;
            GameApp.isPaused = false;
            resetGame();
            GameApp.domRefs.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
            GameApp.domRefs.gameOver.style.display = 'none';
        });
    }
    
    // 游戏结束重新开始按钮
    if (GameApp.domRefs.restartBtn) {
        GameApp.domRefs.restartBtn.addEventListener('click', () => {
            GameApp.domRefs.gameOver.style.display = 'none';
            resetGame();
            GameApp.isGameRunning = true;
            GameApp.isPaused = false;
            game();
        });
    }
}

// =============== 页面加载初始化 ===============
document.addEventListener('DOMContentLoaded', initializeGame);
