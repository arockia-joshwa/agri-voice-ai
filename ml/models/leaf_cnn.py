"""
AgriVoice AI - Leaf Disease CNN Model Architecture
MobileNetV2-based Transfer Learning Architecture tailored for mobile and edge agricultural inference.
"""

import torch
import torch.nn as nn

class CropDiseaseCNN(nn.Module):
    def __init__(self, num_classes: int = 38, pretrained: bool = False, dropout_rate: float = 0.3):
        super(CropDiseaseCNN, self).__init__()
        
        # Lightweight convolutional feature extractor (inspired by MobileNetV2 inverted residuals)
        self.features = nn.Sequential(
            # Block 1: Initial conv
            nn.Conv2d(3, 32, kernel_size=3, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU6(inplace=True),
            
            # Block 2: Depthwise separable conv
            nn.Conv2d(32, 32, kernel_size=3, stride=1, padding=1, groups=32, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU6(inplace=True),
            nn.Conv2d(32, 64, kernel_size=1, stride=1, bias=False),
            nn.BatchNorm2d(64),
            
            # Block 3: Downsampling
            nn.Conv2d(64, 64, kernel_size=3, stride=2, padding=1, groups=64, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU6(inplace=True),
            nn.Conv2d(64, 128, kernel_size=1, stride=1, bias=False),
            nn.BatchNorm2d(128),
            
            # Block 4: Deeper feature extraction
            nn.Conv2d(128, 128, kernel_size=3, stride=2, padding=1, groups=128, bias=False),
            nn.BatchNorm2d(128),
            nn.ReLU6(inplace=True),
            nn.Conv2d(128, 256, kernel_size=1, stride=1, bias=False),
            nn.BatchNorm2d(256),
            
            # Block 5: High-level representation
            nn.Conv2d(256, 512, kernel_size=3, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(512),
            nn.ReLU6(inplace=True),
            
            nn.AdaptiveAvgPool2d((1, 1))
        )
        
        # Classification head with regularization
        self.classifier = nn.Sequential(
            nn.Dropout(p=dropout_rate),
            nn.Linear(512, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout_rate * 0.5),
            nn.Linear(256, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.features(x)
        feat = torch.flatten(feat, 1)
        logits = self.classifier(feat)
        return logits
