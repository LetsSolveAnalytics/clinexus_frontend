import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Edit3, Check, X, Pill, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ItemData {
  id: number;
  name: string;
  type: string;
}

interface MedicationSummaryProps {
  itemData: ItemData;
}

// Mock medication data - replace with FastAPI integration
const getMockMedicationData = (itemId: number) => ({
  patientId: itemId,
  dateOfService: "2024-01-15",
  provider: "Dr. Sarah Johnson",
  medications: [
    {
      name: "Lisinopril 10mg",
      dosage: "Once daily",
      duration: "30 days",
      indication: "Hypertension"
    },
    {
      name: "Metformin 500mg",
      dosage: "Twice daily",
      duration: "90 days",
      indication: "Type 2 Diabetes"
    },
    {
      name: "Atorvastatin 20mg",
      dosage: "Once daily at bedtime",
      duration: "90 days",
      indication: "Hyperlipidemia"
    }
  ],
  summary: `Patient continues on current medication regimen with good tolerance. Blood pressure well controlled on Lisinopril 10mg daily. HbA1c improved to 6.8% on Metformin therapy. Lipid panel shows significant improvement with Atorvastatin therapy. 

Patient counseled on medication adherence and potential side effects. Recommended to continue current medications and return for follow-up in 3 months. Lab work to be repeated prior to next visit.

No adverse drug interactions identified. Patient verbalized understanding of medication instructions.`
});

const MedicationSummary = ({ itemData }: MedicationSummaryProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [medicationData] = useState(() => getMockMedicationData(itemData.id));
  const [editedSummary, setEditedSummary] = useState(medicationData.summary);

  const handleSave = () => {
    // Here you would typically send data to FastAPI backend
    setIsEditing(false);
    toast({
      title: "Summary saved",
      description: "Medication summary has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setEditedSummary(medicationData.summary);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Patient Information Card */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Patient</Label>
              <div className="mt-1 text-sm font-medium">{itemData.name}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Department</Label>
              <Badge variant="secondary" className="mt-1">
                {itemData.type}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Date of Service</Label>
              <div className="mt-1 text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {medicationData.dateOfService}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
              <div className="mt-1 text-sm">{medicationData.provider}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Medications Card */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicationData.medications.map((medication, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/30">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Medication
                    </Label>
                    <div className="mt-1 font-medium text-sm">{medication.name}</div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Dosage
                    </Label>
                    <div className="mt-1 text-sm">{medication.dosage}</div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Duration
                    </Label>
                    <div className="mt-1 text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {medication.duration}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Indication
                    </Label>
                    <div className="mt-1 text-sm">{medication.indication}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medication Summary Card */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medication Summary</CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Summary
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="summary" className="text-sm font-medium">
                  Edit Summary
                </Label>
                <Textarea
                  id="summary"
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  rows={12}
                  className="mt-2 resize-none"
                  placeholder="Enter medication summary..."
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Save className="h-4 w-4" />
                <span>Changes will be automatically synced with your FastAPI backend</span>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div className="bg-background/50 p-4 rounded-lg border border-border/30">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {editedSummary}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Integration Notice */}
      <Card className="shadow-soft border-accent/20 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
            <div>
              <h4 className="font-medium text-sm text-accent-foreground">FastAPI Integration Ready</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This component is designed to work with your FastAPI backend. 
                Replace the mock data with actual API calls to fetch and save medication summaries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationSummary;