import React, { useCallback, useEffect, useState } from 'react';
import { overlayPDFs } from './utils/pdf';
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  const [basePdf, setBasePdf] = useState(null);
  const [overlayPdf, setOverlayPdf] = useState(null);
  const [baseOffsets, setBaseOffsets] = useState({ x: 0, y: 0 });
  const [overlayOffsets, setOverlayOffsets] = useState({ x: 0, y: 0 });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleBaseFileChange = (e) => {
    setBasePdf(e.target.files[0]);
  };

  const handleOverlayFileChange = (e) => {
    setOverlayPdf(e.target.files[0]);
  };

  const debouncedBaseOffsets = useDebounce(baseOffsets, 500);
  const debouncedOverlayOffsets = useDebounce(overlayOffsets, 500);

  const handleOverlay = useCallback(async () => {
    if (basePdf && overlayPdf) {
      const mergedBlob = await overlayPDFs(basePdf, overlayPdf, debouncedBaseOffsets, debouncedOverlayOffsets);
      setPreviewUrl(URL.createObjectURL(mergedBlob));
    }
  }, [basePdf, overlayPdf, debouncedBaseOffsets, debouncedOverlayOffsets]);

  useEffect(() => {
    handleOverlay();
  }, [basePdf, overlayPdf, debouncedBaseOffsets, debouncedOverlayOffsets, handleOverlay]);


  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleBaseFileChange} />
      <input type="file" accept=".pdf" onChange={handleOverlayFileChange} />

      <div>
        <h4>Base PDF Offsets</h4>
        x: <input type="range" value={baseOffsets.x} min={-500} max={500} onChange={(e) => setBaseOffsets({ ...baseOffsets, x: +e.target.value })}
          style={{
            width: "500px"
          }}
          step={.1}
        />
        y: <input type="range" value={baseOffsets.y} min={-500} max={500} onChange={(e) => setBaseOffsets({ ...baseOffsets, y: +e.target.value })}
          step={.1}
          style={{
            width: "500px"
          }}


        />
      </div>

      <div>
        <h4>Overlay PDF Offsets</h4>
        x: <input type="range" value={overlayOffsets.x} min={-500} max={500} onChange={(e) => setOverlayOffsets({ ...overlayOffsets, x: +e.target.value })} 
          step={.1}

          style={{
            width: "500px"
          }}

        />
        y: <input type="range" value={overlayOffsets.y} min={-500} max={500} onChange={(e) => setOverlayOffsets({ ...overlayOffsets, y: +e.target.value })} 
          step={.1}

          style={{
            width: "500px"
          }}

        />
      </div>

      <button onClick={handleOverlay}>Overlay PDFs</button>

      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <h4>PDF Preview:</h4>
          <iframe src={previewUrl} title="PDF Preview" width="1200" height="1600" style={{ border: '1px solid black' }}></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
