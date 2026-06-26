import { Collapse, Row, Col } from "antd";
import type { FC } from "react";
import type { AdvancedSearchProps } from "../../Types";
import { useState } from "react";
import { CommonSelect } from "@/Attribute/FormFields/CommonSelect";
import { FilterOutlined } from "@ant-design/icons";

export const AdvancedSearch: FC<AdvancedSearchProps> = ({ children, filter = [] }) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  if (!filter.length && !children) return null;
  return (
    <Collapse
      activeKey={activeKey}
      onChange={(keys) => setActiveKey(keys as string[])}
      className="advanced-search"
      bordered={false}
      style={{ background: "transparent" }}
      items={[
        {
          key: "1",
          label: (
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <FilterOutlined style={{ color: "var(--primary)" }} /> Advanced Search
            </span>
          ),
          className: "advanced-search-panel",
          children: (
            <div className="advanced-search-body" style={{ width: "100%" }} >
              <Row gutter={[24, 16]} align="middle">
                {filter.map((item, i) => (
                  <Col
                    key={i}
                    {...(item.grid || { xs: 24, sm: 12, md: 8 })}
                    style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: 0 }} >
                    {item.label && (
                      <span className=" text-xs font-semibold uppercase tracking-wider text-muted " >
                        {item.label}
                      </span>
                    )}
                    <div className="commonselect-container">
                      <CommonSelect label="" options={item.options} value={item.value} onChange={(val) => item.onChange?.(val) } multiple={item.multiple} limitTags={item.limitTags ?? 1} isLoading={item.isLoading} />
                    </div>
                  </Col>
                ))}
                {children && (
                  <Col span={24} style={{ marginTop: "4px" }} >
                    {children}
                  </Col>
                )}
              </Row>
            </div>
          ),
        },
      ]}
    />
  );
};
