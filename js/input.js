// 键盘控制
document.addEventListener('keydown', e => {
    if(!game.isRunning) return;
    
    const keyMap = {
        'ArrowUp': () => game.direction !== 'down' && (game.direction = 'up'),
        'ArrowDown': () => game.direction !== 'up' && (game.direction = 'down'),
        'ArrowLeft': () => game.direction !== 'right' && (game.direction = 'left'),
        'ArrowRight': () => game.direction !== 'left' && (game.direction = 'right')
    };
    keyMap[e.key]?.();
});

// 触摸控制（虚拟摇杆）
const joystick = document.getElementById('joystick');
joystick.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const rect = joystick.getBoundingClientRect();
    const dx = touch.clientX - rect.left - rect.width/2;
    const dy = touch.clientY - rect.top - rect.height/2;
    const angle = Math.atan2(dy, dx);
    
    if(Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        if(Math.abs(angle) < Math.PI/4) game.direction = 'right';
        else if(Math.abs(angle) > 3*Math.PI/4) game.direction = 'left';
        else if(angle > 0) game.direction = 'down';
        else game.direction = 'up';
    }
});
