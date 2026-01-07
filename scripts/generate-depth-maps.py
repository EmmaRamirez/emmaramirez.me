#!/usr/bin/env python3
"""
Depth Map Generator using Depth Anything V2

This script generates grayscale depth maps for hero images using the
Depth Anything V2 model via HuggingFace Transformers.

Usage:
    python scripts/generate-depth-maps.py

Requirements:
    pip install transformers torch pillow
"""

import os
from pathlib import Path

try:
    from transformers import pipeline
    from PIL import Image
except ImportError as e:
    print("Error: Required packages not installed.")
    print("Please install them with: pip install transformers torch pillow")
    raise SystemExit(1) from e


def generate_depth_maps():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    hero_dir = project_root / "src" / "lib" / "images" / "photos" / "hero"

    images = [
        ("me.jpeg", "me-depth.png"),
        ("me-robot.png", "me-robot-depth.png"),
    ]

    print("Initializing Depth Anything V2 model...")
    print("(This may take a moment on first run as the model downloads)")
    
    pipe = pipeline(
        task="depth-estimation",
        model="depth-anything/Depth-Anything-V2-Small-hf"
    )

    for input_name, output_name in images:
        input_path = hero_dir / input_name
        output_path = hero_dir / output_name

        if not input_path.exists():
            print(f"Warning: {input_path} not found, skipping...")
            continue

        print(f"Processing {input_name}...")

        image = Image.open(input_path)
        result = pipe(image)
        depth_image = result["depth"]

        if depth_image.mode != "L":
            depth_image = depth_image.convert("L")

        depth_image.save(output_path)
        print(f"  -> Saved {output_name}")

    print("\nDepth map generation complete!")


if __name__ == "__main__":
    generate_depth_maps()

