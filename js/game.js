// 在每个JS文件顶部添加
document.addEventListener("DOMContentLoaded", () => {
  // 原文件中的初始化代码（如事件绑定）
// 游戏状态管理
class Game {
    constructor() {
        this.gridSize = 20;
        this.speed = 150;
        this.score = 0;
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.direction = 'right';
    }

    // 移动逻辑（带方向校验）
    move() {
        const head = {...this.snake[0]};
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        this.snake.unshift(head);
        if(head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    // 碰撞检测（墙和自身）
    checkCollision() {
        const head = this.snake[0];
        // 墙碰撞
        if(head.x < 0 || head.x >= canvas.width/this.gridSize || 
           head.y < 0 || head.y >= canvas.height/this.gridSize) {
            return true;
        }
        // 自身碰撞
        for(let i = 1; i < this.snake.length; i++) {
            if(head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    }

    // 食物生成（避开蛇身）
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * (canvas.width/this.gridSize)),
                y: Math.floor(Math.random() * (canvas.height/this.gridSize))
            };
        } while(this.snake.some(seg => seg.x === food.x && seg.y === food.y));
        return food;
    }
}
});
