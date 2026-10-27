"""
AgriVoice AI - Sample Leaf Generator
Generates realistic agricultural leaf images with visual disease symptoms
for Rice, Tomato, Potato, Corn, Cotton, Chilli, and Healthy leaves.
Allows instant testing without needing camera or external image files.
"""

import os
from PIL import Image, ImageDraw, ImageFilter
from typing import Dict, Any, List

def create_sample_leaf_image(disease_id: str, output_path: str) -> str:
    """Generate a realistic synthetic crop leaf image with specific disease visual markers."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    width, height = 400, 400
    img = Image.new("RGB", (width, height), color=(245, 247, 245))
    draw = ImageDraw.Draw(img)

    # Background subtle soil/field blur
    for y in range(height):
        ratio = y / height
        bg_col = (int(240 - 20 * ratio), int(245 - 15 * ratio), int(240 - 20 * ratio))
        draw.line([(0, y), (width, y)], fill=bg_col)

    if "rice" in disease_id:
        # Rice leaf: elongated slender blade
        leaf_poly = [
            (200, 30),
            (235, 120),
            (240, 240),
            (225, 350),
            (200, 385),
            (175, 350),
            (160, 240),
            (165, 120)
        ]
        leaf_base_color = (68, 142, 60) if "healthy" in disease_id else (90, 145, 55)
        draw.polygon(leaf_poly, fill=leaf_base_color, outline=(45, 95, 35))
        
        # Central midrib vein
        draw.line([(200, 40), (200, 375)], fill=(120, 180, 85), width=3)
        # Parallel veins
        for offset in [-20, -10, 10, 20]:
            draw.line([(200 + offset, 90), (200 + offset, 340)], fill=(85, 155, 60), width=1)

        if disease_id == "rice_leaf_blast":
            # Spindle / diamond shaped lesions with gray center and dark brown border
            lesions = [
                (200, 150, 25, 45),
                (185, 210, 20, 35),
                (215, 270, 22, 40),
                (195, 310, 16, 28)
            ]
            for cx, cy, rx, ry in lesions:
                # Outer brown margin
                draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(115, 55, 25), outline=(75, 30, 15))
                # Inner gray/whitish center
                draw.ellipse([cx - rx//2, cy - ry//2, cx + rx//2, cy + ry//2], fill=(210, 210, 205))

        elif disease_id == "rice_brown_spot":
            # Small oval dark brown spots with yellow halos
            import random
            random.seed(42)
            for _ in range(25):
                rx = random.randint(175, 225)
                ry = random.randint(100, 340)
                # Yellow halo
                draw.ellipse([rx - 8, ry - 5, rx + 8, ry + 5], fill=(205, 180, 45))
                # Brown necrotic center
                draw.ellipse([rx - 4, ry - 3, rx + 4, ry + 3], fill=(80, 40, 15))

        elif disease_id == "rice_bacterial_blight":
            # Wavy yellow-white drying along margins
            margin_poly_right = [(235, 120), (240, 240), (225, 350), (210, 300), (220, 200), (215, 130)]
            draw.polygon(margin_poly_right, fill=(215, 195, 80))
            margin_poly_left = [(165, 120), (160, 240), (175, 320), (180, 250), (175, 180)]
            draw.polygon(margin_poly_left, fill=(225, 185, 75))

    elif "tomato" in disease_id:
        # Broad serrated tomato leaflet
        leaf_poly = [
            (200, 50),
            (240, 90),
            (285, 130),
            (260, 160),
            (290, 200),
            (250, 230),
            (270, 275),
            (230, 310),
            (200, 360),
            (170, 310),
            (130, 275),
            (150, 230),
            (110, 200),
            (140, 160),
            (115, 130),
            (160, 90)
        ]
        leaf_color = (46, 125, 50) if "healthy" in disease_id else (70, 120, 45)
        draw.polygon(leaf_poly, fill=leaf_color, outline=(30, 80, 30))
        
        # Leaf veins branching
        draw.line([(200, 60), (200, 350)], fill=(100, 160, 75), width=3)
        draw.line([(200, 140), (260, 120)], fill=(90, 150, 65), width=2)
        draw.line([(200, 140), (140, 120)], fill=(90, 150, 65), width=2)
        draw.line([(200, 220), (265, 195)], fill=(90, 150, 65), width=2)
        draw.line([(200, 220), (135, 195)], fill=(90, 150, 65), width=2)

        if disease_id == "tomato_early_blight":
            # Target board concentric rings
            centers = [(170, 160, 28), (235, 230, 32), (180, 270, 20)]
            for cx, cy, r in centers:
                # Yellow halo
                draw.ellipse([cx - r - 8, cy - r - 8, cx + r + 8, cy + r + 8], fill=(195, 180, 40))
                # Concentric brown rings
                for step in range(r, 4, -5):
                    c = 70 + (step * 3) % 40
                    draw.ellipse([cx - step, cy - step, cx + step, cy + step], fill=(c, c//2 + 10, 20), outline=(50, 25, 10))

        elif disease_id == "tomato_late_blight":
            # Irregular large water-soaked dark lesions
            draw.polygon([(160, 120), (220, 110), (250, 160), (210, 190), (150, 170)], fill=(55, 50, 35), outline=(35, 30, 20))
            draw.polygon([(190, 230), (255, 250), (240, 300), (170, 290)], fill=(50, 45, 30), outline=(30, 25, 15))
            # White mold edging
            draw.arc([155, 115, 225, 185], start=45, end=180, fill=(230, 235, 230), width=3)

        elif disease_id == "tomato_leaf_curl":
            # Yellowish curled margins
            draw.polygon([(120, 130), (160, 100), (180, 150), (130, 170)], fill=(215, 205, 55))
            draw.polygon([(240, 100), (280, 135), (265, 180), (220, 150)], fill=(215, 205, 55))
            draw.ellipse([180, 210, 220, 250], fill=(210, 200, 60))

    else:
        # Generic healthy/other leaf
        draw.ellipse([130, 60, 270, 350], fill=(50, 135, 55), outline=(35, 95, 35))
        draw.line([(200, 70), (200, 340)], fill=(120, 180, 80), width=3)

    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(output_path, "JPEG", quality=90)
    return output_path

SAMPLE_PREVIEWS = [
    {
        "id": "rice_leaf_blast",
        "crop": "Rice",
        "disease": "Leaf Blast",
        "disease_ta": "இலை கருகல் நோய் (பிளாஸ்ட்)",
        "badge": "High Priority",
        "filename": "sample_rice_blast.jpg"
    },
    {
        "id": "rice_brown_spot",
        "crop": "Rice",
        "disease": "Brown Spot",
        "disease_ta": "பழுப்பு புள்ளி நோய்",
        "badge": "Nutrient Link",
        "filename": "sample_rice_brown_spot.jpg"
    },
    {
        "id": "rice_bacterial_blight",
        "crop": "Rice",
        "disease": "Bacterial Blight",
        "disease_ta": "பாக்டீரியா இலை கருகல்",
        "badge": "Water Drainage",
        "filename": "sample_rice_blight.jpg"
    },
    {
        "id": "tomato_early_blight",
        "crop": "Tomato",
        "disease": "Early Blight",
        "disease_ta": "முன் பருவ கருகல்",
        "badge": "Target Rings",
        "filename": "sample_tomato_early_blight.jpg"
    },
    {
        "id": "tomato_late_blight",
        "crop": "Tomato",
        "disease": "Late Blight",
        "disease_ta": "பின் பருவ கருகல்",
        "badge": "Urgent Action",
        "filename": "sample_tomato_late_blight.jpg"
    },
    {
        "id": "tomato_leaf_curl",
        "crop": "Tomato",
        "disease": "Leaf Curl Virus",
        "disease_ta": "இலை சுருட்டு வைரஸ்",
        "badge": "Whitefly Vector",
        "filename": "sample_tomato_curl.jpg"
    },
    {
        "id": "rice_healthy",
        "crop": "Rice",
        "disease": "Healthy Crop",
        "disease_ta": "ஆரோக்கியமான பயிர்",
        "badge": "No Pesticide Needed",
        "filename": "sample_rice_healthy.jpg"
    }
]

def ensure_sample_images(samples_dir: str):
    """Generate all sample images if they don't already exist."""
    os.makedirs(samples_dir, exist_ok=True)
    for sample in SAMPLE_PREVIEWS:
        path = os.path.join(samples_dir, sample["filename"])
        if not os.path.exists(path):
            create_sample_leaf_image(sample["id"], path)
