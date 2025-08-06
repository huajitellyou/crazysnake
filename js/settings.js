// 确保模块名称与index.html中定义的一致
window.settings = window.settings || {};
window.settings.setup = function() {
  // 原来的setup内容
const settings = {
    snakeHeadImg: null,
    snakeBodyImg: null,
    foodImg: null,
    speedToggle: true,

    // DOM加载完成后设置事件监听
    setup: function() {
        try {
            // 图片上传处理
            this.setupImageUpload('snakeHeadUpload', 'snakeHeadPreview', (img) => {
                this.snakeHeadImg = img;
            });
            
            this.setupImageUpload('snakeBodyUpload', 'snakeBodyPreview', (img) => {
                this.snakeBodyImg = img;
            });
            
            this.setupImageUpload('foodUpload', 'foodPreview', (img) => {
                this.foodImg = img;
            });
            
            // 速度开关事件
            const speedToggle = document.getElementById('speedToggle');
            if (speedToggle) {
                speedToggle.addEventListener('change', (e) => {
                    this.speedToggle = e.target.checked;
                });
            }
        } catch (e) {
            console.error('设置模块初始化失败:', e);
        }
    },

    // 设置图片上传功能
    setupImageUpload: function(inputId, previewId, callback) {
        const uploadInput = document.getElementById(inputId);
        const previewElement = document.getElementById(previewId);
        
        if (!uploadInput || !previewElement) {
            console.error(`元素未找到: ${inputId} 或 ${previewId}`);
            return;
        }
        
        uploadInput.addEventListener('change', (e) => {
            this.handleImageUpload(e, previewId, callback);
        });
    },

    // 图片上传处理函数
    handleImageUpload: function(event, previewId, callback) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    callback(img);
                    
                    // 更新预览
                    const preview = document.getElementById(previewId);
                    if (preview) {
                        preview.innerHTML = '';
                        const imgElement = document.createElement('img');
                        imgElement.src = e.target.result;
                        preview.appendChild(imgElement);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (e) {
            console.error('图片处理失败:', e);
        }
    }
};

// 暴露到全局
window.settings = settings;
