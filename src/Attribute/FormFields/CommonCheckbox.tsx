import { Checkbox } from "antd";
import { type FC } from "react";
import type { CheckboxProps } from "antd";

interface CommonCheckboxProps extends CheckboxProps {
  label?: React.ReactNode;
}

export const CommonCheckbox: FC<CommonCheckboxProps> = ({
  label,
  children,
  ...props
}) => {
  return (
    <Checkbox {...props} className="universal-checkbox">
      {label ?? children}
    </Checkbox>
  );
};