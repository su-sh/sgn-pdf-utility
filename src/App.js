import React, { useCallback, useEffect, useState } from 'react';

import useDebounce from './hooks/useDebounce';

import { overlayPDFs } from './utils/pdf';

import './App.css';

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
      const mergedBlob = await overlayPDFs(
        basePdf,
        overlayPdf,
        debouncedBaseOffsets,
        debouncedOverlayOffsets
      );
      setPreviewUrl(URL.createObjectURL(mergedBlob));
    }
  }, [basePdf, overlayPdf, debouncedBaseOffsets, debouncedOverlayOffsets]);

  useEffect(() => {
    handleOverlay();
  }, [
    basePdf,
    overlayPdf,
    debouncedBaseOffsets,
    debouncedOverlayOffsets,
    handleOverlay,
  ]);

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col">
          <div className="file-name">
            Base PDF (i.e. Empty CMS-1500/UB-04 Form PDF):{' '}
            {basePdf ? basePdf.name : 'No file selected'}
          </div>
          <input type="file" accept=".pdf" onChange={handleBaseFileChange} className="form-control-file" />
        </div>

        <div className="col">
          <div className="file-name">
            Overlay PDF (i.e. PM System Sample PDF):{' '}
            {overlayPdf ? overlayPdf.name : 'No file selected'}
          </div>
          <input type="file" accept=".pdf" onChange={handleOverlayFileChange} className="form-control-file" />
        </div>
      </div>

      <div className="mb-3">
        <h4>Base PDF Offsets</h4>
        <div className="form-group">
          <label>Base PDF X Offset: </label>
          <input
            type="range"
            value={baseOffsets.x}
            min={-500}
            max={500}
            onChange={(e) =>
              setBaseOffsets({ ...baseOffsets, x: +e.target.value })
            }
            step={0.1}
            className="form-control-range"
          />
          <span className="offset-value">Value: {baseOffsets.x}</span>
        </div>
        <div className="form-group">
          <label>Base PDF Y Offset: </label>
          <input
            type="range"
            value={baseOffsets.y}
            min={-500}
            max={500}
            onChange={(e) =>
              setBaseOffsets({ ...baseOffsets, y: +e.target.value })
            }
            step={0.1}
            className="form-control-range"
          />
          <span className="offset-value">Value: {baseOffsets.y}</span>
        </div>
      </div>

      <div className="mb-3">
        <h4>Overlay PDF Offsets</h4>
        <div className="form-group">
          <label>Overlay PDF X Offset: </label>
          <input
            type="range"
            value={overlayOffsets.x}
            min={-500}
            max={500}
            onChange={(e) =>
              setOverlayOffsets({ ...overlayOffsets, x: +e.target.value })
            }
            step={0.1}
            className="form-control-range"
          />
          <span className="offset-value">Value: {overlayOffsets.x}</span>
        </div>
        <div className="form-group">
          <label>Overlay PDF Y Offset: </label>
          <input
            type="range"
            value={overlayOffsets.y}
            min={-500}
            max={500}
            onChange={(e) =>
              setOverlayOffsets({ ...overlayOffsets, y: +e.target.value })
            }
            step={0.1}
            className="form-control-range"
          />
          <span className="offset-value">Value: {overlayOffsets.y}</span>
        </div>
      </div>

      <button onClick={handleOverlay} className="btn btn-primary">
        Overlay PDFs
      </button>

      {previewUrl && (
        <div className="mt-3">
          <h4>PDF Preview:</h4>
          <iframe
            src={previewUrl}
            title="PDF Preview"
            className="pdf-preview"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
