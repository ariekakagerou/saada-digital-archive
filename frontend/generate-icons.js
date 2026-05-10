const fs = require('fs');
const { createCanvas } = require('canvas'); // Kita pakai canvas karena sharp butuh native dependencies yg kadang ribet di windows

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background Hijau MTs
    ctx.fillStyle = '#047857';
    ctx.fillRect(0, 0, size, size);

    // Text "A" (Logo)
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', size / 2, size / 2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`public/icon-${size}x${size}.png`, buffer);
    console.log(`Created public/icon-${size}x${size}.png`);
}

// Cek folder public
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Generate Icons
// createIcon(192);
// createIcon(512);
