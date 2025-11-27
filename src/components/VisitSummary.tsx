import { useEffect, useMemo, useState } from "react";

// --- Minimal UI primitives (Tailwind-only; no external UI deps) ---
const Btn = ({ children, onClick, variant = "primary", size = "md", className = "", disabled }) => {
  const base = "inline-flex items-center justify-center rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-400",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    outline: "border border-neutral-300 text-neutral-800 hover:bg-neutral-50 focus:ring-neutral-400",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = "neutral" }) => {
  const colors = {
    neutral: "bg-neutral-100 text-neutral-800",
    info: "bg-blue-100 text-blue-700",
    warn: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-700",
    success: "bg-emerald-100 text-emerald-800",
    violet: "bg-violet-100 text-violet-800",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${colors[color]}`}>{children}</span>;
};

const Card = ({ title, subtitle, right, children, className = "" }) => (
  <div className={`rounded-2xl border border-neutral-200 bg-white shadow-sm ${className}`}>
    {(title || right || subtitle) && (
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div>
          {title && <div className="text-sm font-semibold text-neutral-900">{title}</div>}
          {subtitle && <div className="text-xs text-neutral-500">{subtitle}</div>}
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

const Toggle = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-2xl border border-neutral-300 bg-white p-1">
    {options.map((opt) => (
      <button
        key={opt}
        className={`px-3 py-1.5 text-sm rounded-xl ${value === opt ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
        onClick={() => onChange(opt)}
      >
        {opt}
      </button>
    ))}
  </div>
);

const ToggleChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-3 py-1 text-xs transition ${active ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"}`}
  >
    {label}
  </button>
);

const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Textarea = ({ value, onChange, rows = 6, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Divider = () => <div className="h-px w-full bg-neutral-200" />;

const SectionHeader = ({ title, actions }) => (
  <div className="mb-3 flex items-center justify-between">
    <div className="text-sm font-semibold text-neutral-900">{title}</div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

const ProvenanceChip = ({ label, conf = 0.9 }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs text-neutral-700">
    <span className="h-2 w-2 rounded-full bg-emerald-500" />
    {label}
    <span className="ml-1 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] text-neutral-600">{Math.round(conf * 100)}%</span>
  </span>
);

// --- Mock data ---
const mockPatient = {
  name: "Jussi Laine",
  age: 46,
  sex: "Male",
  id: "CNX-000187",
  allergies: ["Penicillin"],
  alerts: ["Hypertension"],
  language: "Finnish",
  consent: true,
};

const mockVitals = {
  BP: "138/86 mmHg",
  HR: "78 bpm",
  Temp: "37.2 °C",
  RR: "16",
  SpO2: "98%",
};

const redFlags = [
  { id: "rf1", text: "Chest pain with dyspnea", suggestion: "Consider ECG and troponin; urgent evaluation." },
  { id: "rf2", text: "Severe headache (thunderclap)", suggestion: "Rule out subarachnoid hemorrhage." },
  { id: "rf3", text: "Fever with hypotension", suggestion: "Sepsis screen; fluids and labs." },
];

const guidelinePrompts = [
  { id: "gp1", title: "Acute Cough (Adult)", actions: ["Focused ROS", "Chest exam", "Consider CXR if red flags"] },
  { id: "gp2", title: "UTI Workup (Female)", actions: ["Urine dip (LOINC 5804-0)", "Urine culture (LOINC 630-4)", "Pregnancy test if applicable"] },
];

const orderSets = [
  { id: "os1", title: "UTI Order Set", plan: ["Urine dipstick", "Urine culture", "Empiric nitrofurantoin 100 mg BID 5 days (RxNorm)"] },
  { id: "os2", title: "Low Back Pain (No red flags)", plan: ["Paracetamol PRN", "Active mobilization", "Patient education handout"] },
];

const problemsSeed = [
  { id: "p1", name: "Acute cough", codes: ["ICD-10: R05"], subjective: "3 days of dry cough, worse at night.", objective: "Chest clear, no crackles.", assessment: "Likely viral URI.", plan: "Supportive care; return if red flags." },
  { id: "p2", name: "Hypertension", codes: ["ICD-10: I10"], subjective: "Home readings variable.", objective: "BP 138/86.", assessment: "Controlled on current meds.", plan: "Continue amlodipine; review in 3 months." },
];

// --- Main Component ---
export default function VisitNoteSummaryWireframe() {
  const [layout, setLayout] = useState("SOAP"); // "SOAP" | "Problem"
  const [showSources, setShowSources] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [subjective, setSubjective] = useState("Patient reports dry cough for 3 days, worse at night. Denies chest pain, dyspnea.");
  const [objective, setObjective] = useState(`Vitals: BP ${mockVitals.BP}, HR ${mockVitals.HR}, Temp ${mockVitals.Temp}, RR ${mockVitals.RR}, SpO₂ ${mockVitals.SpO2}. Chest: clear, no wheeze.`);
  const [assessment, setAssessment] = useState("1) Acute cough — likely viral upper respiratory infection. 2) Hypertension — controlled.");
  const [plan, setPlan] = useState("Supportive care (fluids, rest). Return precautions given. Continue amlodipine 5 mg daily.");
  const [problems, setProblems] = useState(problemsSeed);

  const [visitSummaryOpen, setVisitSummaryOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [encountersOpen, setEncountersOpen] = useState(false);

  const [signed, setSigned] = useState(false);
  const [startedAt] = useState(Date.now());
  const timeToSign = useMemo(() => (signed ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : null), [signed, startedAt]);

  // Simulate dictation by appending sample text when "recording"
  useEffect(() => {
    if (!recording) return;
    const sample = [
      " Patient states cough worse when lying down.",
      " No fever or chills.",
      " Exposure to sick contact at work.",
    ];
    let i = 0;
    const id = setInterval(() => {
      setTranscript((t) => (t + sample[i % sample.length]));
      i++;
      if (i > 3) {
        setRecording(false);
        clearInterval(id);
      }
    }, 900);
    return () => clearInterval(id);
  }, [recording]);

  const addToPlan = (text) => setPlan((p) => (p.trim() ? p + "\n- " + text : "- " + text));
  const addSnippet = (text) => setSubjective((s) => (s.trim() ? s + " " + text : text));

  const addOrderSet = (os) => {
    os.plan.forEach((line) => addToPlan(line));
  };

  const addProblem = () => {
    const id = "p" + (problems.length + 1);
    setProblems((ps) => [
      ...ps,
      { id, name: "New problem", codes: [], subjective: "", objective: "", assessment: "", plan: "" },
    ]);
  };

  const updateProblem = (id, key, val) => {
    setProblems((ps) => ps.map((p) => (p.id === id ? { ...p, [key]: val } : p)));
  };

  const deleteProblem = (id) => setProblems((ps) => ps.filter((p) => p.id !== id));

  const handleSign = () => {
    setSigned(true);
  };

  const patientSummary = useMemo(() => {
    return `You were seen for a cough. Your vital signs are okay. We think this is likely a viral infection. Rest, drink fluids, and you can use over-the-counter pain relief if needed. Come back or seek urgent care if you develop high fever, trouble breathing, chest pain, or if symptoms worsen.`;
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-4 md:p-6">
      {/* Top Header */}
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xl font-semibold text-neutral-900">Visit Note Summary</div>
            <Toggle options={["SOAP", "Problem"]} value={layout} onChange={setLayout} />
            <ToggleChip label="Show sources" active={showSources} onClick={() => setShowSources((s) => !s)} />
            {signed && (
              <Badge color="success">Signed • {timeToSign}s</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="outline" onClick={() => setEncountersOpen(true)}>Previous encounters</Btn>
            <Btn variant="secondary" onClick={() => setReconcileOpen(true)}>Reconcile meds</Btn>
            <Btn variant="primary" onClick={handleSign}>Sign & Share</Btn>
          </div>
        </div>

        {/* Patient Banner */}
        <Card
          className="mb-4"
          title={`${mockPatient.name} • ${mockPatient.age}y • ${mockPatient.sex}`}
          subtitle={`ID ${mockPatient.id} • Language: ${mockPatient.language}`}
          right={
            <div className="flex items-center gap-2">
              {mockPatient.allergies.length > 0 && <Badge color="danger">Allergy: {mockPatient.allergies.join(", ")}</Badge>}
              {mockPatient.alerts.map((a) => (<Badge key={a} color="warn">Alert: {a}</Badge>))}
              {mockPatient.consent ? <Badge color="success">Consent on record</Badge> : <Badge color="warn">Consent needed</Badge>}
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-3 text-sm text-neutral-700 md:grid-cols-4">
            <div>
              <div className="text-neutral-500">Reason for visit</div>
              <div>Cough and fatigue</div>
            </div>
            <div>
              <div className="text-neutral-500">Location</div>
              <div>Primary Care • Room 4</div>
            </div>
            <div>
              <div className="text-neutral-500">Triage priority</div>
              <div>Routine</div>
            </div>
            <div>
              <div className="text-neutral-500">Clinician</div>
              <div>Dr. Korhonen (GP)</div>
            </div>
          </div>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_2fr_1fr]">
          {/* Live Capture */}
          <Card title="Live Capture (Speech-to-Text)" subtitle="Dictate and insert into Subjective">
            <div className="mb-3 flex items-center gap-2">
              <Btn variant={recording ? "danger" : "primary"} onClick={() => setRecording((r) => !r)}>
                {recording ? "Stop" : "Start"} mic
              </Btn>
              <Btn variant="secondary" onClick={() => setTranscript((t) => t + " Patient denies chest pain or shortness of breath.")}>Insert snippet: denies CP/SOB</Btn>
              <Btn variant="secondary" onClick={() => addSnippet("Denies fever/chills.")}>Snippet to Subjective</Btn>
            </div>
            <Textarea rows={6} value={transcript} onChange={setTranscript} placeholder="Live transcript…" />
            <div className="mt-3 flex items-center gap-2">
              <Btn variant="outline" onClick={() => setSubjective((s) => (s + (s ? "\n" : "") + transcript))}>
                Send transcript → Subjective
              </Btn>
              <Btn variant="ghost" onClick={() => setTranscript("")}>Clear transcript</Btn>
            </div>
          </Card>

          {/* Note Composer */}
          <Card
            title={layout === "SOAP" ? "Note Composer — SOAP" : "Note Composer — Problem-oriented"}
            subtitle="Edit, review sources, and finalize"
            right={<Badge color="info">Provenance & confidence visible</Badge>}
          >
            {layout === "SOAP" ? (
              <div className="space-y-4">
                {/* Subjective */}
                <div>
                  <SectionHeader title="Subjective (HPI/ROS)" actions={<Btn variant="ghost" onClick={() => addSnippet("No red flags reported.")}>Quick add</Btn>} />
                  <Textarea value={subjective} onChange={setSubjective} rows={6} />
                  {showSources && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ProvenanceChip label="Patient speech" conf={0.86} />
                      <ProvenanceChip label="Prev. Encounter 2025-06-01" conf={0.75} />
                    </div>
                  )}
                </div>
                <Divider />
                {/* Objective */}
                <div>
                  <SectionHeader title="Objective (Vitals/PE/Labs)" />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Card className="border-neutral-200" title="Vitals" subtitle="Observation">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {Object.entries(mockVitals).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between"><span className="text-neutral-500">{k}</span><span className="font-medium">{v}</span></div>
                        ))}
                      </div>
                    </Card>
                    <Card className="border-neutral-200" title="Exam" subtitle="Physical Examination">
                      <Textarea rows={4} value={objective} onChange={setObjective} />
                    </Card>
                  </div>
                  {showSources && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ProvenanceChip label="Vitals (Observation)" conf={0.98} />
                      <ProvenanceChip label="Chest exam (Clinician)" conf={0.9} />
                    </div>
                  )}
                </div>
                <Divider />
                {/* Assessment */}
                <div>
                  <SectionHeader title="Assessment (Diagnoses)" actions={<Btn variant="ghost" onClick={() => setAssessment((a) => a + "\n3) Consider post-viral cough — ICD-10 R05.")}>Suggest code</Btn>} />
                  <Textarea rows={5} value={assessment} onChange={setAssessment} />
                  {showSources && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ProvenanceChip label="SNOMED/ICD mapping" conf={0.84} />
                    </div>
                  )}
                </div>
                <Divider />
                {/* Plan */}
                <div>
                  <SectionHeader title="Plan (Orders/Instructions)" actions={<Btn variant="ghost" onClick={() => addOrderSet(orderSets[0])}>Add UTI order set</Btn>} />
                  <Textarea rows={6} value={plan} onChange={setPlan} />
                  {showSources && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ProvenanceChip label="Order Set (local)" conf={0.92} />
                      <ProvenanceChip label="Allergy check (Penicillin)" conf={0.88} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-700">Track each problem with mini-SOAP. Add, edit, or code inline.</div>
                  <Btn variant="secondary" onClick={addProblem}>Add problem</Btn>
                </div>
                {problems.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-neutral-200 bg-neutral-25 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Input className="w-64" value={p.name} onChange={(v) => updateProblem(p.id, "name", v)} placeholder="Problem name" />
                        <Badge color="violet">{p.codes[0] || "Code: suggest"}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Btn variant="ghost" onClick={() => updateProblem(p.id, "codes", ["ICD-10: R05"]) }>Suggest code</Btn>
                        <Btn variant="ghost" onClick={() => deleteProblem(p.id)}>Remove</Btn>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <div className="text-xs font-semibold text-neutral-600">Subjective</div>
                        <Textarea rows={3} value={p.subjective} onChange={(v) => updateProblem(p.id, "subjective", v)} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-600">Objective</div>
                        <Textarea rows={3} value={p.objective} onChange={(v) => updateProblem(p.id, "objective", v)} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-600">Assessment</div>
                        <Textarea rows={3} value={p.assessment} onChange={(v) => updateProblem(p.id, "assessment", v)} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-600">Plan</div>
                        <Textarea rows={3} value={p.plan} onChange={(v) => updateProblem(p.id, "plan", v)} />
                      </div>
                    </div>
                    {showSources && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <ProvenanceChip label={`Problem: ${p.name || "(new)"}`} conf={0.8} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Decision Support & Orders Rail */}
          <div className="space-y-4">
            <Card title="Red flags" subtitle="Safety net">
              <div className="space-y-2">
                {redFlags.map((rf) => (
                  <div key={rf.id} className="rounded-xl border border-neutral-200 p-3">
                    <div className="text-sm font-medium text-red-700">{rf.text}</div>
                    <div className="text-xs text-neutral-600">{rf.suggestion}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Btn size="sm" variant="outline" onClick={() => addToPlan(rf.suggestion)}>Add to plan</Btn>
                      <Btn size="sm" variant="ghost">Dismiss</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Guideline prompts" subtitle="Contextual checklists">
              <div className="space-y-2">
                {guidelinePrompts.map((g) => (
                  <div key={g.id} className="rounded-xl border border-neutral-200 p-3">
                    <div className="text-sm font-medium text-neutral-900">{g.title}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {g.actions.map((a, i) => (
                        <Badge key={i} color="info">{a}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Order sets & quick actions" subtitle="One-tap inserts">
              <div className="space-y-2">
                {orderSets.map((os) => (
                  <div key={os.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{os.title}</div>
                      <div className="text-xs text-neutral-600">{os.plan.join(" • ")}</div>
                    </div>
                    <Btn size="sm" variant="primary" onClick={() => addOrderSet(os)}>Add</Btn>
                  </div>
                ))}
                <Divider />
                <div className="grid grid-cols-2 gap-2">
                  <Btn size="sm" variant="secondary" onClick={() => setReferralOpen(true)}>Send to Referral</Btn>
                  <Btn size="sm" variant="secondary" onClick={() => setVisitSummaryOpen(true)}>Generate Patient Summary</Btn>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Outputs Dock */}
        <div className="sticky bottom-3 mt-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
              <Badge color="info">Composition (FHIR)</Badge>
              <span>Sections: Subjective, Objective, Assessment, Plan</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Provenance attached</span>
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="outline" onClick={() => setVisitSummaryOpen(true)}>Visit Summary</Btn>
              <Btn variant="outline" onClick={() => setReferralOpen(true)}>Referral Prefill</Btn>
              <Btn variant="secondary" onClick={() => setReconcileOpen(true)}>Update Medication Summary</Btn>
              <Btn variant="primary" onClick={handleSign}>Sign & Share</Btn>
            </div>
          </div>
        </div>

        {/* Provenance Footer */}
        <div className="mt-3 flex flex-wrap gap-2">
          {showSources && (
            <>
              <ProvenanceChip label="Patient speech" conf={0.86} />
              <ProvenanceChip label="Vitals (LOINC-coded)" conf={0.98} />
              <ProvenanceChip label="Medication list (RxNorm)" conf={0.9} />
              <ProvenanceChip label="ICD-10 suggestions" conf={0.84} />
            </>
          )}
        </div>
      </div>

      {/* --- Modals & Drawers --- */}
      {visitSummaryOpen && (
        <Modal title="Patient-facing Visit Summary" onClose={() => setVisitSummaryOpen(false)}>
          <div className="space-y-3 text-sm">
            <p className="text-neutral-700">{patientSummary}</p>
            <Divider />
            <div className="text-neutral-500">Language</div>
            <div className="flex gap-2"><Badge>English</Badge><Badge>Finnish</Badge></div>
            <div className="mt-3 flex items-center gap-2">
              <Btn variant="secondary">Copy</Btn>
              <Btn variant="primary">Save to record</Btn>
            </div>
          </div>
        </Modal>
      )}

      {referralOpen && (
        <Modal title="Referral — Prefilled from Assessment & Plan" onClose={() => setReferralOpen(false)}>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input value="Pulmonology" onChange={() => {}} placeholder="Receiving department" />
              <Input value="Routine" onChange={() => {}} placeholder="Urgency" />
            </div>
            <Textarea rows={8} value={`Reason: Persistent cough.\nAssessment: Viral URI suspected.\nPlan: Supportive care; return if red flags.\nRelevant vitals: BP ${mockVitals.BP}, HR ${mockVitals.HR}, Temp ${mockVitals.Temp}.`} onChange={() => {}} />
            <div className="flex items-center gap-2">
              <Btn variant="secondary">Open full Referral page</Btn>
              <Btn variant="primary">Attach & Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {reconcileOpen && (
        <Drawer title="Medication Reconciliation" onClose={() => setReconcileOpen(false)}>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-neutral-200 p-3">
              <div className="mb-2 text-sm font-semibold text-neutral-900">Discrepancies</div>
              <ul className="list-inside list-disc space-y-1 text-neutral-700">
                <li>Patient reports <strong>Amlodipine 5 mg daily</strong>; EHR shows 10 mg. <Btn size="sm" variant="outline" className="ml-2">Accept patient</Btn> <Btn size="sm" variant="ghost">Keep EHR</Btn></li>
                <li>Patient stopped <strong>Ibuprofen</strong> last week. <Btn size="sm" variant="outline" className="ml-2">Mark stopped</Btn></li>
              </ul>
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="secondary">View full Medication Summary</Btn>
              <Btn variant="primary">Apply changes</Btn>
            </div>
          </div>
        </Drawer>
      )}

      {encountersOpen && (
        <Modal title="Previous Encounters" onClose={() => setEncountersOpen(false)}>
          <div className="space-y-2 text-sm">
            <EncounterRow date="2025-06-01" title="Hypertension follow-up" summary="BP review; continued amlodipine." />
            <EncounterRow date="2025-03-12" title="Annual check-up" summary="Routine labs all within range." />
            <EncounterRow date="2024-11-20" title="Flu-like illness" summary="Supportive care; recovered." />
          </div>
        </Modal>
      )}
    </div>
  );
}

function EncounterRow({ date, title, summary }) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-neutral-200 p-3">
      <div>
        <div className="text-sm font-semibold text-neutral-900">{title}</div>
        <div className="text-xs text-neutral-500">{date}</div>
        <div className="mt-1 text-sm text-neutral-700">{summary}</div>
      </div>
      <Btn variant="outline" size="sm">Open</Btn>
    </div>
  );
}

// Simple modal & drawer components
function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <div className="text-sm font-semibold text-neutral-900">{title}</div>
          <button className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100" onClick={onClose}>✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Drawer({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
      <div className="h-[70vh] w-full max-w-3xl rounded-t-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <div className="text-sm font-semibold text-neutral-900">{title}</div>
          <button className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100" onClick={onClose}>✕</button>
        </div>
        <div className="overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}