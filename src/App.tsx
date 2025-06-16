import React, { useRef, useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('Zet 👁')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const bannerWidth = 600
  const bannerHeight = 240

  // Draw banner on canvas
  const drawBanner = (name: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background (main dark area)
    ctx.clearRect(0, 0, bannerWidth, bannerHeight);
    ctx.fillStyle = '#23272A'; // Discord dark background
    ctx.fillRect(0, 0, bannerWidth, bannerHeight);

    // Card-like message block (top bar)
    const topBarHeight = 64;
    const cardMargin = 24;
    const cardRadius = 16;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cardMargin + cardRadius, cardMargin);
    ctx.lineTo(bannerWidth - cardMargin - cardRadius, cardMargin);
    ctx.quadraticCurveTo(bannerWidth - cardMargin, cardMargin, bannerWidth - cardMargin, cardMargin + cardRadius);
    ctx.lineTo(bannerWidth - cardMargin, cardMargin + topBarHeight - cardRadius);
    ctx.quadraticCurveTo(bannerWidth - cardMargin, cardMargin + topBarHeight, bannerWidth - cardMargin - cardRadius, cardMargin + topBarHeight);
    ctx.lineTo(cardMargin + cardRadius, cardMargin + topBarHeight);
    ctx.quadraticCurveTo(cardMargin, cardMargin + topBarHeight, cardMargin, cardMargin + topBarHeight - cardRadius);
    ctx.lineTo(cardMargin, cardMargin + cardRadius);
    ctx.quadraticCurveTo(cardMargin, cardMargin, cardMargin + cardRadius, cardMargin);
    ctx.closePath();
    ctx.shadowColor = '#0008';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#313338';
    ctx.fill();
    ctx.restore();

    // Inverted plus button (light circle, dark plus)
    const plusX = cardMargin + 32;
    const plusY = cardMargin + 20;
    ctx.beginPath();
    ctx.arc(plusX, plusY + 12, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e3e5e8';
    ctx.stroke();
    // Dark plus sign
    ctx.strokeStyle = '#23272A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(plusX, plusY + 4);
    ctx.lineTo(plusX, plusY + 20);
    ctx.moveTo(plusX - 8, plusY + 12);
    ctx.lineTo(plusX + 8, plusY + 12);
    ctx.stroke();

    // Channel header text: Message #👁 | general (on card)
    ctx.font = "500 18px 'gg sans', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif";
    ctx.fillStyle = '#b9bbbe';
    ctx.textBaseline = 'middle';
    const headerText = 'Message #👁  |  general';
    ctx.fillText(headerText, cardMargin + 70, cardMargin + 32);

    // Three dots (one white, others gray), then username/status, all on one line
    const dotsY = cardMargin + topBarHeight + 18; // Move up, closer to card
    const dotRadius = 8;
    const dotSpacing = 10; // Reduced spacing
    const totalDotsWidth = dotRadius * 2 * 3 + dotSpacing * 2;
    const text = `${name} is $TRUSTing...`;
    ctx.font = "500 22px 'gg sans', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif";
    const startX = (bannerWidth - totalDotsWidth - 12 - ctx.measureText(text).width) / 2;
    // Animate white dot based on username length
    const whiteDotIndex = name.length % 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(startX + dotRadius + i * (dotRadius * 2 + dotSpacing), dotsY + dotRadius, dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = i === whiteDotIndex ? '#fff' : '#b9bbbe';
      ctx.fill();
    }
    // Username/status text
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, startX + totalDotsWidth + 12, dotsY + dotRadius);
  }

  // Redraw banner when username changes
  React.useEffect(() => {
    drawBanner(username)
  }, [username])

  // Download as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'discord-banner.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="banner-generator-container">
      <h1>Discord Banner Generator</h1>
      <label>
        Discord Username:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ marginLeft: 8, fontSize: 18 }}
        />
      </label>
      <div style={{ margin: '24px 0' }}>
        <canvas
          ref={canvasRef}
          width={bannerWidth}
          height={bannerHeight}
          style={{ borderRadius: 16, boxShadow: '0 2px 16px #0004', background: '#23272A' }}
        />
      </div>
      <button onClick={handleDownload} style={{ fontSize: 18, padding: '8px 24px' }}>
        Download Banner
      </button>
    </div>
  )
}

export default App
