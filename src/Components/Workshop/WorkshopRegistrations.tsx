import { useState, useMemo, type FC } from 'react';
import { Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CommonCard, CommonTable } from '@/Components';
import type { WorkshopRegistrationsProps } from '@/Types/Workshop';

export const WorkshopRegistrations: FC<WorkshopRegistrationsProps> = ({ registrations, users }) => {
  const [regSearch, setRegSearch] = useState('');
  const filteredRegistrations = useMemo(() => {
    let result = (registrations || []).map(r => {
      const user = users.find(u => u.id === r.userId);
      return { ...r, id: r.userId, user };
    }).filter(r => r.user);
    if (regSearch.trim()) { 
      const q = regSearch.toLowerCase(); 
      result = result.filter(r => r.user?.username?.toLowerCase().includes(q) || r.status?.toLowerCase().includes(q)); 
    }
    return result;
  }, [registrations, users, regSearch]);

  const regColumns = [
    { title: 'Student', dataIndex: 'user', render: (user: any) => (
        <div className="flex items-center gap-2">
          <Avatar src={user?.profileImage} size="small" icon={<UserOutlined />} />
          <span className="hidden sm:inline">{user?.username}</span>
          <span className="sm:hidden">{user?.username?.split(' ')[0]}</span>
        </div>
    )},
    { title: 'Status', dataIndex: 'status', render: (stat: string) => <Tag color={{ registered: 'processing', attended: 'success', absent: 'warning', cancelled: 'error' }[stat]}>{stat?.toUpperCase()}</Tag> },
    { title: 'Registered', dataIndex: 'registeredAt', responsive: ['md'] as any },
  ];
  const exportRegData = async () => {
    return filteredRegistrations.map(reg => ({
      id: reg.id,               
      userId: reg.userId,       
      status: reg.status?.toUpperCase(),
      registeredAt: reg.registeredAt,
      user: reg.user?.username || 'Unknown', 
    })) as any[]; 
  };

  return (
    <CommonCard title="Registrations">
      <CommonTable columns={regColumns} data={filteredRegistrations} total={filteredRegistrations.length} pageSize={5} searchPlaceholder="Search students..." onSearch={setRegSearch} onExportAll={exportRegData} fileName="workshop-registrations" title="Workshop Registrations" />
    </CommonCard>
  );
};