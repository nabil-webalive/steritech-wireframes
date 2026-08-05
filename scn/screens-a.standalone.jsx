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
        <img src={window.__resources?.steritechLogo || "assets/steritech_logo.png"} alt="Steritech" style={{ width: 90, height: 'auto' }}/>
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

// ── Dashboard Screen ──────────────────────────
const DashboardScreen = ({ navigate, appData }) => {
  const [filter, setFilter] = React.useState('all');
  const filters = ['all', 'RECEIVED', 'STAGED', 'IN_TREATMENT', 'PROCESS_OUT', 'QA_RELEASED'];
  const filtered = filter === 'all' ? SAMPLE_ORDERS : SAMPLE_ORDERS.filter(o => o.state === filter);

  return (
    <PageWrapper
      title={`Hello ${(appData.operator || 'Operator').split(' ')[0]}`}
      bottomBar={<Btn label="Start New Scan" onClick={() => navigate('scan_pallet', { selectedOrder: null })} color="blue" large />}
    >
      <div style={{ padding: '20px 16px 0' }}>
        <SectionTitle title="Treatment Queue" subtitle={`${SAMPLE_ORDERS.length} pallets active`} />

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, WebkitOverflowScrolling: 'touch' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              flexShrink: 0, borderRadius: 20, padding: '5px 12px',
              background: filter === f ? C.navBg : C.white,
              color: filter === f ? '#fff' : C.muted,
              border: `1.5px solid ${filter === f ? C.navBg : C.border}`,
              fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.3px',
            }}>{f === 'all' ? 'All' : f.replace(/_/g, ' ')}</button>
          ))}
        </div>

        {/* Order cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
          {filtered.map(order => (
            <Card key={order.id} style={{ padding: '14px 16px', cursor: 'pointer' }}
              onClick={() => navigate('scan_pallet', { selectedOrder: order })}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 700, color: C.text, letterSpacing: '-0.3px' }}>{order.id}</div>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted, marginTop: 1 }}>{order.customer}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge state={order.state} label={order.state.replace(/_/g,' ')} />
                  <StreamBadge stream={order.stream} />
                </div>
              </div>
              <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted, marginBottom: 10 }}>{order.product}</div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: 'flex', gap: 16 }}>
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted, display: 'flex', gap: 4, alignItems: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {order.date}
                </span>
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted }}>
                  {order.pallets} pallet{order.pallets > 1 ? 's' : ''}
                </span>
                <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 12, color: C.muted }}>
                  {order.weight} kg
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
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
const ReceivingFormScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const handleConfirm = () => {
    navigate('in_storage_unprocessed', {
      selectedOrder: { ...order, stream: order.stream || 'irradiation' },
      palletId: 'PLT-A04-001',
      stream: order.stream || 'irradiation',
      palletState: 'RECEIVED',
    });
  };
  return (
    <PageWrapper title="Receiving" onBack={() => navigate('scan_bin')}
      bottomBar={<Btn label="Confirm Receiving" onClick={handleConfirm} color="orange" large />}>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle title="Receiving" />
          <PalletChip id="PLT-A04-001" />
        </div>
        <Card style={{ padding: '24px 16px', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36, margin: '0 auto 14px',
            background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>
            Receiving Placeholder
          </div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            Receiving details will be displayed here. Tap confirm to continue.
          </div>
        </Card>
      </div>
    </PageWrapper>
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
  SplashScreen, ScanEmployeeScreen, DashboardScreen,
  ScanPalletScreen, PalletItemsScreen,
  ScanBinScreen, SummaryScreen, ReceivingFormScreen,
  InStorageUnprocessedScreen, ScanBinStagingScreen,
});
