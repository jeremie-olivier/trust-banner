import React, { useRef, useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('Zet 👁')
  const [bannerType, setBannerType] = useState<'discord' | 'twitter'>('discord')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Preview sizes
  const previewWidth = 600
  const previewHeight = bannerType === 'discord' ? 240 : 200

  // Export sizes
  const exportSizes = {
    discord: { width: 600, height: 240 },
    twitter: { width: 1500, height: 500 },
  }

  // Draw banner (for any size, using width and height ratios)
  const drawBanner = (ctx: CanvasRenderingContext2D, width: number, height: number, name: string) => {
    // Ratios for layout
    const cardWidth = width * 0.92;
    const cardHeight = height * 0.27; // ~54px for 200, ~65px for 240
    const cardRadius = height * 0.08;
    const cardX = (width - cardWidth) / 2;
    const cardY = height * 0.12;

    // Background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#23272A';
    ctx.fillRect(0, 0, width, height);

    // Card
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cardX + cardRadius, cardY);
    ctx.lineTo(cardX + cardWidth - cardRadius, cardY);
    ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + cardRadius);
    ctx.lineTo(cardX + cardWidth, cardY + cardHeight - cardRadius);
    ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - cardRadius, cardY + cardHeight);
    ctx.lineTo(cardX + cardRadius, cardY + cardHeight);
    ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - cardRadius);
    ctx.lineTo(cardX, cardY + cardRadius);
    ctx.quadraticCurveTo(cardX, cardY, cardX + cardRadius, cardY);
    ctx.closePath();
    ctx.shadowColor = '#0008';
    ctx.shadowBlur = height * 0.03;
    ctx.fillStyle = '#313338';
    ctx.fill();
    ctx.restore();

    // Plus button
    const plusRadius = cardHeight * 0.28;
    const plusX = cardX + cardHeight * 0.5;
    const plusY = cardY + cardHeight / 2;
    ctx.beginPath();
    ctx.arc(plusX, plusY, plusRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = height * 0.01;
    ctx.strokeStyle = '#e3e5e8';
    ctx.stroke();
    // Plus sign
    ctx.strokeStyle = '#23272A';
    ctx.lineWidth = height * 0.015;
    ctx.beginPath();
    ctx.moveTo(plusX, plusY - plusRadius * 0.7);
    ctx.lineTo(plusX, plusY + plusRadius * 0.7);
    ctx.moveTo(plusX - plusRadius * 0.7, plusY);
    ctx.lineTo(plusX + plusRadius * 0.7, plusY);
    ctx.stroke();

    // Header text
    ctx.font = `500 ${cardHeight * 0.28}px 'gg sans', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif`;
    ctx.fillStyle = '#b9bbbe';
    ctx.textBaseline = 'middle';
    const headerText = 'Message #👁  |  general';
    ctx.fillText(headerText, plusX + plusRadius + cardHeight * 0.3, plusY);

    // Dots and username
    const dotsY = cardY + cardHeight + height * 0.13;
    const dotRadius = height * 0.04;
    const dotSpacing = dotRadius * 1.25;
    const totalDotsWidth = dotRadius * 2 * 3 + dotSpacing * 2;
    const text = `${name} is $TRUSTing...`;
    ctx.font = `500 ${height * 0.11}px 'gg sans', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif`;
    const startX = (width - totalDotsWidth - dotRadius * 3 - ctx.measureText(text).width) / 2;
    const whiteDotIndex = name.length % 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(startX + dotRadius + i * (dotRadius * 2 + dotSpacing), dotsY + dotRadius, dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = i === whiteDotIndex ? '#fff' : '#b9bbbe';
      ctx.fill();
    }
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, startX + totalDotsWidth + dotRadius * 3, dotsY + dotRadius);
  }

  // Redraw preview on state change
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBanner(ctx, previewWidth, previewHeight, username)
  }, [username, bannerType])

  // Download logic
  const handleDownload = () => {
    const { width, height } = bannerType === 'discord' ? exportSizes.discord : exportSizes.twitter
    const offCanvas = document.createElement('canvas')
    offCanvas.width = width
    offCanvas.height = height
    const ctx = offCanvas.getContext('2d')
    if (!ctx) return
    drawBanner(ctx, width, height, username)
    const link = document.createElement('a')
    link.download = `${bannerType}-banner.png`
    link.href = offCanvas.toDataURL('image/png')
    link.click()
  }

  React.useEffect(() => {
    document.title = 'Trust Banner';
  }, []);

  return (
    <div className="banner-generator-container">
      <h1>$TRUST Banner Generator</h1>
      <label>
        Discord Username:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ marginLeft: 8, fontSize: 18 }}
        />
      </label>
      {/* Banner type switch */}
      <div className="banner-type-switch">
        <button
          className={`switch-btn${bannerType === 'discord' ? ' active' : ''}`}
          onClick={() => setBannerType('discord')}
          aria-label="Discord banner"
        >
          {/* Official Discord SVG */}
          <img src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e278299a53f5bf88615e90_Symbol.svg" alt="Discord" style={{ width: 32, height: 32 }} />
        </button>
        <button
          className={`switch-btn${bannerType === 'twitter' ? ' active' : ''}`}
          onClick={() => setBannerType('twitter')}
          aria-label="Twitter banner"
        >
          {/* Official X SVG */}
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill={bannerType === 'twitter' ? '#fff' : '#bbb'} /></g></svg>
        </button>
      </div>
      <div style={{ margin: '24px 0' }}>
        <canvas
          ref={canvasRef}
          width={previewWidth}
          height={previewHeight}
          className="banner-canvas"
          style={{ borderRadius: 16, boxShadow: '0 2px 16px #0004', background: '#23272A' }}
        />
      </div>
      <button onClick={handleDownload} style={{ fontSize: 18, padding: '8px 24px' }}>
        Download Banner
      </button>
      <footer className="trust-footer">
        <a
          href="https://github.com/jeremie-olivier/trust-banner/fork"
          target="_blank"
          rel="noopener noreferrer"
          className="fork-btn"
        >
          ⭐ Fork me
        </a>
        <div className="footer-mention">
          Vibe coded in 10min - Rewarded 1M IQ Points
        </div>
        <div className="footer-dm-quote">
          DM me on Discord if you need help building anything on Intuition
        </div>
      </footer>
    </div>
  )
}

export default App
