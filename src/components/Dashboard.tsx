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
import QuickAccess from "./QuickAccess";
import ReferralGeneration from "./ReferralGeneration";
import VisitSummary from "./VisitSummary";

// ---- optional: make an opaque slug for MRN (kept from earlier steps) ----
function fnv1a32(str: string): number { let h=0x811c9dc5; for (let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=(h+((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)))>>>0; } return h>>>0; }
function slugForMrn(mrn: string): string {
  const salt = (import.meta as any)?.env?.VITE_SLUG_SALT || (import.meta as any)?.env?.NEXT_PUBLIC_SLUG_SALT || "clinexus-lite";
  return `p-${fnv1a32(`${salt}:${mrn}`).toString(36)}`;
}

// ---- QuickAccess needs a numeric id; derive a stable number from MRN ----
function numIdFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

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

  // Load patients
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
    {
      id: "referral",
      title: "Referral Generation",
      description: "Generate and manage patient referrals",
      icon: Users,
    },
    {
      id: "visit-notes",
      title: "Visit Note Summary",
      description: "Summarize and review visit notes",
      icon: FileText,
    },
    {
      id: "medication",
      title: "Medication Summary",
      description: "Review and edit medication summaries",
      icon: Pill,
    },
  ];

  // Feature handlers
  const handleFeatureClick = (id: string) => {
    setActiveFeature(id);
  };

  // Conditional rendering for features
  if (activeFeature === "referral" && selectedItemData) {
    return (
      <ReferralGeneration
        patient={selectedItemData}
        onBack={() => setActiveFeature("")}
      />
    );
  }
if (activeFeature === "visit-notes" && selectedItemData) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setActiveFeature("")}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Visit Summary</h1>
        <VisitSummary patient={selectedItemData} />
      </div>
    </div>
  );
}
  if (activeFeature === "medication" && selectedItemData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setActiveFeature("")}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Medication Summary</h1>
          <p className="text-muted-foreground mt-2">
            Review and edit medication summary for {selectedItemData.name}
          </p>
          <MedicationSummary itemData={selectedItemData} />
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold">Healthcare Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Select a patient and choose a feature to get started
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Patient Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <p className="text-sm text-muted-foreground">Loading patients…</p>
            )}
            {error && <p className="text-sm text-destructive">Error: {error}</p>}
            {!loading && !error && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="w-full max-w-md  bg-blue-500 text-white hover:bg-blue-600"
                >
                  Choose a patient...
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen}>
                  <CommandInput placeholder="Search patient..." />
                  <CommandList>
                    <CommandEmpty>No patients found.</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          key={item.patient_id}
                          onSelect={() => {
                            setSelectedItem(item);
                            setOpen(false);
                          }}
                        >
                          {item.name}
                          <Badge variant="secondary" className="ml-2">
                            {item.type}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>

                {selectedItem && (
                  <div className="mt-4 p-4 border rounded bg-blue-50 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-sm text-primary">ID</p>
                      <p className="font-medium">{selectedItem.patient_id}</p>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-sm text-primary">Name</p>
                      <p className="font-medium">{selectedItem.name}</p>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-sm text-primary">Type</p>
                      <p className="font-medium">{selectedItem.type}</p>
                    </div>
                    {selectedItem.diagnosis && (
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-sm text-primary">Diagnosis</p>
                        <p className="font-medium">{selectedItem.diagnosis}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Feature Cards */}
     {selectedItem && selectedItemData && (
  <div className="space-y-8">
    {/* Quick Access */}
    <div>
      <QuickAccess
        patientData={{
          id: numIdFromString(selectedItemData.patient_id), // stable numeric id
          name: selectedItemData.name,
          type: selectedItemData.type,
        }}
      />
    </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.id}
                    className="cursor-pointer hover:shadow-md transition"
                    onClick={() => handleFeatureClick(feature.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Placeholder for not-yet-implemented features */}
            {activeFeature &&
              activeFeature !== "referral" &&
              activeFeature !== "medication" && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>
                      {features.find((f) => f.id === activeFeature)?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {(() => {
                          const feature = features.find(
                            (f) => f.id === activeFeature
                          );
                          const Icon = feature?.icon;
                          return Icon && <Icon className="h-8 w-8 text-primary" />;
                        })()}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Feature Coming Soon
                      </h3>
                      <p className="text-muted-foreground">
                        This feature will be integrated with your FastAPI
                        backend.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        )}

        {!selectedItem && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Welcome to Healthcare Dashboard
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please select a patient from the dropdown above to access the
              available features and start managing their healthcare data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
