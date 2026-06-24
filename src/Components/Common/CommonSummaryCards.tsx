import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { blurRevealUp } from '@/Utils/animations';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  StopOutlined, 
  BookOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  PictureOutlined,
  PercentageOutlined
} from '@ant-design/icons';

interface CommonSummaryCardsProps {
  total: number;
  active: number;
  blocked: number;
  subject: 'Users' | 'Courses' | 'Workshops' | 'Blogs' | 'Banners' | 'Coupons';
}

export const CommonSummaryCards: React.FC<CommonSummaryCardsProps> = ({
  total,
  active,
  blocked,
  subject
}) => {
  const cards = useMemo(() => {
    let totalIcon = TeamOutlined;
    if (subject === 'Courses') totalIcon = BookOutlined;
    else if (subject === 'Workshops') totalIcon = CalendarOutlined;
    else if (subject === 'Blogs') totalIcon = FileTextOutlined;
    else if (subject === 'Banners') totalIcon = PictureOutlined;
    else if (subject === 'Coupons') totalIcon = PercentageOutlined;

    return [
      { key: 'total', title: `Total ${subject}`, value: total, icon: totalIcon, styleClass: 'user-metric-icon--total' },
      { key: 'active', title: `Active ${subject}`, value: active, icon: CheckCircleOutlined, styleClass: 'user-metric-icon--active' },
      { key: 'blocked', title: `Blocked ${subject}`, value: blocked, icon: StopOutlined, styleClass: 'user-metric-icon--blocked' },
    ];
  }, [total, active, blocked, subject]);

  return (
    <motion.div variants={blurRevealUp} className="user-metrics-grid">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="user-metric-card group">
            <div className={`user-metric-icon ${card.styleClass}`}>
              <Icon />
            </div>
            <div className="user-metric-info">
              <p className="user-metric-title">{card.title}</p>
              <p className="user-metric-value">{card.value}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};
