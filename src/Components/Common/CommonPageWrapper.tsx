import type { CommonPageWrapperProps } from "@/Types";
import { type FC } from "react";

const CommonPageWrapper: FC<CommonPageWrapperProps> = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`common-page-wrapper ${className}`}>
      <div className={noPadding ? "page-content-no-padding" : "page-content-padding"}>
        {children}
      </div>
    </div>
  );
};

export default CommonPageWrapper;