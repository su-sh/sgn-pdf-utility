import { PDFDocument } from "pdf-lib";

/**
 * Merges multiple PDF files into a single PDF and returns it as a Blob.
 *
 * @param {File[]} pdfFiles - An array of File objects representing the PDFs to merge.
 * @return {Promise<Blob>} - A promise that resolves to a Blob of the merged PDF.
 */
export const mergePDFs = async (pdfFiles) => {
    const mergedPdf = await PDFDocument.create();

    for (let pdfFile of pdfFiles) {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return new Blob([mergedPdfBytes], { type: "application/pdf" });
};

export const overlayPDFs = async (basePdfFile, overlayPdfFile, baseOffsets, overlayOffsets) => {
    const basePdfBytes = await basePdfFile.arrayBuffer();
    const overlayPdfBytes = await overlayPdfFile.arrayBuffer();

    const basePdfDoc = await PDFDocument.load(basePdfBytes);
    const overlayPdfDoc = await PDFDocument.load(overlayPdfBytes);

    const basePages = basePdfDoc.getPages();
    const overlayPages = overlayPdfDoc.getPages();

    if (basePages.length === 0 || overlayPages.length === 0) {
        throw new Error('One of the PDFs does not have pages.');
    }

    const baseSize = basePages[0].getSize();

    const newPage = basePdfDoc.insertPage(0, [baseSize.width, baseSize.height]);

    const embeddedBasePage = await basePdfDoc.embedPage(basePages[0]);
    const embeddedOverlayPage = await basePdfDoc.embedPage(overlayPages[0]);

    newPage.drawPage(embeddedBasePage, {
        x: baseOffsets.x,
        y: baseOffsets.y
    });

    newPage.drawPage(embeddedOverlayPage, {
        x: overlayOffsets.x,
        y: overlayOffsets.y
    });

    basePdfDoc.removePage(1);

    const mergedPdfBytes = await basePdfDoc.save();
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
};
