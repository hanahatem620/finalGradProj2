import logging
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import cv2
import numpy as np
import base64

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

from makeup_ai import MakeupAI

# تهيئة MakeupAI
makeup_ai = MakeupAI()

# إطلالات المكياج
MAKEUP_LOOKS = [
    {
        'id': 'natural',
        'name': 'مكياج طبيعي',
        'artist': 'لإطلالة يومية',
        'description': 'مكياج خفيف ومناسب لكل يوم',
        'colors_rgb': ['rgb(193, 182, 255)', 'rgb(193, 140, 180)', 'rgb(255, 200, 200)'],
        'config': {
            'foundation': {'intensity': 0.15},
            'blush': {'color': [193, 182, 255], 'intensity': 0.25},
            'lipstick': {'color': [193, 140, 180], 'intensity': 0.45}
        }
    },
    {
        'id': 'bold',
        'name': 'مكياج جريء',
        'artist': 'للسهرات',
        'description': 'ألوان قوية وجذابة',
        'colors_rgb': ['rgb(130, 0, 75)', 'rgb(60, 20, 220)', 'rgb(180, 105, 255)'],
        'config': {
            'foundation': {'intensity': 0.25},
            'eyeshadow': {'color': [130, 0, 75], 'intensity': 0.65},
            'eyeliner': {'color': [0, 0, 0], 'thickness': 3},
            'lipstick': {'color': [60, 20, 220], 'intensity': 0.75},
            'blush': {'color': [180, 105, 255], 'intensity': 0.35}
        }
    },
    {
        'id': 'glamorous',
        'name': 'مكياج فخم',
        'artist': 'للمناسبات الخاصة',
        'description': 'مكياج كامل وفخم',
        'colors_rgb': ['rgb(34, 34, 178)', 'rgb(147, 20, 255)', 'rgb(193, 150, 255)'],
        'config': {
            'foundation': {'intensity': 0.2},
            'eyeshadow': {'color': [34, 34, 178], 'intensity': 0.6},
            'eyeliner': {'color': [0, 0, 0], 'thickness': 2},
            'lipstick': {'color': [147, 20, 255], 'intensity': 0.7},
            'blush': {'color': [193, 150, 255], 'intensity': 0.3}
        }
    }
]

def base64_to_image(base64_string):
    """تحويل base64 إلى صورة"""
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        logger.error(f"Error decoding image: {e}")
        return None

def image_to_base64(image):
    """تحويل صورة إلى base64"""
    try:
        _, buffer = cv2.imencode('.png', image)
        img_str = base64.b64encode(buffer).decode()
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        logger.error(f"Error encoding image: {e}")
        return None

# API Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/makeup-looks', methods=['GET'])
def get_makeup_looks():
    return jsonify({
        'success': True,
        'looks': MAKEUP_LOOKS
    })

@app.route('/api/apply-makeup-look', methods=['POST'])
def apply_makeup_look():
    try:
        data = request.json
        image_base64 = data.get('image')
        look_id = data.get('look_id')
        
        if not image_base64 or not look_id:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        look = next((l for l in MAKEUP_LOOKS if l['id'] == look_id), None)
        if not look:
            return jsonify({'success': False, 'error': 'Look not found'}), 404
        
        image = base64_to_image(image_base64)
        if image is None:
            return jsonify({'success': False, 'error': 'Invalid image'}), 400
        
        result = makeup_ai.apply_custom_makeup(image, look['config'])
        result_base64 = image_to_base64(result)
        
        if result_base64 is None:
            return jsonify({'success': False, 'error': 'Failed to encode result'}), 500
        
        return jsonify({
            'success': True,
            'image': result_base64,
            'look_name': look['name']
        })
        
    except Exception as e:
        logger.error(f"Error in apply_makeup_look: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/apply-custom-makeup', methods=['POST'])
def apply_custom_makeup():
    try:
        data = request.json
        image_base64 = data.get('image')
        config = data.get('config', {})
        
        if not image_base64:
            return jsonify({'success': False, 'error': 'Missing image'}), 400
        
        image = base64_to_image(image_base64)
        if image is None:
            return jsonify({'success': False, 'error': 'Invalid image'}), 400
        
        for key in config:
            if 'color' in config[key] and isinstance(config[key]['color'], str):
                try:
                    config[key]['color'] = [int(x) for x in config[key]['color'].split(',')]
                except (ValueError, TypeError):
                    return jsonify({'success': False, 'error': f'Invalid color format for {key}'}), 400
        
        result = makeup_ai.apply_custom_makeup(image, config)
        result_base64 = image_to_base64(result)
        
        if result_base64 is None:
            return jsonify({'success': False, 'error': 'Failed to encode result'}), 500
        
        return jsonify({
            'success': True,
            'image': result_base64
        })
        
    except Exception as e:
        logger.error(f"Error in apply_custom_makeup: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/apply-makeup-ai', methods=['POST'])
def apply_makeup_ai():
    """Alias for apply-makeup-look used by the templates frontend."""
    return apply_makeup_look()

@app.route('/api/makeup-items', methods=['GET'])
def get_makeup_items():
    items = [
        {'id': 'lipstick', 'name': 'Lipstick', 'category': 'lips', 'default_color': [180, 20, 60]},
        {'id': 'eyeshadow', 'name': 'Eyeshadow', 'category': 'eyes', 'default_color': [138, 43, 226]},
        {'id': 'blush', 'name': 'Blush', 'category': 'cheeks', 'default_color': [255, 182, 193]},
        {'id': 'eyeliner', 'name': 'Eyeliner', 'category': 'eyes', 'default_color': [0, 0, 0]},
        {'id': 'foundation', 'name': 'Foundation', 'category': 'face', 'default_color': None},
        {'id': 'contour', 'name': 'Contour', 'category': 'face', 'default_color': [90, 70, 50]},
        {'id': 'highlighter', 'name': 'Highlighter', 'category': 'face', 'default_color': [255, 255, 255]},
        {'id': 'eyebrows', 'name': 'Eyebrows', 'category': 'eyes', 'default_color': [70, 40, 20]}
    ]
    return jsonify({'success': True, 'items': items})

@app.route('/api/detect-landmarks', methods=['POST'])
def detect_landmarks():
    try:
        data = request.json
        image_base64 = data.get('image')
        if not image_base64:
            return jsonify({'success': False, 'error': 'Missing image'}), 400
        image = base64_to_image(image_base64)
        if image is None:
            return jsonify({'success': False, 'error': 'Invalid image'}), 400
        annotated = makeup_ai.draw_landmarks(image)
        result_base64 = image_to_base64(annotated)
        if result_base64 is None:
            return jsonify({'success': False, 'error': 'Failed to encode result'}), 500
        return jsonify({'success': True, 'image': result_base64})
    except Exception as e:
        logger.error(f"Error in detect_landmarks: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analyze-skin', methods=['POST'])
def analyze_skin():
    try:
        data = request.json
        image_base64 = data.get('image')

        if not image_base64:
            return jsonify({'success': False, 'error': 'Missing image'}), 400

        image = base64_to_image(image_base64)
        if image is None:
            return jsonify({'success': False, 'error': 'Invalid image'}), 400

        result = makeup_ai.analyze_skin_tone(image)
        if result is None:
            return jsonify({'success': False, 'error': 'Could not detect face'}), 400

        return jsonify({'success': True, 'analysis': result})

    except Exception as e:
        logger.error(f"Error in analyze_skin: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting AI Makeup Try-On Server")
    logger.info("Server running at: http://localhost:8080")
    logger.info("Using OpenCV Haar Cascades")
    app.run(debug=False, host='0.0.0.0', port=8080)
