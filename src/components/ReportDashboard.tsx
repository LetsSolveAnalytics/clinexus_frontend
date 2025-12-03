import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Eye, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


const reportsData = [
  { patient: "John Smith", date: "29/01/2025", by: "Elias", action: "Pending", type: "HbA1c" },
  { patient: "Marvin McKinney", date: "29/01/2025", by: "Aino", action: "Pending", type: "MRI Brain Scan" },
  { patient: "Ava Thompson", date: "29/01/2025", by: "Mikko", action: "Pending", type: "Blood Sugar Test" },
  { patient: "Noah Carter", date: "29/01/2025", by: "Emilia", action: "Pending", type: "Chest X-ray" },
  { patient: "Emma Roberts", date: "29/01/2025", by: "Elias", action: "Pending", type: "Thyroid Function Test" },
  { patient: "Mason Lewis", date: "29/01/2025", by: "Mikko", action: "Reviewed", type: "ECG" },
  { patient: "Isabella Scott", date: "29/01/2025", by: "Emilia", action: "Reviewed", type: "CT Scan" },
  { patient: "Jessica Davis", date: "29/01/2025", by: "Juho Laine", action: "Reviewed", type: "MRI Brain" },
  { patient: "Emily Brown", date: "29/01/2025", by: "Emilia", action: "Reviewed", type: "TSH Test" },
  { patient: "Jessica Davis", date: "29/01/2025", by: "Juho Laine", action: "Pending", type: "MRI Brain" },
  { patient: "Sofia Koskinen", date: "29/01/2025", by: "Juho Laine", action: "Reviewed", type: "HbA1c" },
];

export default function ReportsDashboard() {
  const [query, setQuery] = useState("");

  const filtered = reportsData.filter((r) =>
    r.patient.toLowerCase().includes(query.toLowerCase()) ||
    r.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-10 bg-[#E7F1F7] min-h-screen">
      <h1 className="text-3xl font-bold text-[#1B3A65] mb-1">Reports</h1>
      <p className="text-gray-600 mb-6">
        View and download the detailed reports of your patients
      </p>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Input
          placeholder="Search reports"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 py-6 text-lg rounded-2xl bg-white"
        />
        <SlidersHorizontal className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      {/* Table Container */}
      <Card className="rounded-2xl overflow-hidden shadow-sm border">
        {/* Header Row */}
        <div className="grid grid-cols-6 bg-[#CDEBF6] text-[#1B3A65] font-semibold py-4 px-6 text-sm">
          <div>Patient</div>
          <div>Date</div>
          <div>Report by</div>
          <div>Action</div>
          <div>Report type</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="max-h-[70vh] overflow-y-auto bg-white">
          {filtered.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-6 items-center py-4 px-6 border-b text-sm"
            >
              <div>{r.patient}</div>
              <div>{r.date}</div>
              <div>{r.by}</div>

              <div>
                {r.action === "Pending" ? (
                  <span className="bg-[#F4A33E] text-white px-4 py-1 rounded-xl text-xs">
                    Pending
                  </span>
                ) : (
                  <span className="bg-[#0A5253] text-white px-4 py-1 rounded-xl text-xs">
                    Reviewed
                  </span>
                )}
              </div>

              <div>{r.type}</div>

              {/* Icons */}
              <div className="flex justify-end gap-4">
                <Eye className="cursor-pointer hover:text-blue-600" size={18} />
                <Download
  onClick={() => toast.success(`Downloaded ${r.type} report for ${r.patient}`)}
  className="cursor-pointer hover:text-blue-600"
  size={18}
/>

              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
