import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  StopOutlined, 
  BookOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  PictureOutlined,
  PercentageOutlined,
  FolderOpenOutlined,
  MailOutlined,
  CommentOutlined
} from '@ant-design/icons';

interface CommonSummaryCardsProps {
  total: number;
  active: number;
  blocked: number;
  subject: 'Users' | 'Courses' | 'Workshops' | 'Blogs' | 'Banners' | 'Coupons' | 'Gallery Folders' | 'Subscribers' | 'Partners' | 'Testimonials';
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
    else if (subject === 'Gallery Folders') totalIcon = FolderOpenOutlined;
    else if (subject === 'Subscribers') totalIcon = MailOutlined;
    else if (subject === 'Testimonials') totalIcon = CommentOutlined;

    return [
      { key: 'total', title: `Total ${subject}`, value: total, icon: totalIcon, styleClass: 'user-metric-icon--total' },
      { key: 'active', title: `Active ${subject}`, value: active, icon: CheckCircleOutlined, styleClass: 'user-metric-icon--active' },
      { key: 'blocked', title: `Blocked ${subject}`, value: blocked, icon: StopOutlined, styleClass: 'user-metric-icon--blocked' },
    ];
  }, [total, active, blocked, subject]);

  return (
    <motion.div 
      variants={staggerContainer} 
      initial="hidden" 
      animate="visible" 
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5"
    >
      {cards.map(card => {
        const Icon = card.icon;
        
        let colorClass = "text-primary bg-primary/10";
        if (card.key === 'active') colorClass = "text-success bg-success/10";
        if (card.key === 'blocked') colorClass = "text-danger bg-danger/10";

        return (
          <motion.div 
            key={card.key} 
            variants={blurRevealUp}
            className="flex flex-col p-5 rounded-2xl bg-surface border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                <Icon />
              </div>
              <div className="text-text-muted opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">{card.title}</div>
            <div className="text-3xl font-extrabold text-foreground leading-tight">{card.value}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
