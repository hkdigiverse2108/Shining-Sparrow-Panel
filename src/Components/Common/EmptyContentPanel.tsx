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
      <div className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl text-muted">
        <span className="text-lg">{icon}</span>
        <div>
          <h4 className="text-sm text-foreground font-medium">{title}</h4>
          {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-muted border border-border flex items-center justify-center text-muted text-3xl">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {description && <p className="text-sm text-text-muted max-w-sm">{description}</p>}
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
