import type { ReactNode } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export interface EmptyContentPanelProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  /** 'full' = large centered panel (page-level), 'inline' = compact (inside a card) */
  variant?: 'full' | 'inline';
}

const EmptyContentPanel: React.FC<EmptyContentPanelProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'full',
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl text-gray-400">
        <span className="text-lg">{icon}</span>
        <div>
          <h4 className="text-sm text-gray-600 font-medium">{title}</h4>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 text-3xl">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-700">{title}</h3>
        {description && <p className="text-sm text-gray-400 max-w-sm">{description}</p>}
      </div>
      {action && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={action.onClick}
          className="mt-1"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyContentPanel;
