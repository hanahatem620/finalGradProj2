1// المتغيرات العامة
let currentImage = null;
let selectedLookId = null;
let makeupItems = [];
let makeupLooks = [];

const API_URL = 'http://localhost:8080';

// عناصر DOM
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const analyzeSkinBtn = document.getElementById('analyzeSkinBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const processingLoading = document.getElementById('processingLoading');
const resultSection = document.getElementById('resultSection');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');

// رفع الصورة
uploadArea.addEventListener('click', () => imageInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#e3f2fd';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = 'white';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = 'white';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        previewImg.src = currentImage;
        imagePreview.style.display = 'block';
        analyzeSkinBtn.style.display = 'inline-block';
        resultSection.style.display = 'none';
        showSuccess('تم رفع الصورة بنجاح! 🎉');
    };
    reader.readAsDataURL(file);
}

// التبويبات
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const tabId = tab.dataset.tab + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// جلب الإطلالات الجاهزة
async function loadMakeupLooks() {
    const looksLoading = document.getElementById('looksLoading');
    const makeupLooksGrid = document.getElementById('makeupLooksGrid');
    
    try {
        looksLoading.style.display = 'block';
        const response = await fetch(`${API_URL}/api/makeup-looks`);
        const data = await response.json();
        
        if (data.success) {
            makeupLooks = data.looks;
            displayMakeupLooks(data.looks);
        } else {
            showError('فشل تحميل الإطلالات');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('خطأ في الاتصال بالخادم');
    } finally {
        looksLoading.style.display = 'none';
    }
}

function displayMakeupLooks(looks) {
    const grid = document.getElementById('makeupLooksGrid');
    grid.innerHTML = '';
    
    looks.forEach(look => {
        const card = document.createElement('div');
        card.className = 'makeup-look-card';
        card.dataset.lookId = look.id;
        
        const colorPalette = look.colors_rgb.map(color => 
            `<div class="color-dot" style="background: ${color};"></div>`
        ).join('');
        
        card.innerHTML = `
            <h4>${look.name}</h4>
            <div class="color-palette">${colorPalette}</div>
            <p style="font-size: 0.85rem; color: #666;">${look.artist}</p>
            <p style="font-size: 0.8rem; color: #999; margin-top: 5px;">${look.description}</p>
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.makeup-look-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedLookId = look.id;
            document.getElementById('applyLookBtn').style.display = 'block';
        });
        
        grid.appendChild(card);
    });
}

// جلب عناصر المكياج للتخصيص
async function loadMakeupItems() {
    try {
        const response = await fetch(`${API_URL}/api/makeup-items`);
        const data = await response.json();
        
        if (data.success) {
            makeupItems = data.items;
            displayMakeupItems(data.items);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayMakeupItems(items) {
    const container = document.getElementById('makeupItemsContainer');
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'makeup-item';
        
        const hasColor = ['lipstick', 'eyeshadow', 'blush', 'eyeliner'].includes(item.id);
        
        itemDiv.innerHTML = `
            <h4>${item.name}</h4>
            ${hasColor ? `
                <div class="color-picker-wrapper">
                    <input type="color" class="color-picker" id="color-${item.id}" 
                           value="#${rgbToHex(item.default_color)}">
                    <label>اللون</label>
                </div>
            ` : ''}
            <div class="slider-wrapper">
                <label>الشدة: <span id="intensity-${item.id}-value">${Math.round(item.default_intensity * 100)}%</span></label>
                <input type="range" id="intensity-${item.id}" 
                       min="0" max="100" value="${item.default_intensity * 100}">
            </div>
        `;
        
        container.appendChild(itemDiv);
        
        // تحديث قيمة الشدة
        const slider = document.getElementById(`intensity-${item.id}`);
        slider.addEventListener('input', (e) => {
            document.getElementById(`intensity-${item.id}-value`).textContent = e.target.value + '%';
        });
    });
}

// تطبيق الإطلالة الجاهزة
document.getElementById('applyLookBtn').addEventListener('click', async () => {
    if (!currentImage) {
        showError('الرجاء رفع صورة أولاً');
        return;
    }
    
    if (!selectedLookId) {
        showError('الرجاء اختيار إطلالة');
        return;
    }
    
    try {
        processingLoading.style.display = 'block';
        
        const response = await fetch(`${API_URL}/api/apply-makeup-look`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: currentImage,
                look_id: selectedLookId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResult(currentImage, data.image);
            showSuccess(`تم تطبيق إطلالة ${data.look_name} بنجاح! 🎉`);
        } else {
            showError(data.error || 'فشل تطبيق المكياج');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('خطأ في معالجة الصورة');
    } finally {
        processingLoading.style.display = 'none';
    }
});

// تطبيق المكياج المخصص
document.getElementById('applyCustomBtn').addEventListener('click', async () => {
    if (!currentImage) {
        showError('الرجاء رفع صورة أولاً');
        return;
    }
    
    const config = {};
    
    makeupItems.forEach(item => {
        const intensitySlider = document.getElementById(`intensity-${item.id}`);
        if (intensitySlider) {
            const intensity = parseFloat(intensitySlider.value) / 100;
            
            config[item.id] = { intensity };
            
            const colorPicker = document.getElementById(`color-${item.id}`);
            if (colorPicker) {
                config[item.id].color = hexToRgb(colorPicker.value);
            }
            
            if (item.id === 'eyeliner') {
                config[item.id].thickness = 2;
            }
        }
    });
    
    try {
        processingLoading.style.display = 'block';
        
        const response = await fetch(`${API_URL}/api/apply-custom-makeup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: currentImage,
                config: config
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResult(currentImage, data.image);
            showSuccess('تم تطبيق المكياج المخصص بنجاح! 🎉');
        } else {
            showError(data.error || 'فشل تطبيق المكياج');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('خطأ في معالجة الصورة');
    } finally {
        processingLoading.style.display = 'none';
    }
});

// تحليل لون البشرة
analyzeSkinBtn.addEventListener('click', async () => {
    if (!currentImage) {
        showError('الرجاء رفع صورة أولاً');
        return;
    }
    
    try {
        processingLoading.style.display = 'block';
        
        const response = await fetch(`${API_URL}/api/analyze-skin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: currentImage
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displaySkinAnalysis(data.skin_tone);
            showSuccess('تم تحليل لون البشرة بنجاح! 🎉');
            
            // التبديل لتبويب التحليل
            document.querySelector('[data-tab="analysis"]').click();
        } else {
            showError(data.error || 'فشل تحليل البشرة');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('خطأ في تحليل الصورة');
    } finally {
        processingLoading.style.display = 'none';
    }
});

function displaySkinAnalysis(skinTone) {
    const result = document.getElementById('skinToneResult');
    const colorDiv = document.getElementById('skinToneColor');
    const typeDiv = document.getElementById('skinToneType');
    const rgbDiv = document.getElementById('skinToneRgb');
    
    result.style.display = 'block';
    colorDiv.style.background = `rgb(${skinTone.rgb[0]}, ${skinTone.rgb[1]}, ${skinTone.rgb[2]})`;
    
    const typeNames = {
        'fair': 'بشرة فاتحة',
        'medium': 'بشرة متوسطة',
        'tan': 'بشرة قمحية',
        'dark': 'بشرة داكنة'
    };
    
    typeDiv.textContent = typeNames[skinTone.type] || skinTone.type;
    rgbDiv.textContent = `RGB: ${skinTone.rgb[0]}, ${skinTone.rgb[1]}, ${skinTone.rgb[2]}`;
}

// عرض النتيجة
function displayResult(original, processed) {
    originalImage.src = original;
    processedImage.src = processed;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// تحميل الصورة
document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = processedImage.src;
    link.download = `makeup_${Date.now()}.png`;
    link.click();
});

// جرب مرة أخرى
document.getElementById('tryAgainBtn').addEventListener('click', () => {
    resultSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// وظائف مساعدة
function rgbToHex(rgb) {
    // accepts either an array [r, g, b] or a comma-separated string "r,g,b"
    const parts = Array.isArray(rgb) ? rgb : rgb.split(',').map(Number);
    const [r, g, b] = parts;
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : 
        '220,20,60';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// تحميل البيانات عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    loadMakeupLooks();
    loadMakeupItems();
});