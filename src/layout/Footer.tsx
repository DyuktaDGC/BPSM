import { COPY } from '../content/copy';
import logo from '../../assets/logo.svg';

const { phone, address, rights } = COPY.footer;

export default function Footer({ home = '#hero' }: { home?: string }) {
  return (
    <footer className="footer">
      <a className="footer__brand" href={home} aria-label="DGC — home">
        <img className="footer__badge" src={logo} alt="" width={48} height={50} />
        <span className="footer__wordmark">DGC</span>
      </a>

      <div className="footer__row">
        <ul className="footer__contact">
          <li>
            <PhoneIcon />
            <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
          </li>
          <li>
            <PinIcon />
            <span>{address}</span>
          </li>
        </ul>

        <p className="footer__rights">{rights}</p>
      </div>
    </footer>
  );
}

const icon = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function PhoneIcon() {
  return (
    <svg className="footer__icon" {...icon}>
      <path d="M6.3 2.9 7.7 6a1.3 1.3 0 0 1-.3 1.5l-1 .9a9.6 9.6 0 0 0 4.2 4.2l.9-1a1.3 1.3 0 0 1 1.5-.3l3.1 1.4a1.3 1.3 0 0 1 .7 1.5l-.4 1.7a1.4 1.4 0 0 1-1.5 1.1A13.9 13.9 0 0 1 2.3 4.1 1.4 1.4 0 0 1 3.4 2.6l1.7-.4a1.3 1.3 0 0 1 1.2.7z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="footer__icon" {...icon}>
      <path d="M16 8.5c0 4.2-4.6 8.2-5.5 8.9a.8.8 0 0 1-1 0C8.6 16.7 4 12.7 4 8.5a6 6 0 0 1 12 0z" />
      <circle cx="10" cy="8.4" r="2.2" />
    </svg>
  );
}