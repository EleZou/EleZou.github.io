(() => {
  'use strict';

  document.querySelectorAll('[data-showcase-tabs]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach((item, i) => {
          const active = i === index;
          item.setAttribute('aria-selected', String(active));
          item.tabIndex = active ? 0 : -1;
          panels[i].hidden = !active;
        });
      });
    });
  });
})();
