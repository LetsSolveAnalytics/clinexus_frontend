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
  const [shareOpen, setShareOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [verifyingPopup, setVerifyingPopup] = useState(false);
const [readyToSendPopup, setReadyToSendPopup] = useState(false);
const [pendingDoctor, setPendingDoctor] = useState("");



  const [preview, setPreview] = useState("");

  // Auto-hide success message after 3 seconds
useEffect(() => {
  if (!successMessage) return;

  const timer = setTimeout(() => {
    setSuccessMessage("");
  }, 2000); // 3 seconds

  return () => clearTimeout(timer);
}, [successMessage]);

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
   <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] p-6">

{/* 🔥 Popup: Verifying */}
{verifyingPopup && (
  <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl shadow-xl text-center w-[320px]">
      <h2 className="text-lg font-semibold mb-3">Verifying the documents…</h2>
      <p className="text-sm text-gray-500">Please wait while we check the reports.</p>
    </div>
  </div>
)}

{/* 🔥 Popup: Ready to Send */}
{readyToSendPopup && (
  <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl shadow-xl text-center w-[350px]">
      <h2 className="text-lg font-semibold mb-3">Documents are ready to send</h2>
      <p className="text-sm text-gray-500 mb-4">Would you like to send the referral now?</p>

      <div className="flex justify-center gap-3">
        <Button
          variant="secondary"
          onClick={() => setReadyToSendPopup(false)}
        >
          Cancel
        </Button>

        <Button
          onClick={() => {
            setReadyToSendPopup(false);
            setSuccessMessage(`Referral shared with ${pendingDoctor}`);
          }}
        >
          Send
        </Button>
      </div>
    </div>
  </div>
)}

       <div className="max-w-7xl mx-auto">
        {successMessage && (
  <div className=" fixed top-4 left-1/2 -translate-x-1/2  px-4 py-2 rounded-lg shadow-lg bg-green-600 text-white z-50 ">
    {successMessage}
  </div>
)}

      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back to dashboard
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Form */}
       <Card className="glass-card rounded-3xl h-full min-h-[850px] bg-white/95 border border-sky-300 shadow-xl">

          <CardHeader className="pb-2 border-b border-sky-100 text-center">
            <CardTitle className="text-2xl font-bold text-sky-700 tracking-tight">
              Referral Details
            </CardTitle>
            <p className="text-sm text-gray-500">
              Enter clinical and referral-specific information.
            </p>
          </CardHeader>

          <CardContent className="space-y-2">
            <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mt-6 mb-3 text-center">
    Recipient Information
  </h3>
             <div className="mt-6">
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
           <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wide mt-8 mb-3 text-center">
  Clinical Information
</h3>
             <div>
                <label className="text-blue-400 block mb-1">Symptoms :</label>
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
       <Card className="glass-card rounded-2xl h-full min-h-[850px] bg-white/95 border border-sky-200 shadow-lg">

            <CardHeader>
              <CardTitle>Preview (Editable)</CardTitle>
            </CardHeader>

          <CardContent>
            <Textarea
              className="w-full h-[900px] text-lg"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
            />
           <div className="mt-4 flex gap-3">
          <Button onClick={handleDownloadPDF} className="flex-1">
             Download as PDF
          </Button>
          <Button 
            variant="secondary"  
            className="flex-1"  
            onClick={() => setShareOpen(true)}
          >
            Share with Doctor
          </Button>

</div>
          </CardContent>
        </Card>
      </div>
    </div>
      {/* SHOW MODAL WHEN shareOpen = true */}
     {shareOpen && (
  <ShareReferralModal 
      onClose={() => setShareOpen(false)}
      onSuccess={(doctor) => {
  setPendingDoctor(doctor);      // store selected doctor
  setShareOpen(false);           // close modal
  setVerifyingPopup(true);       // show "verifying" popup

  // Wait 10 seconds → show next popup
  setTimeout(() => {
    setVerifyingPopup(false);
    setReadyToSendPopup(true);   // show "ready to send"
  }, 5000);
}}

  />
  
)}

    </div>
  );
};
function ShareReferralModal({ onClose, onSuccess }) 
 {

  // ⬇⬇ YOUR NEW STATE + DATA GOES HERE ⬇⬇
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  
  const doctors = [
    "Dr. Smith",
    "Dr. John",
    "Dr. Emily",
    "Dr. Patel",
    "Dr. Micheal",
    "Dr. Anthony"
  ];

  const filteredDoctors = doctors.filter(d =>
    d.toLowerCase().includes(search.toLowerCase())
  );
  
  // ⬆⬆ END OF NEW BLOCK ⬆⬆

  return (
   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
 <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
  <h2 className="text-xl font-semibold mb-4">Share Referral</h2>

  {/* Search Input */}
  <input
    className="w-full border rounded p-2 mb-3"
    placeholder="Search doctor..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* Doctor List */}
  <div className="max-h-40 overflow-y-auto border rounded mb-4">
    {filteredDoctors.length === 0 ? (
      <p className="p-2 text-sm text-gray-500">No doctors found</p>
    ) : (
      filteredDoctors.map((doctor, idx) => (
        <div
          key={idx}
          onClick={() => { setSelectedDoctor(doctor);
                    setSearch(doctor);
}}

          className={`p-2 cursor-pointer text-sm hover:bg-blue-50 ${
            selectedDoctor === doctor ? "bg-blue-100 font-medium" : ""
          }`}
        >
          {doctor}sh
        </div>
      ))
    )}
  </div>

       {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          disabled={!selectedDoctor}
        onClick={() => {
          onSuccess(selectedDoctor);   // <-- send success up
          onClose();                   // <-- close modal
}}
        >
          verify
        </Button>
      </div>
    </div>
  </div>
);        
}         

export default ReferralGeneration;
