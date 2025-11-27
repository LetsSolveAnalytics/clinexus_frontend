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
      id: "pateint-details",
      title: "Patient Details",
      description: "Clear data about the patient",
      icon: FileText,
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
  if (activeFeature === "pateint-details" && selectedItemData) {
  return <PatientDetails patient={selectedItemData} onBack={() => setActiveFeature("")} />
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
   <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] p-6">

      {/* Header */}
  {/* NAVBAR */}
<div className="w-full bg-white/70 backdrop-blur-md border-b shadow-sm sticky top-0 z-50 ">
  <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
    {/* Left — Logo + Title */}
   <div className="flex-1 flex items-center">
  <img
    src="/logo.png"
    alt="Clinexus Logo"
    className="h-8 w-auto rounded-10g shadow-sm"
  />
</div>

<div className="flex-1 flex justify-center">
  <h1 className="text-3xl font-bold tracking-tight text-primary">
    Dashboard
  </h1>
</div>

<div className="flex-1 flex justify-end gap-4">
  <button className="text-sm text-muted-foreground hover:text-primary transition"
    onClick={() => window.open("https://clinexus.fi/", "_blank")}
  >
    About
  </button>
  <button className="text-sm text-muted-foreground hover:text-primary transition">
    Support
  </button>
  <button className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg shadow hover:bg-primary/80 transition">
    Logout
  </button>
</div>
  </div>
</div>


      <div className="max-w-6xl mx-auto mt-6 space-y-10">
        {/* Patient Selection */}
       <Card className="feature-card">
  <CardHeader className="pb-2">
    <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
      🩺 Select Patient
    </CardTitle>
    <p className="text-sm text-muted-foreground">
      Search or pick a patient to continue
    </p>
  </CardHeader>

  <CardContent className="space-y-4">
    {/* Search Button */}
    <Button
      variant="outline"
      onClick={() => setOpen(true)}
      className="w-full max-w-md bg-primary text-white hover:bg-primary/90 transition rounded-lg py-3"
    >
      Search Patient...
    </Button>

    {/* Search Modal */}
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search patient..." className="text-base" />
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
              className="flex justify-between items-center py-2"
            >
              <span className="font-medium">{item.name}</span>
              <Badge variant="secondary" className="text-xs">
                {item.type}
              </Badge>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>

    {/* Patient Info Card */}
   {selectedItem && (
  <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg transition">
    
    <h4 className="font-semibold text-primary text-lg mb-3 flex items-center gap-2">
      👤 Selected Patient
    </h4>

    <div className="grid grid-cols-2 gap-5">

      {/* ID */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Patient ID</p>
        <p className="font-semibold text-gray-800">{selectedItem.patient_id}</p>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Name</p>
        <p className="font-semibold text-gray-800">{selectedItem.name}</p>
      </div>

      {/* TYPE + DIAGNOSIS on same row */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Visit Type</p>
        <p className="font-semibold text-gray-800">{selectedItem.type}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Diagnosis</p>
        <p className="font-semibold text-gray-800">{selectedItem.diagnosis}</p>
      </div>

    </div>
  </div>
)}

  </CardContent>
</Card>


        {/* Feature Cards */}
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Available Features</h2>
              <Badge variant="outline">{selectedItemData?.name}</Badge>
            </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {features.map((feature) => {
    const Icon = feature.icon;
    return (
      <div
        key={feature.id}
        onClick={() => handleFeatureClick(feature.id)}
        className="
          group p-6 rounded-3xl cursor-pointer
        bg-gradient-to-br from-[#87CEEB] via-[#8CA7FD] to-[#4F6EFF]
          text-white shadow-xl
          hover:shadow-2xl hover:-translate-y-1 
          transition-all duration-300 border border-blue-300/30
        "
      >
        {/* Icon Box */}
        <div className="flex items-center justify-between mb-6">
          <div className="
            p-4 rounded-2xl bg-black/20 
            group-hover:bg-white/30 transition
          ">
            <Icon className="h-7 w-7 text-white" />
          </div>

          <ChevronRight className="
            h-6 w-6 text-white/70 
            group-hover:text-white transition
          " />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold mb-2">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/90 leading-relaxed">
          {feature.description}
        </p>
      </div>
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
    </div>
  );
};

export default Dashboard;
