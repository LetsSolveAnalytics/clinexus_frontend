import { Button } from "@/components/ui/button";
import {
      CommandDialog,
      CommandEmpty,
      CommandGroup,
      CommandInput,
      CommandItem,
      CommandList
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const PatientHub = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [recent, setRecent] = useState<any[]>([]);


  useEffect(() => {
    const load = async () => {
      const res = await fetch("/datafold/data1.json");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    };
    load();
  }, []);
  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("recentPatients") || "[]");
  setRecent(saved);
}, []);


  return (
  <div className="p-10 max-w-3xl mx-auto">

    {/* Page Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#1B3A65]">Patient Hub</h1>
      <p className="text-muted-foreground mt-1">
        Search for a patient to view detailed medical information.
      </p>
    </div>

    {/* Search Section */}
    <div className="bg-white shadow-md rounded-2xl p-8 border">
      <h2 className="text-xl font-semibold mb-4">Select Patient</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Use the search function below to quickly find a patient by name or ID.
      </p>

      <Button className="bg-primary text-white w-full" onClick={() => setOpen(true)}>
        Search Patient
      </Button>
    </div>

    {/* Empty-State Visual */}
    <div className="mt-16 flex flex-col items-center text-center opacity-70">
      <img src="/icons/people.svg" className="h-20 w-20 mb-4 opacity-50" />
      <p className="text-muted-foreground">
        No patient selected yet. Use the search above to continue.
      </p>
    </div>
{/* 🔥 RECENT PATIENTS BLOCK GOES HERE */}
{recent.length > 0 && (
  <div className="mt-10">
    <h3 className="text-lg font-semibold mb-3">Recent Patient Search</h3>
    <div className="space-y-3">
      {recent.map((r) => (
        <div
          key={r.id}
          onClick={() => navigate(`/patient-hub/${r.id}`)}
          className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md cursor-pointer"
        >
          {r.name}
        </div>
      ))}
    </div>
  </div>
)}
    {/* Search Dialog */}
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search patient..." />

      <CommandList>
        <CommandEmpty>No patients found.</CommandEmpty>

        <CommandGroup>
          {patients.map((p) => (
            <CommandItem
              key={p.patient_id}
              onSelect={() => {
  setOpen(false);

  // Save to recent searches
  const newRecent = [
    { id: p.patient_id, name: p.name },
    ...recent.filter((r) => r.id !== p.patient_id)  // remove duplicates
  ].slice(0, 5); // limit to 5

  localStorage.setItem("recentPatients", JSON.stringify(newRecent));
  setRecent(newRecent);

  navigate(`/patient-hub/${p.patient_id}`);
}}


            >
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
);

};

export default PatientHub;
