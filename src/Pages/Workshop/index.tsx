import { useState, type FC } from 'react';
import { Tag, Avatar, message } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { deleteWorkshop } from '@/Store/Slices/WorkshopSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { BREADCRUMBS } from '@/Data/Breadcrumbs';
import { CommonPageWrapper, CommonBreadcrumbs, CommonDrawer } from '@/Components';
import { motion } from 'motion/react';
import { cardRevealUp } from '@/Utils/animations';
import { addWorkshop } from '@/Store/Slices/WorkshopSlice';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { WorkshopForm } from '@/Components/Workshop/WorkshopForm';
import { CommonButton } from '@/Attribute';

const addInitialValues = {
  title: '', description: '', date: '', time: '', category: '', image: '',
  speakerId: '', speaker: { id: '', name: '' }
};

const Workshops: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const workshops = useAppSelector((state) => state.workshops.data);
  const users = useAppSelector((state) => state.users.data);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDeleteWorkshop = (id: number) => {
    dispatch(deleteWorkshop(id));
    message.success('Workshop deleted successfully!');
  };

  const handleAddWorkshop = (values: any) => {
    const speakerUser = users.find(u => u.id === Number(values.speakerId));
    dispatch(addWorkshop({ id: Date.now(), ...values, speakerId: Number(values.speakerId), speaker: { id: Number(values.speakerId), name: speakerUser?.username || '' }, featured: false, attendees: 0, agenda: [],registrations: [] }));
    setIsDrawerOpen(false);
    message.success('Workshop created successfully!');
  };
  return (
    <>
      <CommonBreadcrumbs title="Workshop" breadcrumbs={BREADCRUMBS.WORKSHOP.BASE} />
      <CommonPageWrapper>
        <div className="workshop-header-main">
          <h2 className="workshop-header-title">Workshops</h2>
          <CommonButton type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsDrawerOpen(true)}>
            Add Workshop
          </CommonButton>
        </div>
        <motion.div className="workshop-motion-main" {...cardRevealUp}>
          {workshops.map((item) => {
            const speakerUser = users.find(u => u.id === item.speakerId);
            return (
              <div 
                key={item.id} 
                className="workshop-container-main" 
                onClick={() => navigate(`${ROUTES.WORKSHOP.BASE}/${item.id}`)}
              >
                <div className="worshop-container-title">
                  <img alt={item.title} src={item.image} className="workshop-container-img" />
                </div>
                <div className="workshop-container-inner">
                  <h4 className="workshop-container-title">{item.title}</h4>
                  <div className="workshop-container-datetime">
                    <span className="workshop-container-date"><CalendarOutlined /> {item.date}</span>
                    <span className="workshop-container-time"><ClockCircleOutlined /> {item.time}</span>
                  </div>
                  <div className="workshop-speaker-main">
                    <div className="workshop-speaker-avatar">
                      <Avatar size={22} src={speakerUser?.profileImage} icon={<TeamOutlined />} style={{ backgroundColor: 'var(--primary)' }} />
                      <span>{speakerUser?.username || item.speaker?.name || 'Unknown'}</span>
                    </div>
                    <Tag color="processing">{item.attendees} Spots</Tag>
                    <Popconfirm 
                      title="Delete this workshop?" 
                      onConfirm={() => handleDeleteWorkshop(item.id)} 
                      okText="Yes" 
                      cancelText="No"
                    >
                      {/* Moved stopPropagation to the button instead of Popconfirm */}
                      <CommonButton 
                        buttonVariant='iconOnly' 
                        iconOnly 
                        icon={<DeleteOutlined />} 
                        className="text-danger delete-button" 
                        onClick={(e: any) => e.stopPropagation()} 
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            );  
          })}
        </motion.div>
      </CommonPageWrapper>
      <CommonDrawer title="Add New Workshop" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <WorkshopForm initialValues={addInitialValues} onSubmit={handleAddWorkshop} isEditing={false} />
      </CommonDrawer>
    </>
  );
};

export default Workshops;