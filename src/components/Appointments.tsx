import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
      AlertTriangle,
      ArrowLeft,
      CalendarDays,
      ClipboardCheck,
      Clock3,
      Filter,
      Plus,
      Search,
} from "lucide-react";
import { useState } from "react";

interface Props {
  patient: any;
  onBack: () => void;
}

type ViewMode = "day" | "week" | "month";
type ChipFilter = "all" | "high" | "new" | "followup";

interface Appointment {
  time: string;
  duration: string;
  name: string;
  type: string;
  lastVisit: string;
  age: string;
  gender: string;
  bp: string;
  hr: string;
  spo2: string;
  status: "Checked in" | "Upcoming" | "Alert";
}

const Appointments = ({ patient, onBack }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [chip, setChip] = useState<ChipFilter>("all");

  const appointments: Appointment[] = [
  {
    time: "08:00 AM",
    duration: "30 min",
    name: "Prathibha",
    type: "Diabetes Review",
    lastVisit: "Last visit 1 month ago",
    age: "29y",
    gender: "F",
    bp: "BP 118/78",
    hr: "HR 76",
    spo2: "SpO2 98%",
    status: "Checked in",
  },
  {
    time: "08:30 AM",
    duration: "45 min",
    name: "Rahul Mehta",
    type: "Hypertension Follow-up",
    lastVisit: "Last visit 3 months ago",
    age: "47y",
    gender: "M",
    bp: "BP 160/95 ↑",
    hr: "HR 92 ↑",
    spo2: "SpO2 93%",
    status: "Checked in",
  },
  {
    time: "09:00 AM",
    duration: "30 min",
    name: "Sarah Johnson",
    type: "Chest Pain Evaluation",
    lastVisit: "Last visit 20 days ago",
    age: "51y",
    gender: "F",
    bp: "BP 142/88 ↑",
    hr: "HR 84",
    spo2: "SpO2 96%",
    status: "Upcoming",
  },
  {
    time: "09:30 AM",
    duration: "30 min",
    name: "David Kumar",
    type: "Post-Surgery Review",
    lastVisit: "Last visit 10 days ago",
    age: "62y",
    gender: "M",
    bp: "BP 170/102 ↑↑",
    hr: "HR 99 ↑",
    spo2: "SpO2 91% ↓",
    status: "Alert",
  },
]

  const selected = selectedIndex !== null ? appointments[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-[#F4F8FF] p-6">
      {/* top bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-primary mb-1"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="text-xs text-gray-500">Appointments &gt; Today</div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#25324B]">
              Today, 25 Nov 2025
            </h1>
            <Button
              variant="outline"
              className="h-8 px-3 rounded-lg border-slate-300 bg-white text-xs"
            >
              Today
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search patient"
              className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-sm w-64 outline-none"
            />
          </div>
          <Button
            variant="outline"
            className="h-9 px-3 rounded-lg border-slate-300 bg-white text-sm flex items-center gap-2"
          >
            <Filter size={16} />
            Filter
          </Button>
          <Button
            className="h-9 px-4 rounded-lg bg-[#1D5BFF] hover:bg-[#1447C8] text-sm text-white flex items-center gap-2"
          >
            <Plus size={16} />
            New Appointment
          </Button>
        </div>
      </div>

      {/* summary + view mode */}
      <div className="flex items-center justify-between mb-4">
        <div className="grid grid-cols-4 gap-4 flex-1 max-w-3xl">
          <SummaryCard
            icon={<CalendarDays className="h-5 w-5 text-sky-600" />}
            label="Total Appointments"
            value="12"
          />
          <SummaryCard
            icon={<ClipboardCheck className="h-5 w-5 text-emerald-600" />}
            label="Checked in"
            value="1"
          />
          <SummaryCard
            icon={<Clock3 className="h-5 w-5 text-green-600" />}
            label="Upcoming"
            value="5"
          />
          <SummaryCard
            alert
            icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
            label="With Alerts"
            value="4"
          />
        </div>

        <div className="flex items-center gap-1 bg-white rounded-full px-1 py-1 border border-slate-200">
          {["day", "week", "month"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as ViewMode)}
              className={`px-3 py-1 text-xs rounded-full ${
                viewMode === mode
                  ? "bg-[#1D5BFF] text-white"
                  : "text-slate-600"
              }`}
            >
              {mode === "day" ? "Day" : mode === "week" ? "Week" : "Month"}
            </button>
          ))}
        </div>
      </div>

      {/* chips */}
      <div className="flex items-center gap-3 mb-5">
        <Chip active={chip === "all"} onClick={() => setChip("all")}>
          All
        </Chip>
        <Chip active={chip === "high"} onClick={() => setChip("high")}>
          High Priority
        </Chip>
        <Chip active={chip === "new"} onClick={() => setChip("new")}>
          New
        </Chip>
        <Chip active={chip === "followup"} onClick={() => setChip("followup")}>
          Follow-up
        </Chip>
      </div>

      {/* main layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* left list */}
        <div className="col-span-2 bg-[#E4F0F7] rounded-2xl p-4">
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {appointments.map((apt, index) => (
              <Card
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition
                  ${
                    selectedIndex === index
                      ? "border-[#1D5BFF] bg-white shadow-md"
                      : "border-transparent bg-white/80 hover:border-sky-300"
                  }`}
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-[#25324B]">
                      {apt.time}
                    </div>
                    <div className="text-xs text-slate-500">{apt.duration}</div>
                  </div>

                  <div className="mt-1 text-[15px] font-semibold text-[#243B53]">
                    {apt.name}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    {apt.type}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1">
                    {apt.lastVisit}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mt-2">
                    <span>{apt.age}</span>
                    <span>•</span>
                    <span>{apt.gender}</span>
                    <span>•</span>
                    <span>{apt.bp}</span>
                    <span>•</span>
                    <span>{apt.hr}</span>
                    <span>•</span>
                    <span>{apt.spo2}</span>
                  </div>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 text-[11px] rounded-full font-semibold ${
                      apt.status === "Checked in"
                        ? "bg-emerald-100 text-emerald-700"
                        : apt.status === "Upcoming"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* right panel */}

<div className="bg-white rounded-2xl shadow-sm p-6 border">
  {!selected ? (
    <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
      <div className="text-3xl mb-3">🧑‍⚕️</div>
      Select an appointment to view patient data
    </div>
  ) : (
    <div className="flex flex-col gap-5">
      
      {/* patient header */}
      <div>
        <h2 className="text-xl font-bold text-[#26334D]">{selected.name}</h2>
        <div className="flex items-center gap-6 mt-1 text-sm text-slate-500">
          <span>📞 +358 41 2345678</span>
          <span>⏳ last visit {selected.lastVisit.replace("Last visit ", "")}</span>
        </div>
      </div>

      <hr className="border-slate-200"/>

      <div className="text-sm flex flex-col gap-3">
        <p><b>Reason:</b> {selected.type}</p>
        <p><b>Type:</b> In-person</p>
        <p><b>Duration:</b> {selected.duration}</p>
        <p className="flex items-center gap-2">
          <b>Status:</b>
          <span className="px-3 py-1 text-[11px] bg-emerald-100 text-emerald-700 rounded-full font-semibold">
            {selected.status}
          </span>
        </p>
      </div>

      <div className="pt-2">
        <h3 className="font-semibold text-sm text-[#26334D] mb-3">Vitals</h3>
        <div className="text-[11px] text-slate-600 flex gap-2 flex-wrap">
          <span>Age {selected.age}</span>• 
          <span>{selected.gender}</span>• 
          <span>{selected.bp}</span>• 
          <span>{selected.hr}</span>• 
          <span>{selected.spo2}</span>
        </div>
      </div>

      <hr className="border-slate-200"/>

      {/* quick actions */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
        
        <div className="space-y-3">
          <button className="w-full py-2 text-sm bg-[#7C9FF9] text-white rounded-lg">
            View Medical History
          </button>
          <button className="w-full py-2 text-sm bg-[#7C9FF9] text-white rounded-lg">
            View Lab Results
          </button>
          <button className="w-full py-2 text-sm bg-[#7C9FF9] text-white rounded-lg">
            View Prescription
          </button>
        </div>
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Appointments;

const SummaryCard = ({
  icon,
  label,
  value,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  alert?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white ${
      alert ? "border-red-200" : "border-sky-200"
    }`}
  >
    <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-lg font-bold text-[#243B53]">{value}</div>
    </div>
  </div>
);

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border ${
      active
        ? "bg-[#1D5BFF] text-white border-[#1D5BFF]"
        : "bg-white text-slate-600 border-slate-200"
    }`}
  >
    {children}
  </button>
);
