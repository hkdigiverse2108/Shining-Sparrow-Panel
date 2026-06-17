import { useState, useMemo, type FC, type ReactNode } from 'react';
import { Row, Col, Avatar, Tag, Empty, Popconfirm, message } from 'antd';
import { UserOutlined, EditOutlined, PlusOutlined, DeleteOutlined, DeleteFilled } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ROUTES } from '@/Constants';
import { BREADCRUMBS, statusColors, stepColors, type ActiveDrawer } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonCard, CommonTable, CommonDrawer } from '@/Components';
import { editCourse, deleteCourse } from '@/Store/Slices/CourseSlice';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { CommonButton, CommonTimePicker, CommonValidationTextField } from '@/Attribute';
import { CourseForm } from './CourseForm';
import { CurriculumSchema } from '@/Utils';

const CourseDetail: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const course = useAppSelector(state => state.courses.data.find(c => c.id === Number(id)));
  const users = useAppSelector(state => state.users.data);
  
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [studentSearch, setStudentSearch] = useState('');

  // Dynamically find the instructor user object based on instructorId
  const instructorUser = useMemo(() => {
    if (!course) return null;
    return users.find(u => u.id === course.instructorId);
  }, [course, users]);

  const filteredEnrolled = useMemo(() => {
    if (!course) return []; 
    let result = (course.enrolledStudents || [])
      .map(uid => {
        const user = users.find(u => u.id === uid);
        return user ? { id: uid, userId: uid, user } : null;
      })
      .filter(Boolean) as { id: number; userId: number; user: any }[];

    if (studentSearch.trim()) { 
      const q = studentSearch.toLowerCase(); 
      result = result.filter(r => r.user?.username?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q)); 
    }
    return result;
  }, [course, users, studentSearch]);

  if (!course) return (
    <CommonPageWrapper>
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <CommonButton buttonVariant="outline" onClick={() => navigate(ROUTES.COURSE.BASE)}>Back</CommonButton>
      </div>
    </CommonPageWrapper>
  );

  const patch = (u: any) => dispatch(editCourse({ ...course, ...u, updatedAt: new Date().toLocaleDateString('en-GB') }));
  
  const handleDeleteCourse = () => {
    dispatch(deleteCourse(course.id));
    navigate(ROUTES.COURSE.BASE);
    message.success('Course deleted successfully!');
  };

  // Saves the course and ensures both instructorId (number) and instructor (string name) are updated
  const saveCourse = (v: any) => { 
    const instructor = users.find(u => u.id === Number(v.instructorId));
    patch({ 
      ...v, 
      instructorId: Number(v.instructorId), 
      instructor: instructor?.username || '' 
    }); 
    setActiveDrawer(null); 
    message.success('Course updated!'); 
  };

  const saveCurriculum = (v: any) => {
    const list = [...(course.curriculum || [])];
    if (editIdx !== null) list[editIdx] = { ...list[editIdx], ...v }; else list.push({ ...v, completed: false, locked: false });
    patch({ curriculum: list }); 
    setActiveDrawer(null); 
    message.success(editIdx !== null ? 'Updated!' : 'Added!');
  };
  
  const deleteCurriculum = (i: number) => { 
    patch({ curriculum: course.curriculum?.filter((_, idx) => idx !== i) }); 
    message.success('Deleted!'); 
  };

  const studentCols = [
    { title: 'Student', dataIndex: 'user', render: (u: any) => <div className="flex items-center gap-2"><Avatar src={u?.profileImage} size="small" icon={<UserOutlined />} /><span>{u?.username}</span></div> },
    { title: 'Email', dataIndex: 'user', render: (u: any) => u?.email || '-' },
  ];
  
  const exportStudents = async () => filteredEnrolled.map(r => ({ id: r.id, username: r.user?.username || 'Unknown', email: r.user?.email || '-' })) as any[];

  const drawerCfg: Record<string, { title: string; content: ReactNode }> = {
    course: { title: 'Edit Course', content: <CourseForm initialValues={course} onSubmit={saveCourse} isEditing /> },
    curriculum: { title: editIdx !== null ? 'Edit Lecture' : 'Add Lecture', 
      content: (
        <Formik enableReinitialize initialValues={editIdx !== null ? course.curriculum?.[editIdx] : { title: '', duration: '' }} onSubmit={saveCurriculum} validationSchema={CurriculumSchema} >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="space-y-4">
                <CommonValidationTextField name="title" label="Title" required />
                <CommonTimePicker name="duration" value={values.duration} onChange={(val) => setFieldValue('duration', val)} label="Duration" required placeholder="e.g 01:30" format="HH:mm" />
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <CommonButton htmlType="submit" type="primary" title={editIdx !== null ? 'Save' : 'Add'} block />
              </div>
            </Form>
          )}
        </Formik>
      )
    },
  };
  
  const active = activeDrawer ? drawerCfg[activeDrawer] : null;

  return (
    <>
      <CommonBreadcrumbs title="Edit Course" breadcrumbs={BREADCRUMBS.COURSE.DETAILS} />
      <CommonPageWrapper>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-foreground truncate">{course.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Tag color={statusColors[course.status]}>{course.status?.toUpperCase()}</Tag>
              <span className="text-sm text-muted">{course.enrollmentsCount || 0} Enrollments</span>
              <span className="text-sm text-muted hidden sm:inline">• Updated: {course.updatedAt}</span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <CommonButton type="primary" icon={<EditOutlined />} onClick={() => setActiveDrawer('course')} style={{ background: 'var(--info)', borderColor: 'var(--info)' }}>Edit</CommonButton>
            <Popconfirm title="Delete Course?" description="This cannot be undone!" onConfirm={handleDeleteCourse} okButtonProps={{ danger: true }}>
              <CommonButton danger icon={<DeleteFilled />}>Delete</CommonButton>
            </Popconfirm>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <CommonCard title="Curriculum" extra={<CommonButton size="small" buttonVariant="outline" icon={<PlusOutlined />} onClick={() => { setEditIdx(null); setActiveDrawer('curriculum'); }}>Add</CommonButton>}>
              {course.curriculum?.length ? (
                <div className="flex flex-col gap-3">
                  {course.curriculum.map((item, i) => {
                    const stepColor = stepColors[i % stepColors.length];
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-surface-muted rounded-xl border border-border transition-colors group" style={{ borderLeft: `4px solid ${stepColor}` }}>
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white" style={{ backgroundColor: stepColor }}>{i + 1}</div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground">{item.title}</div>
                            <div className="text-xs text-muted">{item.duration}</div>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <CommonButton buttonVariant="iconOnly" iconOnly icon={<EditOutlined />} style={{ color: stepColor }} onClick={() => { setEditIdx(i); setActiveDrawer('curriculum'); }} />
                          <Popconfirm title="Delete?" onConfirm={() => deleteCurriculum(i)}><CommonButton buttonVariant="iconOnly" iconOnly icon={<DeleteOutlined />} className="text-danger!" /></Popconfirm>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <Empty description="No curriculum added yet." />}
            </CommonCard>

            <CommonCard title="Enrolled Students">
              <CommonTable columns={studentCols} data={filteredEnrolled} total={filteredEnrolled.length} pageSize={5} searchPlaceholder="Search by name or email..." onSearch={setStudentSearch} onExportAll={exportStudents} fileName="enrolled-students" title="Enrolled Students" />
            </CommonCard>
          </Col>

          <Col xs={24} lg={8}>
            <CommonCard title="Cover Image">
              <div className="aspect-video bg-surface-muted rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => setActiveDrawer('course')}>
                <img src={course.image} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <CommonButton type="primary" icon={<EditOutlined />} style={{ background: 'var(--info)', borderColor: 'var(--info)' }}>Change</CommonButton>
                </div>
              </div>
            </CommonCard>

            <CommonCard title="Instructor">
              {instructorUser ? (
                <div className="flex items-center gap-4 mb-4">
                  <Avatar size={56} src={instructorUser.profileImage} icon={<UserOutlined />} style={{ backgroundColor: 'var(--secondary)' }} className="flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{instructorUser.username}</div>
                    <div className="text-sm text-secondary truncate">{instructorUser.email}</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted">No instructor assigned</div>
              )}
            </CommonCard>
          </Col>
        </Row>
      </CommonPageWrapper>
      <CommonDrawer title={active?.title || ''} open={activeDrawer !== null} onClose={() => setActiveDrawer(null)}>{active?.content}</CommonDrawer>
    </>
  );
};

export default CourseDetail;