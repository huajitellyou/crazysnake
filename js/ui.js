import { startGame, stopGame } from './game.js';
import { dir } from './draw.js';

export function initUI(startFn, stopFn){
    // 暂停/继续
    document.getElementById('startBtn').addEventListener('click', () => {
        const btn = document.getElementById('startBtn');
        btn.textContent === '开始游戏' || btn.textContent === '继续' ? startFn() : stopFn();
    });

    // 重新开始
    document.getElementById('restartBtn').addEventListener('click', () => {
        document.getElementById('overlay').style.display = 'none';
        startFn();
    });

    // 加速开关
    document.getElementById('speedToggle').addEventListener('click', e=>{
        e.currentTarget.classList.toggle('on');
        window.speedBoost = e.currentTarget.classList.contains('on');
    });

    // 箭头方向
    document.querySelectorAll('.touchBtn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const d = btn.dataset.dir;
            const newDir = { up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} }[d];
            if(newDir && Math.abs(newDir.x) !== Math.abs(dir.x)) dir.x = newDir.x;
            if(newDir && Math.abs(newDir.y) !== Math.abs(dir.y)) dir.y = newDir.y;
        });
    });

    // 键盘
    document.addEventListener('keydown', e=>{
        switch(e.key){
            case 'ArrowUp': dir.x=0;dir.y=-1;break;
            case 'ArrowDown': dir.x=0;dir.y=1;break;
            case 'ArrowLeft': dir.x=-1;dir.y=0;break;
            case 'ArrowRight': dir.x=1;dir.y=0;break;
        }
    });
}

