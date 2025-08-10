import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Pill, ChevronRight } from "lucide-react";
import MedicationSummary from "./MedicationSummary";

// type PatientItem = {
//   name: string;
//   type: string;
// };
//
// type Feature = {
//   id: "referral" | "visit-notes" | "medication";
//   title: string;
//   description: string;
//   icon: any;
//   bgClass: string;
//   iconClass: string;
// };

// Mock data - replace with FastAPI integration
const mockItems = [
  { id: 1, name: "Patient #1001 - John Smith", type: "Primary Care" },
  { id: 2, name: "Patient #1002 - Sarah Johnson", type: "Cardiology" },
  { id: 3, name: "Patient #1003 - Michael Brown", type: "Dermatology" },
  { id: 4, name: "Patient #1004 - Lisa Davis", type: "Orthopedics" },
];

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [activeFeature, setActiveFeature] = useState<string>("");

  const selectedItemData = mockItems.find(item => item.id.toString() === selectedItem);

  const features = [
    {
      id: "referral",
      title: "Referral Generation",
      description: "Generate and manage patient referrals",
      icon: Users,
      color: "primary",
    },
    {
      id: "visit-notes",
      title: "Visit Note Summary",
      description: "Summarize and review visit notes",
      icon: FileText,
      color: "secondary",
    },
    {
      id: "medication",
      title: "Medication Summary",
      description: "Review and edit medication summaries",
      icon: Pill,
      color: "accent",
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
  };

  if (activeFeature === "medication" && selectedItemData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveFeature("")}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Medication Summary</h1>
            <p className="text-muted-foreground mt-2">
              Review and edit medication summary for {selectedItemData.name}
            </p>
          </div>
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
          <h1 className="text-3xl font-bold text-foreground">Healthcare Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Select a patient and choose a feature to get started
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Item Selection */}
        <Card className="mb-8 shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose a patient..." />
              </SelectTrigger>
              <SelectContent>
                {mockItems.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {item.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Available Features
              </h2>
              <Badge variant="outline">
                {selectedItemData?.name}
              </Badge>
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
                        <div className={`p-3 rounded-lg bg-${feature.color}/10`}>
                          <Icon className={`h-6 w-6 text-${feature.color}`} />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Feature Content Area */}
            {activeFeature && activeFeature !== "medication" && (
              <Card className="mt-8 shadow-medium">
                <CardHeader>
                  <CardTitle>
                    {features.find(f => f.id === activeFeature)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {(() => {
                      const feature = features.find(f => f.id === activeFeature);
                      const Icon = feature?.icon;
                      return Icon && <Icon className="h-8 w-8 text-primary" />;
                    })()}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Feature Coming Soon</h3>
                    <p className="text-muted-foreground">
                      This feature will be integrated with your FastAPI backend.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
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