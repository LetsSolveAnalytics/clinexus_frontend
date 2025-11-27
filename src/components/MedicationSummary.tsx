import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Pill,
  AlertTriangle,
  Beaker,
  Search,
  User,
  Calendar,
  Clock,
  BellRing,
  CircleDot,
} from "lucide-react";

// ---------------- UI helpers ----------------
const SevBadge = ({ level }: { level?: string | null }) => {
  const map: Record<string, { label: string; className: string }> = {
    severe: { label: "Severe", className: "bg-destructive/10 text-destructive border-destructive/30" },
    moderate: { label: "Moderate", className: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-400/30" },
    caution: { label: "Caution", className: "bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-amber-950/40 dark:text-yellow-200 dark:border-yellow-400/30" },
    info: { label: "Info", className: "bg-muted text-foreground border-border" },
  };
  const key = (level || "").toLowerCase();
  const s = map[key] ?? map.info;
  return <Badge variant="outline" className={cn("rounded-full px-2 py-0.5 text-xs", s.className)}>{s.label}</Badge>;
};

const StatChip = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border bg-card shadow-sm">
    <div className="p-2 rounded-full border bg-background"><Icon className="h-4 w-4" /></div>
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold leading-tight">{value}</div>
    </div>
  </div>
);

const MedTile = ({ med }: { med: any }) => (
  <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
    <Card className="border-border/50 hover:shadow-md transition-shadow rounded-2xl">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              <div className="font-medium truncate">
                {med.name} {med.dose && <span className="text-sm text-muted-foreground">{med.dose}</span>}
              </div>
            </div>
            {med.route && <div className="text-xs text-muted-foreground truncate">{med.route}</div>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Frequency</div>
            <div className="truncate">{med.frequency || (med.prn ? "PRN" : "—")}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Indication</div>
            <div className="truncate" title={med.indication}>{med.indication || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Start</div>
            <div>{med.startDate || "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="truncate">Prescriber {med.prescriber || "—"}</div>
          <div className="flex items-center gap-1"><CircleDot className="h-3 w-3" />Status {med.status || "active"}</div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ---------------- slug helpers ----------------
function fnv1a32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}
function slugForMrn(mrn: string): string {
  const salt = (import.meta as any)?.env?.VITE_SLUG_SALT || (import.meta as any)?.env?.NEXT_PUBLIC_SLUG_SALT || "clinexus-lite";
  return `p-${fnv1a32(`${salt}:${mrn}`).toString(36)}`;
}

// ---------------- types & mapping ----------------
type Backend = { patient_id: string; ui_schema: any };
type PatientListItem = { patient_id: string; name: string; type: string };

function mapFromBackend(api: Backend) {
  const ui = api?.ui_schema || {};
  const p = ui.patient || {};
  const meds = Array.isArray(ui.current_medications) ? ui.current_medications : [];
  const allergies = ui?.alerts?.allergies || [];
  const monitoring = ui?.monitoring || [];
  const historyStopped = ui?.history?.recently_stopped || [];
  const sexRaw = p.sex || p.gender;
  const sex = typeof sexRaw === "string"
    ? (sexRaw.toLowerCase().startsWith("f") ? "F" : sexRaw.toLowerCase().startsWith("m") ? "M" : sexRaw)
    : sexRaw;

  return {
    patient: {
      id: api.patient_id,
      name: p.name,
      age: p.age,
      sex,
      mrn: p.mrn || api.patient_id,
      clinic: p.clinic,
      provider: p.latest_provider,
    },
    current: meds.map((m: any) => ({
      name: m.drug_name,
      dose: m.power || m.dose || "",
      route: m.route,
      frequency: m.frequency,
      prn: m.prn,
      indication: m.indication,
      startDate: m.authoredOn,
      prescriber: m.requester,
      status: "active",
    })),
    allergies: allergies.map((a: any) => ({
      allergen: a.substance,
      reaction: a.reaction || "",
      severity: a.severity || "info",
    })),
    monitoring: monitoring.map((m: any) => ({
      drug: m.med_label,
      lab: m.lab_name,
      last: m.last_date,
      next: m.due_date,
      status: m.status === "overdue" ? "overdue" : m.status === "due" ? "due" : "upcoming",
    })),
    history: {
      stoppedRecent: historyStopped.map((h: any) => ({ name: h.name, when: h.when, reason: h.reason })),
    },
  };
}

export default function MedicationSummary() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [raw, setRaw] = useState<Backend | null>(null);
  const [query, setQuery] = useState("");

  const API_BASE =
    (import.meta as any)?.env?.VITE_API_BASE_URL ||
    (import.meta as any)?.env?.NEXT_PUBLIC_API_BASE ||
    "http://127.0.0.1:8888";

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        if (!slug) throw new Error("Missing URL slug.");

        // 1) fetch patient list
        const r1 = await fetch(`${API_BASE}/patients`, { headers: { Accept: "application/json" } });
        const j1 = await r1.json();
        if (!r1.ok) throw new Error(j1?.detail || `Failed to load patients (${r1.status})`);

        const list: PatientListItem[] = Array.isArray(j1?.patients) ? j1.patients : [];
        const match = list.find((p) => slugForMrn(p.patient_id) === slug);
        if (!match) throw new Error("Patient not found for this link (slug mismatch).");

        const mrn = match.patient_id;

        // 2) fetch medication summary
        const r2 = await fetch(`${API_BASE}/patients/${encodeURIComponent(mrn)}/medication_summary`, {
          headers: { Accept: "application/json" },
        });
        const ct = r2.headers.get("content-type") || "";
        const body = ct.includes("application/json") ? await r2.json() : await r2.text();
        if (!r2.ok) throw new Error(typeof body === "string" ? body : body?.detail || `HTTP ${r2.status}`);
        if (!ct.includes("application/json")) throw new Error("Server did not return JSON.");

        if (alive) setRaw(body as Backend);
      } catch (e: any) {
        if (alive) setErr(e.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  const data = useMemo(() => (raw ? mapFromBackend(raw) : null), [raw]);

  const filteredMeds = useMemo(() => {
    if (!data) return [];
    if (!query) return data.current;
    const q = query.toLowerCase();
    return data.current.filter((m) => {
      const blob = `${m.name ?? ""} ${m.dose ?? ""} ${m.indication ?? ""} ${m.prescriber ?? ""} ${m.route ?? ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [data, query]);

  const stats = useMemo(() => {
    if (!data) return { active: 0, severeAlerts: 0, labsDue: 0, labsOverdue: 0 };
    const severe = data.allergies.filter((a) => (a.severity || "").toLowerCase() === "severe").length;
    const due = data.monitoring.filter((m) => m.status === "due").length;
    const overdue = data.monitoring.filter((m) => m.status === "overdue").length;
    return { active: data.current.length, severeAlerts: severe, labsDue: due, labsOverdue: overdue };
  }, [data]);

  // ---------- states ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-sm text-muted-foreground">Loading medication summary…</CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (err || !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Card className="rounded-2xl border-destructive/40">
            <CardContent className="p-6 text-sm text-destructive">
              Failed to load medication summary{err ? `: ${err}` : ""}.{" "}
              <Link to="/" className="underline">Back to dashboard</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------- layout ----------
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Page Title */}
        <div className="border-b bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Medication Summary</h1>
                <p className="text-sm text-muted-foreground mt-1">Review current medications, allergies, and monitoring tasks.</p>
              </div>
              <Button variant="ghost" asChild><Link to="/">← Back</Link></Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Patient details card */}
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-3 rounded-2xl border bg-card"><User className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold truncate">
                      {data.patient.name || "Patient"}
                      {typeof data.patient.age === "number" ? ` • ${data.patient.age}y` : ""}
                      {data.patient.sex ? ` • ${data.patient.sex}` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      MRN {data.patient.mrn}{data.patient.clinic ? ` • ${data.patient.clinic}` : ""}{data.patient.provider ? ` • ${data.patient.provider}` : ""}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full lg:w-auto">
                  <StatChip icon={Pill} label="Active meds" value={stats.active} />
                  <StatChip icon={AlertTriangle} label="Severe alerts" value={stats.severeAlerts} />
                  <StatChip icon={Beaker} label="Labs due" value={stats.labsDue} />
                  <StatChip icon={BellRing} label="Overdue labs" value={stats.labsOverdue} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: search + current meds */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <Card className="rounded-2xl border-border/60">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search drug, indication, prescriber"
                      className="pl-9"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Current Meds */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Pill className="h-5 w-5" /> Current Medications
                  </h3>
                  <span className="text-sm text-muted-foreground">{filteredMeds.length} shown</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMeds.map((m, i) => (
                    <MedTile key={`${m.name}-${i}`} med={m} />
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT: allergies + monitoring */}
            <div className="space-y-6">
              {/* Allergies */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.allergies.length === 0 && (
                    <div className="text-sm text-muted-foreground">No allergies recorded.</div>
                  )}
                  {data.allergies.map((a, i) => (
                    <div key={i} className="p-3 border rounded-xl bg-background/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{a.allergen}</div>
                          {a.reaction && <div className="text-xs text-muted-foreground">Reaction: {a.reaction}</div>}
                        </div>
                        <SevBadge level={a.severity} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Monitoring */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Beaker className="h-4 w-4" /> Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.monitoring.length === 0 && (
                    <div className="text-sm text-muted-foreground">No monitoring tasks.</div>
                  )}
                  {data.monitoring.map((m, i) => (
                    <Card key={i} className={cn(
                      "rounded-xl border",
                      m.status === "overdue" && "border-destructive/40 bg-destructive/5",
                      m.status === "due" && "border-amber-400/40 bg-amber-50 dark:bg-amber-950/20",
                    )}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">{m.drug}</div>
                          {m.status === "overdue" ? (
                            <Badge variant="destructive" className="rounded-full">Overdue</Badge>
                          ) : m.status === "due" ? (
                            <Badge className="rounded-full" variant="secondary">Due</Badge>
                          ) : (
                            <Badge className="rounded-full" variant="outline">Upcoming</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.lab}</div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-1"><Clock className="h-3 w-3" />Last {m.last || "—"}</div>
                          <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />Next {m.next || "—"}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}