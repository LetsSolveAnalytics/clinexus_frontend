import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Pill,
  AlertTriangle,
  Beaker,
  Filter,
  Search,
  User,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  BellRing,
  CircleDot,
} from "lucide-react";

/**
 * Doctor‑centric Medication Summary
 * - 3‑column tile cards for active medications
 * - Alerts (allergies, DDI, disease interactions) as concise tiles
 * - Monitoring (labs due) with due/overdue highlighting
 * - Historical (recently stopped/changed) collapsed by default
 * - Quick filters and search
 * Replace MOCK_DATA with your FastAPI data when wiring up.
 */

interface ItemData {
  id: string;
  name: string;
  type: string; // service/clinic
}

interface MedicationSummaryProps {
  itemData: ItemData;
}

// --- MOCK DATA (replace with backend response) ---
const MOCK_DATA = (patientId: string) => ({
  patient: {
    id: patientId,
    name: "John Doe",
    age: 57,
    sex: "M",
    mrn: "MRN-789456123",
    clinic: "Cardiology",
    dateOfService: "2025-08-01",
    provider: "Dr. Sarah Johnson",
  },
  current: [
    {
      name: "Lisinopril",
      brand: "Zestril",
      dose: "10 mg",
      route: "Oral",
      frequency: "Once daily",
      indication: "Hypertension",
      startDate: "2024-11-12",
      prescriber: "Sarah Johnson, MD",
      status: "active",
      notes: "Take with or without food",
      class: "Antihypertensive",
      changed: false,
    },
    {
      name: "Metformin",
      brand: "Glucophage",
      dose: "500 mg",
      route: "Oral",
      frequency: "Twice daily",
      indication: "Type 2 Diabetes",
      startDate: "2024-09-03",
      prescriber: "Michael Chen, MD",
      status: "active",
      notes: "Take with meals",
      class: "Antidiabetic",
      changed: true, // highlight recently changed
    },
    {
      name: "Atorvastatin",
      brand: "Lipitor",
      dose: "20 mg",
      route: "Oral",
      frequency: "QHS",
      indication: "Hyperlipidemia",
      startDate: "2024-10-10",
      prescriber: "Sarah Johnson, MD",
      status: "active",
      notes: "Bedtime dosing",
      class: "Lipid-lowering",
      changed: false,
    },
    {
      name: "Albuterol",
      brand: "Ventolin",
      dose: "2 puffs",
      route: "Inhaled",
      frequency: "PRN wheeze",
      indication: "Asthma",
      startDate: "2025-07-20",
      prescriber: "Sarah Johnson, MD",
      status: "active",
      notes: "Spacer advised",
      class: "Bronchodilator",
      changed: false,
    },
  ],
  allergies: [
    { allergen: "Penicillin", reaction: "Rash", severity: "moderate" },
    { allergen: "Sulfa", reaction: "Dyspnea", severity: "severe" },
  ],
  interactions: {
    ddi: [
      {
        pair: "Lisinopril + Metformin",
        severity: "moderate",
        note: "Monitor BP and glucose closely; no change needed",
      },
    ],
    disease: [
      {
        condition: "CKD stage 2",
        drug: "Lisinopril",
        note: "Check creatinine/eGFR q3mo",
        severity: "caution",
      },
    ],
    contraindications: [],
  },
  monitoring: [
    {
      drug: "Warfarin",
      lab: "INR",
      last: "2025-07-01",
      next: "2025-08-01",
      status: "due",
    },
    {
      drug: "Atorvastatin",
      lab: "LFTs (ALT/AST)",
      last: "2025-02-10",
      next: "2025-08-10",
      status: "upcoming",
    },
    {
      drug: "Metformin",
      lab: "HbA1c, BMP",
      last: "2025-05-05",
      next: "2025-08-05",
      status: "overdue",
    },
  ],
  history: {
    stoppedRecent: [
      { name: "Amlodipine", when: "2025-06-18", reason: "Switched to ACEi" },
    ],
    changes: [
      { name: "Metformin", what: "Dose ↑ 500→1000 mg/day", when: "2025-07-24" },
    ],
    adherenceNotes: [
      { note: "Occasional missed PM doses per patient", when: "2025-07-24" },
    ],
  },
});

// --- UI Helpers ---
const SevBadge = ({ level }: { level: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    severe: { label: "Severe", className: "bg-destructive/10 text-destructive border-destructive/30" },
    moderate: { label: "Moderate", className: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-400/30" },
    caution: { label: "Caution", className: "bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-200 dark:border-yellow-400/30" },
    info: { label: "Info", className: "bg-muted text-foreground border-border" },
  };
  const s = map[level] ?? map.info;
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
    <Card className={cn(
      "border-border/50 hover:shadow-md transition-shadow rounded-2xl",
      med.changed && "ring-2 ring-primary/40"
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              <div className="font-medium truncate">{med.name} <span className="text-sm text-muted-foreground">{med.dose}</span></div>
            </div>
            <div className="text-xs text-muted-foreground truncate">Brand: {med.brand} • {med.class}</div>
          </div>
          {med.changed && (
            <Badge className="rounded-full" variant="secondary">Changed</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Route</div>
            <div>{med.route}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Frequency</div>
            <div>{med.frequency}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Indication</div>
            <div className="truncate" title={med.indication}>{med.indication}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />Start {med.startDate}</div>
          <div className="truncate">Prescriber {med.prescriber}</div>
          <div className="flex items-center gap-1"><CircleDot className="h-3 w-3" />Status {med.status}</div>
        </div>

        {med.notes && (
          <div className="text-xs bg-muted/40 p-2 rounded-lg">{med.notes}</div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export default function MedicationSummary({ itemData }: MedicationSummaryProps) {
  const data = useMemo(() => MOCK_DATA(itemData.id), [itemData.id]);

  // Filters & search
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [onlyPRN, setOnlyPRN] = useState(false);
  const [onlyHighRisk, setOnlyHighRisk] = useState(false); // placeholder: implement with your risk rules

  const filteredMeds = useMemo(() => {
    return data.current.filter((m) => {
      if (classFilter && m.class !== classFilter) return false;
      if (onlyPRN && !/PRN/i.test(m.frequency)) return false;
      if (onlyHighRisk) {
        // Example heuristic: highlight warfarin/insulin/opioids etc.
        const risky = /warfarin|insulin|morphine|oxycodone/i.test(m.name);
        if (!risky) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        const blob = `${m.name} ${m.brand} ${m.indication} ${m.prescriber} ${m.class}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [data.current, classFilter, onlyPRN, onlyHighRisk, query]);

  // Quick stats
  const stats = useMemo(() => {
    const severe = data.interactions.ddi.filter((d) => d.severity === "severe").length +
      data.allergies.filter((a) => a.severity === "severe").length;
    const due = data.monitoring.filter((m) => m.status === "due").length;
    const overdue = data.monitoring.filter((m) => m.status === "overdue").length;
    return {
      active: data.current.length,
      severeAlerts: severe,
      labsDue: due,
      labsOverdue: overdue,
    };
  }, [data]);

  // Distinct classes for filter chips
  const classes = Array.from(new Set(data.current.map((m) => m.class)));

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header: Patient snapshot */}
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-3 rounded-2xl border bg-card"><User className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="text-lg font-semibold truncate">{data.patient.name} • {data.patient.age}y • {data.patient.sex}</div>
                  <div className="text-xs text-muted-foreground truncate">MRN {data.patient.mrn} • {data.patient.clinic} • {data.patient.provider}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
                <StatChip icon={Pill} label="Active meds" value={stats.active} />
                <StatChip icon={AlertTriangle} label="Severe alerts" value={stats.severeAlerts} />
                <StatChip icon={Beaker} label="Labs due" value={stats.labsDue} />
                <StatChip icon={BellRing} label="Overdue labs" value={stats.labsOverdue} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search drug, class, indication, prescriber" className="pl-9" />
              </div>
              <Tabs value={classFilter ?? "all"} onValueChange={(v) => setClassFilter(v === "all" ? null : v)}>
                <TabsList className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6">
                  <TabsTrigger value="all">All classes</TabsTrigger>
                  {classes.map((c) => (
                    <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={onlyPRN ? "default" : "outline"} size="sm" onClick={() => setOnlyPRN((v) => !v)}>
                      <Filter className="h-4 w-4 mr-1" /> PRN
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show only PRN medications</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={onlyHighRisk ? "default" : "outline"} size="sm" onClick={() => setOnlyHighRisk((v) => !v)}>
                      <Activity className="h-4 w-4 mr-1" /> High‑risk
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Example heuristic: anticoagulants, insulin, opioids</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Meds – 3‑column tiles */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2"><Pill className="h-5 w-5" /> Current Medications</h3>
            <span className="text-sm text-muted-foreground">{filteredMeds.length} shown</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeds.map((m, i) => (
              <MedTile key={`${m.name}-${i}`} med={m} />
            ))}
          </div>
        </section>

        {/* Alerts & Risks */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Alerts & Risks</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Allergies</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data.allergies.map((a, i) => (
                  <div key={i} className="p-3 border rounded-xl bg-background/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{a.allergen}</div>
                        <div className="text-xs text-muted-foreground">Reaction: {a.reaction}</div>
                      </div>
                      <SevBadge level={a.severity} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Drug–Drug Interactions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data.interactions.ddi.length === 0 && (
                  <div className="text-sm text-muted-foreground">No interactions found</div>
                )}
                {data.interactions.ddi.map((d, i) => (
                  <div key={i} className="p-3 border rounded-xl bg-background/50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{d.pair}</div>
                        <div className="text-xs text-muted-foreground mt-1">{d.note}</div>
                      </div>
                      <SevBadge level={d.severity} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Drug–Disease</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data.interactions.disease.map((d, i) => (
                  <div key={i} className="p-3 border rounded-xl bg-background/50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{d.condition} + {d.drug}</div>
                        <div className="text-xs text-muted-foreground mt-1">{d.note}</div>
                      </div>
                      <SevBadge level={d.severity} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Monitoring */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2"><Beaker className="h-5 w-5" /> Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.monitoring.map((m, i) => (
              <Card key={i} className={cn(
                "rounded-2xl border",
                m.status === "overdue" && "border-destructive/40 bg-destructive/5",
                m.status === "due" && "border-amber-400/40 bg-amber-50 dark:bg-amber-950/20",
              )}>
                <CardContent className="p-4 space-y-2">
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
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" />Last {m.last}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />Next {m.next}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* History (collapsed) */}
        <section>
          <Accordion type="single" collapsible className="rounded-2xl border">
            <AccordionItem value="history">
              <AccordionTrigger className="px-4">History & Context</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-0">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Recently Stopped (≤6 mo)</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {data.history.stoppedRecent.length === 0 && (
                        <div className="text-muted-foreground">No recent stops</div>
                      )}
                      {data.history.stoppedRecent.map((h, i) => (
                        <div key={i} className="p-2 border rounded-lg bg-background/50">
                          <div className="font-medium">{h.name}</div>
                          <div className="text-xs text-muted-foreground">{h.when} • {h.reason}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Dose/Frequency Changes</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {data.history.changes.length === 0 && (
                        <div className="text-muted-foreground">No recent changes</div>
                      )}
                      {data.history.changes.map((h, i) => (
                        <div key={i} className="p-2 border rounded-lg bg-background/50">
                          <div className="font-medium">{h.name}</div>
                          <div className="text-xs text-muted-foreground">{h.when} • {h.what}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Adherence Notes</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {data.history.adherenceNotes.length === 0 && (
                        <div className="text-muted-foreground">No adherence concerns</div>
                      )}
                      {data.history.adherenceNotes.map((h, i) => (
                        <div key={i} className="p-2 border rounded-lg bg-background/50">
                          <div className="text-xs">{h.note}</div>
                          <div className="text-xs text-muted-foreground mt-1">{h.when}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Decision Support: concise summary panel */}
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Decision Support Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>Severe allergy present: {data.allergies.some(a => a.severity === "severe") ? <span className="font-medium">Yes</span> : "No"}.</li>
              <li>High‑risk meds filter can surface anticoagulants/insulin/opioids if present.</li>
              <li>Overdue monitoring tasks: {stats.labsOverdue}.</li>
              <li>Highlight changes since last visit: tiles marked “Changed”.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}