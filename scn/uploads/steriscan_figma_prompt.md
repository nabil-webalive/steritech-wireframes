# SteriScan — Figma prototype prompt

## App overview
Mobile warehouse scanning app for Steritech. Tracks pallet movement from dock arrival to dispatch across three treatment streams: Irradiation (Mevex), EtO, and Packing. Every physical movement requires a scan. No scan = no movement.

**Target device:** Android phone, 390×844pt frames  
**Brand:** Dark navy / Steritech blue — match existing frames  
**Key rule:** Service stream is set once at Receiving and stored against the Pallet ID. All subsequent form routing is automatic based on that stream — the operator never manually selects a form.

---

## Existing frames (keep, do not recreate)
| Frame | Description |
|---|---|
| `Login / Splash` | Steritech branded login |
| `Scan Employee ID` | Barcode/QR scan for auth + 2FA fallback |
| `Scan Bin Location` | Camera viewfinder for pallet QR scan |
| `Summary` | All items in pallet, product lines + quantities |
| `Success Screen` | Green confirmation after any successful scan event |
| `Fail / Error Screen` | Red error screen for failed scans or gate violations |

---

## Screens to generate

### Auth & navigation
**Dashboard** — purchase order list. Rows show: order ID, customer, pallet count, pallet state badge. Top nav with SteriScan logo + logout. "Start Scan" CTA at bottom.

### Receiving
**Receiving Form** — triggered on first dock scan. Fields: customer name (read-only), product description, quantity, service stream (Irradiation / EtO / Packing), gross weight (kg), box count. Stream is stored against Pallet ID here — drives all downstream routing. Confirm → prints Zebra ZD421 label → state: RECEIVED.

**In Storage — Unprocessed** — shows Pallet ID, zone name, IN_STORAGE_UNPROCESSED badge. Relocation button for moves within unprocessed zones. "Continue to Staging" button.

### Staging (auto-routed by stream — operator scans pallet QR, form loads automatically)
**Staging Form — Irradiation** — fields: slave pallet ID (scan), target dose range min/max kGy (read-only from BC), conveyor run ID, operator notes. Confirm → state: STAGED.

**Staging Form — EtO** — fields: chamber ID (dropdown), cycle type, scheduled start time, operator notes. Confirm → state: STAGED.

**Staging Form — Packing** — fields: packing line ID, pack type, target completion time, operator notes. Confirm → state: STAGED.

### Treatment
**Treatment Active** — shows Pallet ID, treatment type badge, progress indicator, estimated completion. Read-only. "Scan Process-Out" button activates on completion.

### Process-out (auto-routed by stream — operator scans pallet QR, form loads automatically)
**Process-Out — Irradiation** — fields: dosimetry min kGy, dosimetry max kGy, target range reference, auto pass/fail validation. If out of range: red banner + "Raise PDR" button. Confirm → state: PROCESS_OUT.

**Process-Out — EtO** — fields: actual cycle duration, aeration time (hrs), temperature (°C), residue reading (ppm). Confirm → state: PROCESS_OUT.

**Process-Out — Packing** — fields: final packed quantity, damaged units (default 0). Confirm → state: PROCESS_OUT.

### Post-treatment
**In Storage — Processed** — same layout as unprocessed but teal PROCESSED badge. Hard gate: red banner blocks entry if pallet state is not PROCESS_OUT. "Proceed to QA" button.

**QA Hold** — shown when PDR raised or dosimetry out of range. Shows PDR reference, reason code, red QA_HOLD badge, message: "Pallet blocked — awaiting QA review in Business Central." Close → Dashboard only.

**Dispatch Confirmation** — shows Pallet ID, customer, order ID, green QA_RELEASED badge. Gate enforced: red banner blocks if not QA_RELEASED. Confirm → state: SHIPPED → Success Screen.

### Error handling
**Stream Error** — shown if service stream is missing or unrecognised at staging or process-out. Red banner: "Incomplete receiving data — cannot load treatment form." Single action: "Contact supervisor" → Supervisor PIN Entry.

### Override flow
**Supervisor PIN Entry** — triggered by invalid location scan. Numeric PIN pad (6-digit), reason code dropdown (Zone mismatch / State mismatch / Emergency movement / Other), mandatory notes. Cancel + Confirm.

**Override Confirm** — shows supervisor name, reason code, action being overridden, audit log reference. Approve (green) → Scan Bin Location. Disapprove (red) → Scan Bin Location + error toast.

---

## Pallet state badge colours
| State | Colour |
|---|---|
| RECEIVED | Grey |
| STAGED / IN_TREATMENT | Amber |
| PROCESS_OUT / QA_RELEASED | Teal |
| QA_HOLD | Red |
| SHIPPED | Green |

---

## Prototype connections
```
Login / Splash → [Login] → Scan Employee ID
Scan Employee ID → [success] → Dashboard
Scan Employee ID → [fail] → Fail / Error Screen → [retry] → Scan Employee ID

Dashboard → [tap order / Start Scan] → Scan Bin Location
Scan Bin Location → [valid] → Summary
Scan Bin Location → [invalid scan] → Fail / Error Screen
Scan Bin Location → [invalid location] → Supervisor PIN Entry

Summary → [Continue] → Receiving Form
Receiving Form → [Confirm] → In Storage — Unprocessed → Success Screen

In Storage — Unprocessed → [Continue to Staging] → operator scans pallet QR →
  stream = Irradiation → Staging Form — Irradiation
  stream = EtO        → Staging Form — EtO
  stream = Packing    → Staging Form — Packing
  stream missing      → Stream Error

All Staging Forms → [Confirm] → Treatment Active

Treatment Active → [Scan Process-Out] → operator scans pallet QR →
  stream = Irradiation → Process-Out — Irradiation
  stream = EtO        → Process-Out — EtO
  stream = Packing    → Process-Out — Packing
  stream missing      → Stream Error

Process-Out — Irradiation → [in range] → In Storage — Processed
Process-Out — Irradiation → [out of range] → QA Hold
Process-Out — EtO     → [Confirm] → In Storage — Processed
Process-Out — Packing → [Confirm] → In Storage — Processed

In Storage — Processed → [Proceed to QA] → pending banner →
  [QA_RELEASED pushed from BC] → Dispatch Confirmation
Dispatch Confirmation → [Confirm] → Success Screen

Stream Error → [Contact supervisor] → Supervisor PIN Entry
Supervisor PIN Entry → [valid PIN] → Override Confirm
Override Confirm → [Approve]     → Scan Bin Location
Override Confirm → [Disapprove]  → Scan Bin Location + error toast

All Success Screens → [Done] → Dashboard
All Fail / Error Screens → [Retry] → previous screen
All Fail / Error Screens → [Back to Dashboard] → Dashboard
```

---

## Design constraints
- Match dark navy / Steritech blue from existing frames
- Top nav bar: SteriScan logo + back arrow — consistent across all screens
- All forms: sticky confirm button at bottom, scrollable content above
- All scan screens: camera viewfinder card centred, "Scan or enter manually" text link below
- Scan viewfinder activates camera; fallback is manual Pallet ID text entry
- Service stream is never a user choice after Receiving — system-driven only
