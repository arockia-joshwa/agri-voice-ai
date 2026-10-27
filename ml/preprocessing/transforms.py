"""
AgriVoice AI - Image Preprocessing & Augmentation Pipeline
"""

import numpy as np
from PIL import Image
import torch

def preprocess_leaf_image(image_path: str, target_size: int = 224) -> torch.Tensor:
    """Standardized preprocessing: resize, RGB conversion, normalize using ImageNet statistics."""
    img = Image.open(image_path).convert("RGB")
    img = img.resize((target_size, target_size), Image.Resampling.BILINEAR)
    
    arr = np.array(img, dtype=np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    
    normalized = (arr - mean) / std
    # HWC to CHW
    chw = np.transpose(normalized, (2, 0, 1))
    tensor = torch.from_numpy(chw).unsqueeze(0)
    return tensor
