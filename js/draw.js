export const GRID = 16;
export const SIZE = 320 / GRID;
export const cvs = document.getElementById('board');
export const ctx = cvs.getContext('2d');

export let snake = [{ x: 10, y: 10 }];
export let dir = { x: 1, y: 0 };
export let food = { x: 15, y: 15 };
export let score = 0;
export let speed = 1;

const defaultApple = new Image();
defaultApple.src = `data:image/svg+xml,${encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="55" r="40" fill="#ff5252"/><path d="M50 20c0-10 8-15 8-15s-2 8-8 15z" fill="#4caf50"/></svg>')}`;
window.headImg = null;
window.foodImg = null;

export function placeFood(){
    do{
        food = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) };
    }while(snake.some(s=>s.x===food.x&&s.y===food.y));
}

export function resetGameState(){
    snake.length = 1;
    snake[0] = { x: 10, y: 10 };
    dir = { x: 1, y: 0 };
    score = 0;
    speed = 1;
    placeFood();
    document.getElementById('score').textContent = score;
    document.getElementById('speed').textContent = speed.toFixed(1);
}

export function draw(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.drawImage(window.foodImg || defaultApple, food.x*SIZE, food.y*SIZE, SIZE, SIZE);

    // 蛇
    snake.forEach((p,i)=>{
        const s = SIZE - i*1.2;
        const pad = (SIZE-s)/2;
        ctx.fillStyle = i ? `hsl(120,50%,${70-i*5}%)` : '#388e3c';
        ctx.beginPath();
        ctx.roundRect(p.x*SIZE+pad, p.y*SIZE+pad, s, s, s*0.4);
        ctx.fill();
    });
}

export function tick(){
    if(!running) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if(head.x<0||head.x>=GRID||head.y<0||head.y>=GRID||snake.some(s=>s.x===head.x&&s.y===head.y)){
        running=false;
        clearInterval(window.loop);
        document.getElementById('finalScore').textContent = score;
        document.getElementById('overlay').style.display = 'flex';
        return;
    }
    snake.unshift(head);
    if(head.x===food.x&&head.y===food.y){
        score += 10;
        speed += window.speedBoost?0.2:0;
        document.getElementById('score').textContent = score;
        document.getElementById('speed').textContent = speed.toFixed(1);
        placeFood();
    }else{
        snake.pop();
    }
    draw();
}

placeFood();
draw();

