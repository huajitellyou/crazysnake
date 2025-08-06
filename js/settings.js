// 贴图加载系统
function setupTextureUpload() {
    const uploaders = {
        '#snakeHeadUpload': 'snakeHeadImg',
        '#snakeBodyUpload': 'snakeBodyImg',
        '#foodUpload': 'foodImg'
    };
    
    Object.entries(uploaders).forEach(([selector, varName]) => {
        document.querySelector(selector).addEventListener('change', e => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const img = new Image();
                    img.onload = () => window[varName] = img;
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// 加速开关
document.getElementById('speedToggle').addEventListener('change', e => {
    game.speedToggle = e.target.checked;
});
