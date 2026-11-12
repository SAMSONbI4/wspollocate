// Keep only the latest navigation. Cancelling never leaves inline opacity behind.
export function createPageTransition(container, {
  reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  readStyle = () => getComputedStyle(container),
} = {}) {
  let revision = 0;
  let animation = null;
  return async function transition(update, { initial = false } = {}) {
    const current = ++revision;
    const style = animation ? readStyle() : null;
    const from = { opacity: style?.opacity ?? 1, transform: style?.transform ?? 'translateY(0)' };
    animation?.cancel();
    animation = null;
    if (initial || reducedMotion() || !container.animate) { update(); return; }

    const outgoing = container.animate([from, { opacity: 0, transform: 'translateY(-8px)' }], {
      duration: 120, easing: 'ease-out', fill: 'forwards',
    });
    animation = outgoing;
    try { await outgoing.finished; } catch { /* A newer route can cancel this one. */ }
    if (current !== revision) return;
    outgoing.cancel();
    animation = null;
    update();
    if (reducedMotion()) return;

    const incoming = container.animate([
      { opacity: 0, transform: 'translateY(18px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 380, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' });
    animation = incoming;
    try { await incoming.finished; } catch { /* Superseded by another navigation. */ }
    if (current !== revision) return;
    incoming.cancel();
    animation = null;
  };
}
