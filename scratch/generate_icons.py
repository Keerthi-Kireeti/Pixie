import os
from PIL import Image, ImageDraw

def create_fairy_icon():
    # Create icons directory if it doesn't exist
    os.makedirs('src-tauri/icons', exist_ok=True)
    
    # We will create a base 256x256 image with a cute glowing purple fairy icon
    size = 256
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a cute glowing purple sphere representing Pixie
    # Glow circle
    for r in range(110, 50, -2):
        alpha = int((110 - r) * 1.5)
        draw.ellipse([size/2 - r, size/2 - r, size/2 + r, size/2 + r], 
                     fill=(167, 139, 250, alpha))
        
    # Main body
    draw.ellipse([size/2 - 50, size/2 - 50, size/2 + 50, size/2 + 50], 
                 fill=(139, 92, 246, 255))
    
    # Cute blushing cheeks
    draw.ellipse([size/2 - 35, size/2 + 5, size/2 - 20, size/2 + 15], fill=(244, 114, 182, 200))
    draw.ellipse([size/2 + 20, size/2 + 5, size/2 + 35, size/2 + 15], fill=(244, 114, 182, 200))
    
    # Eyes
    draw.ellipse([size/2 - 25, size/2 - 15, size/2 - 15, size/2 - 5], fill=(30, 27, 75, 255))
    draw.ellipse([size/2 + 15, size/2 - 15, size/2 + 25, size/2 - 5], fill=(30, 27, 75, 255))
    # Eye highlights
    draw.ellipse([size/2 - 23, size/2 - 13, size/2 - 19, size/2 - 9], fill=(255, 255, 255, 255))
    draw.ellipse([size/2 + 17, size/2 - 13, size/2 + 21, size/2 - 9], fill=(255, 255, 255, 255))
    
    # Happy mouth (smile arc)
    draw.arc([size/2 - 10, size/2, size/2 + 10, size/2 + 15], start=0, end=180, fill=(76, 29, 149, 255), width=3)
    
    # Save the different sizes required by Tauri
    img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_32.save('src-tauri/icons/32x32.png')
    
    img_128 = img.resize((128, 128), Image.Resampling.LANCZOS)
    img_128.save('src-tauri/icons/128x128.png')
    
    img_256 = img.resize((256, 256), Image.Resampling.LANCZOS)
    img_256.save('src-tauri/icons/128x128@2x.png')
    
    # Save as ICO (can pack multiple sizes)
    img.save('src-tauri/icons/icon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print("Fairy icons generated successfully under src-tauri/icons/")

if __name__ == '__main__':
    create_fairy_icon()
