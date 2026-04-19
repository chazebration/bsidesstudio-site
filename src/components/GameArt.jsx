import { useRef, useEffect } from 'react';

export default function GameArt({ game, pixelSize = 4, className = '', style = {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const W = c.width;
    const H = c.height;
    const P = pixelSize;
    const cols = Math.floor(W / P);
    const rows = Math.floor(H / P);
    const [bg, c1, c2, c3] = game.palette;

    const px = (x, y, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * P, y * P, P, P);
    };

    const fill = (color) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, W, H);
    };

    let seed = 0;
    for (const ch of game.slug) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };

    fill(bg);

    if (game.pattern === 'stitch') {
      // Knitting V-stitches
      for (let y = 0; y < rows; y += 2) {
        for (let x = 0; x < cols; x += 2) {
          const hue = Math.floor((x + y) / 4) % 3;
          const col = [c1, c2, c3][hue];
          px(x, y, col);
          px(x + 1, y, col);
          px(x, y + 1, bg);
          px(x + 1, y + 1, col);
        }
      }
      // Heart
      const hx = Math.floor(cols * 0.5) - 4;
      const hy = Math.floor(rows * 0.4);
      const heart = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
      heart.forEach((row, yy) => [...row].forEach((ch, xx) => {
        if (ch === '#') px(hx + xx, hy + yy, c1);
      }));
    } else if (game.pattern === 'rpg') {
      // Suburban house silhouette under a dusk sky with a lone window glowing
      // Sky gradient (deterministic-ish bands)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = y / rows;
          if (v < 0.55) {
            // speckle stars
            if (rand() < 0.008) px(x, y, c2);
          }
        }
      }
      // Ground
      const ground = Math.floor(rows * 0.75);
      for (let y = ground; y < rows; y++) {
        for (let x = 0; x < cols; x++) px(x, y, c3);
      }
      // House body
      const hx = Math.floor(cols * 0.35);
      const hy = Math.floor(rows * 0.45);
      const hw = Math.floor(cols * 0.3);
      const hh = ground - hy;
      for (let y = hy; y < hy + hh; y++) {
        for (let x = hx; x < hx + hw; x++) px(x, y, '#0c0910');
      }
      // Roof
      for (let i = 0; i < hw / 2 + 2; i++) {
        for (let x = hx - 2 + i; x < hx + hw + 2 - i; x++) {
          if (hy - Math.floor(hw / 2) + i >= 0) px(x, hy - Math.floor(hw / 2) + i, '#0c0910');
        }
      }
      // Glowing window
      const wx = hx + Math.floor(hw * 0.6);
      const wy = hy + Math.floor(hh * 0.3);
      for (let y = wy; y < wy + 4; y++) {
        for (let x = wx; x < wx + 4; x++) px(x, y, c3);
      }
      // Moon
      const mx = Math.floor(cols * 0.75);
      const my = Math.floor(rows * 0.2);
      for (let i = -3; i <= 3; i++) {
        for (let j = -3; j <= 3; j++) {
          if (i * i + j * j <= 9) px(mx + i, my + j, c3);
        }
      }
      // Mailbox
      const mbx = Math.floor(cols * 0.18);
      const mby = ground - 4;
      for (let y = mby; y < mby + 3; y++) {
        for (let x = mbx; x < mbx + 4; x++) px(x, y, c1);
      }
      px(mbx + 1, mby + 3, '#0c0910');
      px(mbx + 2, mby + 3, '#0c0910');
      px(mbx + 1, mby + 4, '#0c0910');
      px(mbx + 2, mby + 4, '#0c0910');
    } else if (game.pattern === 'weather') {
      // Split sky: sun on left, clouds + rain on right
      // Sky
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) px(x, y, bg);
      }
      // Sun
      const sx = Math.floor(cols * 0.28);
      const sy = Math.floor(rows * 0.4);
      for (let i = -6; i <= 6; i++) {
        for (let j = -6; j <= 6; j++) {
          if (i * i + j * j <= 30) px(sx + i, sy + j, c3);
        }
      }
      // Sun rays
      const rays = [[0, -10], [10, 0], [0, 10], [-10, 0], [7, 7], [-7, 7], [7, -7], [-7, -7]];
      rays.forEach(([dx, dy]) => {
        for (let k = 8; k < 11; k++) {
          px(sx + Math.round(dx * k / 10), sy + Math.round(dy * k / 10), c3);
        }
      });
      // Cloud on the right
      const clx = Math.floor(cols * 0.68);
      const cly = Math.floor(rows * 0.35);
      const cloudPixels = [
        [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
        [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
        [3, 0], [4, 0],
        [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
      ];
      cloudPixels.forEach(([dx, dy]) => {
        for (let k = 0; k < 2; k++) {
          for (let l = 0; l < 2; l++) {
            px(clx + dx * 2 + k, cly + dy * 2 + l, '#efe7d4');
          }
        }
      });
      // Rain
      for (let i = 0; i < 14; i++) {
        const rx = clx + (i % 7) * 2;
        const ry = cly + 10 + Math.floor(i / 7) * 3;
        px(rx, ry, c2);
        px(rx, ry + 1, c2);
      }
      // Ground
      const ground = Math.floor(rows * 0.82);
      for (let y = ground; y < rows; y++) {
        for (let x = 0; x < cols; x++) px(x, y, c3);
      }
    }

    // Vignette frame
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = P;
    ctx.strokeRect(P / 2, P / 2, W - P, H - P);
  }, [game, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={240}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        display: 'block',
        ...style,
      }}
    />
  );
}
