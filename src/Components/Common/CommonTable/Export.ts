import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getValue = (row: any, key: any) => {
    if (!key || typeof key !== "string") return "";
    return key.split(".").reduce((acc, k) => acc?.[k], row) ?? "";
};

const stripHtml = (html: string): string => {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
};

const extractTextFromReactNode = (node: any): string => {
    if (node === null || node === undefined || node === false) return "";
    if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
        return String(node).trim();
    }
    if (Array.isArray(node)) {
        // If the array contains other React elements (objects), it represents separate sibling components.
        // We join their text representations with " - " (e.g. Name - Status, Name - Joined Date).
        const hasReactElements = node.some(item => React.isValidElement(item));
        const parsedItems = node.map(extractTextFromReactNode).filter(val => val !== "");
        return parsedItems.join(hasReactElements ? " - " : " ").trim();
    }
    if (React.isValidElement(node)) {
        const props = node.props as any;
        if (props) {
            if (props.children !== undefined) {
                return extractTextFromReactNode(props.children);
            }
            if (props.title) {
                return String(props.title);
            }
            if (props.className) {
                const className = String(props.className);
                if (className.includes("status-dot-blocked")) return "Blocked";
                if (className.includes("status-dot-active")) return "Active";
            }
        }
    }
    return "";
};

const getExportValue = (row: any, col: any, index: number): string => {
    const dataIndex = col.dataIndex;
    let val = getValue(row, dataIndex);

    // Try render function first to get the formatted text representation
    if (typeof col.render === "function") {
        try {
            const rendered = col.render(val, row, index);
            const extracted = extractTextFromReactNode(rendered);
            if (extracted !== undefined && extracted !== null && extracted.trim() !== "") {
                return stripHtml(extracted);
            }
        } catch (e) {
            console.warn("Failed to render column for export:", col.title, e);
        }
    }

    if (val === null || val === undefined) return "";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (typeof val === "object") {
        if (val.name) return String(val.name);
        if (val.title) return String(val.title);
        if (val.email) return String(val.email);
        return "";
    }

    return stripHtml(String(val));
};

const getExportColumns = (columns: any[]) => {
    return columns.filter((col) => {
        const title = String(col.title || "").toLowerCase().trim();
        const dataIdx = String(col.dataIndex || "").toLowerCase().trim();
        
        // Exclude standard serial number columns that have no dataIndex mapping
        if (title === "#" && !col.dataIndex) {
            return false;
        }

        return (
            title !== "actions" &&
            title !== "image" &&
            title !== "avatar" &&
            title !== "" &&
            dataIdx !== "actions" &&
            dataIdx !== "image" &&
            dataIdx !== "avatar"
        );
    });
};

export const exportExcel = <T,>(
    data: T[],
    columns: any[],
    fileName: string,
    title?: string,
    companyName?: string
) => {
    const exportCols = getExportColumns(columns);
    const headers = exportCols.map((c) => c.title || "");

    const rows = data.map((row, rowIdx) =>
        exportCols.map((col) => getExportValue(row, col, rowIdx))
    );

    const sheetData: any[][] = [];
    if (companyName) {
        sheetData.push([companyName]);
    }
    if (title) {
        sheetData.push([title]);
    }
    sheetData.push([`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`]);
    sheetData.push([]); // spacer row
    sheetData.push(headers);
    sheetData.push(...rows);

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Calculate maximum character length for each column to auto-adjust widths
    const colWidths = exportCols.map((col, colIdx) => {
        let maxLen = String(col.title || "").length;
        rows.forEach((row) => {
            const cellVal = String(row[colIdx] || "");
            if (cellVal.length > maxLen) {
                maxLen = cellVal.length;
            }
        });
        return { wch: Math.min(Math.max(maxLen + 3, 10), 50) };
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report Data");

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
    const doc = new jsPDF("p", "pt", "a4");
    const exportCols = getExportColumns(columns);
    const headers = exportCols.map((c) => c.title || "");

    // Set document properties to preserve metadata and avoid TS6133 unused variable warnings
    doc.setProperties({
        title: title || "Report",
        creator: email || "Administrator",
        subject: companyName || "Shining Sparrow"
    });

    const rows = data.map((row, rowIdx) =>
        exportCols.map((col) => getExportValue(row, col, rowIdx))
    );

    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 40,
        theme: "grid",
        headStyles: {
            fillColor: [249, 115, 22], // Primary Orange color
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: "bold",
            halign: "left",
        },
        bodyStyles: {
            fontSize: 8,
            textColor: [55, 65, 81],
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251],
        },
        styles: {
            overflow: "linebreak",
            cellPadding: 4,
            lineWidth: 0.5,
            lineColor: [229, 231, 235],
        },
        margin: { top: 40, bottom: 40, left: 40, right: 40 },
        didDrawPage: (pageData) => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Draw clean page numbering in footer
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            const pageStr = `Page ${pageData.pageNumber} of ${doc.getNumberOfPages()}`;
            doc.text(pageStr, pageWidth - doc.getTextWidth(pageStr) - 40, pageHeight - 20);
        },
    });

    doc.save(`${fileName}.pdf`);
};