import { Card, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

/* vitals */
interface VitalProps { label: string; value: string }
const Vital = ({ label, value }: VitalProps) => (
  <div className="w-[140px] rounded-xl bg-white p-3 text-center shadow-sm">
    <p className="text-xs font-semibold text-[#1868FF]">{label}</p>
    <p className="text-lg font-bold text-[#0E1F3B]">{value}</p>
  </div>
);

/* row text */
interface SummaryProps { label: string; text: string }
const Summary = ({ label, text }: SummaryProps) => (
  <p className="text-sm">
    <span className="text-gray-500">{label}: </span>
    <b>{text}</b>
  </p>
);

/* alerts */
interface AlertProps { type: "error" | "success"; text: string }
const Alert = ({ type, text }: AlertProps) => (
  <div className={`text-xs px-3 py-2 rounded-md font-semibold 
    ${type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
    {text}
  </div>
);

/* tab */
interface TabProps { id: string; label: string }
const Tab = ({ id, label }: TabProps) => (
  <TabsTrigger value={id} className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
    {label}
  </TabsTrigger>
);

/* grid */
interface GridProps { children: React.ReactNode }
const Grid2 = ({ children }: GridProps) => (
  <div className="grid grid-cols-2 gap-6">{children}</div>
);

/* main */
interface PatientData { name: string }
interface Props { patient: PatientData | null; onBack: () => void }

const PatientDetails = ({ patient, onBack }: Props) => {

  const [dragging, setDragging] = useState(false);
  const [aiWidth, setAiWidth] = useState(48);

  /* drag start */
  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.userSelect = "none";
    setDragging(true);
  };

  /* drag stop */
  const stopDrag = () => {
    setDragging(false);
    document.body.style.userSelect = "auto";
  };

  /* resize */
  const handleDrag = (e: MouseEvent) => {
    if (!dragging) return;
    let width = (e.clientX / window.innerWidth) * 100;
    width = width * 0.85 + aiWidth * 0.15;
    if (width < 32) width = 32;
    if (width > 90) width = 90;
    setAiWidth(width);
  };

  /* listen */
  useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  });

  const hideRight = aiWidth > 56;

  if (!patient) return <div className="p-10 text-center text-lg">No patient selected.</div>;

  return (
    <div className="min-h-screen bg-[#f7faff] p-8">

      {/* back */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack} className="text-primary text-sm hover:underline flex gap-1">
          <ArrowLeft size={16}/> Back
        </button>
        <span className="text-sm text-muted-foreground">/ Patient Details</span>
      </div>

      {/* header */}
      <Card className="p-6 mb-8 shadow-sm bg-white">
        <div className="flex w-full justify-between items-start">
          <div>
            <h2 className="text-3xl font-semibold">{patient.name}</h2>
            <p className="text-gray-600 mt-1">Brain & Nerve Disorders</p>
            <p className="text-sm text-gray-500 mt-2">Male • Age 32</p>
          </div>

          <div className="flex gap-4 bg-[#E9F2FF] rounded-xl p-4">
            <Vital label="Glucose" value="120 mg/dl"/>
            <Vital label="Weight" value="55 kg"/>
            <Vital label="Heart Rate" value="70 bpm"/>
            <Vital label="SpO2" value="71%"/>
            <Vital label="Temperature" value="98.1°F"/>
            <Vital label="Blood Pressure" value="120/80"/>
          </div>
        </div>
      </Card>

      {/* body */}
      <div className="flex gap-6">

        {/* ai */}
        <div style={{ width: `${aiWidth}%` }} className="relative bg-white p-6 shadow-xl rounded-xl transition-[width] duration-150 select-none">

          <div className="min-h-[620px] flex flex-col justify-between">

            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-[#1B3A65]">AI Co-Pilot Summary</h3>
              <Summary label="Chief Complaint" text="Hypertension + Headache"/>
              <Summary label="Recent Trend" text="BP Rising"/>
              <Summary label="Medication" text="Lisinopril 10mg daily"/>
              <Alert type="error" text="Ibuprofen conflict"/>
              <Alert type="success" text="Vaccination OK"/>
            </div>

            <div className="w-full flex justify-center mt-6 mb-2">
              <button className="bg-[#1D5BFF] hover:bg-[#1447C8] text-white py-3 px-10 rounded-lg font-semibold">
                Start Recording
              </button>
            </div>

            {/* two cards */}
            <div className="mt-10 grid grid-cols-2 gap-6">

              <Card className="p-5 rounded-xl shadow-sm border bg-white">
                <CardTitle className="mb-3 text-lg font-semibold">📝 Clinical Notes</CardTitle>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Headache back region</li>
                  <li>• Sleep disturbance</li>
                  <li>• Numbness legs</li>
                  <li>• Better resting</li>
                </ul>
              </Card>

              <Card className="p-5 rounded-xl shadow-sm border bg-white">
                <CardTitle className="mb-3 text-lg font-semibold text-red-600">⚠ Clinical Alerts</CardTitle>
                <div className="space-y-3">
                  <Alert type="error" text="BP spike"/>
                  <Alert type="error" text="Drug interaction risk"/>
                  <Alert type="success" text="Vaccines updated"/>
                  <Alert type="success" text="No admission 1yr"/>
                </div>
              </Card>

            </div>
          </div>

          {/* drag */}
          <div
            onMouseDown={startDrag}
            className={`
              absolute top-1/2 -right-[6px] h-28 w-[10px] rounded-full 
              cursor-ew-resize text-white shadow-lg flex items-center justify-center 
              -translate-y-1/2 transition-all bg-[#1D5BFF]
              ${dragging ? "scale-125 bg-[#0C44D0]" : ""}
            `}
          >
            |
          </div>
        </div>

        {/* right */}
        {!hideRight && (
          <div className="flex-1 transition-all duration-200">
            <Tabs defaultValue="overview">
              <TabsList className="bg-white shadow-sm border p-2 rounded-lg mb-6 gap-4">
                <Tab id="overview" label="Overview"/>
                <Tab id="case" label="Case Study"/>
                <Tab id="history" label="History"/>
                <Tab id="meds" label="Medications"/>
                <Tab id="reports" label="Reports"/>
              </TabsList>

              <TabsContent value="overview">
                <Grid2>
                  <Card className="p-5 shadow-sm"><CardTitle>Diagnosis</CardTitle></Card>
                  <Card className="p-5 shadow-sm"><CardTitle>Latest Notes</CardTitle></Card>
                </Grid2>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
