import { type FC } from "react";
import { Input, Space, Switch, Dropdown, Checkbox } from "antd";
import { SearchOutlined, PlusOutlined, DownloadOutlined, SettingOutlined, } from "@ant-design/icons";
import { CommonButton, CommonCheckbox } from "@/Attribute";
import type { CommonTableToolbarProps } from "@/Types";

const CommonTableToolbar: FC<CommonTableToolbarProps> = ({ searchText, setSearchText, searchPlaceholder, onSearch, isActive, onActiveChange, onAdd, columns, visibleCols, setVisibleCols, onExportExcel, onExportPDF, onExportExcelAll, onExportPDFAll, onExportAll, toolbarExtra }) => {
  const columnSelector = (
    <div className="common-table-column-menu">
      <Checkbox.Group
        value={visibleCols}
        onChange={(val) => setVisibleCols(val as string[])}
      >
        <Space direction="vertical">
          {columns.map((col) => {
            const key = String(col.key || col.dataIndex || col.title || "");
            return (
              <CommonCheckbox key={key} value={key}>
                {col.title}
              </CommonCheckbox>
            );
          })}
        </Space>
      </Checkbox.Group>
    </div>
  );

  return (
    <div className="common-table-toolbar flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-transparent border-b border-border/40">
      {/* Left side actions: Add, Toggle Active, Export */}
      <div className="flex items-center gap-2 flex-wrap">
        {toolbarExtra}
        {onAdd && (
          <CommonButton buttonVariant="primary" className="common-table-add-button" icon={<PlusOutlined />} onClick={onAdd}> Add </CommonButton>
        )}
        {typeof isActive === "boolean" && (
          <Switch checked={isActive} onChange={onActiveChange} checkedChildren="Active" unCheckedChildren="Inactive" />
        )}
        <Dropdown menu={{
            items: [
              {
                key: "current",
                label: "Current Page",
                children: [
                  {
                    key: "current-excel",
                    label: "Export Excel",
                    onClick: onExportExcel,
                  },
                  {
                    key: "current-pdf",
                    label: "Export PDF",
                    onClick: onExportPDF,
                  },
                ],
              },
              {
                key: "all",
                label: "All Data",
                disabled: !onExportAll,
                children: [
                  {
                    key: "all-excel",
                    label: "Export Excel",
                    onClick: onExportExcelAll,
                  },
                  {
                    key: "all-pdf",
                    label: "Export PDF",
                    onClick: onExportPDFAll,
                  },
                ],
              },
            ],
          }}
        >
          <CommonButton buttonVariant="outline" className="common-table-button" icon={<DownloadOutlined />}> Export </CommonButton>
        </Dropdown>
      </div>

      {/* Right side controls: Search input & Settings gear */}
      <div className="flex items-center gap-3">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-text-muted/60" />}
          placeholder={searchPlaceholder}
          className="common-table-search !h-9 !rounded-lg !border-border !bg-surface-muted hover:!border-border-hover focus:!border-primary"
          style={{ width: 200 }}
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            setSearchText(value);
            onSearch?.(value);
          }}
          onPressEnter={() => onSearch?.(searchText)}
        />
        <Dropdown popupRender={() => columnSelector} trigger={["click"]}>
          <CommonButton buttonVariant="iconOnly" className="common-table-button !h-9 !w-9 flex items-center justify-center rounded-lg border border-border bg-surface hover:bg-surface-muted" icon={<SettingOutlined className="text-text-muted" />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default CommonTableToolbar;