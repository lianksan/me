(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const wrap = document.getElementById('gameWrap');

  const CH = 240;
  const GROUND = 196;
  const BUSH_X = 80;
  const BUSH_R = 22;
  const GRAVITY = 0.62;
  const JUMP_VY = -12.5;

  let CW = 0;
  const DPR = window.devicePixelRatio || 1;

  let state = 'idle'; // idle | run | dead
  let frame = 0, score = 0;
  let hiScore = +localStorage.getItem('dsbHi') || 0;

  let bY = GROUND - BUSH_R, bVY = 0, bGround = true, bRot = 0;
  let cacti = [], cTimer = 0, cNext = 80;
  let deadTimer = 0, idleT = 0;

  function speed() { return 5.5 + Math.min(frame / 500, 7); }

  function resize() {
    CW = wrap.clientWidth;
    canvas.width = CW * DPR;
    canvas.height = CH * DPR;
    canvas.style.width = CW + 'px';
    canvas.style.height = CH + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  const ballImg = new Image();
  ballImg.src = 'assets/empty-ball.svg';

  function cssVar(v) {
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  }
  function dark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function reset() {
    state = 'run';
    frame = 0; score = 0; deadTimer = 0;
    cacti = []; cTimer = 0; cNext = 80;
    bY = GROUND - BUSH_R; bVY = 0; bGround = true; bRot = 0;
  }

  function jump() {
    if (state === 'idle') { reset(); return; }
    if (state === 'dead' && deadTimer > 25) { reset(); return; }
    if (state === 'run' && bGround) { bVY = JUMP_VY; bGround = false; }
  }

  function spawnCactus() {
    const h = [48, 58, 68, 78][Math.floor(Math.random() * 4)];
    cacti.push({ x: CW + 30, h });
    cNext = Math.max(35, 55 + Math.random() * 55 - speed() * 2.5);
  }

  function fRR(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }

  function drawBush(cx, cy) {
    const R = BUSH_R;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(bRot);
    if (state === 'dead') ctx.globalAlpha = 0.5;
    ctx.drawImage(ballImg, -R, -R, R * 2, R * 2);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawCactus(cx, h) {
    ctx.fillStyle = dark() ? '#7A9C58' : '#698A48';
    const BW = 13, GY = GROUND, top = GY - h, bx = cx - BW / 2;

    fRR(bx, top, BW, h, 4);

    const aY = top + h * .28, aLen = 18, aW = 9, aUpH = 16;
    fRR(bx - aLen, aY, aLen, aW, 3);
    fRR(bx - aLen, aY - aUpH, aW, aUpH + aW, 3);

    const aY2 = top + h * .44;
    fRR(bx + BW, aY2, aLen, aW, 3);
    fRR(bx + BW + aLen - aW, aY2 - aUpH * .7, aW, aUpH * .7 + aW, 3);
  }

  function collides() {
    const m = 5, BW = 13;
    const bL = BUSH_X - BUSH_R * .68 + m;
    const bR = BUSH_X + BUSH_R * .68 - m;
    const bB = bY + BUSH_R * .5;
    for (const c of cacti) {
      if (bR > c.x - BW / 2 + 2 && bL < c.x + BW / 2 - 2 && bB > GROUND - c.h + 2) return true;
    }
    return false;
  }

  function centeredText(text, y, size, alpha, weight) {
    ctx.fillStyle = cssVar('--text');
    ctx.globalAlpha = alpha;
    ctx.font = `${weight} ${size}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text, CW / 2, y);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  function tick() {
    if (state === 'idle') {
      idleT++;
      bRot = Math.sin(idleT * 0.045) * 0.1;
    }

    if (state === 'run') {
      frame++; score = frame / 6;
      const spd = speed();

      if (!bGround) {
        bVY += GRAVITY; bY += bVY;
        if (bY + BUSH_R >= GROUND) { bY = GROUND - BUSH_R; bVY = 0; bGround = true; }
      }
      bRot += spd * 0.042;

      cTimer++;
      if (cTimer >= cNext) { spawnCactus(); cTimer = 0; }
      for (const c of cacti) c.x -= spd;
      cacti = cacti.filter(c => c.x > -50);

      if (collides()) {
        state = 'dead'; deadTimer = 0;
        if (Math.floor(score) > hiScore) {
          hiScore = Math.floor(score);
          localStorage.setItem('dsbHi', hiScore);
        }
      }
    }

    if (state === 'dead') deadTimer++;

    let ox = 0, oy = 0;
    if (state === 'dead' && deadTimer < 14) {
      ox = (Math.random() - .5) * 6;
      oy = (Math.random() - .5) * 4;
    }

    ctx.clearRect(0, 0, CW, CH);
    ctx.save();
    ctx.translate(ox, oy);

    ctx.fillStyle = cssVar('--surface-2');
    ctx.fillRect(0, GROUND, CW, 1.5);

    for (const c of cacti) drawCactus(c.x, c.h);
    drawBush(BUSH_X, bY);

    if (state !== 'idle') {
      ctx.fillStyle = cssVar('--text');
      ctx.globalAlpha = 0.4;
      ctx.font = `500 13px 'Inter', sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(
        `HI ${String(hiScore).padStart(5, '0')}  ${String(Math.floor(score)).padStart(5, '0')}`,
        CW - 20, 28
      );
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    }

    if (state === 'idle') {
      centeredText('Space or tap to start', CH / 2 + 6, 14, 0.5, '400');
    } else if (state === 'dead') {
      centeredText('GAME OVER', CH / 2 - 10, 15, 1, '600');
      if (deadTimer > 25) centeredText('Space or tap to restart', CH / 2 + 14, 13, 0.45, '400');
    }

    ctx.restore();
    requestAnimationFrame(tick);
  }

  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
  });
  canvas.addEventListener('click', jump);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); jump(); }, { passive: false });
  window.addEventListener('resize', resize);

  resize();
  requestAnimationFrame(tick);
})();
