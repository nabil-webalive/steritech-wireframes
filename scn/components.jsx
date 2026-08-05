// SteriScan — Shared UI Components
// ─────────────────────────────────

const C = {
  navBg:   '#1C2B4A',
  bg:      '#F5F7FA',
  brand:   '#14488F',
  accent:  '#4F6AF5',
  orange:  '#C2410C',
  green:   '#008D02',
  teal:    '#10B981',
  red:     '#C20C0F',
  darkRed: '#8D0000',
  amber:   '#D97706',
  text:    '#1C1917',
  muted:   '#78716C',
  border:  '#E7E5E4',
  white:   '#FFFFFF',
};

// ── Status Bar ────────────────────────────────
const StatusBar = () => (
  <div style={{
    height: 30, background: C.navBg, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px',
  }}>
    <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 700, color: '#fff' }}>9:31</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
        <path d="M7.5 2.2c-2 0-3.7.8-5 2L0 2C1.8 0.8 4.5 0 7.5 0s5.7.8 7.5 2l-2.5 2.2c-1.3-1.2-3-2-5-2z" opacity=".4"/>
        <path d="M7.5 6C6.4 6 5.4 6.45 4.7 7.2L7.5 11l2.8-3.8A4 4 0 0 0 7.5 6z"/>
        <path d="M7.5 4C5.7 4 4.1 4.7 3 5.9L4.7 7.2C5.5 6.2 6.5 5.7 7.5 5.7c1 0 2 .5 2.8 1.5L12 5.9C10.9 4.7 9.3 4 7.5 4z" opacity=".7"/>
      </svg>
      <svg width="13" height="11" viewBox="0 0 13 11" fill="white">
        <rect x="0" y="8" width="2.5" height="3"/>
        <rect x="3.5" y="5.5" width="2.5" height="5.5" opacity=".7"/>
        <rect x="7" y="3" width="2.5" height="8" opacity=".85"/>
        <rect x="10.5" y="0" width="2.5" height="11"/>
      </svg>
      <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
        <rect x=".5" y=".5" width="18" height="10" rx="2.5" stroke="white" strokeOpacity=".45"/>
        <rect x="1.5" y="1.5" width="14" height="8" rx="1.5" fill="white"/>
        <path d="M20 3.5v4a2 2 0 0 0 0-4z" fill="white" opacity=".4"/>
      </svg>
    </div>
  </div>
);

// ── Nav Bar ───────────────────────────────────
const NavBar = ({ title, onBack, showLogo = true }) => (
  <div style={{
    background: C.navBg, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px 14px', minHeight: 58,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#fff', padding: '4px 8px 4px 0', display: 'flex', alignItems: 'center', flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}
      <span style={{
        fontFamily: 'Plus Jakarta Sans,sans-serif',
        fontSize: 20, fontWeight: 600, color: '#fff',
        letterSpacing: '0.3px', lineHeight: 1.2,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{title}</span>
    </div>
    {showLogo && (
      <img src="assets/steritech_logo.png" alt="Steritech" style={{ height: 44, width: 'auto', flexShrink: 0, marginLeft: 10 }} />
    )}
  </div>
);

// ── Page Wrapper ──────────────────────────────
const PageWrapper = ({ title, onBack, children, bottomBar, showLogo = true, bgColor }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', height: '100%',
    background: bgColor || C.bg, overflow: 'hidden',
  }}>
    <StatusBar />
    <NavBar title={title} onBack={onBack} showLogo={showLogo} />
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {children}
    </div>
    {bottomBar && (
      <div style={{
        background: C.white, borderTop: `1px solid ${C.border}`,
        padding: '12px 20px', flexShrink: 0,
      }}>
        {bottomBar}
      </div>
    )}
  </div>
);

// ── Badge ─────────────────────────────────────
const BADGE_MAP = {
  RECEIVED:               { bg: '#E2E8F0', color: '#475569' },
  STAGED:                 { bg: '#FEF3C7', color: '#92400E' },
  IN_TREATMENT:           { bg: '#FEF3C7', color: '#92400E' },
  PROCESS_OUT:            { bg: '#CCFBF1', color: '#0F766E' },
  QA_RELEASED:            { bg: '#CCFBF1', color: '#0F766E' },
  QA_HOLD:                { bg: '#FEE2E2', color: '#991B1B' },
  SHIPPED:                { bg: '#DCFCE7', color: '#15803D' },
  IN_STORAGE_UNPROCESSED: { bg: '#E2E8F0', color: '#475569' },
  IN_STORAGE_PROCESSED:   { bg: '#CCFBF1', color: '#0F766E' },
};

const Badge = ({ state, label }) => {
  const s = BADGE_MAP[state] || { bg: '#E2E8F0', color: '#555' };
  const text = label || state.replace(/_/g, ' ');
  return (
    <span style={{
      background: s.bg, color: s.color,
      borderRadius: 6, padding: '3px 8px',
      fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.7px', display: 'inline-block',
    }}>{text}</span>
  );
};

const StreamBadge = ({ stream }) => {
  const map = {
    irradiation: { bg: '#EEF2FF', color: '#4338CA', label: 'IRRADIATION' },
    eto:         { bg: '#FFF7ED', color: '#C2410C', label: 'EtO' },
    packing:     { bg: '#F0FDF4', color: '#15803D', label: 'PACKING' },
  };
  const s = map[stream] || { bg: '#E2E8F0', color: '#555', label: stream };
  return (
    <span style={{
      background: s.bg, color: s.color,
      borderRadius: 6, padding: '3px 8px',
      fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.7px', display: 'inline-block',
    }}>{s.label}</span>
  );
};

// ── Button ────────────────────────────────────
const Btn = ({ label, onClick, color = 'orange', disabled = false, outline = false, small = false, large = false }) => {
  const bg = { orange: C.orange, green: C.green, red: C.red, blue: C.brand, teal: C.teal, darkRed: C.darkRed }[color] || C.orange;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: large ? 64 : small ? 40 : 48, borderRadius: 16,
      background: disabled ? '#D1D5DB' : (outline ? 'transparent' : bg),
      color: disabled ? '#9CA3AF' : (outline ? bg : '#fff'),
      border: outline ? `2px solid ${bg}` : 'none',
      fontFamily: 'DM Sans,sans-serif', fontSize: large ? 18 : small ? 14 : 16, fontWeight: large ? 600 : 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'filter 0.15s',
    }} onMouseDown={e => e.currentTarget.style.filter='brightness(0.9)'}
       onMouseUp={e => e.currentTarget.style.filter=''}
       onTouchStart={e => e.currentTarget.style.filter='brightness(0.9)'}
       onTouchEnd={e => e.currentTarget.style.filter=''}>{label}</button>
  );
};

// ── Form Field ────────────────────────────────
const Field = ({ label, value, onChange, readOnly = false, type = 'text', placeholder = '' }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{
      display: 'block', fontFamily: 'DM Sans,sans-serif', fontSize: 11,
      fontWeight: 700, color: C.muted, marginBottom: 5,
      textTransform: 'uppercase', letterSpacing: '0.6px',
    }}>{label}</label>
    <input type={type} value={value} onChange={onChange} readOnly={readOnly} placeholder={placeholder}
      style={{
        width: '100%', height: 44, borderRadius: 10, padding: '0 12px',
        border: `1.5px solid ${readOnly ? '#EBEBEB' : '#D1CEC9'}`,
        background: readOnly ? '#F4F4F4' : C.white,
        fontFamily: 'DM Sans,sans-serif', fontSize: 15,
        color: readOnly ? C.muted : C.text,
        outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none',
      }}/>
  </div>
);

// ── Form Select ───────────────────────────────
const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{
      display: 'block', fontFamily: 'DM Sans,sans-serif', fontSize: 11,
      fontWeight: 700, color: C.muted, marginBottom: 5,
      textTransform: 'uppercase', letterSpacing: '0.6px',
    }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={onChange} style={{
        width: '100%', height: 44, borderRadius: 10, padding: '0 36px 0 12px',
        border: `1.5px solid #D1CEC9`, background: C.white,
        fontFamily: 'DM Sans,sans-serif', fontSize: 15, color: C.text,
        outline: 'none', boxSizing: 'border-box',
        appearance: 'none', WebkitAppearance: 'none',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>
  </div>
);

// ── Card ──────────────────────────────────────
const Card = ({ children, style = {}, onClick, ...rest }) => (
  <div onClick={onClick} {...rest} style={{
    background: C.white, borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.06)',
    ...style,
  }}>{children}</div>
);

// ── Alert Banner ──────────────────────────────
const Alert = ({ type = 'error', message, action, onAction }) => {
  const s = {
    error:   { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
    warning: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    info:    { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
    teal:    { bg: '#F0FDFA', color: '#0F766E', border: '#99F6E4' },
  }[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10,
      padding: '12px 14px', marginBottom: 14,
    }}>
      <p style={{ margin: 0, fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: s.color, fontWeight: 500, lineHeight: 1.4 }}>
        {message}
      </p>
      {action && (
        <button onClick={onAction} style={{
          background: 'none', border: `1.5px solid ${s.color}`, color: s.color,
          borderRadius: 6, padding: '4px 12px', marginTop: 8,
          fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>{action}</button>
      )}
    </div>
  );
};

// ── Info Row ──────────────────────────────────
const InfoRow = ({ label, value, bold = false, valueEl }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '9px 0', borderBottom: `1px solid ${C.border}`,
  }}>
    <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted }}>{label}</span>
    {valueEl || (
      <span style={{
        fontFamily: 'DM Sans,sans-serif', fontSize: 13,
        fontWeight: bold ? 700 : 500, color: C.text, textAlign: 'right', maxWidth: '60%',
      }}>{value}</span>
    )}
  </div>
);

// ── Section Title ─────────────────────────────
const SectionTitle = ({ title, subtitle }) => (
  <div style={{ marginBottom: 14 }}>
    <h2 style={{
      fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700,
      color: C.text, margin: 0, letterSpacing: '-0.4px',
    }}>{title}</h2>
    {subtitle && <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted, margin: '3px 0 0' }}>{subtitle}</p>}
  </div>
);

// ── Scan Viewfinder ───────────────────────────
const ScanView = ({ onSimulate, label = 'Tap to Scan', onManual, manualLabel }) => {
  const [scanning, setScanning] = React.useState(false);
  const [lineY, setLineY] = React.useState(20);
  const dirRef = React.useRef(1);
  const rafRef = React.useRef(null);

  const animate = React.useCallback(() => {
    setLineY(y => {
      const next = y + dirRef.current * 2.5;
      if (next >= 155) dirRef.current = -1;
      if (next <= 10) dirRef.current = 1;
      return next;
    });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    rafRef.current = requestAnimationFrame(animate);
    setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      setScanning(false);
      onSimulate && onSimulate();
    }, 1800);
  };

  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <div onClick={startScan} style={{
        width: '100%', height: 260, borderRadius: 18,
        background: '#151A2D', position: 'relative', overflow: 'hidden', cursor: 'pointer',
        border: `2px solid ${scanning ? C.accent : '#2C3350'}`,
        transition: 'border-color 0.3s',
      }}>
        {/* Corner brackets */}
        {[[8,8,null,null],[8,null,null,8],[null,8,8,null],[null,null,8,8]].map(([t,l,b,r], i) => (
          <svg key={i} width="22" height="22" viewBox="0 0 22 22" fill="none"
            style={{ position:'absolute', top:t, left:l, bottom:b, right:r }}>
            {i===0 && <><path d="M4 18V4h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>}
            {i===1 && <><path d="M18 18V4H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>}
            {i===2 && <><path d="M4 4v14h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>}
            {i===3 && <><path d="M18 4v14H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>}
          </svg>
        ))}
        {scanning ? (
          <div style={{
            position:'absolute', left:16, right:16,
            top: lineY, height: 2,
            background: 'rgba(79,106,245,0.95)',
            boxShadow: '0 0 10px 2px rgba(79,106,245,0.6)',
            borderRadius: 1,
          }}/>
        ) : (
          <div style={{
            position:'absolute', inset:0, display:'flex',
            flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
              <rect x="3" y="3" width="5" height="5" rx="1"/>
              <rect x="16" y="3" width="5" height="5" rx="1"/>
              <rect x="3" y="16" width="5" height="5" rx="1"/>
              <line x1="10" y1="5.5" x2="14" y2="5.5"/>
              <line x1="10" y1="18.5" x2="14" y2="18.5"/>
              <line x1="5.5" y1="10" x2="5.5" y2="14"/>
              <line x1="18.5" y1="10" x2="18.5" y2="14"/>
              <rect x="16" y="16" width="5" height="5" rx="1"/>
              <line x1="12" y1="10" x2="12" y2="14"/>
              <line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            <span style={{ color:'rgba(255,255,255,0.45)', fontFamily:'DM Sans,sans-serif', fontSize:12 }}>Tap to activate camera</span>
          </div>
        )}
        {scanning && (
          <div style={{
            position:'absolute', top:6, left:'50%', transform:'translateX(-50%)',
            background:'rgba(79,106,245,0.9)', borderRadius:20, padding:'3px 10px',
          }}>
            <span style={{ color:'#fff', fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600 }}>SCANNING…</span>
          </div>
        )}
      </div>
      <button onClick={startScan} style={{
        background: C.accent, color: '#fff', border: 'none',
        borderRadius: 16, padding: '16px 0', width: '100%',
        fontFamily: 'DM Sans,sans-serif', fontSize: 17, fontWeight: 600, cursor: 'pointer',
        opacity: scanning ? 0.6 : 1, letterSpacing: '0.2px',
      }}>{scanning ? 'Scanning…' : label}</button>
      {(onManual || manualLabel) && (
        <span onClick={onManual} style={{
          fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.accent,
          textDecoration: 'underline', cursor: 'pointer',
        }}>{manualLabel || 'Or enter manually'}</span>
      )}
    </div>
  );
};

// ── Pallet ID chip ────────────────────────────
const PalletChip = ({ id }) => (
  <div style={{
    background: '#EEF2FF', border: '1px solid #C7D2FE',
    borderRadius: 8, padding: '6px 12px', display: 'inline-flex', gap: 6, alignItems: 'center',
  }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
    <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 700, color: C.brand }}>{id}</span>
  </div>
);

Object.assign(window, {
  C, StatusBar, NavBar, PageWrapper, Badge, StreamBadge,
  Btn, Field, Select, Card, ScanView, Alert, InfoRow, SectionTitle, PalletChip,
});
