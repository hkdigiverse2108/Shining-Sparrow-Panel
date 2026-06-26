import { useMemo, useState, type FC } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Tag, Button, Spin, Card } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TagOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  PrinterOutlined,
  SendOutlined
} from '@ant-design/icons';
import { motion } from 'motion/react';
import { CommonBreadcrumbs, CommonPageWrapper, CommonDeleteModal, CommonDrawer } from '@/Components';
import { CommonButton, CommonValidationTextField, showNotification, CommonRichTextEditor } from '@/Attribute';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { ROUTES } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/Constants';
import dayjs from 'dayjs';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const ReplySchema = Yup.object({
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
});

const FranchiseInquiryDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplyDrawerOpen, setIsReplyDrawerOpen] = useState(false);

  // Retrieve record from router navigation state if available
  const stateRecord = location.state?.record;

  // Fallback query if page was reloaded directly
  const { data: inquiriesRes, isLoading: inquiriesLoading } = Queries.useGetFranchiseInquiries(
    { limit: 1000 }
  );

  const record = useMemo(() => {
    if (stateRecord) return stateRecord;
    const list = inquiriesRes?.data?.franchise_inquiries_data || inquiriesRes?.data?.franchise_inquiry_data || [];
    return list.find((item: any) => item._id === id);
  }, [stateRecord, inquiriesRes, id]);

  const deleteMutation = Mutations.useDeleteFranchiseInquiry();
  const markReadMutation = Mutations.useMarkFranchiseRead();
  const sendNewsletterMutation = Mutations.useSendNewsletter();
  const updateMutation = Mutations.useUpdateFranchiseInquiry();

  // Mark as read immediately on mount/load if unread
  useMemo(() => {
    if (record && !record.isRead) {
      markReadMutation.mutate(
        { franchiseInquiryId: record._id, isRead: true },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEYS.FRANCHISE_INQUIRY.BASE] }) }
      );
    }
  }, [record, queryClient]);

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteConfirm = () => {
    if (!record) return;
    deleteMutation.mutate(record._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.FRANCHISE_INQUIRY.BASE] });
        setIsDeleteModalOpen(false);
        navigate(ROUTES.FRANCHISE_INQUIRY);
      },
    });
  };

  if (inquiriesLoading && !stateRecord) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <Spin size="large" tip="Loading inquiry details..." />
      </div>
    );
  }

  if (!record) {
    return (
      <>
        <div className="print:hidden">
          <CommonBreadcrumbs title="Inquiry Details" breadcrumbs={BREADCRUMBS.FRANCHISE_INQUIRY?.DETAILS || []} />
        </div>
        <CommonPageWrapper className="h-full bg-transparent p-6">
          <Card className="text-center rounded-2xl border-border py-12">
            <h3 className="text-lg font-bold text-foreground mb-2">Inquiry Not Found</h3>
            <p className="text-text-muted mb-6 text-sm">We couldn't locate this franchise inquiry record in the system.</p>
            <Button type="primary" onClick={() => navigate(ROUTES.FRANCHISE_INQUIRY)} icon={<ArrowLeftOutlined />}>
              Back to Franchise Inquiries
            </Button>
          </Card>
        </CommonPageWrapper>
      </>
    );
  }

  return (
    <>
      <div className="print:hidden">
        <CommonBreadcrumbs title="Inquiry Details" breadcrumbs={BREADCRUMBS.FRANCHISE_INQUIRY?.DETAILS || []} />
      </div>
      <CommonPageWrapper noPadding className="h-full bg-transparent print:bg-white print:p-0">
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="visible" 
          className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto print:p-0"
        >
          {/* Action Header */}
          <div className="flex items-center justify-between border-b border-border/65 pb-4 print:hidden">
            <Button 
              type="text" 
              onClick={() => navigate(ROUTES.FRANCHISE_INQUIRY)} 
              icon={<ArrowLeftOutlined />}
              className="hover:bg-muted text-foreground font-medium flex items-center gap-1.5"
            >
              Back to Inquiries
            </Button>
            <div className="flex gap-2">
              <Button 
                type="default" 
                onClick={handlePrint} 
                icon={<PrinterOutlined />}
                className="hover:border-primary hover:text-primary transition-all duration-200"
              >
                Print
              </Button>
              <Button 
                danger 
                onClick={() => setIsDeleteModalOpen(true)} 
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Applicant Card */}
          <motion.div variants={blurRevealUp}>
            <Card className="rounded-2xl border-border bg-surface shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar 
                  size={64} 
                  icon={<UserOutlined />} 
                  className="bg-primary-soft text-primary shadow-sm border border-primary/10 shrink-0 text-2xl"
                  style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
                />
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h4 className="font-bold text-foreground text-base leading-snug">{record.name}</h4>
                    <Tag 
                      icon={record.isRead ? <CheckCircleOutlined /> : <InboxOutlined />}
                      color={record.isRead ? 'green' : 'orange'}
                      className="rounded-full px-2.5 py-0 text-[10px] uppercase font-bold m-0"
                    >
                      {record.isRead ? 'Read' : 'Unread'}
                    </Tag>
                    {record.isReplied && (
                      <Tag 
                        icon={<CheckCircleOutlined />}
                        color="success"
                        className="rounded-full px-2.5 py-0 text-[10px] uppercase font-bold m-0"
                      >
                        Replied
                      </Tag>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-muted">
                      <MailOutlined className="text-primary/70 shrink-0" />
                      <span className="truncate">{record.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-muted">
                      <PhoneOutlined className="text-primary/70 shrink-0" />
                      <span className="font-mono">{record.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Message Content */}
          {record.message && (
            <motion.div variants={blurRevealUp}>
              <Card className="rounded-2xl border-border bg-surface shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 border-b border-border pb-2">
                  Message Content
                </h4>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap m-0">
                  {record.message}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Sent Reply Block */}
          {record.isReplied && record.replyMessage && (
            <motion.div variants={blurRevealUp}>
              <Card className="rounded-2xl border-border bg-surface-muted shadow-sm border border-emerald-500/10">
                <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 m-0">
                    <CheckCircleOutlined /> Sent Reply Content
                  </h4>
                  {record.repliedAt && (
                    <span className="text-xs text-text-muted">
                      {dayjs(record.repliedAt).format('DD MMM YYYY, hh:mm A')}
                    </span>
                  )}
                </div>
                {record.replySubject && (
                  <div className="mb-3 text-sm text-foreground/90">
                    <strong className="text-foreground font-semibold">Subject:</strong>{' '}
                    <span>{record.replySubject}</span>
                  </div>
                )}
                <div 
                  className="text-sm text-foreground leading-relaxed ql-editor p-0 m-0"
                  dangerouslySetInnerHTML={{ __html: record.replyMessage }}
                />
              </Card>
            </motion.div>
          )}

          {/* Inquiry Information Card */}
          <motion.div variants={blurRevealUp}>
            <Card className="rounded-2xl border-border bg-surface shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8" />
              
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border pb-2">
                  Inquiry Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-surface-muted/65">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <EnvironmentOutlined /> Location
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {[record.city, record.state].filter(Boolean).join(', ') || '—'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-surface-muted/65">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <DollarOutlined /> Investment Budget
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {record.investmentBudget || '—'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-surface-muted/65">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <TagOutlined /> Occupation
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {record.occupation || '—'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-surface-muted/65">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <ClockCircleOutlined /> Received Date
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {record.createdAt ? dayjs(record.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border/40 space-y-4 print:hidden">
                <CommonButton
                  type={record.isReplied ? "default" : "primary"}
                  icon={<MailOutlined />}
                  onClick={() => setIsReplyDrawerOpen(true)}
                  block
                >
                  {record.isReplied ? 'Send Another Reply' : 'Reply via Email'}
                </CommonButton>
                <div className="text-center text-[10px] text-text-muted flex flex-col items-center gap-1">
                  <span className="font-semibold">Shining Sparrow Admin Console</span>
                  <span>For assistance, contact technical support.</span>
                </div>
              </div>
            </Card>
          </motion.div>

        </motion.div>
      </CommonPageWrapper>

      {/* Reply Drawer */}
      <CommonDrawer
        title={`Reply to ${record.name}`}
        open={isReplyDrawerOpen}
        onClose={() => setIsReplyDrawerOpen(false)}
        size={520}
      >
        <Formik
          initialValues={{ 
            email: record.email || '', 
            subject: `Re: Franchise Inquiry from ${record.name}`, 
            message: '' 
          }}
          validationSchema={ReplySchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            sendNewsletterMutation.mutate(
              {
                emails: [values.email],
                subject: values.subject,
                message: values.message,
              },
              {
                onSuccess: () => {
                  updateMutation.mutate(
                    {
                      franchiseInquiryId: record._id,
                      isReplied: true,
                      replySubject: values.subject,
                      replyMessage: values.message,
                      repliedAt: new Date().toISOString()
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: [KEYS.FRANCHISE_INQUIRY.BASE] });
                        showNotification('success', 'Reply email sent and response saved successfully');
                        setIsReplyDrawerOpen(false);
                        resetForm();
                      },
                      onError: () => {
                        showNotification('warning', 'Email sent, but failed to save reply log in database');
                        setIsReplyDrawerOpen(false);
                        resetForm();
                      }
                    }
                  );
                },
                onSettled: () => {
                  setSubmitting(false);
                }
              }
            );
          }}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="space-y-4 mt-2">
              <CommonValidationTextField
                name="email"
                label="To"
                disabled
              />

              <CommonValidationTextField
                name="subject"
                label="Subject"
                placeholder="Enter email subject..."
                required
              />

              <div className="rounded-lg overflow-hidden">
                <CommonRichTextEditor
                  name="message"
                  label="Message Content"
                  placeholder="Write your reply message here..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
                <Button onClick={() => setIsReplyDrawerOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />}
                  loading={isSubmitting || sendNewsletterMutation.isPending}
                  disabled={!isValid || !dirty}
                >
                  Send Reply
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CommonDrawer>

      <CommonDeleteModal
        open={isDeleteModalOpen}
        title="Delete Franchise Inquiry"
        itemName={record.name}
        loading={deleteMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default FranchiseInquiryDetails;

