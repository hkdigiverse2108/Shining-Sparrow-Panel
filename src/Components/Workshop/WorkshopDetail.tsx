import React, { useState } from 'react';
import { Row, Col, Avatar, message, Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonCard, CommonDrawer } from '@/Components';
import { editWorkshop } from '@/Store/Slices/WorkshopSlice';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { CommonButton } from '@/Attribute';
import { WorkshopForm } from './WorkshopForm';
import { WorkshopAgendaList } from './WorkshopAgendaList';
import { WorkshopRegistrations } from './WorkshopRegistrations';
import { WorkshopAgendaForm } from './WorkshopAgendaForm';

type ActiveDrawer = 'workshop' | 'agenda' | null;

const WorkshopDetail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const workshop = useAppSelector((state) => state.workshops.data.find(w => w.id === Number(id)));
  const users = useAppSelector((state) => state.users.data);
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  // Get speaker details from users state
  const speakerUser = users.find(u => u.id === workshop?.speakerId);

  if (!workshop) return (
    <CommonPageWrapper>
      <div className="flex flex-col items-center justify-center h-[50vh] p-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Workshop Not Found</h2>
        <CommonButton buttonVariant="outline" onClick={() => navigate(ROUTES.WORKSHOP.BASE)}>Back</CommonButton>
      </div>
    </CommonPageWrapper>
  );

  const patch = (u: any) => dispatch(editWorkshop({ ...workshop, ...u }));
  
  const saveWorkshop = (v: any) => { 
    const speaker = users.find(u => u.id === Number(v.speakerId));
    patch({ 
      ...v, 
      speakerId: Number(v.speakerId),
      speaker: { id: Number(v.speakerId), name: speaker?.username || '' } 
    }); 
    setActiveDrawer(null); 
    message.success('Workshop updated!'); 
  };

  const saveAgenda = (v: any) => {
    const list = [...(workshop.agenda || [])];
    if (editIdx !== null) list[editIdx] = { ...list[editIdx], ...v }; else list.push(v);
    patch({ agenda: list }); setActiveDrawer(null); message.success(editIdx !== null ? 'Updated!' : 'Added!');
  };
  
  const deleteAgenda = (i: number) => { patch({ agenda: workshop.agenda?.filter((_, idx) => idx !== i) }); message.success('Deleted!'); };

  return (
    <>
      <CommonBreadcrumbs title="Workshop Details" breadcrumbs={BREADCRUMBS.WORKSHOP.DETAILS} />
      <CommonPageWrapper>
        <div className="ws-detail-main">
          <div className="ws-detail-inner">
            <h2 className="ws-detail-title">{workshop.title}</h2>
            <div className="ws-detail-tags">
              <Tag icon={<CalendarOutlined />} color="processing">{workshop.date}</Tag>
              <Tag icon={<ClockCircleOutlined />} color="success">{workshop.time}</Tag>
              <Tag color="warning">{workshop.category}</Tag>
            </div>
          </div>
          <CommonButton type="primary" icon={<EditOutlined />} onClick={() => setActiveDrawer('workshop')} className="w-full md:w-auto">Edit Details</CommonButton>
        </div>
        <Row gutter={[16, 24]}>
          <Col xs={24} lg={16}>
            <WorkshopAgendaList agenda={workshop.agenda || []} onAdd={() => { setEditIdx(null); setActiveDrawer('agenda'); }} onEdit={(idx) => { setEditIdx(idx); setActiveDrawer('agenda'); }} onDelete={deleteAgenda} />
            <div className='mt-6'></div>
            <WorkshopRegistrations registrations={workshop.registrations || []} users={users} />
          </Col>
          <Col xs={24} lg={8}>
            <CommonCard title="Cover Image">
              <div className="ws-cover-image group" onClick={() => setActiveDrawer('workshop')}>
                <img src={workshop.image} className="ws-cover-img" alt="Cover" />
                <div className="wc-coverimage-change"><CommonButton type="primary" icon={<EditOutlined />}>Change</CommonButton></div>
              </div>
            </CommonCard>
            <div className='mt-6'></div>
            <CommonCard title="Speaker">
              <div className="ws-speaker-main">
                <Avatar size={48} src={speakerUser?.profileImage} icon={<TeamOutlined />} className="ws-speaker-avatar" />
                <div className="ws-speaker-inner">
                  <div className="ws-speaker-name">{speakerUser?.username || workshop.speaker?.name}</div>
                  <div className="ws-speaker-title">{speakerUser?.email || 'Instructor'}</div>
                </div>
              </div>
              {/* Removed bio and linkedin button as data no longer exists */}
            </CommonCard>
          </Col>
        </Row>
      </CommonPageWrapper>
      <CommonDrawer title="Edit Workshop" open={activeDrawer === 'workshop'} onClose={() => setActiveDrawer(null)}>
        <WorkshopForm initialValues={workshop} onSubmit={saveWorkshop} isEditing />
      </CommonDrawer>
      <CommonDrawer 
        title={editIdx !== null ? 'Edit Session' : 'Add Session'} 
        open={activeDrawer === 'agenda'} 
        onClose={() => setActiveDrawer(null)}
      >
        <WorkshopAgendaForm
          initialValues={editIdx !== null ? workshop.agenda?.[editIdx] : { time: '', title: '', desc: '' }} 
          onSubmit={saveAgenda} 
          isEditing={editIdx !== null} 
        />
      </CommonDrawer>
    </>
  );
};

export default WorkshopDetail;