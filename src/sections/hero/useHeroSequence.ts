import { useEffect, useState } from 'react';

type Stage = 'idle' | 'ask' | 'beat';

const T_ASK = 420;
const T_BEAT = 3400;

export function useHeroSequence(reduced: boolean) {
  const [stage, setStage] = useState<Stage>(() => (reduced ? 'beat' : 'idle'));

  useEffect(() => {
    if (reduced) return;
    const a = window.setTimeout(() => setStage('ask'), T_ASK);
    const b = window.setTimeout(() => setStage('beat'), T_BEAT);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [reduced]);

  return { stage };
}