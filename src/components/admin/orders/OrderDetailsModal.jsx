// src/components/admin/orders/OrderDetailsModal.jsx
import React, { useState } from "react";
import { User, Package, MapPin, CreditCard, Download } from "lucide-react";
import Modal from "../shared/Modal";
import AlertModal from "../shared/AlertModal";
import StatusBadge from "../shared/StatusBadge";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import CavoyaLogo from "../../../assets/Cavoya_Logo_Pink.PNG";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

// Convert any image URL / import to base64
const toBase64 = (src) =>
  new Promise((resolve) => {
    if (!src || typeof src !== 'string') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null); // skip on error
    img.src = src;
  });

// ─── Pure jsPDF invoice renderer ─────────────────────────────────────────────
const generateInvoicePDF = async (
  order,
  logoSrc,
  formatCurrency,
  formatDate,
) => {
  const { jsPDF } = window.jspdf;

  // jsPDF's built-in Helvetica lacks the ₹ glyph — swap to "Rs." for PDF only
  const pdfCurrency = (amount) =>
    String(formatCurrency(amount)).replace(/₹\s*/g, "Rs. ");

  // ── Page setup ────────────────────────────────────────────────────────────
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const PW = 210; // page width mm
  const PH = 297; // page height mm
  const ML = 14; // margin left
  const MR = 14; // margin right
  const CW = PW - ML - MR; // content width = 182 mm

  // ── Colour palette ────────────────────────────────────────────────────────
  const PINK = [219, 39, 119]; // #DB2777
  const PINK_LIGHT = [253, 242, 248]; // #FDF2F8
  const PINK_RULE = [252, 231, 243]; // #FCE7F3
  const GRAY_900 = [17, 24, 39];
  const GRAY_700 = [55, 65, 81];
  const GRAY_500 = [107, 114, 128];
  const GRAY_100 = [243, 244, 246];
  const GRAY_50 = [249, 250, 251];
  const WHITE = [255, 255, 255];

  // ── Helpers ───────────────────────────────────────────────────────────────
  let curY = 0; // running Y cursor

  const needsNewPage = (spaceNeeded = 10) => {
    if (curY + spaceNeeded > PH - 14) {
      doc.addPage();
      curY = 14;
      return true;
    }
    return false;
  };

  const setFont = (style = "normal", size = 10, color = GRAY_700) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const rect = (x, y, w, h, fillColor, strokeColor, radius = 0) => {
    if (fillColor) doc.setFillColor(...fillColor);
    if (strokeColor) doc.setDrawColor(...strokeColor);
    else doc.setDrawColor(0, 0, 0, 0);
    const style = fillColor && strokeColor ? "FD" : fillColor ? "F" : "D";
    if (radius > 0) doc.roundedRect(x, y, w, h, radius, radius, style);
    else doc.rect(x, y, w, h, style);
  };

  const hLine = (x1, x2, y, color = [229, 231, 235], lw = 0.2) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(lw);
    doc.line(x1, y, x2, y);
  };

  // Status badge: coloured pill with text
  const STATUS_COLORS = {
    pending: { bg: [254, 243, 199], text: [146, 64, 14] },
    processing: { bg: [219, 234, 254], text: [30, 64, 175] },
    shipped: { bg: [237, 233, 254], text: [91, 33, 182] },
    delivered: { bg: [209, 250, 229], text: [6, 95, 70] },
    cancelled: { bg: [254, 226, 226], text: [153, 27, 27] },
    paid: { bg: [209, 250, 229], text: [6, 95, 70] },
    unpaid: { bg: [254, 226, 226], text: [153, 27, 27] },
    refunded: { bg: [254, 243, 199], text: [146, 64, 14] },
  };

  const badge = (text = "", x, y) => {
    const s = STATUS_COLORS[text.toLowerCase()] || {
      bg: GRAY_100,
      text: GRAY_700,
    };
    const label = text.charAt(0).toUpperCase() + text.slice(1);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const tw = doc.getTextWidth(label);
    const bw = tw + 6;
    const bh = 5;
    rect(x, y - 3.5, bw, bh, s.bg, null, 2);
    doc.setTextColor(...s.text);
    doc.text(label, x + 3, y);
    return bw; // return width so caller can advance X
  };

  // Wrap + print text, return final Y
  const textBlock = (lines, x, y, lineH = 5) => {
    lines.forEach((line) => {
      if (line === null) {
        y += lineH * 0.4;
        return;
      } // spacer
      doc.text(String(line), x, y);
      y += lineH;
    });
    return y;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 1. HEADER
  // ─────────────────────────────────────────────────────────────────────────
  curY = 14;

  // Pink rule line at top
  rect(0, 0, PW, 2, PINK, null);

  // Logo
  const logoB64 = await toBase64(logoSrc);
  if (logoB64) {
    doc.addImage(logoB64, "PNG", ML, curY, 18, 18);
  }

  // Company / invoice title
  setFont("bold", 18, GRAY_900);
  doc.text("Order Invoice", ML + 22, curY + 7);
  setFont("normal", 9, GRAY_500);
  doc.text(`Order #${order.id}`, ML + 22, curY + 13);

  // Right-side date block
  setFont("normal", 8, GRAY_500);
  doc.text("INVOICE DATE", PW - MR, curY + 5, { align: "right" });
  setFont("bold", 10, GRAY_700);
  doc.text(formatDate(order.orderDate), PW - MR, curY + 11, { align: "right" });

  curY += 22;

  // Divider
  hLine(ML, PW - MR, curY, PINK_RULE, 0.5);
  curY += 6;

  // ─────────────────────────────────────────────────────────────────────────
  // 2. INFO CARDS (2 × 2 grid)
  // ─────────────────────────────────────────────────────────────────────────
  const cardW = (CW - 6) / 2;
  const cardH = 36;
  const col2X = ML + cardW + 6;

  const drawCard = (x, y, title, rows) => {
    rect(x, y, cardW, cardH, GRAY_50, [229, 231, 235], 3);
    setFont("bold", 8, GRAY_500);
    doc.text(title.toUpperCase(), x + 4, y + 6);
    hLine(x + 4, x + cardW - 4, y + 8, [229, 231, 235], 0.15);
    let iy = y + 13;
    rows.forEach(({ label, value, isBadge }) => {
      setFont("bold", 8.5, GRAY_900);
      doc.text(`${label}:`, x + 4, iy);
      const lw = doc.getTextWidth(`${label}: `);
      if (isBadge) {
        badge(value, x + 4 + lw, iy);
      } else {
        setFont("normal", 8.5, GRAY_700);
        // Truncate long values to fit card
        const maxW = cardW - 8 - lw;
        const safe = doc.splitTextToSize(String(value ?? "—"), maxW)[0];
        doc.text(safe, x + 4 + lw, iy);
      }
      iy += 5.5;
    });
  };

  // Row 1
  drawCard(ML, curY, "Customer", [
    { label: "Name", value: order.customerName },
    { label: "Email", value: order.customerEmail },
    { label: "Phone", value: order.customerPhone },
  ]);
  drawCard(col2X, curY, "Order Info", [
    { label: "Date", value: formatDate(order.orderDate) },
    { label: "Status", value: order.status, isBadge: true },
    { label: "Tracking", value: order.trackingNumber || "—" },
  ]);
  curY += cardH + 4;

  // Row 2
  const addr = order.shippingAddress;
  drawCard(ML, curY, "Shipping Address", [
    { label: "Street", value: addr.street },
    { label: "City", value: `${addr.city}, ${addr.state} – ${addr.pincode}` },
    { label: "Country", value: addr.country },
  ]);
  drawCard(col2X, curY, "Payment", [
    { label: "Method", value: order.paymentMethod },
    { label: "Status", value: order.paymentStatus, isBadge: true },
    { label: "Amount", value: pdfCurrency(order.totalAmount) },
  ]);
  curY += cardH + 8;

  // ─────────────────────────────────────────────────────────────────────────
  // 3. ITEMS TABLE
  // ─────────────────────────────────────────────────────────────────────────
  setFont("bold", 11, GRAY_900);
  doc.text("Order Items", ML, curY);
  curY += 5;

  // Column config: [header, x, width, align]
  const COLS = [
    { h: "Product", x: ML, w: 68, align: "left" },
    { h: "Size/Color", x: ML + 70, w: 30, align: "left" },
    { h: "Qty", x: ML + 102, w: 14, align: "center" },
    { h: "Price", x: ML + 118, w: 28, align: "right" },
    { h: "Total", x: ML + 148, w: 34, align: "right" },
  ];

  // Table header row
  rect(ML, curY, CW, 8, GRAY_100, null, 2);
  setFont("bold", 8, GRAY_500);
  COLS.forEach((col) => {
    const tx =
      col.align === "right"
        ? col.x + col.w
        : col.align === "center"
          ? col.x + col.w / 2
          : col.x + 2;
    doc.text(col.h.toUpperCase(), tx, curY + 5.2, { align: col.align });
  });
  curY += 8;

  // Item rows
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const THUMB = 10; // thumbnail square mm

  for (const item of order.items) {
    const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(item.image || "");
    const rowH = 14;
    needsNewPage(rowH + 4);

    // Alternating row background
    rect(ML, curY, CW, rowH, WHITE, null);
    hLine(ML, ML + CW, curY, [229, 231, 235], 0.15);

    // Thumbnail
    if (!isVideo) {
      const isValidUrl = item.image && typeof item.image === 'string' && item.image.startsWith('http');
      if (isValidUrl) {
        const imgB64 = await toBase64(item.image);
        if (imgB64) {
          rect(ML + 2, curY + 2, THUMB, THUMB, GRAY_100, null, 1);
          try {
            doc.addImage(imgB64, "PNG", ML + 2, curY + 2, THUMB, THUMB);
          } catch (_) {
            setFont("normal", 6, GRAY_500);
            doc.text("IMG", ML + 2 + THUMB / 2, curY + 7, { align: "center" });
          }
        }
      } else {
        rect(ML + 2, curY + 2, THUMB, THUMB, GRAY_100, null, 1);
        setFont("normal", 6, GRAY_500);
        doc.text("N/A", ML + 2 + THUMB / 2, curY + 7, { align: "center" });
      }
    } else {
      rect(ML + 2, curY + 2, THUMB, THUMB, GRAY_100, null, 1);
      setFont("normal", 6, GRAY_500);
      doc.text("VIDEO", ML + 2 + THUMB / 2, curY + 7, { align: "center" });
    }

    // Product name (wrap to 2 lines)
    setFont("bold", 8.5, GRAY_900);
    const nameLines = doc.splitTextToSize(item.name, COLS[0].w - THUMB - 6);
    doc.text(nameLines.slice(0, 2), ML + 2 + THUMB + 3, curY + 6);

    // Size / Color
    setFont("normal", 8.5, GRAY_700);
    doc.text(`${item.size} / ${item.color}`, COLS[1].x + 2, curY + 7);

    // Qty
    setFont("normal", 8.5, GRAY_700);
    doc.text(String(item.quantity), COLS[2].x + COLS[2].w / 2, curY + 7, {
      align: "center",
    });

    // Price
    setFont("normal", 8.5, GRAY_700);
    doc.text(pdfCurrency(item.price), COLS[3].x + COLS[3].w, curY + 7, {
      align: "right",
    });

    // Total
    setFont("bold", 8.5, GRAY_900);
    doc.text(
      pdfCurrency(item.price * item.quantity),
      COLS[4].x + COLS[4].w,
      curY + 7,
      { align: "right" },
    );

    curY += rowH;
  }

  // ── Totals block ──────────────────────────────────────────────────────────
  hLine(ML, ML + CW, curY, [209, 213, 219], 0.3);
  curY += 4;

  const drawTotalsRow = (label, value, isTotal = false) => {
    needsNewPage(8);
    const labelX = PW - MR - 55;
    const valueX = PW - MR;
    if (isTotal) {
      // Span full content width ML → PW-MR
      rect(ML, curY - 4.5, CW, 10, PINK_LIGHT, PINK_RULE, 2);
    }
    setFont(
      isTotal ? "bold" : "normal",
      isTotal ? 10 : 9,
      isTotal ? GRAY_900 : GRAY_500,
    );
    doc.text(label, labelX, curY);
    setFont(
      isTotal ? "bold" : "normal",
      isTotal ? 10 : 9,
      isTotal ? PINK : GRAY_700,
    );
    doc.text(value, valueX, curY, { align: "right" });
    curY += isTotal ? 7 : 6;
  };

  drawTotalsRow("Subtotal", pdfCurrency(subtotal));
  drawTotalsRow("Shipping", "Free");
  curY += 1;
  hLine(PW - MR - 59, PW - MR, curY - 3, [229, 231, 235], 0.2);
  drawTotalsRow("Total", pdfCurrency(order.totalAmount), true);

  curY += 4;

  // ─────────────────────────────────────────────────────────────────────────
  // 4. NOTES (if any)
  // ─────────────────────────────────────────────────────────────────────────
  if (order.notes) {
    needsNewPage(20);
    rect(ML, curY, CW, 18, [255, 251, 235], [253, 230, 138], 3);
    setFont("bold", 8.5, [146, 64, 14]);
    doc.text("Notes:", ML + 4, curY + 6);
    setFont("normal", 8.5, [180, 83, 9]);
    const noteLines = doc.splitTextToSize(order.notes, CW - 8);
    doc.text(noteLines.slice(0, 2), ML + 4, curY + 12);
    curY += 22;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. FOOTER
  // ─────────────────────────────────────────────────────────────────────────
  const footerY = PH - 10;
  hLine(ML, PW - MR, footerY - 4, PINK_RULE, 0.4);
  setFont("normal", 8, GRAY_500);
  doc.text(
    "Thank you for shopping with Cavoya  ·  This is a system-generated invoice",
    PW / 2,
    footerY,
    { align: "center" },
  );

  // Pink bottom rule
  rect(0, PH - 2, PW, 2, PINK, null);

  return doc;
};

// ─── Component ────────────────────────────────────────────────────────────────
const OrderDetailsModal = ({ order, onClose }) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "" });
  const showAlert = (title, message) =>
    setAlertModal({ isOpen: true, title, message });

  const calculateSubtotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleGeneratePDF = async () => {
    setGeneratingPdf(true);
    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      );

      const doc = await generateInvoicePDF(
        order,
        CavoyaLogo,
        formatCurrency,
        formatDate,
      );
      doc.save(`Invoice-${order.id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showAlert("PDF Generation Failed", "Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal((p) => ({ ...p, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type="error"
      />
      <Modal
        isOpen={true}
        onClose={onClose}
        title={`Order Details - ${order.id}`}
        size="lg"
      >
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {order.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {order.customerEmail}
                </p>
                <p>
                  <strong>Phone:</strong> {order.customerPhone}
                </p>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Order Date:</strong> {formatDate(order.orderDate)}
                </p>
                <p>
                  <strong>Status:</strong>
                  <StatusBadge
                    status={order.status}
                    type="order"
                    className="ml-2"
                  />
                </p>
                <p>
                  <strong>Estimated Delivery:</strong>{" "}
                  {formatDate(order.estimatedDelivery)}
                </p>
                {order.trackingNumber && (
                  <p>
                    <strong>Tracking Number:</strong> {order.trackingNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </h3>
              <div className="text-sm">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Status:</strong>
                  <StatusBadge
                    status={order.paymentStatus}
                    type="payment"
                    className="ml-2"
                  />
                </p>
                <p>
                  <strong>Total Amount:</strong>{" "}
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>

            {/* ── MOBILE: card-per-item (hidden on md+) ── */}
            <div className="md:hidden space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  {/* Product row */}
                  <div className="flex items-center gap-3 mb-3">
                    {item.video ||
                      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(item.image || "") ? (
                      <video
                        src={item.video || item.image}
                        className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                        autoPlay
                        loop
                        muted
                        playsInline
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        crossOrigin="anonymous"
                        className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.size} / {item.color}
                      </p>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Qty
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {item.quantity}
                      </p>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Price
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Total
                      </p>
                      <p className="text-sm font-semibold text-pink-600 mt-0.5">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile totals */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">
                    Subtotal
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrency(calculateSubtotal(order.items))}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">
                    Shipping
                  </span>
                  <span className="text-sm font-medium text-gray-800">Free</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-pink-50 border-t border-pink-100">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-pink-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── DESKTOP: full table (hidden below md) ── */}
            <div className="hidden md:block bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Size/Color
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {item.video ||
                            /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(
                              item.image || "",
                            ) ? (
                            <video
                              src={item.video || item.image}
                              className="h-12 w-12 rounded object-cover mr-3"
                              autoPlay
                              loop
                              muted
                              playsInline
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <img
                              src={item.image}
                              alt={item.name}
                              crossOrigin="anonymous"
                              className="h-12 w-12 rounded object-cover mr-3"
                            />
                          )}
                          <p className="font-medium text-sm">{item.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.size} / {item.color}
                      </td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200 bg-gray-100">
                    <td colSpan="4" className="px-4 py-3 text-right font-medium">
                      Subtotal:
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {formatCurrency(calculateSubtotal(order.items))}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td colSpan="4" className="px-4 py-3 text-right font-medium">
                      Shipping:
                    </td>
                    <td className="px-4 py-3 font-medium">Free</td>
                  </tr>
                  <tr className="bg-gray-100 border-t border-gray-300">
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-right text-lg font-bold"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 text-lg font-bold">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {order.notes && (
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Notes:</h4>
              <p className="text-yellow-700 text-sm">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Generate PDF Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGeneratePDF}
            disabled={generatingPdf}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            {generatingPdf ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate PDF
              </>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default OrderDetailsModal;
