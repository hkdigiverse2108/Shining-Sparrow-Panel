import { useMemo, useState } from "react";
import { Table } from "antd";
import type { CommonTableProps } from "@/Types";
import { exportExcel, exportPDF } from "./Export";
import CommonTableToolbar from "./CommonTableToolbar";

export default function CommonTable<T extends object>({ columns, data, loading, total, current = 1, pageSize = 10, onTableChange, onSearch, searchPlaceholder = "Search...", onAdd, isActive, onActiveChange, onExportAll, fileName = "report", title, companyName, email, }: CommonTableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [visibleCols, setVisibleCols] = useState(columns.map((col) => String(col.dataIndex)));
  
  const filteredColumns = useMemo(
    () => columns.filter((c) => visibleCols.includes(String(c.dataIndex))),
    [columns, visibleCols]
  );
  
  const handleExport = async (type: "excel" | "pdf") => {
    const allData = onExportAll ? await onExportAll() : data;
    if (type === "excel") {
      exportExcel(allData, filteredColumns, fileName, title, companyName);
    } else {
      exportPDF(allData, filteredColumns, fileName, title, undefined, email);
    }
  };

  return (
    <div className="common-table">
      <CommonTableToolbar searchText={searchText} setSearchText={setSearchText} searchPlaceholder={searchPlaceholder} onSearch={onSearch} isActive={isActive} onActiveChange={onActiveChange} onAdd={onAdd} columns={columns} visibleCols={visibleCols} setVisibleCols={setVisibleCols} onExportExcel={() => handleExport("excel")} onExportPDF={() => handleExport("pdf")} />
      <Table className="common-table-surface" rowKey={(r: any) => r._id || r.id} columns={filteredColumns as any} dataSource={data} loading={loading} scroll={{ x: 'max-content' }}  pagination={{ current, pageSize, total, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items` }} onChange={onTableChange} locale={{ emptyText: "No Data Found" }} />
    </div>
  );
}