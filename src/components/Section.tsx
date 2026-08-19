import type { ReactNode, Ref } from 'react';

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  full?: boolean;
  ref?: Ref<HTMLElement>;
};

export default function Section({ id, children, className, full, ref }: Props) {
  return (
    <section
      id={id}
      ref={ref}
      className={[full ? 'sec sec--full' : 'sec', className].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  );
}