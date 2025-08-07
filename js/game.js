import { initUI } from './ui.js';
import { tick, resetGameState } from './draw.js';

let loop = null;
let running = false;

export function startGame() {
  if (running) return;
  resetGameState();
  running = true;
  loop = setInterval(tick, 200);
  document.getElementById('startBtn').textContent = '暂停';
}

export function stopGame() {
  running = false;
  clearInterval(loop);
}

export function initGame() {
  initUI(startGame, stopGame);
}
