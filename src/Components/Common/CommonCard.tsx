import { type FC } from "react";
import { Card, Divider, Flex, Typography } from "antd";
import { Link } from "react-router-dom";
import { CommonButton } from "@/Attribute";
import type { CommonCardProps } from "@/Types";

const { Title } = Typography;

const CommonCard: FC<CommonCardProps> = ({ title, children, cardProps, hideDivider = false, topContent, btnHref, extra, headerClassName, }) => {
  return (
    <Card {...cardProps} styles={{ body: { } }}>
      {(title || topContent) && (
        <>
          <Flex justify="space-between" align="center" className={headerClassName}  >
            <Flex align="center" gap={12}>
              {title && (
                <Title level={5} style={{ margin: 0 }}>
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
          {!hideDivider && <Divider style={{ margin: 0 }} />}
        </>
      )}
      <div style={{ paddingTop: 10 }}>
        {children}
      </div>
    </Card>
  );
};

export default CommonCard;