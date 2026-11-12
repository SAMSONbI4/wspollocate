import test from 'node:test';
import assert from 'node:assert/strict';
import { createPageTransition } from '../src/lib/page-transition.js';

function fixture(options = {}) {
  const animations = [];
  const container = { animate(frames, timing) {
    let resolve, reject;
    const animation = { frames, timing, cancelled: false, finished: new Promise((yes, no) => { resolve = yes; reject = no; }), finish: () => resolve(), cancel() { this.cancelled = true; reject(new Error('cancelled')); } };
    animations.push(animation);
    return animation;
  } };
  return { animations, transition: createPageTransition(container, { reducedMotion: () => false, readStyle: () => ({ opacity: '.4', transform: 'matrix(1, 0, 0, 1, 0, 6)' }), ...options }) };
}
const nextMicrotask = () => Promise.resolve();

test('initial render and reduced motion do not delay or animate navigation', async () => {
  for (const reduced of [false, true]) {
    const { transition, animations } = fixture({ reducedMotion: () => reduced });
    let updates = 0;
    await transition(() => updates++, { initial: !reduced });
    assert.equal(updates, 1);
    assert.equal(animations.length, 0);
  }
});
test('screen changes once after exit and cancels its finished visual effects', async () => {
  const { transition, animations } = fixture();
  let updates = 0;
  const run = transition(() => updates++);
  assert.equal(updates, 0);
  animations[0].finish(); await nextMicrotask();
  assert.equal(updates, 1);
  assert.equal(animations[1].timing.duration, 380);
  animations[1].finish(); await run;
  assert.ok(animations.every(a => a.cancelled));
});
test('rapid navigation renders only the latest requested route', async () => {
  const { transition, animations } = fixture();
  const visited = [];
  const first = transition(() => visited.push('list'));
  const second = transition(() => visited.push('profile'));
  assert.equal(animations[0].cancelled, true);
  animations[1].finish(); await nextMicrotask();
  assert.deepEqual(visited, ['profile']);
  animations[2].finish(); await Promise.all([first, second]);
});
test('interrupted entry continues from the visible opacity without stale commits', async () => {
  const { transition, animations } = fixture();
  const visited = [];
  const first = transition(() => visited.push('form'));
  animations[0].finish(); await nextMicrotask();
  const second = transition(() => visited.push('home'));
  assert.equal(animations[1].cancelled, true);
  assert.deepEqual(animations[2].frames[0], { opacity: '.4', transform: 'matrix(1, 0, 0, 1, 0, 6)' });
  animations[2].finish(); await nextMicrotask();
  animations[3].finish(); await Promise.all([first, second]);
  assert.deepEqual(visited, ['form', 'home']);
});
