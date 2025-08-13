import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Pill, ChevronRight } from "lucide-react";
import QuickAccess from "./QuickAccess";

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
  patient_id: string;  // MRN
  name: string;
  type: string;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>(""); // MRN

  // Load from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const base =
          (import.meta as any)?.env?.VITE_API_BASE_URL ||
          (import.meta as any)?.env?.NEXT_PUBLIC_API_BASE ||
          "http://localhost:8888";

        const res = await fetch(`${base}/patients`, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`Failed to load patients (${res.status})`);
        const data = await res.json();
        setItems(Array.isArray(data?.patients) ? data.patients : []);
      } catch (e: any) {
        setError(e.message || "Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedItemData = useMemo(
    () => items.find(item => item.patient_id === selectedItem),
    [items, selectedItem]
  );

  const features = [
    { id: "referral", title: "Referral Generation", description: "Generate and manage patient referrals", icon: Users },
    { id: "visit-notes", title: "Visit Note Summary", description: "Summarize and review visit notes", icon: FileText },
    { id: "medication", title: "Medication Summary", description: "Review and edit medication summaries", icon: Pill },
  ];

  const handleFeatureClick = (featureId: string) => {
    if (featureId === "medication") {
      if (!selectedItemData) {
        alert("Please select a patient first.");
        return;
      }
      const slug = slugForMrn(selectedItemData.patient_id);
      navigate(`/patients/${slug}/medication_summary`);
      return;
    }
    alert("Feature coming soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-foreground">Healthcare Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Select a patient and choose a feature to get started
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Patient Selection */}
        <Card className="mb-8 shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-sm text-muted-foreground">Loading patients…</p>}
            {error && <p className="text-sm text-destructive">Error: {error}</p>}
            {!loading && !error && (
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Choose a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.patient_id} value={item.patient_id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{item.name}</span>
                        <Badge variant="secondary" className="ml-2">{item.type}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Feature Cards + Quick Access */}
        {selectedItem && selectedItemData && (
          <div className="space-y-8">
            {/* Feature Cards */}
            <div className="space-y-6">
              {/* Quick Access (mocked until backend ready) */}
              <div>
                <QuickAccess
                  patientData={{
                    id: numIdFromString(selectedItemData.patient_id), // stable numeric id from MRN
                    name: selectedItemData.name,
                    type: selectedItemData.type,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-semibold text-foreground">Available Features</h2>
                <Badge variant="outline">{selectedItemData.name}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.id}
                      className="cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 border-border/50 bg-gradient-to-br from-card to-background"
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
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!selectedItem && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to Healthcare Dashboard</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please select a patient from the dropdown above to access the available features
              and start managing their healthcare data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;