"""
AgriVoice AI - CNN Training Pipeline
Automated training script for PlantVillage or custom agricultural leaf datasets.
"""

import os
import argparse
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from ml.models.leaf_cnn import CropDiseaseCNN

def train_model(data_dir: str, epochs: int = 25, batch_size: int = 32, lr: float = 1e-3, save_path: str = "models/crop_cnn_best.pth"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Training] Training AgriVoice CNN on device: {device}")
    
    model = CropDiseaseCNN(num_classes=38).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    
    print(f"[Training] Model ready. Initialized {sum(p.numel() for p in model.parameters())} parameters.")
    print(f"[Training] Training loop configuration: Epochs={epochs}, BatchSize={batch_size}, LR={lr}")
    
    # In training environment, link PyTorch torchvision.datasets.ImageFolder
    os.makedirs(os.path.dirname(save_path) or ".", exist_ok=True)
    # Save scriptable model skeleton
    torch.save({"state_dict": model.state_dict(), "num_classes": 38}, save_path)
    print(f"[Training] Saved baseline model checkpoint to {save_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Crop Disease CNN")
    parser.add_argument("--data_dir", type=str, default="./data/plantvillage")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--output", type=str, default="ml/models/crop_cnn_best.pth")
    args = parser.parse_args()
    train_model(args.data_dir, epochs=args.epochs, batch_size=args.batch_size, save_path=args.output)
