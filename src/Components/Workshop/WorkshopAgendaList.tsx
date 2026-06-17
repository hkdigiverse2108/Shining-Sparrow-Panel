import React from 'react';
import { Empty, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { CommonCard } from '@/Components';
import { CommonButton } from '@/Attribute';
import type { WorkshopAgendaListProps } from '@/Types/Workshop';

export const WorkshopAgendaList: React.FC<WorkshopAgendaListProps> = ({ agenda, onAdd, onEdit, onDelete }) => (
  <CommonCard title="Workshop Agenda" extra={<CommonButton size="small" buttonVariant="outline" icon={<PlusOutlined />} onClick={onAdd}>Add</CommonButton>} >
    {agenda?.length ? (
      <div className="ws-agenda-main">
        {agenda.map((item, idx) => (
          <div key={idx} className="ws-agenda-inner group">
            <div className="ws-agenda-details">
              <div className="ws-agenda-id">{idx + 1}</div>
              <div className="ws-agenda-part">
                <div className="ws-agenda-title">{item.title}</div>
                <div className="ws-agenda-time">{item.time}</div>
                {item.desc && <div className="ws-agenda-desc tiptap-render" dangerouslySetInnerHTML={{ __html: item.desc }} />}
              </div>
            </div>
            <div className="ws-button-container">
              <CommonButton buttonVariant="iconOnly" iconOnly icon={<EditOutlined />} className="text-primary" onClick={() => onEdit(idx)} />
              <Popconfirm title="Delete?" onConfirm={() => onDelete(idx)}>
                <CommonButton buttonVariant="iconOnly" iconOnly icon={<DeleteOutlined />} className="text-danger!" />
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    ) : <Empty description="No agenda items yet." />}
  </CommonCard>
);