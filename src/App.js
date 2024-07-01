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
    <div>
      <div className="file-inputs">
        <div className="file-input">
          <div className="file-name">
            Base PDF (i.e. Empty CMS-1500 Form PDF):{' '}
            {basePdf ? basePdf.name : 'No file selected'}
          </div>
          <input type="file" accept=".pdf" onChange={handleBaseFileChange} />
        </div>

        <div className="file-input">
          <div className="file-name">
            Overlay PDF (i.e. CMS 1500 Form Data PDF):{' '}
            {overlayPdf ? overlayPdf.name : 'No file selected'}
          </div>
          <input type="file" accept=".pdf" onChange={handleOverlayFileChange} />
        </div>
      </div>

      <div className="offset-controls">
        <h4>Base PDF Offsets</h4>
        <div className="offset-control">
          <div className="offset-input">
            <span>
              <label>Base PDF X Offset: </label>
            </span>
            <input
              type="range"
              value={baseOffsets.x}
              min={-500}
              max={500}
              onChange={(e) =>
                setBaseOffsets({ ...baseOffsets, x: +e.target.value })
              }
              step={0.1}
              className="range-input"
            />
            <span className="offset-value">Value: {baseOffsets.x}</span>
          </div>
        </div>
        <div className="offset-input">
          <span>Base PDF Y Offset: </span>
          <input
            type="range"
            value={baseOffsets.y}
            min={-500}
            max={500}
            onChange={(e) =>
              setBaseOffsets({ ...baseOffsets, y: +e.target.value })
            }
            step={0.1}
            className="range-input"
          />
          <span className="offset-value">Value: {baseOffsets.y}</span>
        </div>
      </div>

      <div className="offset-controls">
        <h4>Overlay PDF Offsets</h4>
        <div className="offset-input">
          <span>Overlay PDF X Offset: </span>
          <input
            type="range"
            value={overlayOffsets.x}
            min={-500}
            max={500}
            onChange={(e) =>
              setOverlayOffsets({ ...overlayOffsets, x: +e.target.value })
            }
            step={0.1}
            className="range-input"
          />
          <span className="offset-value">Value: {overlayOffsets.x}</span>
        </div>
        <div className="offset-input">
          <span>Overlay PDF Y Offset: </span>
          <input
            type="range"
            value={overlayOffsets.y}
            min={-500}
            max={500}
            onChange={(e) =>
              setOverlayOffsets({ ...overlayOffsets, y: +e.target.value })
            }
            step={0.1}
            className="range-input"
          />
          <span className="offset-value">Value: {overlayOffsets.y}</span>
        </div>
      </div>

      <button onClick={handleOverlay} className="overlay-button">
        Overlay PDFs
      </button>

      {previewUrl && (
        <div className="preview-container">
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
