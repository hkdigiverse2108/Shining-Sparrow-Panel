import { type FC } from "react";
import { Typography } from "antd";

const { Text } = Typography;
interface CommonLoaderProps {
  fullScreen?: boolean;
  text?: string;
}

const Loader: FC<CommonLoaderProps> = ({
  fullScreen = false,
}) => {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          : "w-full min-h-[60vh] flex items-center justify-center mt-20 "
      }
    >
      <div className="flex flex-col items-center gap-6 ">
        <div className="loader mb-5">
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>

        <Text type="secondary">
          Loading
          <span className="ant-dots" />
        </Text>
      </div>
    </div>
  );
};

export default Loader;