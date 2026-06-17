import type { CommonTagProps } from "@/Types"; 
import { Tag } from "antd";
import type { FC } from "react";

export const CommonTag: FC<CommonTagProps> = ({ 
  color, 
  className = "", 
  children, 
  icon, 
  closable, 
  onClose,
  style 
}) => {
  return (
    <Tag 
      color={color} 
      className={`common-tag flex items-center gap-1 font-medium ${className}`} 
      closable={closable}
      onClose={onClose}
      style={style}
    >
      {icon}
      {children}
    </Tag>
  );
};