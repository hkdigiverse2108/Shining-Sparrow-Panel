import { useState, useMemo, type FC } from 'react';
import { Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, ClockCircleOutlined, EnvironmentOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { CommonBreadcrumbs, CommonPageWrapper, CommonCard, CommonTag, CommonDrawer } from '@/Components';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { catColor, initialInbox, BREADCRUMBS } from '@/Data';
import { ContactForm } from './ContactForm'; 

const ContactPage: FC = () => {
  const [contactInfo, setContactInfo] = useState({ email: 'support@lmsplatform.com', phone: '+1 (555) 123-4567', hours: 'Mon - Fri: 9:00 AM - 5:00 PM EST', location: '123 Education Lane, LC 45678' });
  const [messages] = useState(initialInbox);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  }, [searchQuery, messages]);

  const contactItems = [
    { icon: <MailOutlined />, title: 'Email', text: contactInfo.email },
    { icon: <PhoneOutlined />, title: 'Phone', text: contactInfo.phone },
    { icon: <ClockCircleOutlined />, title: 'Hours', text: contactInfo.hours },
    { icon: <EnvironmentOutlined />, title: 'Location', text: contactInfo.location },
  ];

  const handleSaveInfo = (values: any) => {
    setContactInfo(values);
    setIsEditDrawerOpen(false);
  };

  return (
    <>
      <CommonBreadcrumbs title="Contact" breadcrumbs={BREADCRUMBS.CONTACT || []} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={blurRevealUp} className="contact-header-wrapper">
            <div>
              <h2 className="contact-header-title">Contact Management</h2>
              <p className="contact-header-subtitle">Update details and manage inbox inquiries.</p>
            </div>
            <CommonButton type="primary" icon={<EditOutlined />} onClick={() => setIsEditDrawerOpen(true)} className="contact-btn-responsive">
              Edit Details
            </CommonButton>
          </motion.div>
          
          <motion.div variants={blurRevealUp} className="contact-bento-grid">
            {contactItems.map((item, idx) => (
              <div key={idx} className="contact-bento-card group">
                <div className="contact-bento-icon">{item.icon}</div>
                <div className="contact-bento-info">
                  <div className="contact-bento-label">{item.title}</div>
                  <div className="contact-bento-value">{item.text}</div>
                </div>
              </div>
            ))}
          </motion.div>          
          
          <motion.div variants={blurRevealUp}>
            <CommonCard title="Recent Inquiries">
              <CommonValidationTextField placeholder="Search inbox..." startIcon={<SearchOutlined className="contact-search-icon" />} className="contact-inbox-search" value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} clearable />
              {filteredMessages.length > 0 ? filteredMessages.map(item => (
                <div key={item.id} className="contact-message-row group" onClick={() => { setSelectedMessage(item); setIsViewDrawerOpen(true); }}>
                  <Avatar className="contact-message-avatar" size={40} icon={<UserOutlined />} />
                  <div className="contact-message-content">
                    <div className="contact-message-top">
                      <span className="contact-message-name">{item.name}</span>
                      <CommonTag color={catColor(item.category)}>{item.category}</CommonTag>
                    </div>
                    <div className="contact-message-preview">{item.message}</div>
                  </div>
                  <div className="contact-message-actions">
                    <span className="contact-message-date">{item.date}</span>
                    <EyeOutlined className="contact-eye-icon" />
                  </div>
                </div>
              )) : (
                <div className="contact-empty-state">No inquiries found.</div>
              )}
            </CommonCard>
          </motion.div>
        </motion.div>
      </CommonPageWrapper>

      <CommonDrawer title="Update Contact Information" open={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)}>
        <ContactForm initialValues={contactInfo} onSubmit={handleSaveInfo} />
      </CommonDrawer>

      <CommonDrawer title="Message Details" open={isViewDrawerOpen} onClose={() => setIsViewDrawerOpen(false)} size={480}>
        {selectedMessage && (
          <div className="chat-drawer-body">
            <div className="chat-drawer-header">
              <Avatar size={48} icon={<UserOutlined />} className="chat-drawer-avatar" />
              <div className="chat-drawer-user-info">
                <h3 className="chat-drawer-user-name">{selectedMessage.name}</h3>
                <span className="chat-drawer-user-email">{selectedMessage.email}</span>
              </div>
              <CommonTag color={catColor(selectedMessage.category)}>{selectedMessage.category}</CommonTag>
            </div>

            <div className="chat-drawer-content">
              <div className="chat-drawer-received">
                <ClockCircleOutlined /> Received {selectedMessage.date}
              </div>
              <div className="chat-bubble-container">
                <p className="chat-bubble-text">{selectedMessage.message}</p>
              </div>
            </div>

            <div className="chat-bubble-footer">
              <CommonButton type="primary" icon={<MailOutlined />} size="large" href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.category}`} target="_blank" className="contact-btn-responsive" >
                Reply via Email
              </CommonButton>
            </div>
          </div>
        )}
      </CommonDrawer>
    </>
  );
};

export default ContactPage;