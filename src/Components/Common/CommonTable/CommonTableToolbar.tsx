import { type FC } from "react";
import { Input, Space, Switch, Dropdown, Checkbox } from "antd";
import { SearchOutlined, PlusOutlined, DownloadOutlined, SettingOutlined, } from "@ant-design/icons";
import { CommonButton, CommonCheckbox } from "@/Attribute";
import type { CommonTableToolbarProps } from "@/Types";

const CommonTableToolbar: FC<CommonTableToolbarProps> = ({ searchText, setSearchText, searchPlaceholder, onSearch, isActive, onActiveChange, onAdd, columns, visibleCols, setVisibleCols, onExportExcel, onExportPDF }) => {
  const columnSelector = (
    <div className="common-table-column-menu">
      <Checkbox.Group
        value={visibleCols}
        onChange={(val) => setVisibleCols(val as string[])}
      >
        <Space direction="vertical">
          {columns.map((col) => (
            <CommonCheckbox key={String(col.dataIndex)} value={String(col.dataIndex)}>
              {col.title}
            </CommonCheckbox>
          ))}
        </Space>
      </Checkbox.Group>
    </div>
  );

  return (
    <div className="common-table-toolbar">
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={searchPlaceholder}
        className="common-table-search"
        value={searchText}
        onChange={(e) => {
          const value = e.target.value;
          setSearchText(value);
          onSearch?.(value);
        }}
        onPressEnter={() => onSearch?.(searchText)}
      />
      <Space className="common-table-actions" wrap>
        {typeof isActive === "boolean" && (
          <Switch checked={isActive} onChange={onActiveChange} checkedChildren="Active" unCheckedChildren="Inactive" />
        )}
        <Dropdown popupRender={() => columnSelector} trigger={["click"]}>
          <CommonButton buttonVariant="iconOnly" className="common-table-button" icon={<SettingOutlined />} />
        </Dropdown>
        <Dropdown menu={{
            items: [
              {
                key: "excel",
                label: "Export Excel",
                onClick: onExportExcel,
              },
              {
                key: "pdf",
                label: "Export PDF",
                onClick: onExportPDF,
              },
            ],
          }}
        >
        <CommonButton buttonVariant="outline" className="common-table-button" icon={<DownloadOutlined />}> Export </CommonButton>
        </Dropdown>
        {onAdd && (
          <CommonButton buttonVariant="primary" className="common-table-add-button" icon={<PlusOutlined />} onClick={onAdd} > Add </CommonButton>
        )}
      </Space>
    </div>
  );
};

export default CommonTableToolbar;