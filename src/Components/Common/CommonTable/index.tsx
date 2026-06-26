import { useMemo, useState } from "react";
import { Table } from "antd";
import type { CommonTableProps } from "@/Types";
import { exportExcel, exportPDF } from "./Export";
import CommonTableToolbar from "./CommonTableToolbar";

export default function CommonTable<T extends object>({ columns, data, loading, total, current = 1, pageSize = 10, onTableChange, onSearch, searchPlaceholder = "Search...", onAdd, isActive, onActiveChange, onExportAll, fileName = "report", title, companyName, email, toolbarExtra, }: CommonTableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const getColKey = (col: any) => String(col.key || col.dataIndex || col.title || "");
  const [visibleCols, setVisibleCols] = useState(columns.map(getColKey));
  
  const filteredColumns = useMemo(
    () => columns.filter((c) => visibleCols.includes(getColKey(c))),
    [columns, visibleCols]
  );
  
  const handleExportCurrent = (type: "excel" | "pdf") => {
    if (type === "excel") {
      exportExcel(data, filteredColumns, fileName, title, companyName);
    } else {
      exportPDF(data, filteredColumns, fileName, title, email, companyName);
    }
  };

  const handleExportAllData = async (type: "excel" | "pdf") => {
    if (!onExportAll) return;
    try {
      const allData = await onExportAll();
      if (type === "excel") {
        exportExcel(allData, filteredColumns, fileName, title, companyName);
      } else {
        exportPDF(allData, filteredColumns, fileName, title, email, companyName);
      }
    } catch (e) {
      console.error("Failed to export all data:", e);
    }
  };

  return (
    <div className="common-table">
      <CommonTableToolbar
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        isActive={isActive}
        onActiveChange={onActiveChange}
        onAdd={onAdd}
        columns={columns}
        visibleCols={visibleCols}
        setVisibleCols={setVisibleCols}
        onExportExcel={() => handleExportCurrent("excel")}
        onExportPDF={() => handleExportCurrent("pdf")}
        onExportExcelAll={() => handleExportAllData("excel")}
        onExportPDFAll={() => handleExportAllData("pdf")}
        onExportAll={onExportAll}
        toolbarExtra={toolbarExtra}
      />
      <Table className="common-table-surface" rowKey={(r: any) => r._id || r.id} columns={filteredColumns as any} dataSource={data} loading={loading} scroll={{ x: 'max-content' }}  pagination={{ current, pageSize, total, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` }} onChange={onTableChange} locale={{ emptyText: "No Data Found" }} />
    </div>
  );
}