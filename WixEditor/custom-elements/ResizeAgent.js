// public/custom-elements/ResizeAgent.js  (or host it and use as URL)
class ResizeAgent extends HTMLElement {
  connectedCallback() {
    console.log("[ResizeAgent] connectedCallback");
    // Find all candidate Wix image wrappers by ID pattern
    const targets = this._findTargets();
    /*
    
    const config = this._readConfig();

    // Initialize each image once it’s in the DOM
    targets.forEach(t => this._prepareImage(t, config[t.id] || {}));

    // Re-apply on viewport resize
    const onWinResize = () => this._applyAll(targets, config);
    window.addEventListener('resize', onWinResize, { passive: true });

    // Also react to layout changes using ResizeObserver
    const ro = new ResizeObserver(() => this._applyAll(targets, config));
    ro.observe(document.documentElement);

    // First run
    this._applyAll(targets, config);
    */
  }

  _findTargets() {
    // Old Wix wraps images in a root DIV with your ID
    // select *by id prefix* (no classes in old Wix)
    console.log("[ResizeAgent] _findTargets");
    const targets = Array.from(document.querySelectorAll('[id^="img_comp"]'));
    // const targets = Array.from(document.querySelectorAll('[id^="H4kRA"]'));
    console.log("[ResizeAgent] _findTargets", targets);
    return targets;
  }
/*
  _readConfig() {
    const cfgEl = document.getElementById('ceResizeConfig');
    if (!cfgEl) return {};
    try {
      // Strip potential <p> wrappers etc.
      const raw = cfgEl.innerText || cfgEl.textContent || '';
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[ResizeAgent] Bad JSON in #ceResizeConfig', e);
      return {};
    }
  }

  _prepareImage(wrapper, opts) {
    // Find the inner <img> tag Wix renders
    const img = wrapper.querySelector('img');
    if (!img) return;

    // When it loads, capture natural ratio and apply size
    img.addEventListener('load', () => {
      if (img.naturalWidth && img.naturalHeight) {
        wrapper.dataset._ratio = (img.naturalHeight / img.naturalWidth).toString();
      }
      this._applyOne(wrapper, opts);
    }, { once: true });

    // Make sure the <img> fills the wrapper box we control
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = (opts.fit === 'cover') ? 'cover' : 'contain';
  }

  _applyAll(targets, cfg) {
    targets.forEach(w => this._applyOne(w, cfg[w.id] || {}));
  }

  _applyOne(wrapper, opts) {
    // Measure the *current* container width this image sits in
    const parent = wrapper.parentElement;
    if (!parent) return;
    const containerW = Math.max(0, parent.clientWidth || 0);

    // Decide width with optional clamps
    let newW = containerW;
    if (typeof opts.maxW === 'number') newW = Math.min(newW, opts.maxW);
    if (typeof opts.minW === 'number') newW = Math.max(newW, opts.minW);

    // Aspect ratio: prefer dynamic from image, else configured, else fallback
    const ratio =
      parseFloat(wrapper.dataset._ratio) ||
      (typeof opts.ratio === 'number' ? opts.ratio : 0.75);

    // Apply size to Wix wrapper div (img inside is 100%/100%)
    wrapper.style.width  = `${newW}px`;
    wrapper.style.height = `${Math.round(newW * ratio)}px`;

    // Optional: debug
    // console.log('[ResizeAgent] sized', wrapper.id, newW, 'ratio', ratio);
  }
  */
}
customElements.define('resize-agent', ResizeAgent);