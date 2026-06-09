// public/custom-elements/SizeDetector.js
class SizeDetector extends HTMLElement {
  connectedCallback() {
    console.log('[SizeDetector] connected');

    const fire = () => {
      const detail = { w: window.innerWidth, h: window.innerHeight };
      // CRITICAL: bubbles + composed so Velo can catch it
      this.dispatchEvent(new CustomEvent('changed', {
        detail,
        bubbles: true,
        composed: true
      }));
    };

    fire(); // emit once on load
    window.addEventListener('resize', fire, { passive: true });
  }
}
customElements.define('resize-custom-element', SizeDetector);
