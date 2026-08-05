// SteriScan — Screens B: Staging, Treatment, Process-Out
// ────────────────────────────────────────────────────────

// ── Staging Form — Irradiation ────────────────
const StagingIrradiationScreen = ({ navigate, appData }) => {
  const [slaveId, setSlaveId] = React.useState('');
  const [conveyorRun, setConveyorRun] = React.useState('');
  const [notes, setNotes] = React.useState('');

  return (
    <PageWrapper title="Staging — Irradiation" onBack={() => navigate('in_storage_unprocessed')}
      bottomBar={<Btn label="Confirm Staging" onClick={() => navigate('treatment_active', { palletState: 'STAGED', treatmentType: 'irradiation' })} color="orange" disabled={!slaveId || !conveyorRun} />}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <SectionTitle title="Irradiation Staging" />
          <StreamBadge stream="irradiation" />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 16 }}/>

        <Card style={{ padding: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Slave Pallet ID</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={slaveId} onChange={e => setSlaveId(e.target.value)} placeholder="Scan or enter ID"
                style={{ flex: 1, height: 44, borderRadius: 10, padding: '0 12px', border: `1.5px solid #D1CEC9`, background: C.white, fontFamily: 'DM Sans,sans-serif', fontSize: 15, color: C.text, outline: 'none', boxSizing: 'border-box' }}/>
              <button onClick={() => setSlaveId('SLAVE-2026-009')} style={{
                height: 44, width: 44, borderRadius: 10, border: `1.5px solid ${C.accent}`,
                background: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/>
                  <rect x="3" y="16" width="5" height="5" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1"/>
                  <line x1="10" y1="5.5" x2="14" y2="5.5"/><line x1="10" y1="18.5" x2="14" y2="18.5"/>
                  <line x1="5.5" y1="10" x2="5.5" y2="14"/><line x1="18.5" y1="10" x2="18.5" y2="14"/>
                </svg>
              </button>
            </div>
          </div>
          <Field label="Target Dose Range Min (kGy)" value="25.0" readOnly />
          <Field label="Target Dose Range Max (kGy)" value="45.0" readOnly />
          <Field label="Conveyor Run ID" value={conveyorRun} onChange={e => setConveyorRun(e.target.value)} placeholder="e.g. RUN-2026-014" />
          <Field label="Operator Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
        </Card>
      </div>
    </PageWrapper>
  );
};

// ── Staging Form — EtO ────────────────────────
const StagingEtOScreen = ({ navigate, appData }) => {
  const [chamber, setChamber] = React.useState('CH-03');
  const [cycleType, setCycleType] = React.useState('standard');
  const [startTime, setStartTime] = React.useState('2026-04-29T08:00');
  const [notes, setNotes] = React.useState('');

  return (
    <PageWrapper title="Staging — EtO" onBack={() => navigate('in_storage_unprocessed')}
      bottomBar={<Btn label="Confirm Staging" onClick={() => navigate('treatment_active', { palletState: 'STAGED', treatmentType: 'eto' })} color="orange" />}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <SectionTitle title="EtO Staging" />
          <StreamBadge stream="eto" />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 16 }}/>
        <Card style={{ padding: 16 }}>
          <Select label="Chamber ID" value={chamber} onChange={e => setChamber(e.target.value)}
            options={['CH-01','CH-02','CH-03','CH-04','CH-05'].map(v => ({ value: v, label: v }))} />
          <Select label="Cycle Type" value={cycleType} onChange={e => setCycleType(e.target.value)}
            options={[
              { value: 'standard', label: 'Standard (12hr)' },
              { value: 'extended', label: 'Extended (24hr)' },
              { value: 'rapid',    label: 'Rapid (6hr)' },
            ]} />
          <Field label="Scheduled Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} type="datetime-local" />
          <Field label="Operator Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
        </Card>
      </div>
    </PageWrapper>
  );
};

// ── Staging Form — Packing ────────────────────
const StagingPackingScreen = ({ navigate, appData }) => {
  const [lineId, setLineId] = React.useState('');
  const [packType, setPackType] = React.useState('blister');
  const [targetTime, setTargetTime] = React.useState('2026-04-29T14:00');
  const [notes, setNotes] = React.useState('');

  return (
    <PageWrapper title="Staging — Packing" onBack={() => navigate('in_storage_unprocessed')}
      bottomBar={<Btn label="Confirm Staging" onClick={() => navigate('treatment_active', { palletState: 'STAGED', treatmentType: 'packing' })} color="orange" disabled={!lineId} />}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <SectionTitle title="Packing Staging" />
          <StreamBadge stream="packing" />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 16 }}/>
        <Card style={{ padding: 16 }}>
          <Field label="Packing Line ID" value={lineId} onChange={e => setLineId(e.target.value)} placeholder="e.g. LINE-04" />
          <Select label="Pack Type" value={packType} onChange={e => setPackType(e.target.value)}
            options={[
              { value: 'blister',  label: 'Blister Pack' },
              { value: 'pouch',    label: 'Sterile Pouch' },
              { value: 'tray',     label: 'Tray & Lid' },
              { value: 'bulk_bag', label: 'Bulk Bag' },
            ]} />
          <Field label="Target Completion Time" value={targetTime} onChange={e => setTargetTime(e.target.value)} type="datetime-local" />
          <Field label="Operator Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
        </Card>
      </div>
    </PageWrapper>
  );
};

// ── Treatment Active ──────────────────────────
const TreatmentActiveScreen = ({ navigate, appData }) => {
  const type = appData.treatmentType || 'irradiation';
  const [processed, setProcessed] = React.useState(false);

  const typeLabel = { irradiation: 'Irradiation', eto: 'EtO Treatment', packing: 'Packing' }[type];

  const handleProcessOut = () => {
    const dest = { irradiation: 'process_out_irradiation', eto: 'process_out_eto', packing: 'process_out_packing' }[type];
    navigate(dest, { palletState: 'PROCESS_OUT' });
  };

  return (
    <PageWrapper title="Treatment" onBack={() => navigate('dashboard')}
      bottomBar={
        processed
          ? <Btn label="Scan Process-Out →" onClick={handleProcessOut} color="green" large />
          : <Btn label="Scan Process-Out" disabled color="green" large />
      }>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <SectionTitle title={typeLabel} />
          <Badge state={processed ? 'PROCESS_OUT' : 'IN_TREATMENT'} label={processed ? 'PROCESSED' : 'IN TREATMENT'} />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 18 }}/>

        {/* Status card */}
        <Card style={{ padding: '20px 16px', marginBottom: 14, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36, margin: '0 auto 14px',
            background: processed ? '#DCFCE7' : '#FEF3C7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {processed ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            )}
          </div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {processed ? 'Treatment Complete' : 'Treatment In Progress'}
          </div>
          <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, color: C.muted }}>
            {processed
              ? 'Pallet is processed and ready for process-out scan.'
              : 'Pallet is currently undergoing treatment. Scan process-out when treatment is complete.'}
          </div>
          {!processed && (
            <button onClick={() => setProcessed(true)} style={{
              marginTop: 14, background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '6px 14px', fontFamily: 'DM Sans,sans-serif',
              fontSize: 12, color: C.muted, cursor: 'pointer',
            }}>Mark as processed (demo) →</button>
          )}
        </Card>

        <Card style={{ padding: '14px 16px' }}>
          <InfoRow label="Treatment Type" valueEl={<StreamBadge stream={type} />} />
          <InfoRow label="Started" value="Apr 28, 2026 — 07:14" />
          <InfoRow label="Chamber / Line" value={type === 'eto' ? 'CH-03' : type === 'packing' ? 'LINE-04' : 'Conveyor B'} />
          <InfoRow label="Target Dose / Cycle" value={type === 'irradiation' ? '25 – 45 kGy' : type === 'eto' ? 'Standard 12hr' : 'Blister Pack'} />
        </Card>
      </div>
    </PageWrapper>
  );
};

// ── Process-Out — Irradiation ─────────────────
const ProcessOutIrradiationScreen = ({ navigate, appData }) => {
  const [doseMin, setDoseMin] = React.useState('27.3');
  const [doseMax, setDoseMax] = React.useState('41.8');
  const targetMin = 25.0, targetMax = 45.0;
  const min = parseFloat(doseMin), max = parseFloat(doseMax);
  const inRange = !isNaN(min) && !isNaN(max) && min >= targetMin && max <= targetMax && min < max;

  const handleConfirm = () => {
    if (inRange) navigate('in_storage_processed', { palletState: 'PROCESS_OUT' });
    else navigate('qa_hold', { palletState: 'QA_HOLD', pdrReference: 'PDR-2026-007' });
  };

  return (
    <PageWrapper title="Process-Out" onBack={() => navigate('treatment_active')}
      bottomBar={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!inRange && doseMin && doseMax && (
            <Btn label="Raise PDR" onClick={() => navigate('qa_hold', { palletState: 'QA_HOLD', pdrReference: 'PDR-2026-007' })} color="darkRed" />
          )}
          <Btn label="Confirm Process-Out" onClick={handleConfirm} color={inRange ? 'green' : 'red'} />
        </div>
      }>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <SectionTitle title="Irradiation Process-Out" />
          <StreamBadge stream="irradiation" />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 16 }}/>

        {doseMin && doseMax && (
          <Alert
            type={inRange ? 'teal' : 'error'}
            message={inRange
              ? `✓ Dosimetry within range (${targetMin}–${targetMax} kGy). Ready to confirm.`
              : `✗ Dosimetry out of range! Entered: ${doseMin}–${doseMax} kGy. Target: ${targetMin}–${targetMax} kGy.`}
          />
        )}

        <Card style={{ padding: 16 }}>
          <Field label="Dosimetry Min (kGy)" value={doseMin} onChange={e => setDoseMin(e.target.value)} type="number" placeholder="Enter measured min" />
          <Field label="Dosimetry Max (kGy)" value={doseMax} onChange={e => setDoseMax(e.target.value)} type="number" placeholder="Enter measured max" />
          <Field label="Target Range Reference" value={`${targetMin} – ${targetMax} kGy (from BC)`} readOnly />
          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Auto Validation</label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 10, background: inRange ? '#F0FDF4' : '#FEF2F2',
              border: `1.5px solid ${inRange ? '#86EFAC' : '#FECACA'}`,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                background: inRange ? C.green : C.red,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontSize: 14 }}>{inRange ? '✓' : '✗'}</span>
              </div>
              <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 600, color: inRange ? '#15803D' : '#991B1B' }}>
                {inRange ? 'PASS — Within specification' : 'FAIL — Out of specification'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

// ── Process-Out — EtO ─────────────────────────
const ProcessOutEtOScreen = ({ navigate, appData }) => {
  const [duration, setDuration] = React.useState('12.5');
  const [aeration, setAeration] = React.useState('24');
  const [temp, setTemp] = React.useState('54');
  const [residue, setResidue] = React.useState('1.2');

  return (
    <PageWrapper title="Process-Out — EtO" onBack={() => navigate('treatment_active')}
      bottomBar={<Btn label="Confirm Process-Out" onClick={() => navigate('in_storage_processed', { palletState: 'PROCESS_OUT' })} color="green" disabled={!duration || !aeration} />}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <SectionTitle title="EtO Process-Out" />
          <StreamBadge stream="eto" />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 16 }}/>
        <Card style={{ padding: 16 }}>
          <Field label="Actual Cycle Duration (hrs)" value={duration} onChange={e => setDuration(e.target.value)} type="number" />
          <Field label="Aeration Time (hrs)" value={aeration} onChange={e => setAeration(e.target.value)} type="number" />
          <Field label="Temperature (°C)" value={temp} onChange={e => setTemp(e.target.value)} type="number" />
          <Field label="Residue Reading (ppm)" value={residue} onChange={e => setResidue(e.target.value)} type="number" />
        </Card>
      </div>
    </PageWrapper>
  );
};

// ── Process-Out — Packing ─────────────────────
const ProcessOutPackingScreen = ({ navigate, appData }) => {
  const [finalQty, setFinalQty] = React.useState('368');
  const [damaged, setDamaged] = React.useState('0');

  return (
    <PageWrapper title="Process-Out — Packing" onBack={() => navigate('treatment_active')}
      bottomBar={<Btn label="Confirm Process-Out" onClick={() => navigate('in_storage_processed', { palletState: 'PROCESS_OUT' })} color="green" disabled={!finalQty} />}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <SectionTitle title="Packing Process-Out" />
          <StreamBadge stream="packing" />
        </div>
        <PalletChip id={appData.palletId || 'PLT-A04-001'} />
        <div style={{ height: 16 }}/>
        <Card style={{ padding: 16 }}>
          <Field label="Final Packed Quantity" value={finalQty} onChange={e => setFinalQty(e.target.value)} type="number" />
          <Field label="Damaged Units" value={damaged} onChange={e => setDamaged(e.target.value)} type="number" />
          {parseInt(damaged) > 0 && (
            <Alert type="warning" message={`${damaged} damaged unit(s) recorded. This will be flagged in the dispatch report.`} />
          )}
        </Card>
      </div>
    </PageWrapper>
  );
};

Object.assign(window, {
  StagingIrradiationScreen, StagingEtOScreen, StagingPackingScreen,
  TreatmentActiveScreen,
  ProcessOutIrradiationScreen, ProcessOutEtOScreen, ProcessOutPackingScreen,
});
