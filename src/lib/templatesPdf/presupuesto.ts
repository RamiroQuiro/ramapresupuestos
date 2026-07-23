import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const handleDescargarPDF = (data:any,pro:any,total:any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const marginRight = pageWidth - 20;
    let y = 20;

    // Bloque dos columnas: Profesional (izq) | Cliente (der)
    const colLeft = marginLeft;
    const colRight = pageWidth / 2 + 5;
    const blockStartY = y;

    // Fondo del bloque
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(marginLeft - 2, y - 4, pageWidth - 36, 40, 2, 2, "F");

    // Columna izquierda - Profesional
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(232, 93, 58);
    doc.text("ELABORADO POR", colLeft, y);
    y += 5;
    doc.setTextColor(0);
    if (pro.nombre) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(pro.nombre, colLeft, y);
      y += 5;
    }
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    if (pro.titulo) {
      doc.text(pro.titulo, colLeft, y);
      y += 4;
    }
    if (pro.telefono) {
      doc.text(`Tel: ${pro.telefono}`, colLeft, y);
      y += 4;
    }
    if (pro.email) {
      doc.text(pro.email, colLeft, y);
      y += 4;
    }
    if (pro.direccion) {
      doc.text(pro.direccion, colLeft, y);
    }

    // Línea vertical separadora
    const lineX = pageWidth / 2 - 5;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(lineX, blockStartY - 2, lineX, blockStartY + 38);

    // Columna derecha - Cliente
    let yRight = blockStartY;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(232, 93, 58);
    doc.text("PRESUPUESTO PARA", colRight, yRight);
    yRight += 5;
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(data.cliente.nombre, colRight, yRight);
    yRight += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    if (data.cliente.telefono) {
      doc.text(`Tel: ${data.cliente.telefono}`, colRight, yRight);
      yRight += 4;
    }
    if (data.cliente.email) {
      doc.text(data.cliente.email, colRight, yRight);
      yRight += 4;
    }
    if (data.cliente.direccion) {
      doc.text(data.cliente.direccion, colRight, yRight);
      yRight += 4;
    }
    if (data.cliente.notas) {
      doc.setFont("helvetica", "italic");
      doc.text(data.cliente.notas, colRight, yRight);
    }

    y = blockStartY + 48;

    // Servicios
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Servicios", marginLeft, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Descripción", "Cant.", "Precio Unit.", "Subtotal"]],
      body: data.servicios.map((s) => [
        s.descripcion,
        String(s.cantidad),
        `$${s.precioUnitario.toLocaleString("es-AR")}`,
        `$${(s.cantidad * s.precioUnitario).toLocaleString("es-AR")}`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [232, 93, 58],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { left: marginLeft, right: 20 },
    });

    // Total
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
    doc.setFillColor(232, 93, 58);
    doc.roundedRect(marginLeft, finalY - 7, pageWidth - 40, 14, 2, 2, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255);
    doc.text(`TOTAL: $${total.toLocaleString("es-AR")}`, marginRight, finalY + 1, {
      align: "right",
    });
    doc.setTextColor(0);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("Generado con ramaPresupuesto", pageWidth / 2, footerY, { align: "center" });

    doc.save(`presupuesto-${data.cliente.nombre || "cliente"}.pdf`);
  };

  export default handleDescargarPDF