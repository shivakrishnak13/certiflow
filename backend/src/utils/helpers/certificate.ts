import { CertificateData } from "@/types/application";
import PDFDocument from "pdfkit";

const COLORS = {
  navy: "#1a2a4a",
  gold: "#b8860b",
  goldLight: "#d4af37",
  border: "#8b6914",
  text: "#1a1a1a",
  muted: "#555555",
  bgTint: "#fdfaf3",
};

export const generateCertificatePdf = (
  data: CertificateData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // ---------- Background ----------
    doc.rect(0, 0, pageWidth, pageHeight).fill(COLORS.bgTint);

    // ---------- Watermark (SPECIMEN) ----------
    doc.save();
    doc.rotate(-35, { origin: [pageWidth / 2, pageHeight / 2] });
    doc
      .fontSize(90)
      .fillColor(COLORS.navy)
      .opacity(0.06)
      .font("Helvetica-Bold")
      .text("SPECIMEN", 0, pageHeight / 2 - 50, {
        width: pageWidth,
        align: "center",
      });
    doc.restore();
    doc.opacity(1);

    // ---------- Decorative border ----------
    const outerMargin = 24;
    const innerMargin = 34;
    doc
      .lineWidth(3)
      .strokeColor(COLORS.navy)
      .rect(
        outerMargin,
        outerMargin,
        pageWidth - outerMargin * 2,
        pageHeight - outerMargin * 2,
      )
      .stroke();

    doc
      .lineWidth(1)
      .strokeColor(COLORS.gold)
      .rect(
        innerMargin,
        innerMargin,
        pageWidth - innerMargin * 2,
        pageHeight - innerMargin * 2,
      )
      .stroke();

    // Corner flourishes
    const cornerSize = 16;
    [
      [innerMargin, innerMargin],
      [pageWidth - innerMargin, innerMargin],
      [innerMargin, pageHeight - innerMargin],
      [pageWidth - innerMargin, pageHeight - innerMargin],
    ].forEach(([x, y]) => {
      doc
        .save()
        .lineWidth(2)
        .strokeColor(COLORS.gold)
        .circle(x, y, cornerSize / 2)
        .stroke()
        .restore();
    });

    // ---------- Header: University branding ----------
    const contentX = 70;
    const contentWidth = pageWidth - contentX * 2;
    let y = 60;

    // Dummy logo (placeholder emblem - circle + initials)
    const logoX = pageWidth / 2;
    const logoY = y + 30;
    doc
      .save()
      .lineWidth(2)
      .strokeColor(COLORS.gold)
      .fillColor(COLORS.navy)
      .circle(logoX, logoY, 28)
      .fillAndStroke(COLORS.navy, COLORS.gold);
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("AU", logoX - 14, logoY - 10, { width: 28, align: "center" });
    doc.restore();

    y = logoY + 40;

    doc
      .fillColor(COLORS.navy)
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("ABC UNIVERSITY", contentX, y, {
        width: contentWidth,
        align: "center",
      });

    y += 32;
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica")
      .fontSize(10)
      .text("(Dummy Institution — For Demonstration Purposes Only)", contentX, y, {
        width: contentWidth,
        align: "center",
      });

    y += 26;
    // Gold divider line with center diamond
    doc
      .strokeColor(COLORS.gold)
      .lineWidth(1)
      .moveTo(contentX + 40, y)
      .lineTo(pageWidth / 2 - 8, y)
      .stroke()
      .moveTo(pageWidth / 2 + 8, y)
      .lineTo(pageWidth - contentX - 40, y)
      .stroke();
    doc
      .save()
      .translate(pageWidth / 2, y)
      .rotate(45)
      .rect(-4, -4, 8, 8)
      .fill(COLORS.gold)
      .restore();

    y += 26;
    doc
      .fillColor(COLORS.navy)
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("PROVISIONAL CERTIFICATE", contentX, y, {
        width: contentWidth,
        align: "center",
      });

    y += 45;

    // ---------- Body ----------
    doc.font("Times-Roman").fontSize(12).fillColor(COLORS.text);

    doc.text(`Reference Number: ${data.referenceNumber}`, contentX, y);
    y = doc.y + 14;

    doc
      .fontSize(13)
      .font("Times-Italic")
      .text("This is to certify that", contentX, y, {
        width: contentWidth,
        align: "center",
      });
    y = doc.y + 6;

    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(COLORS.navy)
      .text(data.fullName, contentX, y, {
        width: contentWidth,
        align: "center",
      });
    y = doc.y + 10;

    doc
      .font("Times-Roman")
      .fontSize(12)
      .fillColor(COLORS.text)
      .text(
        `Date of Birth: ${data.dateOfBirth.toLocaleDateString()}    |    Registration No: ${data.registrationNumber}`,
        contentX,
        y,
        { width: contentWidth, align: "center" },
      );
    y = doc.y + 16;

    doc.text(
      `has provisionally been awarded the degree of`,
      contentX,
      y,
      { width: contentWidth, align: "center" },
    );
    y = doc.y + 6;

    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor(COLORS.navy)
      .text(data.degree, contentX, y, {
        width: contentWidth,
        align: "center",
      });
    y = doc.y + 4;

    doc
      .font("Times-Italic")
      .fontSize(12)
      .fillColor(COLORS.text)
      .text(`with specialization in ${data.specialization}`, contentX, y, {
        width: contentWidth,
        align: "center",
      });
    y = doc.y + 24;

    // Address block
    doc.font("Helvetica-Bold").fontSize(11).text("Address on Record:", contentX, y);
    y = doc.y + 2;
    doc.font("Helvetica").fontSize(11);
    doc.text(data.address.line1, contentX, y);
    y = doc.y;
    if (data.address.line2) {
      doc.text(data.address.line2, contentX, y);
      y = doc.y;
    }
    doc.text(
      `${data.address.city}, ${data.address.state} - ${data.address.postalCode}`,
      contentX,
      y,
    );
    y = doc.y + 22;

    doc
      .font("Times-Italic")
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text(
        "This provisional certificate has been generated based on the submitted application and does not constitute an official academic record.",
        contentX,
        y,
        { width: contentWidth, align: "center" },
      );

    // ---------- Footer: Seal + Signature + Date ----------
    const footerY = pageHeight - 170;

    // Signature (drawn as a stylized scribble)
    const sigX = contentX + 20;
    const sigBaseY = footerY + 55;
    doc
      .save()
      .strokeColor(COLORS.navy)
      .lineWidth(1.3)
      .moveTo(sigX, sigBaseY)
      .bezierCurveTo(
        sigX + 15, sigBaseY - 20,
        sigX + 25, sigBaseY + 15,
        sigX + 45, sigBaseY - 10,
      )
      .bezierCurveTo(
        sigX + 60, sigBaseY - 25,
        sigX + 70, sigBaseY + 10,
        sigX + 95, sigBaseY - 5,
      )
      .stroke()
      .restore();

    doc
      .strokeColor(COLORS.text)
      .lineWidth(0.75)
      .moveTo(sigX, sigBaseY + 12)
      .lineTo(sigX + 140, sigBaseY + 12)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.text)
      .text("Registrar, ABC University", sigX, sigBaseY + 16);

    // Official seal (concentric circles + text ring effect via simple label)
    const sealX = pageWidth - contentX - 55;
    const sealY = footerY + 40;
    doc.save();
    doc
      .lineWidth(2)
      .strokeColor(COLORS.gold)
      .circle(sealX, sealY, 40)
      .stroke();
    doc
      .lineWidth(1)
      .strokeColor(COLORS.gold)
      .circle(sealX, sealY, 34)
      .stroke();
    doc
      .fillColor(COLORS.navy)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("ABC UNIVERSITY", sealX - 32, sealY - 20, {
        width: 64,
        align: "center",
      });
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor(COLORS.gold)
      .text("★ OFFICIAL SEAL ★", sealX - 32, sealY - 4, {
        width: 64,
        align: "center",
      });
    doc
      .fontSize(7)
      .fillColor(COLORS.navy)
      .text("SPECIMEN COPY", sealX - 32, sealY + 10, {
        width: 64,
        align: "center",
      });
    doc.restore();

    // Issued date
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(
        `Issued on: ${new Date().toLocaleDateString()}`,
        contentX,
        pageHeight - 90,
      );

    doc.end();
  });
};