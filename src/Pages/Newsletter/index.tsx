import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Modal, Segmented } from 'antd';
import { DeleteOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, CommonSummaryCards } from '@/Components';
import { CommonValidationTextField, CommonRichTextEditor, showNotification } from '@/Attribute';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
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
  customEmails: Yup.string().when('target', {
    is: 'custom',
    then: (schema) => schema.required('Please enter at least one recipient email address'),
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

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<any | null>(null);

  // Fetch Subscribers (Paginated)
  const { data: responseData, isLoading } = Queries.useGetNewsletters({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery
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

  const handleSendBroadcast = (values: { subject: string; body: string; target: string; customEmails?: string }, { resetForm, setSubmitting }: any) => {
    let recipientEmails: string[] = [];

    if (values.target === 'all') {
      recipientEmails = allSubscribersEmails;
      if (recipientEmails.length === 0) {
        showNotification('warning', 'No subscribers available to send broadcast to');
        setSubmitting(false);
        return;
      }
    } else {
      recipientEmails = (values.customEmails || '')
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0 && e.includes('@'));
      if (recipientEmails.length === 0) {
        showNotification('error', 'Please enter valid recipient email addresses');
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
            active={totalSubscribers} 
            blocked={0} 
            subject="Subscribers" 
          />
          <motion.div variants={blurRevealUp}>
            <CommonTable 
              columns={columns} 
              data={subscribers} 
              loading={isLoading} 
              searchPlaceholder="Search email address..." 
              onSearch={handleSearch} 
              onAdd={() => setIsAddModalOpen(true)} 
              fileName="Subscribers" 
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
          initialValues={{ subject: '', body: '', target: 'all', customEmails: '' }}
          validationSchema={BroadcastSchema}
          onSubmit={handleSendBroadcast}
        >
          {({ isSubmitting, values, setFieldValue, isValid, dirty }) => (
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
                <CommonValidationTextField
                  name="customEmails"
                  label="Target Email Address(es)"
                  placeholder="Enter email addresses separated by commas..."
                  multiline
                  rows={2}
                  required
                />
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
