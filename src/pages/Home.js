import { useState } from 'react';
import FileUpload from '../components/FileUpload.js';
import PatientPreview from '../components/PatientPreview.js';

export default function Home() {
  const [patientData, setPatientData] = useState(null);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Clinexus Lite - Patient Upload</h1>
      <FileUpload onUpload={setPatientData} />
      {patientData && <PatientPreview data={patientData} />}
    </div>
  );
}
