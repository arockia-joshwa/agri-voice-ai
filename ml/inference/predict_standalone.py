"""
AgriVoice AI - Standalone CLI Inference Script
"""

import sys
import os
import torch
from ml.preprocessing.transforms import preprocess_leaf_image
from ml.models.leaf_cnn import CropDiseaseCNN

def run_cli_inference(image_path: str, model_weights: str = ""):
    if not os.path.exists(image_path):
        print(f"Error: Image {image_path} not found.")
        sys.exit(1)
        
    print(f"[Inference] Preprocessing {image_path}...")
    tensor = preprocess_leaf_image(image_path)
    
    model = CropDiseaseCNN(num_classes=38)
    model.eval()
    
    if model_weights and os.path.exists(model_weights):
        checkpoint = torch.load(model_weights, map_location="cpu")
        if "state_dict" in checkpoint:
            model.load_state_dict(checkpoint["state_dict"])
        else:
            model.load_state_dict(checkpoint)
        print(f"[Inference] Loaded weights from {model_weights}")
    else:
        print("[Inference] Using initialized CNN architecture (Demo/Evaluation weights)")
        
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)
        confidence, pred_class = torch.max(probs, 1)
        
    print(f"Predicted Class Index: {pred_class.item()} | Confidence: {confidence.item():.2%}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ml/inference/predict_standalone.py <path_to_leaf_image> [model_weights.pth]")
        sys.exit(1)
    img_path = sys.argv[1]
    weights = sys.argv[2] if len(sys.argv) > 2 else ""
    run_cli_inference(img_path, weights)
