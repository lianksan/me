const ARROW_SVG = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1 9M9 1V6.6M9 1H3.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function renderShots(shots, layout) {
  const cls = `pcard__shots pcard__shots--${layout.toLowerCase()}`;
  const imgs = shots
    .map((src, i) => `<img class="shot shot--${i + 1}" src="${src}" alt="screenshot">`)
    .join('\n      ');
  return `<div class="${cls}">\n      ${imgs}\n    </div>`;
}

function renderCard(p) {
  const iconInner = p.icon
    ? `<img src="${p.icon}" alt="${p.name} icon">`
    : '';
  const extraClass = p.section === 'web' ? ' pcard--web' : '';
  // iOS layouts A and B: screenshots first, then icon/text
  const shotsFirst = p.section === 'ios' && (p.layout === 'A' || p.layout === 'B');

  const top = `<div class="pcard__top">
      <div class="pcard__icon">${iconInner}</div>
      <div class="pcard__text">
        <div class="pcard__name h3">${p.name} ${ARROW_SVG}</div>
        <div class="pcard__desc body-text">${p.desc}</div>
      </div>
    </div>`;
  const shots = renderShots(p.shots, p.layout);

  return `<a href="${p.url}" target="_blank" class="pcard${extraClass}">
    ${shotsFirst ? shots + '\n    ' + top : top + '\n    ' + shots}
  </a>`;
}

document.querySelectorAll('.products-grid[data-section]').forEach(grid => {
  const section = grid.dataset.section;
  const cards = PRODUCTS
    .filter(p => p.section === section)
    .map(renderCard)
    .join('\n');
  grid.innerHTML = cards;
});
