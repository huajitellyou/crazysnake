import { startGame, stopGame } from './game.js';
import { dir, snake } from './draw.js';

export function initUI(startFn, stopFn) {
  // 开始 / 暂停
  document.getElementById('startBtn').addEventListener('click', () => {
    if (snake.length) {
      stopGame();
      document.getElementById('startBtn').textContent = '继续';
    } else {
      startGame();
    }
  });

  // 重启
  document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    startGame();
  });

  // 速度开关
  document.getElementById('speedToggle').addEventListener('click', e => {
    e.currentTarget.classList.toggle('on');
  });

  // 方向键
  document.querySelectorAll('.touchBtn').forEach(btn =>
    btn.addEventListener('click', () => {
      const d = btn.dataset.dir;
      const newDir = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      }[d];
      if (newDir && Math.abs(newDir.x) !== Math.abs(dir.x)) dir.x = newDir.x;
      if (newDir && Math.abs(newDir.y) !== Math.abs(dir.y)) dir.y = newDir.y;
    })
  );

  // 贴图上传
  document.getElementById('headInput').addEventListener('change', e => loadImg(e, 'head'));
  document.getElementById('foodInput').addEventListener('change', e => loadImg(e, 'food'));
}

function loadImg(ev, target) {
  const file = ev.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => URL.revokeObjectURL(url);
  img.src = url;
  if (target === 'head') window.headImg = img;
  else window.foodImg = img;
}
