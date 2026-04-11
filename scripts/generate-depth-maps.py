#!/usr/bin/env python3
"""
Depth Map Generator using Depth Anything V2

This script generates grayscale depth maps for hero images using the
Depth Anything V2 model via HuggingFace Transformers.

Usage:
    python scripts/generate-depth-maps.py
    python scripts/generate-depth-maps.py --images path/to/a.jpg path/to/b.png

Each custom image is written as <stem>-depth.png alongside the source file.

Requirements:
    pip install transformers torch pillow
"""

import argparse
from pathlib import Path

try:
    from transformers import pipeline
    from PIL import Image
except ImportError as e:
    print("Error: Required packages not installed.")
    print("Please install them with: pip install transformers torch pillow")
    raise SystemExit(1) from e


def _default_hero_jobs(project_root: Path) -> list[tuple[Path, Path]]:
    hero_dir = project_root / "src" / "lib" / "images" / "photos" / "hero"
    return [
        (hero_dir / "me.jpeg", hero_dir / "me-depth.png"),
        (hero_dir / "me-robot.png", hero_dir / "me-robot-depth.png"),
    ]


def _jobs_from_image_paths(paths: list[Path]) -> list[tuple[Path, Path]]:
    jobs: list[tuple[Path, Path]] = []
    for p in paths:
        resolved = p.expanduser().resolve()
        out = resolved.with_name(f"{resolved.stem}-depth.png")
        jobs.append((resolved, out))
    return jobs


def generate_depth_maps(jobs: list[tuple[Path, Path]]) -> None:
    print("Initializing Depth Anything V2 model...")
    print("(This may take a moment on first run as the model downloads)")

    pipe = pipeline(
        task="depth-estimation",
        model="depth-anything/Depth-Anything-V2-Small-hf"
    )

    for input_path, output_path in jobs:
        if not input_path.exists():
            print(f"Warning: {input_path} not found, skipping...")
            continue

        print(f"Processing {input_path}...")

        image = Image.open(input_path)
        result = pipe(image)
        depth_image = result["depth"]

        if depth_image.mode != "L":
            depth_image = depth_image.convert("L")

        depth_image.save(output_path)
        print(f"  -> Saved {output_path}")

    print("\nDepth map generation complete!")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate grayscale depth maps with Depth Anything V2.",
    )
    parser.add_argument(
        "--images",
        nargs="+",
        type=Path,
        metavar="PATH",
        help=(
            "One or more input image paths; writes <stem>-depth.png next to each file. "
            "If omitted, uses the default hero images in src/lib/images/photos/hero."
        ),
    )
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    if args.images:
        jobs = _jobs_from_image_paths(list(args.images))
    else:
        jobs = _default_hero_jobs(project_root)

    generate_depth_maps(jobs)


if __name__ == "__main__":
    main()

