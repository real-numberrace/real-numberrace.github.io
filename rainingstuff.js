// that fucking script that i hate, rain script of toggles..! 

(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);
  Object.assign(canvas.style, {
    position: 'fixed', top: 0, left: 0, background: '#000', zIndex: -1, 
    pointerEvents: 'none'
  });
// zIndex does sits behind the screen yes real

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const FONT = '20px "SomeType Mono", "Some Type Mono", monospace'; // font obvious
  const DROP_COUNT = 20; // number drop
  const drops = [];
  const splashes = [];
  let spawning = false;

  
  function makeDrop() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      value: Math.floor(Math.random() * 150) + 1,  // the amount of number min-max
      speed: 0.5 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.05, // rotation after fall
      hue: Math.floor(Math.random() * 360),
      active: true,
      alpha: 1,
    };
  }

  for (let i = 0; i < DROP_COUNT; i++) {
    const d = makeDrop();
    d.active = false; // empty when started (either rain btn is off)
    d.alpha = 0;
    drops.push(d);
  }

  function spawnSplash(x, y, hue) {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      splashes.push({
        x, y,
        vx: Math.cos(angle) * (1 + Math.random() * 2),
        vy: Math.sin(angle) * (1 + Math.random() * 2) - 1, 
        life: 1,
        hue,
      });
    }
  }

  function update() {
    const groundY = canvas.height - 10;

    for (const d of drops) {
      if (!d.active) continue;
      d.y += d.speed;
      d.rotation += d.spin;
      
      if (!spawning) {
        d.alpha -= 0.03;
        if (d.alpha <= 0) {
          d.active = false; continue;
        }
      }

      if (d.y >= groundY) {
        spawnSplash(d.x, groundY, d.hue);
        if (spawning) {
         Object.assign(d, makeDrop(), { y: Math.random() * -100 });
        } else {
          d.active = false;
        }
      }
    }

    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.15; // gravity on splash particles
      s.life -= 0.04;
      if (s.life <= 0) splashes.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const d of drops) {
      if (!d.active) continue;
      ctx.save();
      ctx.globalAlpha = d.alpha
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rotation);
      ctx.fillStyle = `hsl(${d.hue}, 100%, 60%)`;
      ctx.shadowColor = `hsl(${d.hue}, 100%, 60%)`
      ctx.shadowBlur = 8
      ctx.fillText(d.value, 0, 0);
      ctx.restore();
    }

    for (const s of splashes) {
      ctx.strokeStyle = `hsla(${s.hue}, 100%, 60%, ${s.life})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2);
      ctx.stroke();
    }
  }
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }
  loop();
  
  window.toggleRain = (on) => {
    spawning = on;
    if (on) {
      for (const d of drops) if (!d.active) Object.assign(d, makeDrop());
    } 
  }
})();
 
 // Rain button stuff
  const rainBtn = document.getElementById('rainBtn');
   const savedOn = localStorage.getItem('rainOn') === 'true';
   rainBtn.classList.toggle('on', savedOn);
   rainBtn.classList.toggle('off', !savedOn);
   window.toggleRain(savedOn);
   
  rainBtn.addEventListener('click', function () {
   const isOn = this.classList.toggle('on');
   this.classList.toggle('off', !isOn);
   window.toggleRain(isOn);
   localStorage.setItem('rainOn', isOn);
 });