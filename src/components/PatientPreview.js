function PatientPreview({ data }) {
  return (
    <div className="mt-4 bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto">
      <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default PatientPreview;
