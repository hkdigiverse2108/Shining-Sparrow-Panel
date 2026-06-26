import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Modal, Segmented, DatePicker, Col, Select } from 'antd';
import { DeleteOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, CommonSummaryCards, AdvancedSearch } from '@/Components';
import { CommonValidationTextField, CommonRichTextEditor, showNotification } from '@/Attribute';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations, Get } from '@/Api';
import { KEYS, URL_KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';

const AddSubscriberSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const BroadcastSchema = Yup.object({
  subject: Yup.string().required('Subject is required'),
  body: Yup.string().required('Email content is required'),
  target: Yup.string().oneOf(['all', 'custom']).required(),
  customEmails: Yup.array().when('target', {
    is: 'custom',
    then: (schema) => schema.min(1, 'Please select or enter at least one recipient email address').required('Please enter at least one recipient email address'),
    otherwise: (schema) => schema.optional(),
  }),
});

const getNewsletterColumns = ({ 
  onDelete, 
  current = 1, 
  pageSize = 10 
}: any): ColumnType<any>[] => [
  {
    title: '#',
    key: 'srNo',
    align: 'center',
    width: 70,
    render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1
  },
  {
    title: 'Email Address',
    dataIndex: 'email',
    align: 'left',
    render: (v: string) => (
      <span className="font-semibold text-foreground flex items-center gap-2">
        <MailOutlined className="text-muted" />
        {v}
      </span>
    )
  },
  {
    title: 'Subscribed Date',
    dataIndex: 'createdAt',
    align: 'left',
    width: 250,
    render: (v: string) => (
      <span className="text-text-muted text-xs">
        {v ? dayjs(v).format('DD MMM YYYY, hh:mm A') : '—'}
      </span>
    )
  },
  {
    title: 'Status',
    dataIndex: 'isBlocked',
    align: 'center',
    width: 130,
    render: (isBlocked: boolean) => (
      <Tag color={isBlocked ? 'red' : 'green'} className="border-none font-medium">
        {isBlocked ? 'Inactive' : 'Active'}
      </Tag>
    )
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: 120,
    align: 'center',
    render: (_: any, r: any) => (
      <div className="flex gap-1 justify-center">
        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} />
      </div>
    )
  }
];

const NewsletterPage: FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Advanced Search states
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<any | null>(null);

  // Fetch Subscribers (Paginated)
  const { data: responseData, isLoading } = Queries.useGetNewsletters({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
    endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
  });

  const subscribers = useMemo(() => responseData?.data?.newsletter_data || [], [responseData]);
  const totalSubscribers = Number(responseData?.data?.totalData) || 0;

  // Fetch all subscribers for broadcast recipient gathering
  const { data: allSubscribersRes } = Queries.useGetNewsletters({
    page: 1,
    limit: 10000
  });
  
  const allSubscribersEmails = useMemo(() => 
    (allSubscribersRes?.data?.newsletter_data || []).map((s: any) => s.email),
    [allSubscribersRes]
  );

  // Fetch users to filter client-side for non-purchasing ones
  const { data: allUsersRes } = Queries.useGetUser({
    page: 1,
    limit: 10000,
  });

  const nonPurchasingUsersOptions = useMemo(() => {
    return (allUsersRes?.data?.user_data || [])
      .filter((u: any) => (!u.courseIds || u.courseIds.length === 0) && (!u.workshopIds || u.workshopIds.length === 0))
      .map((u: any) => ({
        label: `${u.fullName} (${u.email})`,
        value: u.email
      }));
  }, [allUsersRes]);

  // Mutations
  const addSubscriberMutation = Mutations.useAddNewsletter();
  const deleteSubscriberMutation = Mutations.useDeleteNewsletter();
  const sendBroadcastMutation = Mutations.useSendNewsletter();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };

  const handleAddSubscriber = (values: { email: string }, { resetForm }: any) => {
    addSubscriberMutation.mutate(
      { email: values.email },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.NEWSLETTER.BASE] });
          setIsAddModalOpen(false);
          resetForm();
        }
      }
    );
  };

  const handleSendBroadcast = (values: { subject: string; body: string; target: string; customEmails?: string[] }, { resetForm, setSubmitting }: any) => {
    let recipientEmails: string[] = [];

    if (values.target === 'all') {
      recipientEmails = allSubscribersEmails;
      if (recipientEmails.length === 0) {
        showNotification('warning', 'No subscribers available to send broadcast to');
        setSubmitting(false);
        return;
      }
    } else {
      recipientEmails = values.customEmails || [];
      if (recipientEmails.length === 0) {
        showNotification('error', 'Please select or enter valid recipient email addresses');
        setSubmitting(false);
        return;
      }
    }

    sendBroadcastMutation.mutate(
      {
        emails: recipientEmails,
        subject: values.subject,
        message: values.body, // backend field is named message
      },
      {
        onSuccess: () => {
          setIsBroadcastModalOpen(false);
          resetForm();
        },
        onSettled: () => {
          setSubmitting(false);
        }
      }
    );
  };

  const handleDeleteClick = (sub: any) => { 
    setSubscriberToDelete(sub);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!subscriberToDelete) return;
    deleteSubscriberMutation.mutate(subscriberToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.NEWSLETTER.BASE] });
        setIsDeleteModalOpen(false);
        setSubscriberToDelete(null);
      }
    });
  };

  const columns = useMemo(() => getNewsletterColumns({ 
    onDelete: handleDeleteClick,
    current,
    pageSize
  }), [current, pageSize]);  

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleExportAll = async () => {
    const res = await Get<any>(URL_KEYS.NEWSLETTER.GET, {
      page: 1,
      limit: 10000,
      search: debouncedSearchQuery || undefined,
      isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
      startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
      endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
    });
    return res?.data?.newsletter_data || [];
  };

  return (
    <>
      <CommonBreadcrumbs title="Newsletter Subscribers" breadcrumbs={BREADCRUMBS.NEWSLETTER.BASE} />
      <CommonPageWrapper>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div className="text-text-muted text-sm">
            Monitor newsletter subscriptions and dispatch email newsletters to your audience.
          </div>
          <div className="flex gap-2">
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={() => setIsBroadcastModalOpen(true)}
              className="bg-primary hover:bg-primary-hover border-none flex items-center h-10 px-4 rounded-xl font-semibold transition-all duration-200"
            >
              Send Broadcast
            </Button>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <CommonSummaryCards 
            total={totalSubscribers} 
            active={subscribers.filter((s: any) => !s.isBlocked).length} 
            blocked={subscribers.filter((s: any) => s.isBlocked).length} 
            subject="Subscribers" 
          />
          <motion.div variants={blurRevealUp}>
            <AdvancedSearch filter={[
              {
                label: "Status",
                value: isBlockedFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Active (Unblocked)", value: "false" },
                  { label: "Blocked Only", value: "true" }
                ],
                onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 8 }
              }
            ]}>
              <Col xs={24} sm={12} md={8} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Subscription Date Range</span>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange(dates as any);
                    setCurrent(1);
                  }}
                  className="rounded-lg h-[40px] w-full"
                />
              </Col>
              {(isBlockedFilter !== "all" || dateRange) && (
                <Col xs={24} sm={24} md={8}>
                  <Button
                    onClick={() => {
                      setIsBlockedFilter("all");
                      setDateRange(null);
                      setCurrent(1);
                    }}
                    className="h-[40px] px-6 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200 text-foreground"
                  >
                    Clear Filters
                  </Button>
                </Col>
              )}
            </AdvancedSearch>
            <CommonTable 
              columns={columns} 
              data={subscribers} 
              loading={isLoading} 
              searchPlaceholder="Search email address..." 
              onSearch={handleSearch} 
              onAdd={() => setIsAddModalOpen(true)} 
              fileName="Subscribers" 
              onExportAll={handleExportAll} 
              title="Subscriber Management" 
              current={current} 
              pageSize={pageSize} 
              total={totalSubscribers} 
              onTableChange={handleTableChange} 
            />
          </motion.div>
        </motion.div>
      </CommonPageWrapper>

      {/* Manual Subscriber Add Modal */}
      <Modal
        title="Add Manual Subscriber"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        destroyOnClose
        className="modern-modal"
      >
        <Formik
          initialValues={{ email: '' }}
          validationSchema={AddSubscriberSchema}
          onSubmit={handleAddSubscriber}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="space-y-4 mt-4">
              <CommonValidationTextField
                name="email"
                label="Email Address"
                placeholder="Enter email to subscribe..."
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isSubmitting || addSubscriberMutation.isPending}
                  disabled={!isValid || !dirty}
                >
                  Subscribe
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Broadcast Composer Modal */}
      <Modal
        title="Compose Newsletter Broadcast"
        open={isBroadcastModalOpen}
        onCancel={() => setIsBroadcastModalOpen(false)}
        footer={null}
        destroyOnClose
        width={720}
        className="modern-modal"
      >
        <Formik
          initialValues={{ subject: '', body: '', target: 'all', customEmails: [] }}
          validationSchema={BroadcastSchema}
          onSubmit={handleSendBroadcast}
        >
          {({ isSubmitting, values, setFieldValue, isValid, dirty, errors, touched }) => (
            <Form className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground block">Recipients</label>
                <Segmented
                  options={[
                    { label: `All Subscribers (${allSubscribersEmails.length})`, value: 'all' },
                    { label: 'Custom Email List', value: 'custom' }
                  ]}
                  value={values.target}
                  onChange={(val) => setFieldValue('target', val)}
                  className="bg-surface-muted border border-border/80 p-0.5 rounded-lg w-fit"
                />
              </div>

              {values.target === 'custom' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Target Email Address(es) / Non-purchasing Users</label>
                  <Select
                    mode="tags"
                    placeholder="Select non-purchasing users or type custom email addresses..."
                    value={values.customEmails}
                    onChange={(val) => setFieldValue('customEmails', val)}
                    options={nonPurchasingUsersOptions}
                    className="w-full"
                    style={{ minHeight: '40px' }}
                    tokenSeparators={[',', ' ']}
                  />
                  {errors.customEmails && touched.customEmails && (
                    <div className="text-red-500 text-xs mt-1">{errors.customEmails as string}</div>
                  )}
                </div>
              )}

              <CommonValidationTextField
                name="subject"
                label="Email Subject"
                placeholder="Enter email subject line..."
                required
              />

              <div className="rounded-lg overflow-hidden">
                <CommonRichTextEditor
                  name="body"
                  label="Email Body Content"
                  placeholder="Write your email announcement or newsletter content here..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button onClick={() => setIsBroadcastModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />}
                  loading={isSubmitting || sendBroadcastMutation.isPending}
                  disabled={!isValid || !dirty}
                >
                  Send Newsletter
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <CommonDeleteModal 
        open={isDeleteModalOpen} 
        title="Unsubscribe Member" 
        itemName={subscriberToDelete?.email} 
        loading={deleteSubscriberMutation.isPending} 
        onClose={() => { setIsDeleteModalOpen(false); setSubscriberToDelete(null); }} 
        onConfirm={handleConfirmDelete} 
      />
    </>
  );
};

export default NewsletterPage;
