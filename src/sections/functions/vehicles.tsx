import type { Vehicle } from './vehicleList';

const spokes = (cx: number, cy: number, r: number, cls: string) =>
  [0, 45, 90, 135].map((a) => {
    const t = (a * Math.PI) / 180;
    return (
      <line
        key={a}
        className={cls}
        x1={cx - Math.cos(t) * r}
        y1={cy - Math.sin(t) * r}
        x2={cx + Math.cos(t) * r}
        y2={cy + Math.sin(t) * r}
      />
    );
  });

const wheel = (cx: number, cy: number, r: number) => (
  <>
    <circle className="d2" cx={cx} cy={cy} r={r} />
    <g className="spin">
      <circle className="pp" cx={cx} cy={cy} r={r * 0.56} />
      {[0, 72, 144, 216, 288].map((a) => {
        const t = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            className="sk"
            x1={cx + Math.cos(t) * r * 0.16}
            y1={cy + Math.sin(t) * r * 0.16}
            x2={cx + Math.cos(t) * r * 0.53}
            y2={cy + Math.sin(t) * r * 0.53}
            strokeWidth={r * 0.18}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.2} />
    </g>
  </>
);

export function Walk() {
  return (
    <svg viewBox="0 0 68 116" width="68" height="116">
      <g className="walker__side">
        <g className="walker__torso">
          <g className="walker__limb walker__arm-back" data-limb="armB">
            <line x1="43" y1="54" x2="56" y2="78" strokeWidth="13" />
          </g>
          <g className="walker__limb walker__leg-back" data-limb="legB">
            <line x1="34" y1="80" x2="46" y2="110" strokeWidth="15" />
          </g>
          <g className="walker__limb walker__leg-front" data-limb="legA">
            <line x1="32" y1="80" x2="24" y2="110" strokeWidth="15" />
          </g>
          <rect className="walker__body" x="15" y="42" width="38" height="38" rx="13" />
          <circle className="walker__head" cx="33" cy="18" r="17" />
          <g className="walker__limb walker__arm-front" data-limb="armA">
            <line x1="23" y1="51" x2="47" y2="77" strokeWidth="15" />
          </g>
        </g>
      </g>
      <g className="walker__front">
        <g className="walker__torso">
          <g className="walker__limb walker__leg-back" data-limb="legFrontR">
            <line x1="42" y1="80" x2="43" y2="110" strokeWidth="14" />
          </g>
          <g className="walker__limb walker__leg-front" data-limb="legFrontL">
            <line x1="26" y1="80" x2="25" y2="110" strokeWidth="14" />
          </g>
          <g className="walker__limb walker__arm-back" data-limb="armRest">
            <line x1="21" y1="52" x2="13" y2="74" strokeWidth="13" />
          </g>
          <rect className="walker__body" x="15" y="42" width="38" height="38" rx="13" />
          <circle className="walker__head" cx="34" cy="18" r="17" />
          <g className="walker__limb walker__arm-front" data-limb="armWave">
            <line x1="47" y1="52" x2="60" y2="28" strokeWidth="13" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function Bike() {
  return (
    <svg viewBox="0 0 124 102" width="124" height="102">
      <g className="d1">
        <circle className="rim" cx="24" cy="78" r="23" />
        <g className="spin">{spokes(24, 78, 23, 'sp')}</g>
        <circle className="rim" cx="100" cy="78" r="23" />
        <g className="spin">{spokes(100, 78, 23, 'sp')}</g>
      </g>
      <g className="frame">
        <line x1="24" y1="78" x2="46" y2="46" />
        <line x1="46" y1="46" x2="84" y2="44" />
        <line x1="84" y1="44" x2="100" y2="78" />
        <line x1="24" y1="78" x2="62" y2="78" />
        <line x1="62" y1="78" x2="46" y2="46" />
        <line x1="62" y1="78" x2="84" y2="44" />
        <line x1="84" y1="44" x2="96" y2="34" />
      </g>
      <g className="pedal">
        <circle className="d2" cx="62" cy="78" r="7" />
      </g>
      <g className="d1 leg" data-limb="legA">
        <line x1="54" y1="46" x2="58" y2="76" strokeWidth="11" />
      </g>
      <g className="d2 leg" data-limb="legB">
        <line x1="54" y1="46" x2="68" y2="76" strokeWidth="11" />
      </g>
      <line x1="52" y1="44" x2="74" y2="26" strokeWidth="22" />
      <circle cx="85" cy="17" r="13" />
      <g className="d1">
        <line x1="74" y1="28" x2="94" y2="34" strokeWidth="8" />
      </g>
    </svg>
  );
}

function Moto() {
  return (
    <svg viewBox="0 0 138 102" width="138" height="102">
      {wheel(26, 76, 25)}
      {wheel(112, 76, 25)}
      <path className="d2" d="M 8 60 L 34 58 L 40 68 L 12 70 Z" />
      <path d="M 34 60 L 56 48 L 80 38 L 100 42 L 112 58 L 102 66 L 58 68 Z" />
      <path className="d1" d="M 52 50 L 78 40 L 84 48 L 56 58 Z" />
      <g className="frame">
        <line x1="100" y1="44" x2="116" y2="34" />
      </g>
      <g className="d2">
        <line x1="66" y1="48" x2="74" y2="74" strokeWidth="12" />
      </g>
      <line x1="64" y1="46" x2="88" y2="30" strokeWidth="23" />
      <circle cx="99" cy="20" r="14" />
      <circle className="pp" cx="107" cy="20" r="5" />
      <g className="d1">
        <line x1="88" y1="32" x2="110" y2="42" strokeWidth="9" />
      </g>
    </svg>
  );
}

/** A wheel drawn the way the reference silhouette reads it: tyre in the body
 *  colour, a paper ring, a solid hub. The valve dot is the only asymmetric
 *  mark, which is what makes the spin legible without drawing spokes. */
const disc = (cx: number, cy: number, r: number) => (
  <>
    <circle cx={cx} cy={cy} r={r} />
    <circle className="pp" cx={cx} cy={cy} r={r * 0.6} />
    <g className="spin">
      <circle cx={cx} cy={cy} r={r * 0.38} />
      <circle className="pp" cx={cx} cy={cy - r * 0.22} r={r * 0.07} />
    </g>
  </>
);

/** Nose to the right, contact patch exactly on the bottom edge of the viewBox.
 *  Every vehicle is anchored at `bottom: 0`, so a tyre that stops short of the
 *  edge is a car hovering over the road. */
function Car() {
  return (
    <svg viewBox="0 0 200 92" width="200" height="92">
      <path d="
        M 6 73
        L 6 57
        Q 6 49 17 46
        L 45 40
        Q 57 23 81 18
        L 113 17
        Q 129 18 140 28
        L 167 43
        L 187 46
        Q 197 49 197 60
        L 197 73
        Z
      " />

      {/* Greenhouse: two panes with a B-pillar of body colour between them. */}
      <path className="pp" d="M 61 38 L 77 24 Q 85 21 95 21 L 95 38 Z" />
      <path className="pp" d="M 102 21 L 120 22 Q 128 23 134 30 L 141 38 L 102 38 Z" />

      <rect className="pp" x="185" y="53" width="11" height="7" rx="3" />
      <rect className="d2" x="6" y="52" width="8" height="7" rx="3" />

      {disc(50, 73, 19)}
      {disc(152, 73, 19)}
    </svg>
  );
}

function F1() {
  return (
    <svg viewBox="0 0 200 80" width="200" height="80">
      <g className="dash">
        <line className="ps" x1="0" y1="24" x2="26" y2="24" strokeWidth="4" />
        <line className="ps" x1="8" y1="40" x2="40" y2="40" strokeWidth="4" />
        <line className="ps" x1="0" y1="56" x2="22" y2="56" strokeWidth="4" />
      </g>
      <rect className="d1" x="6" y="16" width="40" height="9" rx="3" />
      <rect className="d2" x="22" y="24" width="8" height="20" rx="2" />
      <path d="M 16 64 L 16 50 Q 18 42 32 41 L 78 38 Q 84 28 98 28 L 118 30 Q 128 32 134 44 L 176 52 L 194 60 L 194 68 L 24 68 Z" />
      <path className="d2" d="M 66 42 L 108 40 L 112 56 L 62 58 Z" />
      <path className="no halo" d="M 86 32 Q 104 12 124 30" />
      <circle className="d2" cx="105" cy="30" r="11" />
      <rect className="d1" x="168" y="65" width="32" height="8" rx="3" />
      {wheel(52, 56, 22)}
      {wheel(158, 58, 20)}
    </svg>
  );
}

function Plane() {
  return (
    <svg viewBox="0 0 214 116" width="214" height="116">
      <path className="d2" d="M 122 48 L 66 22 L 94 22 L 150 46 Z" />
      <path className="d2" d="M 42 44 L 14 6 L 32 6 L 60 42 Z" />
      <path className="d1" d="M 8 12 L 44 4 L 52 12 L 16 20 Z" />
      <path d="M 208 56 Q 186 40 140 40 L 58 44 Q 24 48 14 60 Q 26 74 58 76 L 140 76 Q 188 74 208 56 Z" />
      <path className="d1" d="M 130 72 L 58 104 L 92 106 L 160 76 Z" />
      <path className="d1" d="M 58 104 L 54 88 L 66 86 L 70 102 Z" />
      <g className="d1">
        <rect x="40" y="28" width="46" height="20" rx="10" />
      </g>
      <ellipse className="pp" cx="42" cy="38" rx="4" ry="9" />
      <path className="pp" d="M 178 46 L 196 50 L 190 57 L 174 54 Z" />
      <path className="pp" d="M 158 45 L 170 46 L 168 55 L 156 54 Z" />
      <g className="pp">
        <circle cx="96" cy="58" r="3.4" />
        <circle cx="112" cy="57" r="3.4" />
        <circle cx="128" cy="56" r="3.4" />
        <circle cx="144" cy="55" r="3.4" />
      </g>
      <g className="rim">
        <path d="M 176 74 L 176 88" />
      </g>
      <circle className="d2" cx="176" cy="92" r="5" />
    </svg>
  );
}

function Rocket() {
  return (
    <svg viewBox="0 -120 240 284" width="240" height="284">
      <g className="fs">
        <g className="flame">
          <path className="rk-f1" d="M 40 50 Q -30 82 40 114 Z" />
          <path className="rk-f2" d="M 40 61 Q -6 82 40 103 Z" />
          <path className="rk-f3" d="M 40 70 Q 10 82 40 94 Z" />
        </g>
        <path className="rk-red" d="M 112 48 Q 92 4 56 12 Q 58 34 78 50 Z" />
        <path className="rk-red" d="M 108 116 Q 88 156 56 150 Q 58 130 76 114 Z" />
        <path className="rk-body" d="M 50 58 L 34 50 Q 26 82 34 114 L 50 106 Q 44 82 50 58 Z" />
        <path className="rk-red" d="M 64 56 Q 58 82 64 108 L 50 112 Q 43 82 50 52 Z" />
        <path className="rk-body" d="M 168 46 L 88 50 Q 58 58 58 82 Q 58 106 88 114 L 168 118 Q 186 102 186 82 Q 186 62 168 46 Z" />
        <path className="rk-red" d="M 172 50 Q 188 64 188 82 Q 188 100 172 114 Q 212 106 220 82 Q 212 58 172 50 Z" />
      </g>
      <path className="pl" d="M 92 51 Q 84 82 92 113" />
      <g className="fs">
        <circle className="rk-ring" cx="150" cy="84" r="23" />
        <circle className="rk-glass" cx="150" cy="84" r="15" />
      </g>
      <path className="rk-hl" d="M 141 90 Q 150 96 159 90 Q 151 100 141 90 Z" />
      <g className="rider">
        <path className="lo" strokeWidth="11" d="M 76 -46 L 106 -106" />
        <path className="rk-pole" strokeWidth="6" d="M 76 -46 L 106 -106" />
        <g className="fs">
          <path className="rk-flag" d="M 104 -102 Q 82 -94 60 -102 L 56 -70 Q 78 -62 100 -70 Z" />
        </g>
        <path className="lo" strokeWidth="29" d="M 96 -16 L 78 -44" />
        <path className="lo" strokeWidth="31" d="M 104 24 L 128 46 L 126 64" />
        <path className="lo" strokeWidth="29" d="M 94 26 L 108 52 L 100 66" />
        <path className="li" strokeWidth="19" d="M 96 -16 L 78 -44" />
        <path className="li" strokeWidth="21" d="M 104 24 L 128 46 L 126 64" />
        <path className="li" strokeWidth="19" d="M 94 26 L 108 52 L 100 66" />
        {/* The waving arm is three pieces — dark casing, white core, and the
            glove over in the .fs pass. All of them carry .arm so they swing
            together; animating the core alone slid it out of its own outline
            and left the glove hanging in mid-air. Staying before .fs keeps the
            shoulder tucked behind the torso. */}
        <g className="arm">
          <path className="lo" strokeWidth="29" d="M 130 -22 L 162 -32" />
          <path className="li" strokeWidth="19" d="M 130 -22 L 162 -32" />
        </g>
        <g className="fs">
          <rect className="rk-suit" x="88" y="-20" width="44" height="52" rx="19" />
          <rect className="rk-pack" x="98" y="2" width="38" height="19" rx="7" />
          <circle className="rk-suit" cx="122" cy="-48" r="33" />
          <circle className="rk-visor" cx="130" cy="-48" r="24" />
          <circle className="rk-suit" cx="76" cy="-47" r="11" />
          {/* Painted after the helmet so the glove passes in front of it at
              the top of the swing, which is why it isn't in the group above. */}
          <g className="arm">
            <circle className="rk-suit" cx="165" cy="-33" r="11" />
          </g>
        </g>
        <path className="rk-gleam" d="M 116 -68 Q 132 -72 145 -62 Q 131 -66 118 -60 Z" />
        <circle className="rk-vh" cx="122" cy="-58" r="5.5" />
        <circle className="rk-vh" cx="119" cy="-46" r="3" />
        <circle className="rk-vh" cx="80" cy="-86" r="7" />
      </g>
    </svg>
  );
}

function Chute() {
  return (
    <svg viewBox="0 0 148 178" width="148" height="178">
      <g className="canopy">
        <path d="M 8 66 Q 74 -14 140 66 Q 107 46 74 66 Q 41 46 8 66 Z" />
        <path className="d2" d="M 41 56 Q 57 44 74 66 Q 57 44 41 56 Z" />
        <path className="d1" d="M 107 56 Q 91 44 74 66 Q 91 44 107 56 Z" />
        <g className="cord">
          <line x1="8" y1="66" x2="60" y2="118" />
          <line x1="41" y1="56" x2="66" y2="118" />
          <line x1="107" y1="56" x2="82" y2="118" />
          <line x1="140" y1="66" x2="88" y2="118" />
        </g>
      </g>
      <g className="rider">
        <g className="d1">
          <line x1="62" y1="128" x2="52" y2="120" strokeWidth="11" />
          <line x1="86" y1="128" x2="96" y2="120" strokeWidth="11" />
          <line x1="66" y1="162" x2="58" y2="176" strokeWidth="13" />
          <line x1="82" y1="162" x2="90" y2="176" strokeWidth="13" />
        </g>
        <rect x="55" y="128" width="38" height="38" rx="13" />
        <circle cx="74" cy="104" r="17" />
      </g>
    </svg>
  );
}

const ART: Record<Vehicle, () => React.JSX.Element> = {
  walk: Walk,
  bike: Bike,
  moto: Moto,
  car: Car,
  f1: F1,
  plane: Plane,
  rocket: Rocket,
  chute: Chute,
};

export default function Vehicles() {
  return (
    <>
      {(Object.keys(ART) as Vehicle[]).map((k) => {
        const Art = ART[k];
        return (
          <div key={k} className={`veh veh--${k}`}>
            <Art />
          </div>
        );
      })}
    </>
  );
}