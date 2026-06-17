import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getValue = (row: any, key: string) =>
    key.split(".").reduce((acc, k) => acc?.[k], row);

export const exportExcel = <T,>(
    data: T[],
    columns: any[],
    fileName: string,
    title?: string,
    companyName?: string
) => {
    const headers = columns.map((c) => c.title);

    const rows = data.map((row) =>
        columns.map((col) => getValue(row, col.dataIndex))
    );

    const sheetData = [
        [companyName || ""],
        [title || ""],
        headers,
        ...rows,
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });

    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

export const exportPDF = <T,>(
    data: T[],
    columns: any[],
    fileName: string,
    title?: string,
    email?: string,
    companyName?: string
) => {
    const doc = new jsPDF("l", "pt", "a4");

    const headers = columns.map((c) => c.title);

    const rows = data.map((row) =>
        columns.map((col) => getValue(row, col.dataIndex))
    );

    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 60,

        didDrawPage: () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const page = doc.getNumberOfPages();

            if (page === 1) {
                doc.text(title || "", pageWidth / 2, 30, { align: "center" });
                doc.text(companyName || "", pageWidth / 2, 45, {
                    align: "center",
                });
            }

            doc.text(`Email: ${email || "-"}`, 40, pageHeight - 20);
            doc.text(
                `Page ${page}`,
                pageWidth / 2,
                pageHeight - 20,
                { align: "center" }
            );
        },
    });

    doc.save(`${fileName}.pdf`);
};