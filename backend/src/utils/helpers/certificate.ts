import { CertificateData } from "@/types/application";
import PDFDocument from "pdfkit";

export const generateCertificatePdf = (
  data: CertificateData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    doc.fontSize(24).text("PROVISIONAL CERTIFICATE", {
      align: "center",
    });

    doc.moveDown(2);

    doc.fontSize(12).text(`Reference Number: ${data.referenceNumber}`);

    doc.moveDown();

    doc.text(`Name: ${data.fullName}`);

    doc.text(`Date of Birth: ${data.dateOfBirth.toLocaleDateString()}`);

    doc.text(`Registration Number: ${data.registrationNumber}`);

    doc.text(`Degree: ${data.degree}`);
    doc.text(`Specialization: ${data.specialization}`);

    doc.moveDown();

    doc.text("Address:");

    doc.text(data.address.line1);

    if (data.address.line2) {
      doc.text(data.address.line2);
    }

    doc.text(
      `${data.address.city}, ${data.address.state} - ${data.address.postalCode}`,
    );

    doc.moveDown(2);

    doc.text(
      "This provisional certificate has been generated based on the submitted application.",
    );

    doc.moveDown(3);

    doc.text(`Issued on: ${new Date().toLocaleDateString()}`);

    doc.end();
  });
};
