// 在每个JS文件顶部添加
document.addEventListener("DOMContentLoaded", () => {
  // 原文件中的初始化代码（如事件绑定）
// 蛇身绘制（含尾部渐变）
function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制食物
    drawFood();
    
    // 绘制蛇身（从尾到头保证头部在上层）
    for(let i = snake.length - 1; i >= 0; i--) {
        const width = i === 0 ? gridSize : 
                     i === snake.length-1 ? gridSize*0.8 : 
                     gridSize*0.9;
                     
        const offset = (gridSize - width) / 2;
        const x = snake[i].x * gridSize + offset;
        const y = snake[i].y * gridSize + offset;
        
        if(i === 0) {
            drawHead(x, y, width); // 蛇头特殊绘制
        } else {
            ctx.fillStyle = `hsl(120, 70%, ${40 + 30*(i/snake.length)}%)`;
            ctx.beginPath();
            ctx.roundRect(x, y, width, width, width/3);
            ctx.fill();
        }
    }
}

// 蛇头绘制（三角形）
function drawHead(x, y, size) {
    ctx.fillStyle = '#2e8b57';
    ctx.beginPath();
    ctx.moveTo(x + size/2, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    
    // 眼睛
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + size/3, y + size/3, size/8, 0, Math.PI*2);
    ctx.arc(x + size*2/3, y + size/3, size/8, 0, Math.PI*2);
    ctx.fill();
}
    });
