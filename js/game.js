import { initUI } from './ui.js';
import { tick, resetGameState, draw } from './draw.js';

let loop = null;
let running = false;

function startGame(){
    if(running) return;
    resetGameState();
    draw();                         // 立即重绘一次
    running = true;
    loop = setInterval(tick, 200);
    document.getElementById('startBtn').textContent = '暂停';
}
function stopGame(){
    running = false;
    clearInterval(loop);
    document.getElementById('startBtn').textContent = '继续';
}

export { startGame, stopGame };   // 导出给 ui.js 用
initUI(startGame, stopGame);      // 初始化 UI 事件
