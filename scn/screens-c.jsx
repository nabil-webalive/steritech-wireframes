// SteriScan — Screens C: Post-Treatment, Errors, Override, Success, Fail
// ────────────────────────────────────────────────────────────────────────

// ── In Storage — Processed ────────────────────
const InStorageProcessedScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];

  return (
    <PageWrapper title="In Storage — Processed" onBack={() => navigate('dashboard')}
      bottomBar={
        <Btn label="Continue to QA →" onClick={() => navigate('qa_status')} color="teal" large />
      }>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle title="Treated Pallet Stored" subtitle="Awaiting QA review" />
          <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        </div>

        <Alert type="info" message="Pallet is treated and stored. Continue to QA when ready for review." />

        <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
          <InfoRow label="Status" valueEl={<Badge state="IN_STORAGE_PROCESSED" label="PROCESSED — AWAITING QA" />} />
          <InfoRow label="Zone" value={appData.binLocation || 'Zone C — Bay 02'} />
          <InfoRow label="Customer" value={order.customer} />
          <InfoRow label="Product" value={order.product} />
          <InfoRow label="Stream" valueEl={<StreamBadge stream={appData.stream || order.stream || 'irradiation'} />} />
          <InfoRow label="Process-Out" value="Apr 28, 2026 — 14:32" />
        </Card>
      </div>
    </PageWrapper>
  );
};

// ── QA Status ─────────────────────────────────
const QAStatusScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  // demo state: 'pending' | 'released' | 'hold'
  const [qaState, setQaState] = React.useState('pending');

  const stateConfig = {
    pending: {
      bg: '#FEF3C7', stroke: '#D97706',
      icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
      title: 'QA Review Pending',
      sub: 'Quality Assurance is reviewing this pallet. Continue to packing once released.',
      badge: { state: 'IN_TREATMENT', label: 'QA PENDING' },
    },
    released: {
      bg: '#DCFCE7', stroke: C.green,
      icon: <path d="M20 6L9 17l-5-5"/>,
      title: 'QA Released',
      sub: 'Pallet is cleared by QA. Proceed to packing.',
      badge: { state: 'QA_RELEASED', label: 'QA RELEASED' },
    },
    hold: {
      bg: '#FEE2E2', stroke: C.red,
      icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
      title: 'QA Hold Raised',
      sub: 'A PDR has been raised. This pallet cannot proceed until cleared.',
      badge: { state: 'QA_HOLD', label: 'QA HOLD' },
    },
  };
  const cfg = stateConfig[qaState];

  return (
    <PageWrapper title="QA Status" onBack={() => navigate('in_storage_processed')}
      bottomBar={
        qaState === 'released'
          ? <Btn label="Continue to Packing →" onClick={() => navigate('packing')} color="green" large />
          : qaState === 'hold'
            ? <Btn label="View QA Hold Details →" onClick={() => navigate('qa_hold', { pdrReference: 'PDR-2026-007' })} color="darkRed" large />
            : <Btn label="Awaiting QA Release…" disabled color="green" large />
      }>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <SectionTitle title="QA Review" />
          <Badge state={cfg.badge.state} label={cfg.badge.label} />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 18 }}/>

        {/* Status card */}
        <Card style={{ padding: '20px 16px', marginBottom: 14, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36, margin: '0 auto 14px',
            background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={cfg.stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {cfg.icon}
            </svg>
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {cfg.title}
          </div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted }}>
            {cfg.sub}
          </div>
        </Card>

        <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
          <InfoRow label="Pallet ID" value={appData.palletId || 'PLT-A04-001'} />
          <InfoRow label="Customer" value={order.customer} />
          <InfoRow label="Stream" valueEl={<StreamBadge stream={appData.stream || order.stream || 'irradiation'} />} />
          <InfoRow label="Process-Out" value="Apr 28, 2026 — 14:32" />
          {qaState !== 'pending' && <InfoRow label="QA Reviewer" value="Sarah Mitchell" />}
          {qaState !== 'pending' && <InfoRow label="Reviewed At" value="Apr 28, 2026 — 16:08" />}
        </Card>

        {/* Demo state switcher */}
        <div style={{
          background: C.surface, borderRadius: 12, padding: '10px 12px',
          border: `1px dashed ${C.border}`,
        }}>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Demo — set QA state
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['pending', 'released', 'hold'].map(s => (
              <button key={s} onClick={() => setQaState(s)} style={{
                flex: 1, padding: '7px 8px', borderRadius: 8,
                border: qaState === s ? `1.5px solid ${C.brand}` : `1px solid ${C.border}`,
                background: qaState === s ? '#EEF2FF' : '#fff',
                fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 600,
                color: qaState === s ? C.brand : C.text, cursor: 'pointer', textTransform: 'capitalize',
              }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Packing ───────────────────────────────────
const PackingScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const [packed, setPacked] = React.useState(false);
  const items = [
    { name: 'Surgical Instruments — Class II', qty: 48 },
    { name: 'Sterile Packaging Pouches',        qty: 200 },
    { name: 'Indicator Strips',                 qty: 120 },
  ];

  return (
    <PageWrapper title="Packing" onBack={() => navigate('qa_status')}
      bottomBar={
        packed
          ? <Btn label="Send to Dispatch →" onClick={() => navigate('dispatch', { palletState: 'PACKED' })} color="teal" large />
          : <Btn label="Confirm Packing Complete" onClick={() => setPacked(true)} color="orange" large />
      }>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <SectionTitle title="Pack Items" />
          <Badge state={packed ? 'QA_RELEASED' : 'IN_TREATMENT'} label={packed ? 'PACKED' : 'PACKING'} />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 18 }}/>

        <Card style={{ padding: '20px 16px', marginBottom: 14, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36, margin: '0 auto 14px',
            background: packed ? '#DCFCE7' : '#EEF2FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={packed ? C.green : C.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {packed
                ? <path d="M20 6L9 17l-5-5"/>
                : <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}
            </svg>
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {packed ? 'Packing Complete' : 'Ready to Pack'}
          </div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted }}>
            {packed
              ? 'All items packed. Send to dispatch when ready.'
              : 'Pack the items below into shipping cartons. Confirm when complete.'}
          </div>
        </Card>

        <SectionTitle title="Items to Pack" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, i) => (
            <Card key={i} style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 500, color: C.text, flex: 1 }}>{item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, color: C.orange }}>
                    Qty {item.qty}
                  </div>
                  {packed && (
                    <div style={{
                      width: 22, height: 22, borderRadius: 11,
                      background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

// ── QA Hold ───────────────────────────────────
const QAHoldScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const pdr = appData.pdrReference || 'PDR-2026-007';

  return (
    <PageWrapper title="QA Hold" onBack={null}
      bottomBar={<Btn label="Return to Dashboard" onClick={() => navigate('dashboard')} color="red" />}>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle title="Pallet Blocked" subtitle="QA review required" />
          <Badge state="QA_HOLD" label="QA HOLD" />
        </div>

        <Alert type="error"
          message="Pallet blocked — awaiting QA review in Business Central. No further movement is permitted until released." />

        <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
          <InfoRow label="PDR Reference" value={pdr} bold />
          <InfoRow label="Reason Code" value="Dosimetry out of range" />
          <InfoRow label="Pallet ID" value={appData.palletId || 'PLT-A04-001'} />
          <InfoRow label="Customer" value={order.customer} />
          <InfoRow label="Stream" valueEl={<StreamBadge stream={appData.stream || order.stream || 'irradiation'} />} />
          <InfoRow label="Raised" value="Apr 28, 2026 — 15:01" />
        </Card>

        <div style={{
          background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ margin: 0, fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
            Contact your QA supervisor and reference PDR <strong>{pdr}</strong>. Do not move or process this pallet until cleared.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Dispatch Confirmation ─────────────────────
const DispatchScreen = ({ navigate, appData }) => {
  const order = appData.selectedOrder || SAMPLE_ORDERS[0];
  const [confirmed, setConfirmed] = React.useState(false);

  const handleConfirm = () => {
    navigate('success', {
      palletState: 'SHIPPED',
      successMessage: `Pallet ${appData.palletId || 'PLT-A04-001'} dispatched successfully.\nOrder ${order.id} — ${order.customer}`,
      successTitle: 'DISPATCHED!',
    });
  };

  return (
    <PageWrapper title="Dispatch" onBack={() => navigate('packing')}
      bottomBar={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Confirm Dispatch" onClick={handleConfirm} color="green" />
        </div>
      }>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <SectionTitle title="Dispatch Confirmation" />
          <Badge state="QA_RELEASED" label="QA RELEASED" />
        </div>

        <Alert type="teal" message="Pallet cleared for dispatch. Confirm below to update state to SHIPPED." />

        <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
          <InfoRow label="Pallet ID" value={appData.palletId || 'PLT-A04-001'} bold />
          <InfoRow label="Order ID" value={order.id} />
          <InfoRow label="Customer" value={order.customer} />
          <InfoRow label="Product" value={order.product} />
          <InfoRow label="Stream" valueEl={<StreamBadge stream={appData.stream || order.stream || 'irradiation'} />} />
          <InfoRow label="Weight" value={`${order.weight} kg`} />
          <InfoRow label="QA Released" value="Apr 28, 2026 — 16:20" />
        </Card>

        <div style={{
          background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: '14px',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: '#166534', fontWeight: 500 }}>
            All gate checks passed — pallet is QA_RELEASED
          </span>
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Success Screen ────────────────────────────
const SuccessScreen = ({ navigate, appData }) => {
  const title = appData.successTitle || 'SUCCESS!';
  const msg = appData.successMessage || 'Operation completed successfully.';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <StatusBar />
      <NavBar title="SteriScan" showLogo />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
        {/* Success card */}
        <div style={{
          width: 220, height: 220, borderRadius: 16, background: C.white,
          border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,141,2,0.15)', marginBottom: 24,
        }}>
          <div style={{ width: 180, height: 180, borderRadius: 10, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* decorative triangle */}
            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, background: '#74b776', borderRadius: 4, transform: 'rotate(45deg)' }}/>
            <svg width="72" height="52" viewBox="0 0 72 52" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M4 26L26 48L68 4" stroke="#B7FFA9" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 24, fontWeight: 700, color: C.green, marginBottom: 10 }}>{title}</div>
        <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{msg}</div>
      </div>
      <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: '12px 20px' }}>
        <Btn label="Done — Back to Dashboard" onClick={() => navigate('dashboard')} color="green" />
      </div>
    </div>
  );
};

// ── Fail / Error Screen ───────────────────────
const FailScreen = ({ navigate, appData }) => {
  const msg = appData.failMessage || 'Scan failed or invalid location.';
  const retryScreen = appData.retryScreen || 'scan_bin';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <StatusBar />
      <NavBar title="Error" showLogo />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
        <div style={{
          width: 220, height: 220, borderRadius: 16, background: C.white,
          border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(141,0,0,0.15)', marginBottom: 24,
        }}>
          <div style={{ width: 180, height: 180, borderRadius: 10, background: C.darkRed, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, background: '#b74a4a', borderRadius: 4, transform: 'rotate(45deg)' }}/>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M4 4L48 48M48 4L4 48" stroke="#FFA9A9" strokeWidth="10" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 24, fontWeight: 700, color: C.darkRed, marginBottom: 10 }}>FAIL!!</div>
        <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 1.5 }}>{msg}</div>
        <div style={{ marginTop: 14, fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted }}>Contact your Supervisor</div>
      </div>
      <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Btn label="Retry Scan" onClick={() => navigate(retryScreen)} color="blue" />
        <Btn label="Back to Dashboard" onClick={() => navigate('dashboard')} color="red" outline />
      </div>
    </div>
  );
};

// ── Stream Error ──────────────────────────────
const StreamErrorScreen = ({ navigate, appData }) => (
  <PageWrapper title="Stream Error" onBack={() => navigate('dashboard')}
    bottomBar={<Btn label="Contact Supervisor" onClick={() => navigate('supervisor_pin', { overrideReason: 'Incomplete receiving data' })} color="red" />}>
    <div style={{ padding: '20px 16px' }}>
      <Alert type="error" message="Incomplete receiving data — cannot load treatment form. Service stream is missing or unrecognised for this pallet." />
      <Card style={{ padding: '14px 16px' }}>
        <InfoRow label="Pallet ID" value={appData.palletId || 'PLT-A04-001'} />
        <InfoRow label="Stream" value="UNKNOWN / MISSING" />
        <InfoRow label="Last Known State" value={appData.palletState || 'RECEIVED'} />
      </Card>
      <div style={{ marginTop: 20, fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        This error occurs when the pallet was not correctly received or the service stream was not set. A supervisor must authorise manual override to proceed.
      </div>
    </div>
  </PageWrapper>
);

// ── Supervisor PIN Entry ──────────────────────
const SupervisorPINScreen = ({ navigate, appData }) => {
  const [pin, setPin] = React.useState('');
  const [reason, setReason] = React.useState('zone_mismatch');
  const [notes, setNotes] = React.useState('');
  const [error, setError] = React.useState(false);

  const CORRECT_PIN = '123456';

  const handleDigit = d => {
    if (pin.length < 6) setPin(p => p + d);
  };
  const handleBack = () => setPin(p => p.slice(0, -1));
  const handleConfirm = () => {
    if (pin === CORRECT_PIN) {
      navigate('override_confirm', { supervisorName: 'Sarah Mitchell', overrideReason: reason, overrideNotes: notes });
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const REASONS = [
    { value: 'zone_mismatch',      label: 'Zone mismatch' },
    { value: 'state_mismatch',     label: 'State mismatch' },
    { value: 'emergency_movement', label: 'Emergency movement' },
    { value: 'other',              label: 'Other' },
  ];

  return (
    <PageWrapper title="Supervisor PIN" onBack={() => navigate('scan_bin')} showLogo>
      <div style={{ padding: '20px 16px 8px' }}>
        <SectionTitle title="Supervisor Override" subtitle="A 6-digit supervisor PIN is required to proceed" />

        {appData.overrideReason && (
          <Alert type="warning" message={`Override triggered: ${appData.overrideReason}`} />
        )}

        {/* PIN dots */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 12, margin: '20px 0',
        }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{
              width: 44, height: 44, borderRadius: 22,
              border: `2px solid ${error ? C.red : pin.length > i ? C.brand : C.border}`,
              background: pin.length > i ? (error ? C.red : C.brand) : C.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
              {pin.length > i && <div style={{ width: 10, height: 10, borderRadius: 5, background: '#fff' }}/>}
            </div>
          ))}
        </div>
        {error && <p style={{ textAlign: 'center', color: C.red, fontFamily: 'DM Sans,sans-serif', fontSize: 13, margin: '-8px 0 16px', fontWeight: 600 }}>Incorrect PIN — try again</p>}

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
            <button key={i} onClick={() => d === '⌫' ? handleBack() : d ? handleDigit(d) : null}
              disabled={!d}
              style={{
                height: 56, borderRadius: 14,
                background: d === '⌫' ? '#FEE2E2' : d ? C.white : 'transparent',
                border: d ? `1.5px solid ${C.border}` : 'none',
                fontFamily: 'DM Sans,sans-serif', fontSize: d === '⌫' ? 18 : 22, fontWeight: 600,
                color: d === '⌫' ? C.red : C.text, cursor: d ? 'pointer' : 'default',
                boxShadow: d ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}>{d}</button>
          ))}
        </div>

        <Select label="Reason Code" value={reason} onChange={e => setReason(e.target.value)} options={REASONS} />
        <Field label="Mandatory Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe the reason for override..." />
        <div style={{ height: 2 }}/>
        <Btn label="Confirm Override" onClick={handleConfirm} color="blue" disabled={pin.length < 6 || !notes} />
        <div style={{ height: 8 }}/>
        <Btn label="Cancel" onClick={() => navigate('scan_bin')} color="red" outline />
        <div style={{ height: 8, fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 8 }}>
          Demo PIN: 123456
        </div>
      </div>
    </PageWrapper>
  );
};

// ── Override Confirm ──────────────────────────
const OverrideConfirmScreen = ({ navigate, appData }) => {
  const auditRef = `AUD-${Date.now().toString().slice(-6)}`;

  return (
    <PageWrapper title="Override Review" showLogo
      bottomBar={
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Btn label="Approve" onClick={() => navigate('scan_bin', { overrideApproved: true })} color="green" />
          </div>
          <div style={{ flex: 1 }}>
            <Btn label="Disapprove" onClick={() => navigate('fail', { failMessage: 'Supervisor override disapproved.', retryScreen: 'scan_bin' })} color="red" />
          </div>
        </div>
      }>
      <div style={{ padding: '20px 16px' }}>
        <SectionTitle title="Override Confirmation" subtitle="Review and approve or disapprove this override" />

        <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
          <InfoRow label="Supervisor" value={appData.supervisorName || 'Sarah Mitchell'} bold />
          <InfoRow label="Reason Code" value={(appData.overrideReason || 'zone_mismatch').replace(/_/g, ' ')} />
          <InfoRow label="Notes" value={appData.overrideNotes || 'Emergency relocation authorised'} />
          <InfoRow label="Pallet ID" value={appData.palletId || 'PLT-A04-001'} />
          <InfoRow label="Action" value="Override location gate" />
          <InfoRow label="Audit Reference" value={auditRef} bold />
          <InfoRow label="Timestamp" value={new Date().toLocaleString('en-AU', { dateStyle:'medium', timeStyle:'short' })} />
        </Card>

        <Alert type="warning" message="This override will be permanently recorded in the audit log. Approve only if you are satisfied the reason is valid." />
      </div>
    </PageWrapper>
  );
};

Object.assign(window, {
  InStorageProcessedScreen, QAStatusScreen, PackingScreen, QAHoldScreen, DispatchScreen,
  SuccessScreen, FailScreen, StreamErrorScreen,
  SupervisorPINScreen, OverrideConfirmScreen,
});
