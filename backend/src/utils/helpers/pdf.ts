const PDF_HEADER = "%PDF-";
const PDF_EOF = "%%EOF";

const forbiddenPdfTokens = [
  "/JavaScript",
  "/JS",
  "/AA",
  "/OpenAction",
  "/Launch",
  "/EmbeddedFile",
  "/RichMedia",
  "/XFA",
];

export const sanitizePdf = (buffer: Buffer): Buffer => {
  if (buffer.length === 0 || buffer.subarray(0, PDF_HEADER.length).toString() !== PDF_HEADER) {
    throw new Error("The uploaded file is not a valid PDF.");
  }

  const content = buffer.toString("latin1");
  if (!content.includes(PDF_EOF)) {
    throw new Error("The uploaded PDF is incomplete or corrupted.");
  }

  // const forbiddenToken = forbiddenPdfTokens.find((token) => content.includes(token));
  // if (forbiddenToken) {
  //   throw new Error("The PDF contains unsupported active content.");
  // }

  return Buffer.from(buffer);
};
