import { Button } from "antd";
import { type FC } from "react";
import type { CommonButtonProps } from "@/Types/Common";

const sizeHeightMap: Record<string, number> = {
  small: 36,
  middle: 42,
  large: 48,
};

export const CommonButton: FC<CommonButtonProps> = ({ children, title, loading, disabled, style, className = "", size = "middle", buttonVariant = "primary", ...props }) => {
  return (
    <Button
      {...props}
      type="default"   
      danger={false}
      loading={loading}
      disabled={loading || disabled}
      size={size}
      className={`common-btn btn-${buttonVariant} ${className}`}
      style={{
        borderRadius: 8,
        fontWeight: 600,
        height: sizeHeightMap[size],
        ...style,
      }}
    >
      {children ?? title}
    </Button>
  );
};