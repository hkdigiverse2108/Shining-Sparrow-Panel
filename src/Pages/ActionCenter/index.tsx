import React, { useState } from "react";
import { Switch } from "antd";
import { DollarOutlined, UserOutlined, MailOutlined, CheckCircleOutlined, ExclamationCircleOutlined, BookOutlined, SettingOutlined, ClockCircleOutlined, RocketOutlined, ApiOutlined, SafetyOutlined, } from "@ant-design/icons";
import { motion } from "motion/react";
import { CommonBreadcrumbs, CommonPageWrapper } from "@/Components";
import { CommonButton } from "@/Attribute";
import { blurRevealUp, fadeInUp, staggerContainer } from "@/Utils/animations";
import { BREADCRUMBS } from "@/Data";

const ActionCenter: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [openEnrollment, setOpenEnrollment] = useState(true);
  const timelineData = [
    { user: "Sarah Johnson", action: "enrolled in", target: "TypeScript Deep Dive", time: "2 mins ago", icon: <BookOutlined />, dotClass: "dot-primary" },
    { user: "Alex Chen", action: "requested refund for", target: "UI/UX Bootcamp", time: "15 mins ago", icon: <DollarOutlined />, dotClass: "dot-danger" },
    { user: "Michael Scott", action: "left a 5-star review on", target: "Advanced React", time: "1 hr ago", icon: <CheckCircleOutlined />, dotClass: "dot-success" },
    { user: "New Instructor", action: "uploaded assets for", target: "Python Basics", time: "3 hrs ago", icon: <UserOutlined />, dotClass: "dot-warning" },
  ];

  return (
    <>
      <CommonBreadcrumbs title="Action Center" breadcrumbs={BREADCRUMBS.ACTIONCENTER || []} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={blurRevealUp} className="action-header">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="action-status-dot" />
                <span className="action-status-text">System Online</span>
              </div>
              <h2 className="action-title">Mission Control</h2>
              <p className="action-subtitle">Your daily overview of tasks and platform health.</p>
            </div>
            <CommonButton type="default" icon={<CheckCircleOutlined />} size="middle" className="action-mark-read-btn">
              Mark All Read
            </CommonButton>
          </motion.div>
          <motion.div variants={blurRevealUp} className="action-bento-grid">
            <div className={`action-card-base action-card-lg action-card-hover-danger`}>
              <div className="action-card-blob-danger" />
              <div className="relative z-10">
                <div className="action-card-header">
                  <div className="action-icon-danger"><DollarOutlined /></div>
                  <span className="action-badge-danger">Urgent</span>
                </div>
                <div className="action-card-content">
                  <div>
                    <h3 className="action-card-title-lg">Pending Refunds</h3>
                    <p className="action-card-desc-lg">Require immediate review to avoid disputes</p>
                  </div>
                  <span className="action-number-danger">3</span>
                </div>
                <div className="mt-3">
                  <CommonButton type="primary" danger size="middle" className="!rounded-lg shadow-sm hover:shadow-md">Process Now</CommonButton>
                </div>
              </div>
            </div>
            <div className={`action-card-base action-card-sm action-card-hover-warning`}>
              <div className="action-card-header">
                <div className="action-icon-warning"><UserOutlined /></div>
              </div>
              <span className="action-number-normal">2</span>
              <h3 className="action-card-title">Instructor Approvals</h3>
              <p className="action-card-desc">Waiting for verification</p>
              <CommonButton type="default" size="small" className="mt-3 !rounded-md">Review</CommonButton>
            </div>
            <div className={`action-card-base action-card-sm action-card-hover-primary`}>
              <div className="action-card-header">
                <div className="action-icon-primary"><MailOutlined /></div>
              </div>
              <span className="action-number-normal">5</span>
              <h3 className="action-card-title">Inquiries</h3>
              <p className="action-card-desc">Unread messages</p>
              <CommonButton type="primary" size="small" className="mt-3 !rounded-md">Reply</CommonButton>
            </div>

          </motion.div>
          <div className="action-split-grid">
            <motion.div variants={fadeInUp} className="action-timeline-panel">
              <h3 className="action-timeline-title">Recent Activity</h3>
              <div className="action-timeline-wrapper">
                {timelineData.map((item, index) => (
                  <div key={index} className="action-timeline-item">
                    <div className={`action-timeline-dot ${item.dotClass}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="action-timeline-text">
                        <span className="action-timeline-user">{item.user}</span> {item.action} <span className="action-timeline-highlight">{item.target}</span>
                      </p>
                      <div className="action-timeline-time">
                        <ClockCircleOutlined /> {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="action-controls-panel">
              <div className="action-controls-card">
                <h3 className="action-controls-title">
                  <SettingOutlined className="text-muted" /> Platform Controls
                </h3>
                <div className="space-y-4">
                  <div className="action-toggle-row">
                    <div className="action-toggle-info">
                      <div className="action-toggle-icon-danger"><ExclamationCircleOutlined /></div>
                      <div>
                        <h4 className="action-toggle-label">Maintenance Mode</h4>
                        <p className="action-toggle-desc">Temporarily disable access</p>
                      </div>
                    </div>
                    <Switch size="small" checked={maintenanceMode} onChange={setMaintenanceMode} />
                  </div>
                  <div className="border-b border-border" />
                  <div className="action-toggle-row">
                    <div className="action-toggle-info">
                      <div className="action-toggle-icon-success"><BookOutlined /></div>
                      <div>
                        <h4 className="action-toggle-label">Open Enrollment</h4>
                        <p className="action-toggle-desc">Allow new signups</p>
                      </div>
                    </div>
                    <Switch size="small" checked={openEnrollment} onChange={setOpenEnrollment} />
                  </div>
                </div>
              </div>
              <div className="action-dev-card">
                <div className="action-dev-blob" />
                <div className="relative z-10">
                  <div className="action-dev-header">
                    <ApiOutlined className="text-primary text-xs" />
                    <h3 className="action-dev-title">Developer</h3>
                  </div>
                  <div className="space-y-1">
                    <button className="action-dev-link">
                      <SafetyOutlined className="text-xs" /> <span className="action-dev-link-text">API Keys & Webhooks</span>
                    </button>
                    <button className="action-dev-link">
                      <RocketOutlined className="text-xs" /> <span className="action-dev-link-text">System Logs</span>
                    </button>
                    <button className="action-dev-link">
                      <MailOutlined className="text-xs" /> <span className="action-dev-link-text">SMTP Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </CommonPageWrapper>
    </>
  );
};

export default ActionCenter;