// SteriScan — Screens A: Auth, Dashboard, Scan, Summary, Receiving, InStorage
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_ORDERS = [
  { id: 'PLT-2026-041', customer: 'MedTech Australia',  pallets: 3, state: 'RECEIVED',    stream: 'irradiation', date: 'Apr 28', product: 'Surgical Instruments — Class II', weight: 142 },
  { id: 'PLT-2026-038', customer: 'BioPharma Ltd',       pallets: 1, state: 'STAGED',       stream: 'eto',         date: 'Apr 27', product: 'Single-Use Catheters',           weight: 88  },
  { id: 'PLT-2026-035', customer: 'SurgiCare Corp',      pallets: 5, state: 'IN_TREATMENT', stream: 'irradiation', date: 'Apr 26', product: 'Sterile Gloves — Bulk',           weight: 310 },
  { id: 'PLT-2026-031', customer: 'HealthPlus Group',    pallets: 2, state: 'PROCESS_OUT',  stream: 'packing',     date: 'Apr 25', product: 'IV Administration Sets',           weight: 95  },
  { id: 'PLT-2026-028', customer: 'NovaMed Supplies',    pallets: 4, state: 'QA_RELEASED',  stream: 'eto',         date: 'Apr 24', product: 'Wound Dressing Packs',            weight: 204 },
];

// ── Splash Screen ─────────────────────────────
const SplashScreen = ({ navigate }) => {
  React.useEffect(() => {
    const t = setTimeout(() => navigate('scan_employee'), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      height: '100%', background: C.brand,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 28,
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        animation: 'fadeUp 0.6s ease both',
      }}>
        <img src="assets/steritech_logo.png" alt="Steritech" style={{ width: 90, height: 'auto' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>SteriScan</div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>Warehouse Scanning System</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: 3,
            background: i === 0 ? '#fff' : 'rgba(255,255,255,0.35)',
            animation: `pulse 1.4s ${i*0.3}s infinite`,
          }}/>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 28,
        fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)',
      }}>Steritech Pty Ltd © 2026</div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:0.35} 50%{opacity:1} }
      `}</style>
    </div>
  );
};

// ── Scan Employee Screen ──────────────────────
const ScanEmployeeScreen = ({ navigate }) => {
  const [pin, setPin] = React.useState('');
  const [mode, setMode] = React.useState('scan'); // 'scan' | 'pin'
  const handleScan = () => navigate('dashboard', { operator: 'Pan Xiao' });
  const handlePin = () => {
    if (pin.length >= 4) navigate('dashboard', { operator: 'Pan Xiao' });
  };
  return (
    <PageWrapper title="Sign In" showLogo={true}>
      <div style={{ padding: '28px 20px 20px' }}>
        <SectionTitle title="Employee Identification" subtitle="Scan your employee badge or enter your ID" />
        <div style={{ height: 20 }}/>
        {mode === 'scan' ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ScanView onSimulate={handleScan} label="Scan Employee Badge"
              manualLabel="Enter ID manually"
              onManual={() => setMode('pin')} />
          </div>
        ) : (
          <>
            <Field label="Employee ID" value={pin} onChange={e => setPin(e.target.value)} placeholder="e.g. EMP-0042" />
            <div style={{ height: 12 }}/>
            <Btn label="Sign In" onClick={handlePin} color="blue" disabled={pin.length < 3} />
            <div style={{ height: 10 }}/>
            <button onClick={() => setMode('scan')} style={{
              width: '100%', background: 'none', border: 'none',
              fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.accent, cursor: 'pointer',
            }}>← Back to badge scan</button>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

// ── Step progress mapping ─────────────────────
const STATE_TO_STEP = {
  RECEIVED: 1, STAGED: 3, IN_TREATMENT: 4, PROCESS_OUT: 5, QA_RELEASED: 7, SHIPPED: 8,
};

const KPI = ({ label, value, color }) => (
  <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '10px 12px', border: `1px solid ${C.border}` }}>
    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
  </div>
);

// ── Dashboard Screen (Orders list, customer-style layout) ─
const DashboardScreen = ({ navigate, appData }) => {
  const [sort, setSort] = React.useState('date');
  const [filter, setFilter] = React.useState('all');

  const filters = [
    { id: 'all',         label: 'All' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'ready',       label: 'Ready' },
    { id: 'shipped',     label: 'Shipped' },
  ];
  const inProgress = ['RECEIVED','STAGED','IN_TREATMENT','PROCESS_OUT'];
  const ready = ['QA_RELEASED'];

  const filtered = SAMPLE_ORDERS.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return inProgress.includes(o.state);
    if (filter === 'ready') return ready.includes(o.state);
    if (filter === 'shipped') return o.state === 'SHIPPED';
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'status') return (STATE_TO_STEP[a.state]||0) - (STATE_TO_STEP[b.state]||0);
    return b.id.localeCompare(a.id);
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <StatusBar />
      <NavBar title={`Hello ${(appData.operator || 'Operator').split(' ')[0]}`} showLogo={true} />
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <KPI label="In Progress" value={SAMPLE_ORDERS.filter(o => inProgress.includes(o.state)).length} color={C.brand} />
          <KPI label="Ready" value={SAMPLE_ORDERS.filter(o => ready.includes(o.state)).length} color={C.green} />
          <KPI label="Shipped" value={SAMPLE_ORDERS.filter(o => o.state === 'SHIPPED').length} color={C.muted} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '7px 13px', borderRadius: 999,
              border: filter === f.id ? `1.5px solid ${C.brand}` : `1px solid ${C.border}`,
              background: filter === f.id ? '#EEF2FF' : '#fff',
              fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 600,
              color: filter === f.id ? C.brand : C.muted, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 700, color: C.text }}>
            {sorted.length} pallet{sorted.length !== 1 ? 's' : ''}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.border}`,
            fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.text, background: '#fff', cursor: 'pointer',
          }}>
            <option value="date">Sort: Date</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
          {sorted.map(order => {
            const step = STATE_TO_STEP[order.state] || 1;
            return (
              <Card key={order.id} style={{ padding: '14px 16px', cursor: 'pointer' }}
                onClick={() => navigate('order_detail', { selectedOrder: order })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, fontWeight: 700, color: C.text }}>{order.id}</div>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted, marginTop: 2 }}>{order.customer}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <Badge state={order.state} />
                    <StreamBadge stream={order.stream} />
                  </div>
                </div>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.text, marginBottom: 10 }}>{order.product}</div>
                <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? C.brand : C.border }}/>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted }}>
                    {order.pallets} pallet{order.pallets > 1 ? 's' : ''} · {order.weight} kg
                  </span>
                  <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.text, fontWeight: 600 }}>
                    {order.date}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <div style={{ background: '#fff', borderTop: `1px solid ${C.border}`, padding: '12px 16px' }}>
        <Btn label="Start New Scan" onClick={() => navigate('scan_pallet', { selectedOrder: null })} color="blue" large />
      </div>
    </div>
  );
};

// ── Order Detail (employee) ───────────────────
const TIMELINE_STEPS = [
  { key: 'received',  label: 'Received',         desc: 'Pallet checked in at warehouse' },
  { key: 'storage',   label: 'In Storage',       desc: 'Awaiting staging' },
  { key: 'staged',    label: 'Staged',           desc: 'Loaded for treatment' },
  { key: 'treatment', label: 'In Treatment',     desc: 'Sterilisation in progress' },
  { key: 'processed', label: 'Processed',        desc: 'Treatment complete' },
  { key: 'qa',        label: 'QA Review',        desc: 'Quality assurance check' },
  { key: 'packed',    label: 'Packed',           desc: 'Packaged for dispatch' },
  { key: 'shipped',   label: 'Dispatched',       desc: 'On the way to customer' },
];

const OrderDetailScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const step = STATE_TO_STEP[order.state] || 1;
  const isShipped = order.state === 'SHIPPED';

  const items = [
    { name: 'Surgical Instruments — Class II', qty: 48, lot: 'LOT-2026-A' },
    { name: 'Sterile Packaging Pouches',        qty: 200, lot: 'LOT-2026-B' },
    { name: 'Indicator Strips',                 qty: 120, lot: 'LOT-2026-C' },
  ];


  // Decide next action based on state
  const action = (() => {
    if (order.state === 'RECEIVED')     return { label: 'Start: Scan Pallet →',     screen: 'scan_pallet' };
    if (order.state === 'STAGED')       return { label: 'Begin Treatment →',         screen: 'treatment_active' };
    if (order.state === 'IN_TREATMENT') return { label: 'View Active Treatment →',   screen: 'treatment_active' };
    if (order.state === 'PROCESS_OUT')  return { label: 'Process-Out: Scan Bin →',   screen: 'scan_bin', extras: { binPhase: 'post_treatment' } };
    if (order.state === 'QA_RELEASED')  return { label: 'Continue to Packing →',     screen: 'packing' };
    return null;
  })();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <StatusBar />
      <NavBar title={order.id} onBack={() => navigate('dashboard')} showLogo={false} />
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted, fontWeight: 600 }}>{order.customer}</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: C.text, marginTop: 2 }}>{order.product}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <Badge state={order.state} />
            <StreamBadge stream={order.stream} />
          </div>
        </div>

        <Card style={{ padding: '16px', marginBottom: 14, background: isShipped ? '#DCFCE7' : '#EEF2FF', border: `1px solid ${isShipped ? '#86EFAC' : '#C7D2FE'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: isShipped ? C.green : C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isShipped
                  ? <path d="M20 6L9 17l-5-5"/>
                  : <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 700, color: isShipped ? '#15803D' : '#3730A3', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {isShipped ? 'Dispatched' : 'Current Step'}
              </div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: C.text, marginTop: 2 }}>
                {TIMELINE_STEPS[Math.min(step - 1, TIMELINE_STEPS.length - 1)].label}
              </div>
            </div>
          </div>
        </Card>

        <SectionTitle title="Progress" />
        <Card style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TIMELINE_STEPS.map((tStep, i) => {
              const done = i < step;
              const current = i === step - 1;
              return (
                <div key={tStep.key} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div style={{ position: 'absolute', left: 11, top: 22, bottom: -10, width: 2, background: i < step - 1 ? C.green : C.border }}/>
                  )}
                  <div style={{
                    width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                    background: done ? C.green : current ? C.brand : '#fff',
                    border: done || current ? 'none' : `2px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: current ? `0 0 0 4px rgba(79,106,245,0.18)` : 'none', zIndex: 1,
                  }}>
                    {done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                    {current && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }}/>}
                  </div>
                  <div style={{ paddingBottom: i === TIMELINE_STEPS.length - 1 ? 0 : 14, flex: 1 }}>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: current ? 700 : done ? 600 : 500, color: current ? C.brand : done ? C.text : C.muted }}>
                      {tStep.label}
                    </div>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted, marginTop: 2 }}>{tStep.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div style={{ height: 14 }}/>
        <SectionTitle title="Order details" />
        <Card style={{ padding: '14px 16px', marginBottom: 12 }}>
          <InfoRow label="Pallets" value={`${order.pallets} × PLT-A04-00${order.pallets}`} />
          <InfoRow label="Bin Location" value={step >= 5 ? 'Zone C — Bay 02' : 'Zone A — Bay 04'} />
          <InfoRow label="Gross Weight" value={`${order.weight} kg`} />
          <InfoRow label="Stream" valueEl={<StreamBadge stream={order.stream} />} />
          <InfoRow label="Target Dose / Cycle" value={order.stream === 'irradiation' ? '25 – 45 kGy' : order.stream === 'eto' ? 'Standard 12hr' : 'Blister Pack'} />
          <InfoRow label="Received" value={order.date + ', 2026'} />
          {step >= 6 && <InfoRow label="QA Reviewer" value="Sarah Mitchell" />}
        </Card>

        <SectionTitle title="Items" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {items.map((item, i) => (
            <Card key={i} style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 500, color: C.text }}>{item.name}</div>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted, marginTop: 2 }}>{item.lot}</div>
                </div>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, color: C.orange, marginLeft: 12 }}>
                  Qty {item.qty}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {action && (
        <div style={{ background: '#fff', borderTop: `1px solid ${C.border}`, padding: '12px 16px' }}>
          <Btn label={action.label} onClick={() => navigate(action.screen, { selectedOrder: order, palletId: 'PLT-A04-001', ...(action.extras || {}) })} color="orange" large />
        </div>
      )}
    </div>
  );
};

// ── Scan Pallet ID (after dashboard) ─────────
const ScanPalletScreen = ({ navigate, appData }) => {
  const handleScan = () => {
    const order = appData.selectedOrder || SAMPLE_ORDERS[0];
    navigate('pallet_items', { selectedOrder: order, palletId: 'PLT-A04-001' });
  };
  return (
    <PageWrapper title="Scan Pallet" onBack={() => navigate('dashboard')}>
      <div style={{ padding: '28px 20px 0' }}>
        <SectionTitle title="Scan Pallet ID" subtitle="Scan the pallet QR to view its items" />
        {appData.selectedOrder && (
          <Alert type="info" message={`Order ${appData.selectedOrder.id} — ${appData.selectedOrder.customer}`} />
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <ScanView onSimulate={handleScan} label="Scan Pallet QR" manualLabel="Enter Pallet ID manually" onManual={handleScan} />
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Scan Bin Location Screen (to store pallet) ─
const ScanBinScreen = ({ navigate, appData }) => {
  const invalid = React.useRef(false);
  const phase = appData.binPhase || 'pre_treatment'; // 'pre_treatment' | 'post_treatment'
  const handleScan = () => {
    if (invalid.current) {
      navigate('supervisor_pin', { prevScreen: 'scan_bin', overrideReason: 'Zone mismatch' });
    } else if (phase === 'post_treatment') {
      navigate('in_storage_processed', { binLocation: 'Zone C — Bay 02' });
    } else {
      navigate('receiving_form', { binLocation: 'Zone A — Bay 04' });
    }
  };
  const subtitle = phase === 'post_treatment'
    ? 'Scan the bin where the treated pallet will be stored'
    : 'Scan the bin where the pallet will be stored';
  return (
    <PageWrapper title="Scan Bin Location" onBack={() => navigate(phase === 'post_treatment' ? 'treatment_active' : 'pallet_items')}
      bottomBar={
        <button onClick={() => { invalid.current = true; navigate('fail', { failMessage: 'Invalid location scan — bin not recognised in system.', retryScreen: 'scan_bin' }); }}
          style={{ width:'100%', background:'none', border:'none', color: C.muted, fontFamily:'DM Sans,sans-serif', fontSize:13, cursor:'pointer' }}>
          Simulate Invalid Scan →
        </button>
      }>
      <div style={{ padding: '28px 20px 0' }}>
        <SectionTitle title="Scan Bin Location" subtitle={subtitle} />
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <ScanView onSimulate={handleScan} label="Scan Bin QR Code" manualLabel="Enter bin manually" onManual={handleScan} />
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Pallet Items (after pallet scan) ──────────
const PalletItemsScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const items = [
    { name: 'Surgical Instruments — Class II', qty: 48, lot: 'LOT-2026-A' },
    { name: 'Sterile Packaging Pouches',        qty: 200, lot: 'LOT-2026-B' },
    { name: 'Indicator Strips',                 qty: 120, lot: 'LOT-2026-C' },
  ];
  return (
    <PageWrapper title="Pallet Items" onBack={() => navigate('scan_pallet')}
      bottomBar={<Btn label="Scan Bin Location →" onClick={() => navigate('scan_bin', { binPhase: 'pre_treatment' })} color="blue" large />}>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 19, fontWeight: 700, color: C.text }}>{order.id}</div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted, marginTop: 2 }}>{order.customer}</div>
          </div>
          <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        </div>

        <Card style={{ padding: '14px 16px', marginBottom: 12 }}>
          <InfoRow label="Stream" valueEl={<StreamBadge stream={order.stream} />} />
          <InfoRow label="Date Received" value={order.date} />
          <InfoRow label="Gross Weight" value={`${order.weight} kg`} />
        </Card>

        <SectionTitle title="Items on Pallet" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, i) => (
            <Card key={i} style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 500, color: C.text }}>{item.name}</div>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted, marginTop: 2 }}>{item.lot}</div>
                </div>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, color: C.orange, marginLeft: 12 }}>
                  Qty {item.qty}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Summary Screen ────────────────────────────
const SummaryScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const items = [
    { name: 'Surgical Instruments — Class II', qty: 48, lot: 'LOT-2026-A' },
    { name: 'Sterile Packaging Pouches',        qty: 200, lot: 'LOT-2026-B' },
    { name: 'Indicator Strips',                 qty: 120, lot: 'LOT-2026-C' },
  ];
  return (
    <PageWrapper title="Pallet Summary" onBack={() => navigate('scan_bin')}
      bottomBar={<Btn label="Continue to Receiving" onClick={() => navigate('receiving_form')} color="blue" />}>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 19, fontWeight: 700, color: C.text }}>{order.id}</div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted, marginTop: 2 }}>{order.customer}</div>
          </div>
          <PalletChip id="PLT-A04-001" />
        </div>

        <Card style={{ padding: '14px 16px', marginBottom: 12 }}>
          <InfoRow label="Bin Location" value={appData.binLocation || 'Zone A — Bay 04'} />
          <InfoRow label="Stream" valueEl={<StreamBadge stream={order.stream} />} />
          <InfoRow label="Date Received" value={order.date} />
          <InfoRow label="Gross Weight" value={`${order.weight} kg`} />
        </Card>

        <SectionTitle title="Product Lines" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, i) => (
            <Card key={i} style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 500, color: C.text }}>{item.name}</div>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted, marginTop: 2 }}>{item.lot}</div>
                </div>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, color: C.orange, marginLeft: 12 }}>
                  Qty {item.qty}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Receiving (placeholder dummy) ─────────────
// ── Receiving — multi-step read-only request review ─
// 4 steps: Request details · Treatment details · Collection · Documents & declaration
// All values are read-only (employee is reviewing the customer's submission).

const SAMPLE_REQUEST = {
  // Step 1
  company:      'NSW Fresh Produce Pty Ltd',
  contact:      'Daniel Hartley',
  mobile:       '+61 412 558 901',
  email:        'd.hartley@nswfresh.com.au',
  poNumber:     'PO-2026-04412',
  palletSpaces: 2,
  cheps:        4,
  eta:          '14 Apr 2026, 09:30',
  // Step 2
  market:       'Domestic — NSW / VIC / QLD',
  pallets: [
    {
      palletSpace: 'PLT-A04-001',
      noOfSpaces:  1,
      storageTemp: '+2°C to +8°C',
      cheps:       2,
      cartons:     48,
      commodities: [
        { commodity: 'Mangoes — Kensington Pride', grower: 'Bowen Farms QLD',     cartons: 24, cheps: 1, pulpMin: '4.0°C', pulpMax: '6.5°C', address: '147 Plantation Rd, Bowen QLD 4805' },
        { commodity: 'Lychees',                    grower: 'Tropical Acres NT',   cartons: 24, cheps: 1, pulpMin: '3.5°C', pulpMax: '5.0°C', address: '22 Orchard Way, Darwin NT 0810' },
      ],
    },
    {
      palletSpace: 'PLT-A04-002',
      noOfSpaces:  1,
      storageTemp: '+2°C to +8°C',
      cheps:       2,
      cartons:     36,
      commodities: [
        { commodity: 'Tomatoes — Truss',           grower: 'SunRipe Growers VIC', cartons: 36, cheps: 2, pulpMin: '8.0°C', pulpMax: '10.0°C', address: '88 Greenhouse Ln, Werribee VIC 3030' },
      ],
    },
  ],
  // Step 3
  collection:        'yes',
  deliveryAddress:   'Steritech Wetherill Park, 12 Ferndell St, NSW 2164',
  expectedDelivery:  '14 Apr 2026',
  transportCharge:   'A$ 480.00',
  // Step 4
  documents: [
    { name: 'Phytosanitary Certificate.pdf', size: '218 KB' },
    { name: 'Bill of Lading.pdf',            size: '142 KB' },
    { name: 'Packing List.xlsx',             size: '64 KB' },
  ],
  notes:        'Please prioritise — destined for Sydney Markets Friday delivery. All cartons pre-cooled.',
  declaredAt:   '12 Apr 2026, 16:42',
  declaredBy:   'Daniel Hartley',
};

// Read-only display row — labelled value, no input
const ReadRow = ({ label, value, mono = false }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
      {label}
    </div>
    <div style={{
      fontFamily: mono ? 'ui-monospace,Menlo,monospace' : 'DM Sans,sans-serif',
      fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.4,
    }}>
      {value || <span style={{ color: C.muted, fontStyle: 'italic' }}>—</span>}
    </div>
  </div>
);

// Two-column read-only row
const ReadGrid = ({ items }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
    {items.map((it, i) => (
      <ReadRow key={i} label={it.label} value={it.value} mono={it.mono}/>
    ))}
  </div>
);

const StepDots = ({ step, total }) => (
  <div style={{ display: 'flex', gap: 6, padding: '12px 16px 14px', background: '#fff', borderBottom: `1px solid ${C.border}` }}>
    {[...Array(total)].map((_, i) => (
      <div key={i} style={{
        flex: 1, height: 5, borderRadius: 3,
        background: i < step ? C.brand : C.border,
        transition: 'background 200ms',
      }}/>
    ))}
  </div>
);

const ReceivingFormScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const req = SAMPLE_REQUEST;
  const [step, setStep] = React.useState(1);
  const TOTAL = 4;

  const next = () => {
    if (step < TOTAL) setStep(step + 1);
    else navigate('in_storage_unprocessed', {
      selectedOrder: { ...order, stream: order.stream || 'irradiation' },
      palletId: 'PLT-A04-001',
      stream: order.stream || 'irradiation',
      palletState: 'RECEIVED',
    });
  };
  const back = () => {
    if (step > 1) setStep(step - 1);
    else navigate('scan_bin');
  };

  const STEP_TITLES = ['Request details', 'Treatment details', 'Collection from Steritech', 'Documents & declaration'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <StatusBar />
      <NavBar title={`Receiving · ${order.id}`} onBack={back} showLogo={false} />
      <StepDots step={step} total={TOTAL} />

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Step {step} of {TOTAL}
            </div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 20, fontWeight: 700, color: C.text, marginTop: 2 }}>
              {STEP_TITLES[step - 1]}
            </div>
          </div>
          <PalletChip id="PLT-A04-001" />
        </div>

        {/* Read-only banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#EEF2FF', border: `1px solid #C7D2FE`, borderRadius: 10,
          padding: '10px 12px', marginBottom: 14,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: '#3730A3', lineHeight: 1.4 }}>
            Read-only — submitted by customer. Verify the request, then continue receiving.
          </div>
        </div>

        {/* ── STEP 1: Request details ─────────── */}
        {step === 1 && (
          <>
            <SectionTitle title="Company info" />
            <Card style={{ padding: '14px 16px', marginBottom: 12 }}>
              <ReadRow label="Company" value={req.company}/>
              <ReadGrid items={[
                { label: 'Contact name', value: req.contact },
                { label: 'Mobile',       value: req.mobile },
              ]}/>
              <ReadRow label="Email" value={req.email}/>
            </Card>

            <SectionTitle title="Order details" />
            <Card style={{ padding: '14px 16px' }}>
              <ReadGrid items={[
                { label: 'Purchase order',  value: req.poNumber, mono: true },
                { label: 'ETA',             value: req.eta },
                { label: 'Pallet spaces',   value: req.palletSpaces },
                { label: 'CHEPs',           value: req.cheps },
              ]}/>
            </Card>
          </>
        )}

        {/* ── STEP 2: Treatment details ───────── */}
        {step === 2 && (
          <>
            <SectionTitle title="Market" />
            <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
              <ReadRow label="Destination market" value={req.market}/>
            </Card>

            <SectionTitle title={`Pallets (${req.pallets.length})`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {req.pallets.map((p, pi) => (
                <Card key={pi} style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 700, color: C.text }}>
                      Pallet {pi + 1}
                    </div>
                    <PalletChip id={p.palletSpace}/>
                  </div>
                  <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
                    <ReadGrid items={[
                      { label: 'No. of spaces', value: p.noOfSpaces },
                      { label: 'CHEPs',         value: p.cheps },
                      { label: 'Storage temp',  value: p.storageTemp },
                      { label: 'Cartons',       value: p.cartons },
                    ]}/>
                  </div>
                  <div style={{ padding: '10px 14px 4px' }}>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                      Commodities ({p.commodities.length})
                    </div>
                    {p.commodities.map((c, ci) => (
                      <div key={ci} style={{
                        background: '#FAFBFC', borderRadius: 10, border: `1px solid ${C.border}`,
                        padding: '10px 12px', marginBottom: 8,
                      }}>
                        <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                          {c.commodity}
                        </div>
                        <ReadGrid items={[
                          { label: 'Grower',     value: c.grower },
                          { label: 'Cartons',    value: c.cartons },
                          { label: 'CHEPs',      value: c.cheps },
                          { label: 'Pulp range', value: `${c.pulpMin} – ${c.pulpMax}` },
                        ]}/>
                        <ReadRow label="Address" value={c.address}/>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── STEP 3: Collection ──────────────── */}
        {step === 3 && (
          <>
            <SectionTitle title="Transport booking" />
            <Card style={{ padding: '14px 16px', marginBottom: 12 }}>
              <ReadRow label="Collection from Steritech?" value={req.collection === 'yes' ? 'Yes — Steritech to deliver' : 'No — customer to collect'}/>
            </Card>

            {req.collection === 'yes' ? (
              <>
                <SectionTitle title="Delivery details" />
                <Card style={{ padding: '14px 16px', marginBottom: 12 }}>
                  <ReadRow label="Delivery address"      value={req.deliveryAddress}/>
                  <ReadRow label="Expected delivery"     value={req.expectedDelivery}/>
                </Card>


              </>
            ) : (
              <Alert type="info" message="Customer will collect treated pallets directly from Steritech."/>
            )}
          </>
        )}

        {/* ── STEP 4: Documents & declaration ─── */}
        {step === 4 && (
          <>
            <SectionTitle title="Attached documents" />
            <Card style={{ padding: 0, marginBottom: 14, overflow: 'hidden' }}>
              {req.documents.map((doc, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderBottom: i < req.documents.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                    <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted }}>{doc.size}</div>
                  </div>
                  <button style={{
                    background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: '6px 10px', fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 600,
                    color: C.brand, cursor: 'pointer',
                  }}>View</button>
                </div>
              ))}
            </Card>

            <SectionTitle title="Customer notes" />
            <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: C.text, lineHeight: 1.55 }}>
                {req.notes}
              </div>
            </Card>

            <SectionTitle title="Declaration" />
            <Card style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                  background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.text, lineHeight: 1.5, marginBottom: 8 }}>
                    Customer declared the information provided is true and correct, and accepts Steritech's terms of service.
                  </div>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted }}>
                    Signed by <span style={{ color: C.text, fontWeight: 600 }}>{req.declaredBy}</span> · {req.declaredAt}
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      <div style={{ background: '#fff', borderTop: `1px solid ${C.border}`, padding: '12px 16px', display: 'flex', gap: 10 }}>
        <button onClick={back} style={{
          flex: '0 0 38%', padding: '14px', borderRadius: 12,
          background: '#fff', border: `1.5px solid ${C.border}`, color: C.text,
          fontFamily: 'DM Sans,sans-serif', fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>{step === 1 ? 'Back' : '← Previous'}</button>
        <button onClick={next} style={{
          flex: 1, padding: '14px', borderRadius: 12,
          background: step === TOTAL ? C.orange : C.brand, border: 'none', color: '#fff',
          fontFamily: 'DM Sans,sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>{step === TOTAL ? 'Confirm Receiving' : 'Continue →'}</button>
      </div>
    </div>
  );
};

// ── Success Screen — store after receiving ──
// (the receiving placeholder will route to in_storage_unprocessed which already exists)

// ── In Storage — Unprocessed (cleanup) ───────
const InStorageUnprocessedScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const stream = appData.stream || order.stream || 'irradiation';

  return (
    <PageWrapper title="In Storage" onBack={() => navigate('dashboard')}
      bottomBar={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Continue to Staging" onClick={() => navigate('scan_bin_staging')} color="blue" />
          <Btn label="Relocate Pallet" onClick={() => navigate('scan_bin')} color="blue" outline />
        </div>
      }>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle title="Pallet In Storage" />
          <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        </div>

        <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
          <InfoRow label="Status" valueEl={<Badge state="RECEIVED" label="IN STORAGE — UNPROCESSED" />} />
          <InfoRow label="Zone" value="Zone A — Bay 04" />
          <InfoRow label="Customer" value={order.customer} />
          <InfoRow label="Product" value={order.product} />
          <InfoRow label="Stream" valueEl={<StreamBadge stream={stream} />} />
          <InfoRow label="Received" value={order.date} />
        </Card>

        <Alert type="info" message="Pallet is awaiting staging. Tap 'Continue to Staging' to begin the treatment workflow." />
      </div>
    </PageWrapper>
  );
};

// ── Scan for Staging (intermediate step) ──────
const ScanBinStagingScreen = ({ navigate, appData }) => {
  const stream = appData.stream || (appData.selectedOrder && appData.selectedOrder.stream) || 'irradiation';
  const handleScan = () => {
    const dest = { irradiation: 'staging_irradiation', eto: 'staging_eto', packing: 'staging_packing' }[stream] || 'stream_error';
    navigate(dest);
  };
  return (
    <PageWrapper title="Scan Pallet" onBack={() => navigate('in_storage_unprocessed')}
      bottomBar={null}>
      <div style={{ padding: '28px 20px 0' }}>
        <SectionTitle title="Scan Pallet for Staging" subtitle="Scan the pallet QR to auto-load the staging form" />
        <Alert type="info" message={`Stream: ${stream.toUpperCase()} — form will load automatically.`} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <ScanView onSimulate={handleScan} label="Scan Pallet QR" />
        </div>
      </div>
    </PageWrapper>
  );
};

Object.assign(window, {
  SAMPLE_ORDERS,
  SplashScreen, ScanEmployeeScreen, DashboardScreen, OrderDetailScreen,
  TIMELINE_STEPS, STATE_TO_STEP, KPI,
  ScanPalletScreen, PalletItemsScreen,
  ScanBinScreen, SummaryScreen, ReceivingFormScreen,
  InStorageUnprocessedScreen, ScanBinStagingScreen,
});
