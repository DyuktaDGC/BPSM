import { useState } from 'react';

const SLOTS = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5'] as const;
const FRONT = 0;

const ring = (count: number) =>
  Array.from({ length: count }, (_, i) => (i + FRONT) % count);

export function useCarouselOrder(count: number) {
  const [order, setOrder] = useState<number[]>(() => ring(count));

  const slotOf = (index: number) => SLOTS[order.indexOf(index)] ?? '';

  const cycle = (dir: 1 | -1) => {
    setOrder((prev) =>
      dir > 0 ? [...prev.slice(1), prev[0]] : [prev[prev.length - 1], ...prev.slice(0, -1)],
    );
  };

  const goTo = (target: number) => {
    setOrder((prev) => {
      const next = [...prev];
      let guard = 0;
      while (next[0] !== target && guard++ < count) next.push(next.shift() as number);
      return next;
    });
  };

  return { front: order[0], slotOf, cycle, goTo };
}