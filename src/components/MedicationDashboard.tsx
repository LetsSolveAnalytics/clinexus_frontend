import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search, Stethoscope } from "lucide-react";
import { useState } from "react";


const fakeData = [
  {
    medicine: "Amlodipine",
    patient: "John Smith",
    dosage: "5 mg once daily",
    date: "Today",
    condition: "Hypertension",
    action: "Prescription",
  },
  {
    medicine: "Gabapentin",
    patient: "Marvin McKinney",
    dosage: "300 mg to 900 mg daily",
    date: "Today",
    condition: "Nerve Disorder",
    action: "Diagnosis",
  },
  {
    medicine: "Losartan",
    patient: "Daniel Perez",
    dosage: "50 mg once daily",
    date: "Today",
    condition: "Hypertension",
    action: "Prescription",
  },
  {
    medicine: "Insulin Glargine",
    patient: "Maria Thompson",
    dosage: "10 units at night",
    date: "Today",
    condition: "Type 2 Diabetes",
    action: "Reports",
  },
  {
    medicine: "Prednisone",
    patient: "Oliver Singh",
    dosage: "20 mg once daily",
    date: "02/12/2025",
    condition: "Inflammation",
    action: "Diagnosis",
  },
  {
    medicine: "Cetirizine",
    patient: "Sophia Martinez",
    dosage: "10 mg once daily",
    date: "02/12/2025",
    condition: "Allergic Rhinitis",
    action: "Prescription",
  },
  {
    medicine: "Fluoxetine",
    patient: "Kevin Brown",
    dosage: "20 mg once daily",
    date: "01/12/2025",
    condition: "Depression",
    action: "Reports",
  },
  {
    medicine: "Sumatriptan",
    patient: "Jessica Davis",
    dosage: "50 mg at onset",
    date: "Today",
    condition: "Migraine",
    action: "Reports",
  },
  {
    medicine: "Levothyroxine",
    patient: "Emily Brown",
    dosage: "500 mg twice daily",
    date: "19/02/2025",
    condition: "Hypothyroidism",
    action: "Diagnosis",
  },
  {
    medicine: "Metformin",
    patient: "Sarah Johnson",
    dosage: "500 mg twice daily",
    date: "19/02/2025",
    condition: "Diabetes Mellitus",
    action: "Prescription",
  },
];

const iconForAction = (action: string) => {
  switch (action) {
    case "Prescription":
      return <FileText size={16} />;

    case "Diagnosis":
      return <Stethoscope size={16} />;

    default:
      return <FileText size={16} />;
  }
};


export default function MedicationDashboard() {
  const [searchPatient, setSearchPatient] = useState("");
  const [searchMedicine, setSearchMedicine] = useState("");

  const filtered = fakeData.filter(
    (item) =>
      item.patient.toLowerCase().includes(searchPatient.toLowerCase()) &&
      item.medicine.toLowerCase().includes(searchMedicine.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#1B3A65] mb-6">Medications</h1>
    <p className="text font-semi-bold text-[#1B3A65] mb-6">Your Patient medication Plans</p>
      {/* Filters */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4 flex items-center gap-3 border rounded-xl">
          <Search className="text-slate-400" size={18} />
          <Input
            placeholder="Search by patient name"
            className="border-none shadow-none"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
          />
        </Card>

        <Card className="p-4 flex items-center gap-3 border rounded-xl">
          <Search className="text-slate-400" size={18} />
          <Input
            placeholder="Search by medicine name"
            className="border-none shadow-none"
            value={searchMedicine}
            onChange={(e) => setSearchMedicine(e.target.value)}
          />
        </Card>
      </div>

      {/* Filter Chips */}
    {/* Filter Chips */}
<div className="flex items-center gap-4 mb-8">
  <Button className="rounded-full px-5 py-2 bg-[#1D5BFF] text-white hover:bg-[#1447C8]">
    All patients
  </Button>

  <Button className="rounded-full px-5 py-2 bg-[#1D5BFF] text-white hover:bg-[#1447C8]">
    New prescriptions
  </Button>

  <Button className="rounded-full px-5 py-2 bg-[#1D5BFF] text-white hover:bg-[#1447C8]">
    Last week
  </Button>

  <Button className="rounded-full px-5 py-2 bg-[#1D5BFF] text-white hover:bg-[#1447C8]">
    Last 30 days
  </Button>
</div>


      {/* Table */}
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-6 bg-[#D7EDF9] font-semibold text-sm text-slate-700 py-3 px-4">
          <div>Medicine</div>
          <div>Patient</div>
          <div>Dosage</div>
          <div>Date</div>
          <div>Condition</div>
          <div>Last action</div>
        </div>

        <div className="max-h-[450px] overflow-y-auto divide-y">
          {filtered.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-6 items-center py-4 px-4 bg-white"
            >
              <div>{row.medicine}</div>
              <div>{row.patient}</div>
              <div>{row.dosage}</div>
              <div>{row.date}</div>
              <div>{row.condition}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                {row.action} {iconForAction(row.action)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
