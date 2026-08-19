import { useEffect, useRef, useState } from 'react';

type Props = {
  lines: readonly string[];
  as?: 'h1' | 'h2' | 'p';
  className?: string;
  stagger?: number;
  play?: boolean;
};

export default function MaskedLines({ lines, as = 'h2', className, stagger = 110, play }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const on = play ?? seen;

  useEffect(() => {
    if (play !== undefined || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [play]);

  const Tag = as;

  return (
    <div ref={ref}>
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={line} className={on ? 'mask in' : 'mask'}>
            <span style={{ transitionDelay: `${i * stagger}ms` }}>{line}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}