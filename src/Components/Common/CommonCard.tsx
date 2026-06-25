import { type FC } from "react";
import { Card, Divider, Flex, Typography } from "antd";
import { Link } from "react-router-dom";
import { CommonButton } from "@/Attribute";
import type { CommonCardProps } from "@/Types";

const { Title } = Typography;

const CommonCard: FC<CommonCardProps> = ({ title, children, cardProps, hideDivider = false, topContent, btnHref, extra, headerClassName, }) => {
  return (
    <Card 
      {...cardProps} 
      styles={{ body: { padding: 0 } }}
      style={{ 
        borderRadius: 12, 
        border: '1px solid var(--border)', 
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        ...(cardProps?.style || {})
      }}
    >
      {(title || topContent) && (
        <div style={{ padding: '16px 20px 0' }}>
          <Flex justify="space-between" align="center" className={headerClassName}  >
            <Flex align="center" gap={12}>
              {title && (
                <Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>
                  {title}
                </Title>
              )}
              {topContent}
            </Flex>
            <Flex gap={8}>
              {extra}
              {btnHref && (
                <Link to={btnHref}>
                  <CommonButton type="primary" size="small">
                    ADD
                  </CommonButton>
                </Link>
              )}
            </Flex>
          </Flex>
          {!hideDivider && <Divider style={{ margin: '12px 0 0', borderColor: 'var(--border)' }} />}
        </div>
      )}
      <div style={{ padding: title || topContent ? '12px 20px 16px' : '16px 20px' }}>
        {children}
      </div>
    </Card>
  );
};

export default CommonCard;