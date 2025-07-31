function FileUpload({ onUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          onUpload(json);
        } catch (err) {
          alert('Invalid JSON format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 border border-dashed border-gray-400 rounded-xl">
      <input type="file" accept=".json" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
