import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronRight, FileText, Pill, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MedicationSummary from "./MedicationSummary";
import PatientDetails from "./PatientDetails";
import ReferralGeneration from "./ReferralGeneration";
import VisitSummary from "./VisitSummary";


type PatientItem = {
  patient_id: string;
  name: string;
  type: string;
  diagnosis: string;
};

const Dashboard = () => {
  const [items, setItems] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<PatientItem | null>(null);
  const [activeFeature, setActiveFeature] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/datafold/data1.json");
        if (!res.ok) throw new Error(`Failed to load patients (${res.status})`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || "Failed to load patients");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const selectedItemData = useMemo(
    () => items.find((item) => item.patient_id === selectedItem?.patient_id),
    [items, selectedItem]
  );

  const features = [
    { id: "referral", title: "Referral Generation", description: "Generate and manage referrals", icon: Users },
    { id: "visit-notes", title: "Visit Note Summary", description: "Visit summary insights", icon: FileText },
    { id: "medication", title: "Medication Summary", description: "Review & manage meds", icon: Pill },];

  const handleFeatureClick = (id: string) => setActiveFeature(id);

  if (activeFeature === "referral" && selectedItemData)
    return <ReferralGeneration patient={selectedItemData} onBack={() => setActiveFeature("")} />;

  if (activeFeature === "visit-notes" && selectedItemData)
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => setActiveFeature("")} className="mb-4">
            ← Back to dashboard
          </Button>
          <h1 className="text-3xl font-bold">Visit Summary</h1>
          <VisitSummary patient={selectedItemData} />
        </div>
      </div>
    );

  if (activeFeature === "medication" && selectedItemData)
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => setActiveFeature("")} className="mb-4">
            ← Back to dashboard
          </Button>
          <h1 className="text-3xl font-bold">Medication Summary</h1>
          <MedicationSummary itemData={selectedItemData} />
        </div>
      </div>
    );


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] p-6">

      {/* NAVBAR */}
      <div className="w-full bg-white/70 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between">
          <img src="/logo.png" alt="logo" className="h-8" />
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <div className="flex gap-4">
            <button>About</button><button>Support</button>
            <button className="bg-primary text-white px-4 py-1 rounded-lg">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 space-y-10">

        {/* PATIENT SELECT */}
        <Card>
          <CardHeader><CardTitle className="text-2xl">🩺 Select Patient</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => setOpen(true)} className="w-full bg-primary text-white">Search Patient...</Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Search patient..." />
              <CommandList>
                <CommandEmpty>No patients found.</CommandEmpty>
                <CommandGroup>
                  {items.map((p) => (
                    <CommandItem key={p.patient_id} onSelect={() => { setSelectedItem(p); setOpen(false); }}>
                      {p.name} <Badge>{p.type}</Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>

            {selectedItem && (
              <div className="p-5 bg-white rounded-xl">
                <h4 className="text-lg font-semibold text-primary">👤 Selected Patient</h4>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <p><b>ID:</b> {selectedItem.patient_id}</p>
                  <p><b>Name:</b> {selectedItem.name}</p>
                  <p><b>Type:</b> {selectedItem.type}</p>
                  <p><b>Diagnosis:</b> {selectedItem.diagnosis}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FEATURES */}
        {selectedItem && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.id} onClick={() => handleFeatureClick(f.id)}
                  className="p-6 rounded-3xl cursor-pointer bg-gradient-to-br from-[#87CEEB] to-[#4F6EFF] text-white shadow-xl">
                  <div className="flex justify-between">
                    <div className="p-3 bg-white/30 rounded-xl"><f.icon /></div>
                    <ChevronRight className="opacity-80" />
                  </div>
                  <h3 className="text-xl font-semibold mt-3">{f.title}</h3>
                  <p className="text-sm opacity-90">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>{!selectedItem && (
  <div className="relative flex flex-col items-center justify-center py-24 px-4">


    {/* Soft Gradient Background */}
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-50/60 to-indigo-100/40" />

    <Card className="glass-card px-10 py-14 rounded-3xl shadow-xl relative">
      <div className="w-24 h-24 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
        <FileText className="h-12 w-12 text-primary" />
      </div>

      <h3 className="text-2xl font-bold text-center mb-3 text-gray-800">
        Welcome to Clinexus Dashboard
      </h3>

      <p className="text-muted-foreground text-center max-w-sm mx-auto">
        Select a patient from the panel above to generate referrals, visit summaries, and medication overviews.
      </p>

      <p className="mt-4 text-sm text-primary font-medium text-center animate-pulse">
        Waiting for patient selection...
      </p>
    </Card>

  </div>
)}

    </div>
  );
};

export default Dashboard;
