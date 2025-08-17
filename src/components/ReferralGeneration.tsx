import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";

type PatientItem = {
  patient_id: string;
  name: string;
  dob: string;
  symptoms: string;
  diagnosis: string;
  findings: string;
  past_history: string;
  medications: string;
  investigations: string;
  results: string;
  phone: string;
  email: string;
};

type ReferralProps = {
  patient: PatientItem;
  onBack: () => void;
};

const ReferralGeneration = ({ patient, onBack }: ReferralProps) => {
  const [doctorName, setDoctorName] = useState("Dr. Willam");
  const [department, setDepartment] = useState(
    "Cardiology Department, The Mount Sinai Hospital"
  );
  const [address, setAddress] = useState(
    "1468 Madison Ave, New York, NY 10029, United States"
  );
  const [diagnosis, setDiagnosis] = useState(patient.diagnosis || "");
  const [findings, setFindings] = useState(patient.findings || "");
  const [past_history, setHistory] = useState(patient.past_history || "");
  const [medications, setMedications] = useState(patient.medications || "");
  const [investigations, setInvestigations] = useState(patient.investigations || "");
  const [results, setResults] = useState(patient.results || "");

  const [preview, setPreview] = useState("");

  // auto-generate preview from form values
  useEffect(() => {
    setPreview(
`Date: ${new Date().toLocaleDateString()}

To:
${doctorName}
${department}
${address}

Dear ${doctorName},

Re: Referral for ${patient.name}, Date of Birth: ${patient.dob}

I am referring ${patient.name} to your clinic for further evaluation and management.

Clinical Details:
- Presenting Complaint: ${diagnosis}
- Relevant Findings: ${findings}
- Past Medical History: ${past_history}
- Current Medications: ${medications}

Investigations:
- Recent Tests: ${investigations}
- Results: ${results}

Patient’s Contact Information:
- Phone: ${patient.phone}
- Email: ${patient.email}

Yours sincerely,
Dr. John
General Practitioner
555-987-6543
The Johns Hopkins Hospital`
    );
  }, [doctorName, department, address, diagnosis, findings, past_history, medications, investigations, results, patient]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(preview, 180); // wrap text nicely
    doc.setFontSize(12);
    doc.text(lines, 10, 10);
    doc.save(`Referral_${patient.name}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
       <div className="max-w-7xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back to dashboard
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Form */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <div>
                <label className="text-blue-400 block mb-1">Doctor Name:</label>
            <input
              className="w-full border p-2 rounded"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
            </div>
             <div>
                <label className="text-blue-400 block mb-1">Department & Hospital:</label>
            <input
              className="w-full border p-2 rounded"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            /></div>

              <div>
                <label className="text-blue-400 block mb-1">Address:</label>
                <input
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
           
             <div>
                <label className="text-blue-400 block mb-1">Symptoms:</label>
            <Textarea
              rows={1}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            </div>

             <div>
                <label className="text-blue-400 block mb-1">Relevant Findings:</label>
            <Textarea
              rows={1}
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
            />
            </div>
             <div>
                <label className="text-blue-400 block mb-1">Past Medical History:</label>
            <Textarea
              rows={1}
              value={past_history}
              onChange={(e) => setHistory(e.target.value)}
            />
            </div>
             <div>
                <label className="text-blue-400 block mb-1">Current Medications:</label>
            <Textarea
              rows={1}
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
            />
            </div>
             <div>
                <label className="text-blue-400 block mb-1">Investigations:</label>
            <Textarea
              rows={1}
              value={investigations}
              onChange={(e) => setInvestigations(e.target.value)}
            />
            </div>

             <div>
                <label className="text-blue-400 block mb-1">Results:</label>
            <Textarea
              rows={1}
              value={results}
              onChange={(e) => setResults(e.target.value)}
            />
            </div>
          </CardContent>
        </Card>

        {/* Right side - Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview (Editable)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="w-full h-[900px] text-lg"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
            />
            <Button onClick={handleDownloadPDF} className="mt-4 w-full">
              Download as PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default ReferralGeneration;
