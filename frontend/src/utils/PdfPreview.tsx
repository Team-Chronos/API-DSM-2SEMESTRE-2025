interface PdfPreviewIframeProps {
  pdfUrl: string;
}

const buildIframeSrc = (url: string) => {
  return `${url}#view=FitH&toolbar=0&scrollbar=0&navpanes=0`;
}

export const PdfPreviewIframe = ({ pdfUrl }: PdfPreviewIframeProps) => {
  return (
    <div className="iframe-preview-container">
      <iframe
        src={buildIframeSrc(pdfUrl)}
        title={`Preview de ${pdfUrl}`}
        frameBorder="0"
      ></iframe>
    </div>
  );
};