from PIL import Image
import shutil

# Copy generated image
src_path = 'C:/Users/adhav/.gemini/antigravity-ide/brain/b13fb4be-ccce-42fc-ae35-3051a0a0c4a0/abstract_gradient_logo_1781850679529.png'
dest_path = 'd:/Portfolio/Portfolio/src/app/icon.png'
shutil.copyfile(src_path, dest_path)

img = Image.open(dest_path).convert("RGBA")
datas = img.getdata()
new_data = []

# Remove black background and keep orange/white gradient
for item in datas:
    r, g, b, a = item
    brightness = (r + g + b) / 3
    
    # If the pixel is very dark (black background)
    if brightness < 15:
        new_data.append((0, 0, 0, 0))
    elif brightness < 60:
        # Anti-aliasing edge: keep original color, but reduce alpha
        new_data.append((r, g, b, int((brightness - 15) / 45 * 255)))
    else:
        new_data.append((r, g, b, 255))

img.putdata(new_data)

# Crop to bounding box
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Add padding
width, height = img.size
pad = int(max(width, height) * 0.05)
new_width = width + pad * 2
new_height = height + pad * 2
final_img = Image.new("RGBA", (new_width, new_height), (0, 0, 0, 0))
final_img.paste(img, (pad, pad))

# Resize
final_img = final_img.resize((512, 512), Image.Resampling.LANCZOS)
final_img.save(dest_path, "PNG")
print("Successfully generated and processed abstract gradient icon")
