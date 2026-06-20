const fs = require('fs');
const width = 256;
const height = 256;
const headerSize = 54;
const fileSize = headerSize + width * height * 4;

const buffer = Buffer.alloc(fileSize);

// BMP Header
buffer.write('BM', 0); // Signature
buffer.writeUInt32LE(fileSize, 2); // File size
buffer.writeUInt32LE(0, 6); // Reserved
buffer.writeUInt32LE(headerSize, 10); // Data offset

// DIB Header
buffer.writeUInt32LE(40, 14); // Header size
buffer.writeInt32LE(width, 18); // Width
buffer.writeInt32LE(-height, 22); // Height (negative for top-down)
buffer.writeUInt16LE(1, 26); // Color planes
buffer.writeUInt16LE(32, 28); // Bits per pixel (BGRA)
buffer.writeUInt32LE(0, 30); // Compression (none)
buffer.writeUInt32LE(width * height * 4, 34); // Image size
buffer.writeInt32LE(2835, 38); // X pixels per meter
buffer.writeInt32LE(2835, 42); // Y pixels per meter
buffer.writeUInt32LE(0, 46); // Colors in color table
buffer.writeUInt32LE(0, 50); // Important color count

let offset = headerSize;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    // Generate crisp grayscale noise
    const val = Math.floor(Math.random() * 256);
    buffer.writeUInt8(val, offset);     // B
    buffer.writeUInt8(val, offset + 1); // G
    buffer.writeUInt8(val, offset + 2); // R
    buffer.writeUInt8(255, offset + 3); // A
    offset += 4;
  }
}

fs.writeFileSync('public/noise.bmp', buffer);
console.log('Crisp noise texture generated at public/noise.bmp');
