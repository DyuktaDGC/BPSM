/** A one-shot burst at the finish flag. Deliberately hand-rolled rather than a
 *  library: it is 40 divs on the Web Animations API, so it runs off the main
 *  thread, needs no canvas sitting over the road, and costs nothing until the
 *  walker actually gets there. */

const COUNT = 44;
const SPREAD = 150;      // degrees of the cone, centred straight up
const SPEED = [220, 620] as const;
const GRAVITY = 900;     // px the fall adds on top of the launch arc
const LIFE = [1100, 1900] as const;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function burst(origin: HTMLElement, colors: readonly string[]) {
  const stage = origin.parentElement;
  if (!stage || typeof origin.animate !== 'function') return;

  const box = document.createElement('div');
  box.className = 'confetti';
  box.setAttribute('aria-hidden', 'true');
  box.style.left = origin.style.left || '0px';
  box.style.top = origin.style.top || '0px';
  stage.appendChild(box);

  let alive = COUNT;
  const done = () => {
    if (--alive <= 0) box.remove();
  };

  for (let i = 0; i < COUNT; i++) {
    const bit = document.createElement('i');
    const wide = Math.random() < 0.4;
    bit.style.background = colors[i % colors.length] ?? '#d8412f';
    bit.style.width = `${wide ? rand(7, 11) : rand(4, 6)}px`;
    bit.style.height = `${wide ? rand(4, 6) : rand(9, 14)}px`;
    if (Math.random() < 0.25) bit.style.borderRadius = '50%';
    box.appendChild(bit);

    // Straight up is -90deg; the cone opens symmetrically either side of it so
    // the burst reads as launched from the flag, not sprayed sideways.
    const angle = (-90 + rand(-SPREAD / 2, SPREAD / 2)) * (Math.PI / 180);
    const speed = rand(SPEED[0], SPEED[1]);
    const life = rand(LIFE[0], LIFE[1]);
    const t = life / 1000;

    const dx = Math.cos(angle) * speed * t;
    const peakY = Math.sin(angle) * speed * t * 0.55;
    const endY = Math.sin(angle) * speed * t + GRAVITY * t * t * 0.5;
    const spin = rand(-900, 900);

    bit
      .animate(
        [
          { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
          {
            transform: `translate3d(${dx * 0.55}px, ${peakY}px, 0) rotate(${spin * 0.5}deg)`,
            opacity: 1,
            offset: 0.45,
          },
          {
            transform: `translate3d(${dx}px, ${endY}px, 0) rotate(${spin}deg)`,
            opacity: 0,
          },
        ],
        { duration: life, easing: 'cubic-bezier(0.2, 0.7, 0.35, 1)', fill: 'forwards' },
      )
      .addEventListener('finish', done);
  }
}
