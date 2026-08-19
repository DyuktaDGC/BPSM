import Cta from '../../components/Cta';
import Nav from '../../components/Nav';
import Footer from '../../layout/Footer';
import { COPY } from '../../content/copy';
import { DEMOS } from '../../content/demos';
import DemoCard from './DemoCard';

const C = COPY.demos;

export default function Demos() {
  return (
    <>
      <Nav base="/" />

      <main className="demos">
        <div className="demos__intro">
          <div>
            <p className="demos__kicker mono soft">{C.kicker}</p>
            <h1 className="demos__head">
              {C.head.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
          </div>

          <div className="demos__aside">
            <p className="demos__sub soft">{C.sub}</p>
          </div>
        </div>

        <hr className="demos__rule" />

        <div className="demos__grid">
          {DEMOS.map((d) => (
            <DemoCard key={d.slug} demo={d} />
          ))}
        </div>

        <div className="demos__back">
          <Cta label={C.back} href="/" where="demos:back" size="sm" arrow="→" tone="ink" />
        </div>
      </main>

      <Footer home="/" />
    </>
  );
}