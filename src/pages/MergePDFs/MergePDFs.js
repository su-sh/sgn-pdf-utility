import React, { useState } from 'react';

import { mergePDFs } from '../../utils/pdf';

function MergePDFs() {
  const [pdfFiles, setPdfFiles] = useState([]);

  const handleFileChange = (e) => {
    setPdfFiles([...pdfFiles, ...e.target.files]);
  };

  const handleMerge = async () => {
    const mergedBlob = await mergePDFs(pdfFiles);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(mergedBlob);
    link.download = 'merged.pdf';
    link.click();
  };

  return (
    <div>
      <input type="file" accept=".pdf" multiple onChange={handleFileChange} />
      <button onClick={handleMerge}>Merge PDFs</button>
    </div>
  );
}

export default MergePDFs;
