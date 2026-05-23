function renderGallery(sections) {
  return sections.map(section => {
    const heading = `<h2 class="h1 gallery-year">${section.years}</h2>`;
    const shots = section.rows.flatMap(row => {
      const span = 6 / row.length;
      return row.map(({ src, caption, link }) => {
        const media = /\.mp4$/i.test(src)
          ? `<video class="shot-img" src="${src}" autoplay muted loop playsinline></video>`
          : `<img class="shot-img" src="${src}" alt="">`;
        let captionHtml = '';
        if (caption) {
          captionHtml += `<span class="shot-caption text-body">${caption}</span>`;
          if (link) {
            captionHtml += `<a class="shot-link text-body" href="${link}">${caption}<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
          }
        }
        const captionBlock = captionHtml ? `<div class="shot-caption-wrap">${captionHtml}</div>` : '';
        return `<div class="shot-wrap col-${span}" data-caption="${(caption || '').replace(/"/g, '&quot;')}" data-link="${(link || '').replace(/"/g, '&quot;')}" data-years="${section.years}">${media}${captionBlock}</div>`;
      });
    }).join('\n');
    return `<div class="portfolio-block">${heading}<div class="shots-grid">${shots}</div></div>`;
  }).join('\n');
}

document.getElementById('gallery').innerHTML = renderGallery(GALLERY);

(function () {
  const lightbox = document.getElementById('shotLightbox');
  const mediaEl = document.getElementById('shotLightboxMedia');
  const captionEl = document.getElementById('shotLightboxCaption');
  const slider = document.getElementById('shotSlider');
  const thumbsContainer = document.getElementById('sliderThumbs');
  const arrowUp = document.getElementById('sliderArrowUp');
  const arrowDown = document.getElementById('sliderArrowDown');
  const wraps = Array.from(document.querySelectorAll('.shot-wrap'));
  let current = -1;
  let savedScrollY = 0;

  let lastYears = '';
  wraps.forEach((wrap, i) => {
    const years = wrap.dataset.years;
    if (years !== lastYears) {
      const label = document.createElement('div');
      label.className = 'shot-slider-year';
      label.textContent = years;
      thumbsContainer.appendChild(label);
      lastYears = years;
    }

    const asset = wrap.querySelector('.shot-img');
    const src = asset.src || asset.currentSrc;
    const isVideo = /\.mp4$/i.test(src);
    const thumb = document.createElement('div');
    thumb.className = 'shot-slider-thumb';
    if (isVideo) {
      const vid = document.createElement('video');
      vid.src = src;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      vid.addEventListener('loadedmetadata', () => { vid.currentTime = 0.001; });
      thumb.appendChild(vid);
    } else {
      thumb.innerHTML = `<img src="${src}" alt="">`;
    }
    thumb.addEventListener('click', e => { e.stopPropagation(); showShot(i); });
    thumbsContainer.appendChild(thumb);
  });

  const thumbEls = Array.from(thumbsContainer.querySelectorAll('.shot-slider-thumb'));

  function updateThumbs() {
    thumbEls.forEach((el, i) => el.classList.toggle('active', i === current));
    const active = thumbEls[current];
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function showShot(index) {
    const isFirstOpen = !lightbox.classList.contains('visible');
    if (isFirstOpen) {
      savedScrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
    }
    current = (index + wraps.length) % wraps.length;
    const wrap = wraps[current];
    const asset = wrap.querySelector('.shot-img');
    const src = asset.src || asset.currentSrc;
    const isVideo = /\.mp4$/i.test(src);
    mediaEl.innerHTML = isVideo
      ? `<video src="${src}" autoplay muted loop playsinline></video>`
      : `<img src="${src}" alt="">`;

    const caption = wrap.dataset.caption;
    captionEl.textContent = caption || '';
    captionEl.style.display = caption ? '' : 'none';

    lightbox.offsetHeight;
    lightbox.classList.add('visible');
    updateThumbs();
  }

  function close() {
    lightbox.classList.remove('visible');
    current = -1;
    document.body.style.overflow = '';
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    setTimeout(() => { mediaEl.innerHTML = ''; captionEl.textContent = ''; }, 200);
  }

  lightbox.addEventListener('click', close);
  slider.addEventListener('click', e => e.stopPropagation());

  arrowUp.addEventListener('click', e => { e.stopPropagation(); if (current > -1) showShot(current - 1); });
  arrowDown.addEventListener('click', e => { e.stopPropagation(); if (current > -1) showShot(current + 1); });

  wraps.forEach((el, i) => {
    el.addEventListener('click', () => {
      if (window.innerWidth >= 768) showShot(i);
    });
  });

  // Custom scrollbar
  const scrollbar = document.getElementById('sliderScrollbar');
  const scrollbarThumb = document.getElementById('sliderScrollbarThumb');

  function updateScrollbar() {
    const el = thumbsContainer;
    const scrollH = el.scrollHeight;
    const clientH = el.clientHeight;
    if (scrollH <= clientH) {
      scrollbar.style.display = 'none';
      return;
    }
    scrollbar.style.display = '';
    const trackH = scrollbar.clientHeight;
    const ratio = clientH / scrollH;
    const thumbH = Math.max(ratio * trackH, 20);
    const maxScroll = scrollH - clientH;
    const scrollRatio = el.scrollTop / maxScroll;
    const thumbTop = scrollRatio * (trackH - thumbH);
    scrollbarThumb.style.height = thumbH + 'px';
    scrollbarThumb.style.top = thumbTop + 'px';
  }

  thumbsContainer.addEventListener('scroll', updateScrollbar);
  new ResizeObserver(updateScrollbar).observe(thumbsContainer);

  // Draggable scrollbar
  let dragging = false;
  let dragStartY = 0;
  let dragStartScroll = 0;

  scrollbar.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    scrollbar.classList.add('dragging');
    dragStartY = e.clientY;
    dragStartScroll = thumbsContainer.scrollTop;
    document.body.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const el = thumbsContainer;
    const trackH = scrollbar.clientHeight;
    const ratio = el.clientHeight / el.scrollHeight;
    const thumbH = Math.max(ratio * trackH, 20);
    const maxThumbTop = trackH - thumbH;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const dy = e.clientY - dragStartY;
    const scrollDelta = (dy / maxThumbTop) * maxScroll;
    el.scrollTop = dragStartScroll + scrollDelta;
  });

  window.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      scrollbar.classList.remove('dragging');
      document.body.style.cursor = '';
    }
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('visible')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); showShot(current + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); showShot(current - 1); }
    else if (e.key === 'Escape') close();
  });
}());
