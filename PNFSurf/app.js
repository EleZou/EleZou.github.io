(() => {
  'use strict';
  const data = window.PNFSURF_DATA;
  const state = {dataset: 'replica', reference: 'PGSR', position: 50};
  const methodOrder = ['PNFSurf-P', 'PNFSurf-A', 'PGSR', '2DGS', 'GOF', 'AmbiSuR'];
  const grid = document.querySelector('#comparison-grid');
  const referenceSelect = document.querySelector('#reference-select');
  const dialog = document.querySelector('#comparison-dialog');
  const sync = document.querySelector('#sync-sliders');
  let renderVersion = 0;
  const dataset = () => data.datasets.find(d => d.id === state.dataset);
  const comparisonScene = d => d.comparisonScene ?? d.scene;
  const available = () => dataset().images;
  const referenceName = () => state.reference;
  const arrows = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M3 12h18"/></svg>';
  const expandIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4M3 3l5 5m9-5-5 5M3 17l5-5m9 5-5-5"/></svg>';
  const loadViewImages = view => view.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    delete img.dataset.src;
  });
  const imageObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      loadViewImages(entry.target);
      imageObserver.unobserve(entry.target);
    });
  }, {rootMargin: '120px'}) : null;

  function selectTab(button) {
    button.parentElement.querySelectorAll('[role="tab"]').forEach(tab => {
      const selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    list.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus(); tabs[next].click();
    });
  });

  function moveDivider(view, value) {
    const position = Math.max(0, Math.min(100, Number(value)));
    view.style.setProperty('--position', `${position}%`);
    const range = view.querySelector('input');
    range.value = position;
    range.setAttribute('aria-valuetext', `${Math.round(position)} percent ${view.dataset.methodLabel}, ${100 - Math.round(position)} percent ${referenceName()}`);
  }
  function updatePosition(view, value) {
    if (sync.checked) {
      state.position = Number(value);
      document.querySelectorAll('.compare-view').forEach(other => moveDivider(other, value));
    } else moveDivider(view, value);
  }

  function createView(method, large = false) {
    const images = available();
    const view = document.createElement('div');
    view.className = 'compare-view';
    view.dataset.methodLabel = method;
    view.dataset.loading = 'true';
    view.dataset.method = method;
    const d = dataset();
    view.style.setProperty('--image-ratio', `${d.width} / ${d.height}`);
    view.innerHTML = `<img class="reference-image" alt="${referenceName()}: ${d.name} ${comparisonScene(d)} mesh" decoding="async" draggable="false">
      <img class="method-image" alt="${method}: ${d.name} ${comparisonScene(d)} mesh" decoding="async" draggable="false">
      <span class="image-label left">${method}</span><span class="image-label right">${referenceName()}</span>
      <span class="compare-divider"><span class="compare-handle">${arrows}</span></span>
      <input class="compare-range" type="range" min="0" max="100" step="1" value="50" aria-label="Compare ${method} with ${referenceName()}, ${d.name} mesh">`;
    let loaded = 0;
    const onLoad = event => {
      loaded += 1;
      if (event.target.classList.contains('method-image')) {
        view.style.setProperty('--image-ratio', `${event.target.naturalWidth} / ${event.target.naturalHeight}`);
        if (large) view.style.width = `min(100%, calc((90dvh - 110px) * ${event.target.naturalWidth / event.target.naturalHeight}))`;
      }
      if (loaded === 2) view.dataset.loading = 'false';
    };
    for (const img of view.querySelectorAll('img')) {
      img.addEventListener('load', onLoad);
      img.addEventListener('error', () => { view.dataset.error = 'true'; view.dataset.loading = 'false'; });
    }
    view.querySelector('.reference-image').dataset.src = images[state.reference];
    view.querySelector('.method-image').dataset.src = images[method];
    if (large || !imageObserver) loadViewImages(view);
    else imageObserver.observe(view);
    const range = view.querySelector('input');
    range.addEventListener('input', () => updatePosition(view, range.value));
    let dragging = false;
    const fromPointer = event => {
      const rect = view.getBoundingClientRect();
      updatePosition(view, Math.round((event.clientX - rect.left) / rect.width * 100));
    };
    range.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      dragging = true; range.focus({preventScroll:true}); range.setPointerCapture(event.pointerId); fromPointer(event);
    });
    range.addEventListener('pointermove', event => { if (dragging) fromPointer(event); });
    const stop = () => { dragging = false; };
    range.addEventListener('pointerup', stop); range.addEventListener('pointercancel', stop); range.addEventListener('lostpointercapture', stop);
    moveDivider(view, state.position);
    return view;
  }

  function enlarge(method, opener) {
    const d = dataset();
    const title = `${d.name} · ${comparisonScene(d)}`;
    document.querySelector('#dialog-title').textContent = title;
    document.querySelector('#dialog-content').replaceChildren(createView(method, true));
    dialog.showModal();
    const restore = () => { document.querySelector('#dialog-content').replaceChildren(); opener.focus(); };
    dialog.addEventListener('close', restore, {once:true});
  }
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });

  function render() {
    imageObserver?.disconnect();
    renderVersion += 1;
    const version = renderVersion;
    const d = dataset(), images = available();
    referenceSelect.replaceChildren();
    for (const method of methodOrder) {
      const option = new Option(method, method);
      option.selected = method === state.reference; referenceSelect.append(option);
    }
    grid.classList.toggle('is-portrait', d.height / d.width > 0.9);
    grid.replaceChildren();
    for (const method of methodOrder) {
      if (!images[method] || method === state.reference) continue;
      const card = document.createElement('article'); card.className = 'compare-card';
      card.innerHTML = `<div class="card-heading"><h3>${method}${method.startsWith('PNFSurf-') ? '<span class="ours-badge">Ours</span>' : ''}</h3><button class="expand-button" type="button" aria-label="Enlarge ${method} comparison">${expandIcon}<span>Enlarge</span></button></div>`;
      card.append(createView(method));
      const button = card.querySelector('button'); button.addEventListener('click', () => enlarge(method, button));
      grid.append(card);
    }
    document.querySelector('#comparison-scene').textContent = comparisonScene(d);
    document.querySelector('#comparison-context').textContent = `${d.name} · Mesh`;
    const note = document.querySelector('#comparison-note');
    note.hidden = !d.imageNote;
    note.textContent = d.imageNote;
    document.querySelector('#comparison-panel').setAttribute('aria-labelledby', `dataset-${d.id}`);
    requestAnimationFrame(() => { if (version === renderVersion) document.querySelector('#comparison-status').textContent = `${d.name}, ${comparisonScene(d)}. Mesh comparisons against ${referenceName()}.`; });
  }
  document.querySelectorAll('[data-dataset]').forEach(button => button.addEventListener('click', () => {
    state.dataset = button.dataset.dataset; selectTab(button); render();
  }));
  referenceSelect.addEventListener('change', () => { state.reference = referenceSelect.value; render(); });
  sync.addEventListener('change', () => { if (sync.checked) document.querySelectorAll('.compare-view').forEach(view => moveDivider(view,state.position)); });

  const demo = document.querySelector('#reconstruction-video');
  if (demo) {
    const play = document.querySelector('#video-play-toggle');
    play.addEventListener('click', () => {
      if (demo.paused) demo.play().catch(() => { play.textContent = 'Retry playback'; });
      else demo.pause();
    });
    demo.addEventListener('play', () => { play.textContent = 'Pause video'; });
    demo.addEventListener('pause', () => { play.textContent = 'Play video'; });
    document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
      if (button.getAttribute('aria-selected') === 'true') return;
      const item = data.reconstructionVideos.find(entry => entry.id === button.dataset.video);
      const resume = !demo.paused;
      demo.pause();
      demo.poster = item.poster;
      demo.src = item.src;
      demo.querySelector('a').href = item.src;
      demo.setAttribute('aria-label', 'PNFSurf reconstruction video on ' + item.dataset + ', ' + item.scene);
      document.querySelector('#video-scene').textContent = item.scene;
      document.querySelector('#video-details').setAttribute('aria-labelledby', button.id);
      selectTab(button);
      if (resume) demo.play().catch(() => { play.textContent = 'Retry playback'; });
    }));
    document.querySelector('#reconstruction-demos').addEventListener('toggle', event => {
      if (!event.currentTarget.open) demo.pause();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) demo.pause(); });
  }

  render();
})();
