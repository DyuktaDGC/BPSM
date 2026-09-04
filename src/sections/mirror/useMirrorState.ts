import { useState } from 'react';
import { SYMPTOMS } from '../../content/symptoms';
import { track } from '../../lib';

export function useMirrorState() {
  const [picked, setPicked] = useState<ReadonlySet<number>>(new Set());

  const toggle = (i: number) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      track('symptom_toggle', { fn: SYMPTOMS[i].fn, on: next.has(i), total: next.size });
      return next;
    });
  };

  return { picked, toggle };
}