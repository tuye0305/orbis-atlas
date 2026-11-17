/**
 * Small animated pictograms for the intro's step cards: each shows the one thing the player does,
 * so the card needs only a two-word title and the key to press.
 */
const A = 'var(--accent)';
const INK = 'rgba(255,255,255,.86)';
const DIM = 'rgba(255,255,255,.22)';
const GOLD = '#ffd36a';

function Junk({ x, y, s = 1, sail = '#d9bd86', lit = false }: { x: number; y: number; s?: number; sail?: string; lit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 0 Q0 7 14 0 L11 4 Q0 9 -11 4 Z" fill="#6b4a2c" />
      <line x1="0" y1="0" x2="0" y2="-19" stroke="#3a2818" strokeWidth="1.4" />
      <path d="M-7 -17 L7 -17 L8 -3 L-8 -3 Z" fill={sail} />
      {[-13, -9, -5].map((yy) => (
        <line key={yy} x1="-7.5" y1={yy} x2="7.5" y2={yy} stroke="rgba(0,0,0,.25)" strokeWidth="0.8" />
      ))}
      {lit && (
        <g className="sa-flame">
          <path d="M-9 -2 Q-6 -16 -2 -6 Q0 -22 4 -6 Q7 -14 9 -2 Z" fill="#ff7a2a" />
          <path d="M-5 -2 Q-2 -11 0 -4 Q2 -13 5 -2 Z" fill="#ffd27a" />
        </g>
      )}
    </g>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  // the compass needle swings from north round to south-east
  wind: () => (
    <svg viewBox="0 0 160 100">
      <circle cx="80" cy="50" r="34" fill="rgba(255,255,255,.03)" stroke={DIM} />
      <circle cx="80" cy="50" r="22" fill="none" stroke="rgba(255,255,255,.08)" />
      {[
        ['N', 80, 22],
        ['S', 80, 84],
        ['E', 110, 54],
        ['W', 50, 54],
      ].map(([t, x, y]) => (
        <text key={t as string} x={x as number} y={y as number} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.5)" fontFamily="Inter, sans-serif">
          {t}
        </text>
      ))}
      <g className="sa-needle" style={{ transformOrigin: '80px 50px' }}>
        <path d="M80 26 L86 52 L80 47 L74 52 Z" fill={A} />
        <line x1="80" y1="47" x2="80" y2="72" stroke={A} strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="sa-gust">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${122 + i * 4} ${30 + i * 14} q8 -4 16 0`} stroke="rgba(255,255,255,.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  ),
  // the fire ships push off together
  sail: () => (
    <svg viewBox="0 0 160 100">
      <path d="M0 70 Q40 66 80 70 T160 70 V100 H0 Z" fill="rgba(120,170,210,.10)" />
      <g className="sa-fleet">
        {[0, 1, 2, 3].map((i) => (
          <Junk key={i} x={30 + i * 32} y={70 + (i % 2) * 6} s={1.15} />
        ))}
      </g>
      <g stroke={A} strokeWidth="2.2" fill="none" strokeLinecap="round" className="sa-up">
        <path d="M80 34 L80 14 M72 22 L80 13 L88 22" />
      </g>
    </svg>
  ),
  // at the gold line, every ship catches fire at once
  fire: () => (
    <svg viewBox="0 0 160 100">
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${12 + i * 30} 26 l12 0 l-2 4 l-8 0 Z`} fill="#3a2a1e" />
        ))}
      </g>
      <line x1="6" y1="52" x2="154" y2="52" stroke={GOLD} strokeWidth="2" strokeDasharray="7 6" className="sa-line" />
      {[0, 1, 2].map((i) => (
        <Junk key={i} x={40 + i * 40} y={62} s={1.1} lit />
      ))}
    </svg>
  ),
  // the rocket leans from vertical toward the horizon along the guide arc
  lean: () => (
    <svg viewBox="0 0 160 100">
      <path d="M40 90 Q46 40 128 22" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="5 5" opacity=".75" />
      <line x1="10" y1="90" x2="150" y2="90" stroke="rgba(140,190,255,.45)" strokeWidth="1.5" />
      <g className="sa-rocket" style={{ transformOrigin: '40px 88px' }}>
        <path d="M40 46 Q44 52 44 62 L44 86 L36 86 L36 62 Q36 52 40 46 Z" fill="#e6e8e4" />
        <path d="M36 74 L31 88 L36 86 Z M44 74 L49 88 L44 86 Z" fill="#b7bbb4" />
        <path d="M37 88 Q40 100 43 88 Z" fill="#ffb24a" className="sa-flame" />
      </g>
      <g fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(255,255,255,.6)">
        <text x="134" y="16" textAnchor="middle">
          ←
        </text>
      </g>
    </svg>
  ),
  // the orbit ring closes and turns green: cut now
  cut: () => (
    <svg viewBox="0 0 160 100">
      <circle cx="80" cy="50" r="22" fill="#24508a" />
      <circle cx="80" cy="50" r="22" fill="none" stroke="rgba(140,200,255,.6)" strokeWidth="2" />
      <ellipse cx="80" cy="50" rx="38" ry="34" fill="none" stroke="rgba(142,240,176,.18)" strokeWidth="10" />
      <ellipse cx="80" cy="50" rx="38" ry="34" fill="none" stroke="#8ef0b0" strokeWidth="2.6" pathLength="100" strokeDasharray="100" className="sa-orbit" />
      <circle cx="80" cy="16" r="3.5" fill="#fff" />
      <g className="sa-key">
        <rect x="118" y="70" width="34" height="18" rx="4" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.45)" />
        <rect x="124" y="82" width="22" height="2" rx="1" fill={INK} />
      </g>
    </svg>
  ),
  // the red predicted landing mark slides onto the gold target
  retro: () => (
    <svg viewBox="0 0 160 100">
      <defs>
        <radialGradient id="sa-globe" cx="35%" cy="35%">
          <stop offset="0" stopColor="#4d86c6" />
          <stop offset="1" stopColor="#12305a" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="56" r="40" fill="url(#sa-globe)" />
      <path d="M58 40 Q70 30 86 36 Q96 44 88 54 Q78 60 70 52 Q60 50 58 40 Z" fill="#7a8a52" opacity=".85" />
      <circle cx="78" cy="42" r="7" fill="none" stroke={GOLD} strokeWidth="2.2" />
      <circle cx="78" cy="42" r="2" fill={GOLD} />
      <g className="sa-mark">
        <circle cx="78" cy="42" r="5" fill="none" stroke="#ff5a4a" strokeWidth="2.4" />
      </g>
    </svg>
  ),
};

/** Wide scenic banners behind each intro's title. */
const HERO: Record<string, () => React.ReactElement> = {
  'red-cliffs': () => (
    <svg viewBox="0 0 680 210" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#03060e" />
          <stop offset=".6" stopColor="#0d1b2e" />
          <stop offset="1" stopColor="#2a3446" />
        </linearGradient>
        <radialGradient id="rh-fire" cx=".62" cy=".72" r=".5">
          <stop offset="0" stopColor="#ff8a2a" stopOpacity=".85" />
          <stop offset=".4" stopColor="#c2410c" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rh-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1622" />
          <stop offset="1" stopColor="#03070c" />
        </linearGradient>
      </defs>
      <rect width="680" height="210" fill="url(#rh-sky)" />
      <circle cx="150" cy="52" r="15" fill="#efe9d8" />
      <circle cx="150" cy="52" r="40" fill="#cfd8e8" opacity=".08" />
      <path d="M0 132 Q90 100 170 118 T340 110 T520 104 T680 118 V150 H0 Z" fill="#141f2c" />
      <path d="M0 146 Q120 128 240 138 T480 132 T680 140 V160 H0 Z" fill="#0c141d" />
      <rect y="150" width="680" height="60" fill="url(#rh-water)" />
      <rect width="680" height="210" fill="url(#rh-fire)" className="hr-flicker" />
      <path d="M150 152 L140 210 L160 210 Z" fill="#e8e3d4" opacity=".12" />
      <g fill="#080b10">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={i} transform={`translate(${330 + i * 40} ${148})`}>
            <path d="M-16 0 Q0 6 16 0 L13 5 Q0 9 -13 5 Z" />
            <rect x="-1" y="-26" width="2" height="26" />
            <path d="M-9 -24 L9 -24 L10 -6 L-10 -6 Z" />
          </g>
        ))}
      </g>
      <g className="hr-flames">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${368 + i * 40} 146 q-8 -22 0 -40 q4 14 8 4 q6 18 -2 36 Z`} fill={i % 2 ? '#ffb347' : '#ff7a2a'} opacity=".9" />
        ))}
      </g>
      <g opacity=".5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={364 + i * 40} y={156 + (i % 2) * 6} width="12" height="40" fill="#ff8a2a" opacity=".35" />
        ))}
      </g>
      <path d="M0 210 L0 150 Q30 120 60 112 L92 108 L100 150 L100 210 Z" fill="#5a1e14" />
      <text x="46" y="142" fontSize="14" fill="#c2412a" fontFamily="'Noto Serif SC', serif" fontWeight="700">
        赤壁
      </text>
    </svg>
  ),
  vostok: () => (
    <svg viewBox="0 0 680 210" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="vh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#02040a" />
          <stop offset=".55" stopColor="#0b2550" />
          <stop offset="1" stopColor="#7aa7d6" />
        </linearGradient>
        <radialGradient id="vh-earth" cx=".5" cy="0" r="1">
          <stop offset="0" stopColor="#3f78b8" />
          <stop offset="1" stopColor="#0d2547" />
        </radialGradient>
      </defs>
      <rect width="680" height="210" fill="url(#vh-sky)" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 97) % 680} cy={(i * 53) % 90} r={i % 5 ? 0.7 : 1.2} fill="#fff" opacity={0.3 + (i % 4) * 0.15} />
      ))}
      <ellipse cx="340" cy="420" rx="620" ry="250" fill="url(#vh-earth)" />
      <ellipse cx="340" cy="420" rx="620" ry="250" fill="none" stroke="#8cc4ff" strokeWidth="4" opacity=".55" />
      <ellipse cx="340" cy="420" rx="632" ry="262" fill="none" stroke="#8cc4ff" strokeWidth="10" opacity=".12" />
      <path d="M120 190 Q260 120 420 150 T640 180" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="9" strokeLinecap="round" />
      <path d="M300 200 Q360 150 470 60 Q520 28 590 16" fill="none" stroke="#ffd36a" strokeWidth="2" strokeDasharray="6 7" opacity=".7" />
      <g className="hr-rocket">
        <g transform="translate(470 60) rotate(52)">
          <path d="M0 -26 Q5 -18 5 -6 L5 18 L-5 18 L-5 -6 Q-5 -18 0 -26 Z" fill="#e6e8e4" />
          <path d="M-5 6 L-11 22 L-5 18 Z M5 6 L11 22 L5 18 Z" fill="#b7bbb4" />
          <path d="M-3 19 Q0 46 3 19 Z" fill="#ffb24a" className="sa-flame" />
        </g>
      </g>
    </svg>
  ),
};

export function HeroArt({ id }: { id: string }) {
  const Art = HERO[id];
  return Art ? (
    <div className="gp-hero" aria-hidden="true">
      <Art />
    </div>
  ) : null;
}

export default function StepArt({ art }: { art?: string }) {
  const Art = art ? ART[art] : undefined;
  return Art ? (
    <div className="gp-art" aria-hidden="true">
      <Art />
    </div>
  ) : null;
}
