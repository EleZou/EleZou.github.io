(() => {
  'use strict';
  const data = window.VisPNF_DATA;
  const state = {dataset: 'replica', modality: 'mesh', reference: 'GT', position: 50};
  const methodOrder = ['VisPNF', 'PGSR', '2DGS', 'AmbiSuR'];
  const modalityLabels = {mesh: 'Mesh', rgb: 'RGB', depth: 'Depth', normal: 'Normal'};
  const grid = document.querySelector('#comparison-grid');
  const referenceSelect = document.querySelector('#reference-select');
  const dialog = document.querySelector('#comparison-dialog');
  const sync = document.querySelector('#sync-sliders');
  let renderVersion = 0;
  const dataset = () => data.datasets.find(d => d.id === state.dataset);
  const available = () => dataset().images[state.modality];
  const name = method => method === 'VisPNF' ? 'VisPNF (Ours)' : method === 'GT' ? 'Ground truth' : method;
  const referenceName = () => state.reference === 'GT' && state.modality === 'normal' ? 'GT depth-derived normal' : name(state.reference);
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
    view.dataset.methodLabel = name(method);
    view.dataset.loading = 'true';
    view.dataset.method = method;
    const isPortrait = state.dataset === 'mushroom' && state.modality !== 'mesh';
    view.style.setProperty('--image-ratio', isPortrait ? '738 / 994' : '16 / 9');
    view.innerHTML = `<img class="reference-image" alt="${referenceName()}: ${dataset().name} ${dataset().scene}, ${modalityLabels[state.modality]}" decoding="async" draggable="false">
      <img class="method-image" alt="${name(method)}: ${dataset().name} ${dataset().scene}, ${modalityLabels[state.modality]}" decoding="async" draggable="false">
      <span class="image-label left">${name(method)}</span><span class="image-label right">${state.reference === 'GT' ? 'GT' : name(state.reference)}</span>
      <span class="compare-divider"><span class="compare-handle">${arrows}</span></span>
      <input class="compare-range" type="range" min="0" max="100" step="1" value="50" aria-label="Compare ${name(method)} with ${referenceName()}, ${dataset().name} ${modalityLabels[state.modality]}">`;
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
    const title = `${dataset().name} · ${dataset().scene} · ${modalityLabels[state.modality]}`;
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
    if (!images[state.reference]) state.reference = images.GT ? 'GT' : 'VisPNF';
    referenceSelect.replaceChildren();
    for (const method of ['GT', ...methodOrder]) {
      if (!images[method]) continue;
      const option = new Option(method === 'GT' && state.modality === 'normal' ? 'GT (depth-derived)' : name(method), method);
      option.selected = method === state.reference; referenceSelect.append(option);
    }
    grid.classList.toggle('is-portrait', d.id === 'mushroom' && state.modality !== 'mesh');
    grid.replaceChildren();
    for (const method of methodOrder) {
      if (method === state.reference) continue;
      const card = document.createElement('article'); card.className = 'compare-card';
      card.innerHTML = `<div class="card-heading"><h3>${method}${method === 'VisPNF' ? '<span class="ours-badge">Ours</span>' : ''}</h3><button class="expand-button" type="button" aria-label="Enlarge ${method} comparison">${expandIcon}<span>Enlarge</span></button></div>`;
      card.append(createView(method));
      const button = card.querySelector('button'); button.addEventListener('click', () => enlarge(method, button));
      grid.append(card);
    }
    document.querySelector('#comparison-scene').textContent = d.scene;
    document.querySelector('#comparison-context').textContent = `${d.name} · ${modalityLabels[state.modality]}`;
    let note;
    if (state.modality === 'mesh') note = 'Reconstructed surfaces and the reference mesh, using the supplied mesh captures. Drag left or right to reveal either surface.';
    if (state.modality === 'rgb') note = `Matched RGB test view (${d.view}). All methods use the same camera view.`;
    if (state.modality === 'depth') note = 'Depth colors show relative structure with per-image normalization, not a shared metric distance scale.';
    if (state.modality === 'normal') note = 'Normal colors encode camera-space orientation. 2DGS normals are derived from its exported depth.';
    if (state.modality === 'normal' && d.id === 'mushroom') note += ' The reference normal is derived from captured GT depth; it is not a native normal measurement.';
    if (['normal','depth'].includes(state.modality) && !images.GT) note += ' GT maps are not available for this scene; compare the methods directly.';
    document.querySelector('#comparison-note').textContent = note;
    document.querySelector('#comparison-panel').setAttribute('aria-labelledby', `dataset-${d.id}`);
    document.querySelector('#comparison-content').setAttribute('aria-labelledby', `modality-${state.modality}`);
    requestAnimationFrame(() => { if (version === renderVersion) document.querySelector('#comparison-status').textContent = `${d.name}, ${d.scene}. ${modalityLabels[state.modality]} comparisons against ${referenceName()}.`; });
  }
  document.querySelectorAll('[data-dataset]').forEach(button => button.addEventListener('click', () => {
    state.dataset = button.dataset.dataset; selectTab(button); state.reference = available().GT ? 'GT' : 'VisPNF'; render();
  }));
  document.querySelectorAll('[data-modality]').forEach(button => button.addEventListener('click', () => {
    state.modality = button.dataset.modality; selectTab(button); state.reference = available().GT ? 'GT' : 'VisPNF'; render();
  }));
  referenceSelect.addEventListener('change', () => { state.reference = referenceSelect.value; render(); });
  sync.addEventListener('change', () => { if (sync.checked) document.querySelectorAll('.compare-view').forEach(view => moveDivider(view,state.position)); });

  const video = document.querySelector('#reconstruction-video');
  const playToggle = document.querySelector('#video-play-toggle');
  playToggle.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => { playToggle.textContent = 'Retry playback'; });
    else video.pause();
  });
  video.addEventListener('play', () => { playToggle.textContent = 'Pause video'; });
  video.addEventListener('pause', () => { playToggle.textContent = 'Play video'; });
  document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-selected') === 'true') return;
    const v = data.videos.find(item => item.id === button.dataset.video);
    const wasPlaying = !video.paused;
    video.pause(); video.poster = v.poster; video.src = v.src; video.load();
    video.setAttribute('aria-label', `VisPNF reconstruction video on ${v.dataset}, ${v.scene}`);
    document.querySelector('#video-scene').textContent = v.scene;
    document.querySelector('#video-details').setAttribute('aria-labelledby', button.id);
    selectTab(button);
    if (wasPlaying) video.play().catch(() => {});
  }));
  const videoObserver = new IntersectionObserver(entries => { if (!entries[0].isIntersecting && !video.paused) video.pause(); }, {threshold:0.05});
  videoObserver.observe(video);
  document.addEventListener('visibilitychange', () => { if (document.hidden && !video.paused) video.pause(); });
  render();
})();
