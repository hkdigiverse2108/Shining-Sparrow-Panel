import type { CommonDrawerProps } from "@/Types";
import { Drawer } from "antd";
import type { FC } from "react";

export const CommonDrawer: FC<CommonDrawerProps> = ({ title, open, onClose, children, size = 520, ...props}) => {
  return (
    <Drawer {...props} title={title} open={open} onClose={onClose} size={size} forceRender={false} >
        {children}
    </Drawer>
  );
};