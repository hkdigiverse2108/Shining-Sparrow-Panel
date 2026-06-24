import type { ReactNode } from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  PlayCircleOutlined,
  PaperClipOutlined,
  RightOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

// ─── Badge definition ───────────────────────────────────────────────────────

type BadgeColor = 'neutral' | 'indigo' | 'emerald' | 'amber' | 'green' | 'red';

export interface ContentBadge {
  label: string;
  icon?: ReactNode;
  href?: string;          // renders as <a> when provided
  color?: BadgeColor;
}

// ─── Action definition ───────────────────────────────────────────────────────

export interface ContentAction {
  label?: string;
  icon?: ReactNode;
  danger?: boolean;
  confirm?: boolean;         // wrap in Popconfirm
  confirmTitle?: string;
  confirmDesc?: string;
  onClick?: () => void;
  onConfirm?: () => void;   // used when confirm=true
  loading?: boolean;
  tooltip?: string;
}

// ─── Main props ──────────────────────────────────────────────────────────────

export interface ContentItemCardProps {
  index: number;
  title: string;
  subtitle?: string;
  description?: string;     // may contain HTML
  thumbnail?: string;
  thumbnailFallbackText?: string;
  badges?: ContentBadge[];
  actions?: ContentAction[];
  /** Extra class on the outer wrapper */
  className?: string;
}

// ─── Badge colour map ─────────────────────────────────────────────────────────

const BADGE_CLASS: Record<BadgeColor, string> = {
  neutral: 'bg-surface-muted border-border text-text-muted',
  indigo:  'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/20',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20',
  amber:   'bg-amber-500/10 border-amber-500/20 text-amber-600 hover:bg-amber-500/20',
  green:   'bg-green-500/10 border-green-500/20 text-green-600',
  red:     'bg-red-500/10 border-red-500/20 text-red-600',
};

// ─── Component ────────────────────────────────────────────────────────────────

const ContentItemCard: React.FC<ContentItemCardProps> = ({
  index,
  title,
  subtitle,
  description,
  thumbnail,
  thumbnailFallbackText,
  badges = [],
  actions = [],
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface border border-border rounded-xl hover:shadow-md transition-all gap-4 ${className}`}
    >
      {/* Left: thumbnail + info */}
      <div className="flex items-start gap-4 overflow-hidden flex-1">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-16 h-16 object-cover rounded-lg border border-border shadow-sm flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Item';
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
            {thumbnailFallbackText ?? String(index + 1).padStart(2, '0')}
          </div>
        )}

        <div className="space-y-1.5 overflow-hidden flex-1">
          <div>
            <h4 className="text-base font-semibold text-foreground truncate">{title}</h4>
            {subtitle && <p className="text-xs text-text-muted truncate">{subtitle}</p>}
          </div>

          {description && (
            <div
              className="text-xs text-text-muted line-clamp-2 max-w-xl content-card-description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {badges.map((badge, i) => {
                const cls = `text-[10px] font-medium px-2 py-0.5 rounded border inline-flex items-center gap-1 ${BADGE_CLASS[badge.color ?? 'neutral']}`;
                return badge.href ? (
                  <a key={i} href={badge.href} target="_blank" rel="noopener noreferrer" className={`${cls} cursor-pointer transition-colors`}>
                    {badge.icon}{badge.label}
                  </a>
                ) : (
                  <span key={i} className={cls}>
                    {badge.icon}{badge.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: actions */}
      {actions.length > 0 && (
        <div className="flex flex-row items-center gap-2 flex-shrink-0 self-end md:self-center">
          {actions.map((action, i) => {
            const btnInner = action.label ? (
              <Button
                size="small"
                icon={action.icon}
                danger={action.danger}
                loading={action.loading}
                onClick={action.onClick}
                className="text-xs"
              >
                {action.label}
                {!action.icon && <RightOutlined />}
              </Button>
            ) : (
              <Button
                type="text"
                icon={action.icon}
                danger={action.danger}
                loading={action.loading}
                onClick={action.onClick}
                className={`rounded-lg ${action.danger ? 'hover:bg-red-500/10 hover:!text-red-500' : 'hover:bg-surface-muted'}`}
              />
            );

            const btnConfirm = action.confirm ? (
              <Popconfirm
                title={action.confirmTitle ?? 'Are you sure?'}
                description={action.confirmDesc}
                onConfirm={action.onConfirm}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                {btnInner}
              </Popconfirm>
            ) : btnInner;

            return action.tooltip ? (
              <Tooltip title={action.tooltip} key={i}>
                <span>{btnConfirm}</span>
              </Tooltip>
            ) : (
              <span key={i}>{btnConfirm}</span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentItemCard;

// ─── Named badge builders (convenience) ──────────────────────────────────────

export const priorityBadge = (priority: number): ContentBadge => ({
  label: `Priority ${priority}`,
  color: 'neutral',
});

export const durationBadge = (duration: string | number): ContentBadge => ({
  label: String(duration),
  icon: <ClockCircleOutlined />,
  color: 'neutral',
});

export const dateBadge = (date: string): ContentBadge => ({
  label: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
  icon: <CalendarOutlined />,
  color: 'neutral',
});

export const videoBadge = (href: string, label = 'Video'): ContentBadge => ({
  label,
  href,
  icon: <PlayCircleOutlined />,
  color: 'indigo',
});

export const videoResourceBadge = (href: string): ContentBadge => ({
  label: 'Video Resource',
  href,
  icon: <VideoCameraOutlined />,
  color: 'indigo',
});

export const attachmentBadge = (href: string, label = 'Attachment'): ContentBadge => ({
  label,
  href,
  icon: <PaperClipOutlined />,
  color: 'emerald',
});

export const attachmentFileBadge = (href: string): ContentBadge => ({
  label: 'Attachment File',
  href,
  icon: <FileTextOutlined />,
  color: 'amber',
});

export const lockBadge = (locked: boolean): ContentBadge => ({
  label: locked ? 'Locked' : 'Unlocked',
  icon: locked ? <LockOutlined /> : <UnlockOutlined />,
  color: locked ? 'amber' : 'green',
});

export const editAction = (onClick: () => void): ContentAction => ({
  icon: <EditOutlined />,
  onClick,
});

export const deleteAction = (onConfirm: () => void, confirmDesc?: string): ContentAction => ({
  icon: <DeleteOutlined />,
  danger: true,
  confirm: true,
  confirmTitle: 'Delete this item?',
  confirmDesc,
  onConfirm,
});

export const blockAction = (blocked: boolean, onClick: () => void, loading?: boolean): ContentAction => ({
  icon: blocked ? <UnlockOutlined /> : <LockOutlined />,
  tooltip: blocked ? 'Unblock' : 'Block',
  onClick,
  danger: !blocked,
  loading,
});

export const blockedBadge = (): ContentBadge => ({
  label: 'Blocked',
  color: 'red',
});
