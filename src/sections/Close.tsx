import { useState } from 'react';
import type { FormEvent } from 'react';
import Section from '../components/Section';
import { COPY } from '../content/copy';
import { track } from '../lib';

const C = COPY.close;
const ACCESS_KEY = 'PASTE-YOUR-ACCESS-KEY-HERE';
const ENDPOINT = 'https://api.web3forms.com/submit';

type Field = { name: string; label: string; type?: string; span?: 2 | 3; area?: boolean; required?: boolean };

const FIELDS: Field[] = [
  { name: 'Full Name', label: 'Full Name', required: true },
  { name: 'Contact Number', label: 'Contact Number', type: 'tel', required: true },
  { name: 'Alternate Contact Number', label: 'Alternate Contact Number', type: 'tel' },
  { name: 'Email-ID', label: 'Email-ID', type: 'email', required: true },
  { name: 'Business Name', label: 'Business Name', required: true },
  { name: 'Team', label: 'Team' },
  { name: 'Monthly Turnover', label: 'Monthly Turnover' },
  { name: 'Address', label: 'Address', span: 2 },
  { name: 'Major Challenges', label: 'Major Challenges in Business (In Brief)', span: 3, area: true },
];

export default function Close() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('access_key', ACCESS_KEY);
    data.append('subject', `New enquiry — ${data.get('Business Name')}`);
    data.append('from_name', 'DGC website');
    setState('sending');
    track('contact_submit', { where: 'close' });

    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      form.reset();
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <Section id="close" full className="close">
        <h2 className="close__head">{C.head}</h2>
        <div className="close__form close__form--done">
          <p className="close__done">Thanks — we&rsquo;ve got it.</p>
          <p className="soft">Someone from the team will reach out within one working day.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="close" full className="close">
      <h2 className="close__head" data-par="0.35" data-par-plain>{C.head}</h2>

      <form className="close__form" onSubmit={submit} data-par="0.12" data-par-plain>
        {FIELDS.map((f) => (
          <div key={f.name} className={`close__field${f.span ? ` close__field--s${f.span}` : ''}`}>
            <label htmlFor={f.name}>{f.label}</label>
            {f.area ? (
              <textarea id={f.name} name={f.name} rows={4} />
            ) : (
              <input id={f.name} name={f.name} type={f.type || 'text'} required={f.required} />
            )}
          </div>
        ))}

        <input type="checkbox" name="botcheck" className="close__bot" tabIndex={-1} autoComplete="off" />

        <button type="submit" className="cta cta--brand cta--md" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending' : C.cta}<span aria-hidden="true">→</span>
        </button>

        {state === 'error' && (
          <p className="close__error close__field--s3">Something went wrong. Please email {COPY.footer.email}.</p>
        )}
      </form>
    </Section>
  );
}