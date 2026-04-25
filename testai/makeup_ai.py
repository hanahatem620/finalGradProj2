import logging
import cv2
import numpy as np
import base64

logger = logging.getLogger(__name__)

# ── MediaPipe Face Mesh landmark index groups ──────────────────────────────────
# Full outer lip contour (clockwise)
LIPS_ALL = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375,
            291, 409, 270, 269, 267, 0, 37, 39, 40, 185]
LIPS_UPPER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291]
LIPS_LOWER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]
# Inner mouth ring — subtract this from LIPS_ALL to exclude teeth/tongue
LIPS_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415,
              308, 324, 318, 402, 317, 14, 87, 178, 88, 95]

LEFT_EYE  = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]

# Upper eyelid line for eyeliner
LEFT_UPPER_LID  = [33, 246, 161, 160, 159, 158, 157, 173, 133]
RIGHT_UPPER_LID = [362, 398, 384, 385, 386, 387, 388, 466, 263]

LEFT_EYEBROW  = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46]
RIGHT_EYEBROW = [336, 296, 334, 293, 300, 276, 283, 282, 295, 285]

FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323,
             361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
             176, 149, 150, 136, 172,  58, 132,  93, 234, 127,
             162,  21,  54, 103,  67, 109]

# Cheek anchor points (lateral cheek landmarks)
LEFT_CHEEK_IDX  = 234
RIGHT_CHEEK_IDX = 454


class MakeupAI:
    def __init__(self):
        self._mp_ready = False
        try:
            import mediapipe as mp
            self.mp_face_mesh = mp.solutions.face_mesh
            self.face_mesh = self.mp_face_mesh.FaceMesh(
                static_image_mode=True,
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=0.5
            )
            self._mp_ready = True
            logger.info("MediaPipe Face Mesh initialized — precise landmark detection active")
        except ImportError:
            logger.warning("MediaPipe not installed — falling back to Haar cascades")
            self.face_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            self.eye_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_eye.xml')

    # ── Landmark detection ──────────────────────────────────────────────────────

    def get_landmarks(self, image):
        """Run MediaPipe Face Mesh and return (h, w, landmarks) or None."""
        if not self._mp_ready:
            return None
        h, w = image.shape[:2]
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb)
        if not results.multi_face_landmarks:
            return None
        return h, w, results.multi_face_landmarks[0].landmark

    def lm_pts(self, lm, indices, h, w):
        """Convert landmark indices to integer pixel (x, y) array."""
        return np.array(
            [(int(lm[i].x * w), int(lm[i].y * h)) for i in indices],
            dtype=np.int32
        )

    def draw_landmarks(self, image):
        """Draw the full MediaPipe Face Mesh overlay on a copy of the image.

        Renders three layers:
          1. Tesselation  — fine triangular mesh across the whole face (grey)
          2. Contours     — bold outlines for eyes, lips, eyebrows, face oval
          3. Irises       — iris ring landmarks (cyan)

        Falls back to colored dot groups if MediaPipe drawing utils unavailable.
        Returns annotated copy; returns original copy if no face detected.
        """
        if not self._mp_ready:
            return image.copy()

        h, w = image.shape[:2]
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb)
        if not results.multi_face_landmarks:
            return image.copy()

        try:
            import mediapipe as mp
            mp_drawing        = mp.solutions.drawing_utils
            mp_drawing_styles = mp.solutions.drawing_styles
            mp_face_mesh      = mp.solutions.face_mesh

            # Work in RGB so MediaPipe drawing utils render correctly
            annotated_rgb = rgb.copy()

            for face_landmarks in results.multi_face_landmarks:
                # Layer 1 — full triangular tesselation (subtle grey mesh)
                mp_drawing.draw_landmarks(
                    image=annotated_rgb,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                        .get_default_face_mesh_tesselation_style()
                )
                # Layer 2 — bold contour lines (eyes, lips, brows, face oval)
                mp_drawing.draw_landmarks(
                    image=annotated_rgb,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_CONTOURS,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles
                        .get_default_face_mesh_contours_style()
                )
                # Layer 3 — iris rings (only present with refine_landmarks=True)
                if hasattr(mp_face_mesh, 'FACEMESH_IRISES'):
                    mp_drawing.draw_landmarks(
                        image=annotated_rgb,
                        landmark_list=face_landmarks,
                        connections=mp_face_mesh.FACEMESH_IRISES,
                        landmark_drawing_spec=None,
                        connection_drawing_spec=mp_drawing_styles
                            .get_default_face_mesh_iris_connections_style()
                    )

            annotated = cv2.cvtColor(annotated_rgb, cv2.COLOR_RGB2BGR)

        except Exception:
            # Fallback: colored dots per region
            annotated = image.copy()
            lm = results.multi_face_landmarks[0].landmark
            groups = [
                (FACE_OVAL,       (200,  80, 180), 2),
                (LEFT_EYE,        (200, 180,   0), 2),
                (RIGHT_EYE,       (200, 180,   0), 2),
                (LEFT_UPPER_LID,  (120, 220, 255), 2),
                (RIGHT_UPPER_LID, (120, 220, 255), 2),
                (LEFT_EYEBROW,    ( 50, 200,  80), 2),
                (RIGHT_EYEBROW,   ( 50, 200,  80), 2),
                (LIPS_ALL,        ( 30,  60, 220), 2),
            ]
            for indices, color, radius in groups:
                pts = self.lm_pts(lm, indices, h, w)
                for pt in pts:
                    cv2.circle(annotated, tuple(pt), radius + 1, (255, 255, 255), -1)
                    cv2.circle(annotated, tuple(pt), radius,     color,           -1)

        # Landmark count label
        total = len(results.multi_face_landmarks[0].landmark)
        cv2.putText(annotated, f"{total} landmarks detected",
                    (8, h - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45,
                    (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(annotated, f"{total} landmarks detected",
                    (8, h - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45,
                    (40, 40, 40), 1, cv2.LINE_AA)

        return annotated

    # ── Mask builders ───────────────────────────────────────────────────────────

    def polygon_mask(self, shape, points, blur=11):
        """Soft-edged filled polygon mask."""
        mask = np.zeros(shape[:2], dtype=np.uint8)
        cv2.fillPoly(mask, [points], 255)
        if blur > 1:
            blur = blur | 1
            mask = cv2.GaussianBlur(mask, (blur, blur), 0)
        return mask

    def ellipse_mask(self, shape, center, axes, angle=0, blur=21):
        """Soft-edged ellipse mask."""
        mask = np.zeros(shape[:2], dtype=np.uint8)
        cv2.ellipse(mask, center, axes, angle, 0, 360, 255, -1)
        blur = blur | 1
        return cv2.GaussianBlur(mask, (blur, blur), 0)

    # ── Color blending ──────────────────────────────────────────────────────────

    def apply_color_blend(self, image, mask, color, intensity=0.7, blend_mode='multiply'):
        overlay    = image.copy().astype(float)
        color_layer = np.zeros_like(overlay)
        color_layer[:] = color

        if blend_mode == 'multiply':
            blended = overlay * color_layer / 255.0
        elif blend_mode == 'screen':
            blended = 255 - ((255 - overlay) * (255 - color_layer) / 255.0)
        elif blend_mode == 'overlay':
            blended = np.where(
                overlay < 128,
                2 * overlay * color_layer / 255.0,
                255 - 2 * (255 - overlay) * (255 - color_layer) / 255.0
            )
        else:  # normal
            blended = overlay * (1 - intensity) + color_layer * intensity

        final    = overlay * (1 - intensity) + blended * intensity
        mask_3ch = cv2.merge([mask, mask, mask]) / 255.0
        result   = image.astype(float) * (1 - mask_3ch) + final * mask_3ch
        return np.clip(result, 0, 255).astype(np.uint8)

    # ── Makeup features ─────────────────────────────────────────────────────────

    def apply_lipstick(self, image, color=(180, 20, 60), intensity=0.7, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return self._fb_lipstick(image, color, intensity)

        h, w, lm = lm_data

        # Build outer lip mask then subtract inner mouth opening (teeth/tongue)
        outer_pts = self.lm_pts(lm, LIPS_ALL,   h, w)
        inner_pts = self.lm_pts(lm, LIPS_INNER, h, w)
        outer_mask = np.zeros(image.shape[:2], dtype=np.uint8)
        cv2.fillPoly(outer_mask, [outer_pts], 255)
        inner_mask = np.zeros(image.shape[:2], dtype=np.uint8)
        cv2.fillPoly(inner_mask, [inner_pts], 255)
        lip_mask = np.clip(
            outer_mask.astype(np.int16) - inner_mask.astype(np.int16), 0, 255
        ).astype(np.uint8)
        lip_mask = cv2.GaussianBlur(lip_mask, (3, 3), 0)

        result = self.apply_color_blend(image, lip_mask, color, intensity, 'multiply')

        # Soft highlight on upper-lip center
        up_pts = self.lm_pts(lm, LIPS_UPPER, h, w)
        cx, cy = int(up_pts[:, 0].mean()), int(up_pts[:, 1].mean()) - 2
        hl = self.ellipse_mask(image.shape, (cx, cy),
                               (max(1, int(w * 0.01)), max(1, int(h * 0.006))), blur=5)
        hl = (hl.astype(float) / 255.0 * 0.3).astype(np.uint8)
        result = result.astype(float)
        for i in range(3):
            result[:, :, i] = np.clip(result[:, :, i] + hl * 40, 0, 255)
        return result.astype(np.uint8)

    def apply_eyeshadow(self, image, color=(138, 43, 226), intensity=0.6, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return self._fb_eyeshadow(image, color, intensity)

        h, w, lm = lm_data
        result = image.copy()

        for lid_idx, brow_idx in [(LEFT_UPPER_LID, LEFT_EYEBROW),
                                   (RIGHT_UPPER_LID, RIGHT_EYEBROW)]:
            lid_pts  = self.lm_pts(lm, lid_idx,  h, w)
            brow_pts = self.lm_pts(lm, brow_idx, h, w)

            # Lift is a small fixed fraction of image height — keeps shadow
            # tight to the eyelid and avoids bleeding down the cheek.
            lift = int(h * 0.025)

            top_pts       = lid_pts.copy()
            top_pts[:, 1] = np.maximum(0, top_pts[:, 1] - lift)
            shadow_pts    = np.vstack([lid_pts, top_pts[::-1]])
            mask          = self.polygon_mask(image.shape, shadow_pts, blur=11)
            result        = self.apply_color_blend(result, mask, color, intensity * 0.5, 'overlay')

        return result

    def apply_blush(self, image, color=(255, 182, 193), intensity=0.3, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return self._fb_blush(image, color, intensity)

        h, w, lm = lm_data
        result = image.copy()

        # Zygomatic (cheekbone) landmark clusters — averaged to find the true
        # blush sweet-spot on each cheek.  234/454 are the face silhouette edges
        # (too far lateral); these indices sit on the actual cheekbone prominence.
        LEFT_BLUSH_CLUSTER  = [116, 50, 36, 205, 187, 123]
        RIGHT_BLUSH_CLUSTER = [345, 280, 266, 425, 411, 352]

        for cluster in [LEFT_BLUSH_CLUSTER, RIGHT_BLUSH_CLUSTER]:
            pts = self.lm_pts(lm, cluster, h, w)
            cx  = int(pts[:, 0].mean())
            cy  = int(pts[:, 1].mean())

            # Ellipse sized to cover the cheekbone — slightly wider than tall,
            # tilted ~-20° to follow the natural cheekbone slope.
            axes  = (int(w * 0.10), int(h * 0.055))
            mask  = self.ellipse_mask(image.shape, (cx, cy), axes, angle=-20, blur=35)
            result = self.apply_color_blend(result, mask, color, intensity * 0.45, 'overlay')

        return result

    def apply_eyeliner(self, image, color=(0, 0, 0), thickness=2, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return self._fb_eyeliner(image, color, thickness)

        h, w, lm = lm_data
        result = image.copy()
        for lid_idx in [LEFT_UPPER_LID, RIGHT_UPPER_LID]:
            pts = self.lm_pts(lm, lid_idx, h, w)
            cv2.polylines(result, [pts], isClosed=False,
                          color=color, thickness=thickness, lineType=cv2.LINE_AA)
        return result

    def apply_eyebrows(self, image, color=(70, 40, 20), intensity=0.4, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return self._fb_eyebrows(image, color, intensity)

        h, w, lm = lm_data
        result = image.copy()

        for brow_idx in [LEFT_EYEBROW, RIGHT_EYEBROW]:
            pts = self.lm_pts(lm, brow_idx, h, w)

            # The landmark arrays are ordered so that:
            #   pts[0:5]  = upper edge of brow (outer → inner corner)
            #   pts[5:10] = lower edge of brow (inner → outer corner)
            # Together they form a complete, non-self-intersecting brow arch.
            # Expand the lower edge very slightly so color covers the brow skin
            # below the hairs without spilling above the brow.
            brow_poly        = pts.copy().astype(float)
            brow_poly[5:, 1] += max(2, int(h * 0.005))   # push lower edge down ~3-5 px
            brow_poly        = np.clip(brow_poly, 0, [w - 1, h - 1]).astype(np.int32)

            mask   = self.polygon_mask(image.shape, brow_poly, blur=5)
            result = self.apply_color_blend(result, mask, color, intensity * 0.75, 'overlay')

        return result

    def apply_foundation(self, image, intensity=0.2, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return self._fb_foundation(image, intensity)

        h, w, lm = lm_data
        pts  = self.lm_pts(lm, FACE_OVAL, h, w)
        mask = self.polygon_mask(image.shape, pts, blur=45)
        face_color       = cv2.mean(image, mask=mask)[:3]
        foundation_color = tuple(min(255, int(c * 1.08)) for c in face_color)
        result = self.apply_color_blend(image, mask, foundation_color, intensity, 'normal')
        return cv2.bilateralFilter(result, 5, 50, 50)

    def apply_highlighter(self, image, intensity=0.3, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return image

        h, w, lm = lm_data
        result = image.copy()
        # Nose bridge + cheekbones
        for idx in [6, 197, LEFT_CHEEK_IDX, RIGHT_CHEEK_IDX]:
            cx   = int(lm[idx].x * w)
            cy   = int(lm[idx].y * h)
            axes = (int(w * 0.03), int(h * 0.04))
            mask = self.ellipse_mask(image.shape, (cx, cy), axes, blur=25)
            result = self.apply_color_blend(result, mask, (255, 255, 255), intensity, 'screen')
        return result

    def apply_contour(self, image, intensity=0.3, lm_data=None):
        if lm_data is None:
            lm_data = self.get_landmarks(image)
        if lm_data is None:
            return image

        h, w, lm = lm_data
        result = image.copy()
        for idx in [234, 93, 132, 58, 172]:   # left jaw
            cx, cy = int(lm[idx].x * w), int(lm[idx].y * h)
            mask   = self.ellipse_mask(image.shape, (cx, cy),
                                       (int(w * 0.04), int(h * 0.06)), -20, blur=35)
            result = self.apply_color_blend(result, mask, (90, 70, 50), intensity, 'multiply')
        for idx in [454, 323, 361, 288, 397]:  # right jaw
            cx, cy = int(lm[idx].x * w), int(lm[idx].y * h)
            mask   = self.ellipse_mask(image.shape, (cx, cy),
                                       (int(w * 0.04), int(h * 0.06)), 20, blur=35)
            result = self.apply_color_blend(result, mask, (90, 70, 50), intensity, 'multiply')
        return result

    # ── Master dispatcher ────────────────────────────────────────────────────────

    def apply_custom_makeup(self, image, config):
        result  = image.copy()
        lm_data = self.get_landmarks(image)   # ← detect ONCE, reuse for all layers

        if config.get('foundation',  {}).get('intensity', 0) > 0:
            result = self.apply_foundation(result, config['foundation']['intensity'],
                                           lm_data=lm_data)
        if config.get('contour',     {}).get('intensity', 0) > 0:
            result = self.apply_contour(result, config['contour']['intensity'],
                                        lm_data=lm_data)
        if config.get('blush',       {}).get('intensity', 0) > 0:
            result = self.apply_blush(result,
                                      tuple(config['blush'].get('color', [255, 182, 193])),
                                      config['blush']['intensity'], lm_data=lm_data)
        if config.get('highlighter', {}).get('intensity', 0) > 0:
            result = self.apply_highlighter(result, config['highlighter']['intensity'],
                                            lm_data=lm_data)
        if config.get('eyebrows',    {}).get('intensity', 0) > 0:
            result = self.apply_eyebrows(result,
                                         tuple(config['eyebrows'].get('color', [70, 40, 20])),
                                         config['eyebrows']['intensity'], lm_data=lm_data)
        if config.get('eyeshadow',   {}).get('intensity', 0) > 0:
            result = self.apply_eyeshadow(result,
                                          tuple(config['eyeshadow'].get('color', [138, 43, 226])),
                                          config['eyeshadow']['intensity'], lm_data=lm_data)
        if config.get('eyeliner',    {}).get('intensity', 0) > 0:
            result = self.apply_eyeliner(result,
                                         tuple(config['eyeliner'].get('color', [0, 0, 0])),
                                         config['eyeliner'].get('thickness', 2), lm_data=lm_data)
        if config.get('lipstick',    {}).get('intensity', 0) > 0:
            result = self.apply_lipstick(result,
                                         tuple(config['lipstick'].get('color', [180, 20, 60])),
                                         config['lipstick']['intensity'], lm_data=lm_data)
        return result

    # ── Skin tone analysis ───────────────────────────────────────────────────────

    def analyze_skin_tone(self, image):
        lm_data = self.get_landmarks(image)
        if lm_data:
            h, w, lm = lm_data
            forehead_pts = self.lm_pts(lm, [10, 338, 297, 332, 109, 67, 103, 54], h, w)
            mask = np.zeros((h, w), dtype=np.uint8)
            cv2.fillPoly(mask, [forehead_pts], 255)
            mean_color = cv2.mean(image, mask=mask)
        else:
            face = self._fb_detect_face(image)
            if face is None:
                return None
            x, y, fw, fh = face
            region = image[y + int(fh * 0.1): y + int(fh * 0.25), x: x + fw]
            if region.size == 0:
                return None
            mean_color = cv2.mean(region)

        b, g, r = mean_color[:3]
        brightness = (r + g + b) / 3
        skin_type = ("fair" if brightness > 200 else
                     "medium" if brightness > 150 else
                     "tan"    if brightness > 100 else "dark")
        return {
            'rgb':        [int(r), int(g), int(b)],
            'hex':        f"#{int(r):02x}{int(g):02x}{int(b):02x}",
            'type':       skin_type,
            'brightness': int(brightness)
        }

    def process_base64(self, base64_string, style='natural'):
        try:
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            img_data = base64.b64decode(base64_string)
            image    = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)
            if image is None:
                return None
            presets = {
                'natural':   {'foundation': {'intensity': 0.15},
                              'blush':      {'color': [193, 182, 255], 'intensity': 0.25},
                              'lipstick':   {'color': [193, 140, 180], 'intensity': 0.45}},
                'bold':      {'foundation': {'intensity': 0.25},
                              'eyeshadow':  {'color': [130, 0, 75],   'intensity': 0.65},
                              'eyeliner':   {'color': [0, 0, 0], 'thickness': 3, 'intensity': 1},
                              'lipstick':   {'color': [60, 20, 220],  'intensity': 0.75},
                              'blush':      {'color': [180, 105, 255],'intensity': 0.35}},
                'glamorous': {'foundation': {'intensity': 0.2},
                              'contour':    {'intensity': 0.35},
                              'highlighter':{'intensity': 0.35},
                              'eyeshadow':  {'color': [34, 34, 178],  'intensity': 0.6},
                              'eyeliner':   {'color': [0, 0, 0], 'thickness': 2, 'intensity': 1},
                              'lipstick':   {'color': [147, 20, 255], 'intensity': 0.7},
                              'blush':      {'color': [193, 150, 255],'intensity': 0.3}},
            }
            result = self.apply_custom_makeup(image, presets.get(style, {}))
            _, buf  = cv2.imencode('.png', result)
            return f"data:image/png;base64,{base64.b64encode(buf).decode()}"
        except Exception as e:
            logger.error(f"Error in process_base64: {e}")
            return None

    # ── Haar cascade fallbacks (used only when MediaPipe unavailable) ────────────

    def _fb_detect_face(self, image):
        if not hasattr(self, 'face_cascade'):
            return None
        gray  = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        return max(faces, key=lambda f: f[2] * f[3]) if len(faces) else None

    def _fb_lipstick(self, image, color, intensity):
        face = self._fb_detect_face(image)
        if face is None: return image
        x, y, w, h = face
        mask = self.ellipse_mask(image.shape, (x + w // 2, y + int(h * 0.72)),
                                 (int(w * 0.14), int(h * 0.05)), blur=9)
        return self.apply_color_blend(image, mask, color, intensity, 'multiply')

    def _fb_eyeshadow(self, image, color, intensity):
        face = self._fb_detect_face(image)
        if face is None: return image
        x, y, w, h = face
        result = image.copy()
        # Ellipse sitting above the eye line, not around it
        for cx in [x + int(w * 0.30), x + int(w * 0.70)]:
            cy   = y + int(h * 0.35)
            mask = self.ellipse_mask(image.shape, (cx, cy),
                                     (int(w * 0.11), int(h * 0.05)), blur=19)
            result = self.apply_color_blend(result, mask, color, intensity * 0.85, 'overlay')
        return result

    def _fb_blush(self, image, color, intensity):
        face = self._fb_detect_face(image)
        if face is None: return image
        x, y, w, h = face
        result = image.copy()
        for cx in [x + int(w * 0.22), x + int(w * 0.78)]:
            mask   = self.ellipse_mask(image.shape, (cx, y + int(h * 0.58)),
                                       (int(w * 0.09), int(h * 0.08)), blur=41)
            result = self.apply_color_blend(result, mask, color, intensity * 0.6, 'overlay')
        return result

    def _fb_eyeliner(self, image, color, thickness):
        face = self._fb_detect_face(image)
        if face is None: return image
        x, y, w, h = face
        result = image.copy()
        ey = y + int(h * 0.42)
        cv2.line(result, (x + int(w * 0.25), ey), (x + int(w * 0.40), ey), color, thickness, cv2.LINE_AA)
        cv2.line(result, (x + int(w * 0.60), ey), (x + int(w * 0.75), ey), color, thickness, cv2.LINE_AA)
        return result

    def _fb_eyebrows(self, image, color, intensity):
        face = self._fb_detect_face(image)
        if face is None: return image
        x, y, w, h = face
        result = image.copy()
        for cx in [x + int(w * 0.32), x + int(w * 0.68)]:
            mask   = self.ellipse_mask(image.shape, (cx, y + int(h * 0.28)),
                                       (int(w * 0.10), int(h * 0.025)), blur=5)
            result = self.apply_color_blend(result, mask, color, intensity, 'multiply')
        return result

    def _fb_foundation(self, image, intensity):
        face = self._fb_detect_face(image)
        if face is None: return image
        x, y, w, h = face
        mask = self.ellipse_mask(image.shape, (x + w // 2, y + h // 2),
                                 (int(w * 0.45), int(h * 0.55)), blur=45)
        fc  = cv2.mean(image, mask=mask)[:3]
        col = tuple(min(255, int(c * 1.08)) for c in fc)
        return cv2.bilateralFilter(
            self.apply_color_blend(image, mask, col, intensity, 'normal'), 5, 50, 50)
