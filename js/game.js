// js/game.js  —— 只改这里
import { initUI } from './ui.js';
import { tick, resetGameState, draw } from './draw.js';

let loop = null;
let running = false;

export function startGame() {
    if (running) return;
    resetGameState();
    draw();
    running = true;
    loop = setInterval(tick, 200);
    document.getElementById('startBtn').textContent = '暂停';
}

export function stopGame() {
    running = false;
    clearInterval(loop);
    document.getElementById('startBtn').textContent = '继续';
}

/* ⬇️ 等待 DOM 后再初始化事件 ⬇️ */
window.addEventListener('DOMContentLoaded', () => {
    initUI(startGame, stopGame);
});
