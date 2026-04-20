import sys
from PIL import Image

def process(path):
    img = Image.open(path).convert("RGB")
    img.thumbnail((800, 800))
    img.save(path, "JPEG", quality=85, optimize=True)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 process_image.py <image_path>")
        sys.exit(1)
    process(sys.argv[1])