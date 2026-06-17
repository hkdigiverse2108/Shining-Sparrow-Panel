import { type FC } from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";
import type { BreadcrumbHeaderProps } from "@/Types";
import { ROUTES } from "@/Constants";

const CommonBreadcrumbs: FC<BreadcrumbHeaderProps> = ({ title, breadcrumbs = [] }) => {
  const items = [
    {
      title: (
        <Link to={ROUTES.DASHBOARD} className="home-crumb">
          <HomeFilled style={{ fontSize: '14px' }} />
        </Link>
      ),
    },
    ...breadcrumbs.map((item) => ({
      title: item.href ? (
        <Link to={item.href} className="common-breadcrumb-link">
          {item.label}
        </Link>
      ) : (
        <span className="common-breadcrumb-span">{item.label}</span>
      ),
    })),
  ];

  return (
    <div className="common-breadcrumbs">
      <h2 className="common-breadcrumbs-title"> {title} </h2>
      <Breadcrumb className="common-breadcrumb-nav" separator=">" items={items} />
    </div>
  );
};

export default CommonBreadcrumbs;