import { useState, useMemo, type FC } from 'react';
import { Avatar, Button, Tag, Tooltip, Tabs, Spin, DatePicker, Col } from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined,
  DeleteOutlined, EyeOutlined, ClockCircleOutlined,
  CheckCircleOutlined, InboxOutlined, SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, CommonDrawer, CommonFormSection, AdvancedSearch } from '@/Components';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations, Get } from '@/Api';
import { KEYS, URL_KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// ─── Columns ────────────────────────────────────────────────────────────────
const getColumns = ({
  onView,
  onDelete,
  current = 1,
  pageSize = 10,
}: {
  onView: (r: any) => void;
  onDelete: (r: any) => void;
  current?: number;
  pageSize?: number;
}): ColumnType<any>[] => [
  {
    title: 'Sr.',
    key: 'srNo',
    width: 60,
    render: (_: any, __: any, i: number) => (
      <span className="font-mono text-xs text-muted font-semibold">
        {(current - 1) * pageSize + i + 1}
      </span>
    ),
  },
  {
    title: 'Sender',
    dataIndex: 'name',
    render: (v: string, r: any) => (
      <div className="flex items-center gap-3">
        <Avatar size={38} icon={<UserOutlined />} className="shrink-0 border border-border shadow-sm" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
            {v}
            {!r.isRead && (
              <span className="inline-block w-2 h-2 rounded-full bg-primary shrink-0" title="Unread" />
            )}
          </div>
          <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
            <MailOutlined className="text-[10px]" />
            {r.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Phone',
    dataIndex: 'phoneNumber',
    width: 140,
    render: (v: string) => (
      <div className="flex items-center gap-1.5 text-sm text-muted">
        <PhoneOutlined className="text-xs" />
        <span className="font-mono">{v || '—'}</span>
      </div>
    ),
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    width: 180,
    render: (v: string) => (
      <span className="text-sm text-foreground truncate max-w-[160px] block">
        {v || <span className="text-muted italic">No subject</span>}
      </span>
    ),
  },
  {
    title: 'Message',
    dataIndex: 'message',
    render: (v: string) => (
      <p className="text-sm text-muted truncate max-w-[220px] m-0">{v}</p>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'isRead',
    width: 100,
    render: (v: boolean) => (
      <Tag
        icon={v ? <CheckCircleOutlined /> : <InboxOutlined />}
        color={v ? 'green' : 'orange'}
        className="capitalize m-0"
      >
        {v ? 'Read' : 'Unread'}
      </Tag>
    ),
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    width: 120,
    render: (v: string) => (
      <span className="text-xs text-muted">{v ? dayjs(v).format('DD MMM YYYY') : '—'}</span>
    ),
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: 100,
    fixed: 'right' as const,
    render: (_: any, r: any) => (
      <div className="flex items-center gap-1.5 justify-center">
        <Tooltip title="View Message">
          <Button
            type="text"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => onView(r)}
            className="hover:!bg-primary/10 hover:!text-primary text-muted transition-all duration-200"
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            type="text"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(r)}
            className="hover:!bg-rose-500/10 transition-all duration-200"
          />
        </Tooltip>
      </div>
    ),
  },
];

// ─── Contact Details Schema ──────────────────────────────────────────────────
const ContactDetailsSchema = Yup.object().shape({
  address: Yup.string().optional(),
  phoneNumber: Yup.string().optional(),
  email: Yup.string().email("Invalid email").optional().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
  workingHours: Yup.string().optional(),
  facebook: Yup.string().url("Must be a valid URL").optional().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
  instagram: Yup.string().url("Must be a valid URL").optional().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
  linkedin: Yup.string().url("Must be a valid URL").optional().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
  twitter: Yup.string().url("Must be a valid URL").optional().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
});

// ─── Contact Details Form Tab ────────────────────────────────────────────────
const ContactDetailsTab: FC = () => {
  const queryClient = useQueryClient();
  const { data: contactUsData, isLoading } = Queries.useGetContactUs({
    retry: false,
  });
  const updateContactUsMutation = Mutations.useUpdateContactUs();

  const contactUs = contactUsData?.data;

  const initialValues = useMemo(() => {
    const phones = contactUs?.phoneNumbers || [];
    const firstPhone = phones[0]?.number || "";

    return {
      address: contactUs?.address || "",
      phoneNumber: firstPhone,
      workingHours: contactUs?.workingHours || "",
      email: contactUs?.email || "",
      facebook: contactUs?.socialMediaLinks?.facebook || "",
      instagram: contactUs?.socialMediaLinks?.instagram || "",
      linkedin: contactUs?.socialMediaLinks?.linkedin || "",
      twitter: contactUs?.socialMediaLinks?.twitter || "",
    };
  }, [contactUs]);

  const handleSubmit = async (values: any) => {
    const payload = {
      phoneNumbers: values.phoneNumber ? [{ number: values.phoneNumber, label: "General" }] : [],
      email: values.email || "",
      address: values.address || "",
      workingHours: values.workingHours || "",
      socialMediaLinks: {
        facebook: values.facebook || "",
        instagram: values.instagram || "",
        linkedin: values.linkedin || "",
        twitter: values.twitter || "",
      },
    };

    try {
      await updateContactUsMutation.mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: [KEYS.CONTACT_US.BASE] });
    } catch {
      // handled globally
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={ContactDetailsSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="profile-tab-form space-y-6 max-w-4xl mx-auto mt-4">
          <div className="profile-form-section-card">
            <CommonFormSection title="Company Contact Information">
              <CommonValidationTextField name="address" label="Office Address" />
              <CommonValidationTextField name="phoneNumber" label="Phone Number" />
              <CommonValidationTextField name="email" label="Contact Email" />
              <CommonValidationTextField name="workingHours" label="Working Hours" />
            </CommonFormSection>
          </div>

          <div className="profile-form-section-card">
            <CommonFormSection title="Social Media Handles">
              <CommonValidationTextField name="facebook" label="Facebook URL" />
              <CommonValidationTextField name="instagram" label="Instagram URL" />
              <CommonValidationTextField name="linkedin" label="LinkedIn URL" />
              <CommonValidationTextField name="twitter" label="Twitter / X URL" />
            </CommonFormSection>
          </div>

          <div className="profile-form-actions">
            <CommonButton
              htmlType="submit"
              type="primary"
              icon={<SaveOutlined />}
              title="Save Contact Details"
              loading={updateContactUsMutation.isPending}
              className="course-button course-button--primary"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

// ─── Contact Page Main Component ─────────────────────────────────────────────
const ContactPage: FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState<any>(null);

  // Advanced Search states
  const [isReadFilter, setIsReadFilter] = useState<string | undefined>("all");
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const { data: responseData, isLoading, isFetching } = Queries.useGetContactMessages({
    page: current,
    limit: pageSize,
    search: debouncedSearch || undefined,
    isRead: isReadFilter === "all" ? undefined : isReadFilter,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
    endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
  });

  const messages = useMemo(() => responseData?.data?.contact_messages_data || [], [responseData]);
  const totalMessages = Number(responseData?.data?.totalData) || 0;

  const deleteMutation = Mutations.useDeleteContactMessage();
  const markReadMutation = Mutations.useMarkContactRead();

  const unreadCount = useMemo(() => messages.filter((m: any) => !m.isRead).length, [messages]);
  const readCount = useMemo(() => messages.filter((m: any) => m.isRead).length, [messages]);

  const handleView = (msg: any) => {
    setSelectedMessage(msg);
    setIsViewDrawerOpen(true);
    // Mark as read if unread
    if (!msg.isRead) {
      markReadMutation.mutate(
        { getInTouchId: msg._id, isRead: true },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEYS.GET_IN_TOUCH.BASE] }) }
      );
    }
  };

  const handleDeleteClick = (msg: any) => {
    setMsgToDelete(msg);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!msgToDelete) return;
    deleteMutation.mutate(msgToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.GET_IN_TOUCH.BASE] });
        setIsDeleteModalOpen(false);
        setMsgToDelete(null);
      },
    });
  };

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleExportAll = async () => {
    const res = await Get<any>(URL_KEYS.GET_IN_TOUCH.GET, {
      page: 1,
      limit: 10000,
      search: searchQuery || undefined,
      isRead: isReadFilter === "all" ? undefined : isReadFilter,
      isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
      startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
      endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
    });
    return res?.data?.contact_messages_data || [];
  };

  const columns = useMemo(
    () => getColumns({ onView: handleView, onDelete: handleDeleteClick, current, pageSize }),
    [current, pageSize]
  );

  const tabItems = [
    {
      key: "messages",
      label: (
        <span className="profile-tab-label">
          <InboxOutlined /> Messages Inbox
        </span>
      ),
      children: (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mt-4">
          {/* Summary Cards */}
          <motion.div variants={blurRevealUp} className="user-metrics-grid">
            <div className="user-metric-card">
              <div className="user-metric-icon user-metric-icon--total">
                <InboxOutlined />
              </div>
              <div className="user-metric-info">
                <p className="user-metric-title">Total Messages</p>
                <p className="user-metric-value">{totalMessages}</p>
              </div>
            </div>
            <div className="user-metric-card">
              <div className="user-metric-icon user-metric-icon--blocked">
                <MailOutlined />
              </div>
              <div className="user-metric-info">
                <p className="user-metric-title">Unread</p>
                <p className="user-metric-value">{unreadCount}</p>
              </div>
            </div>
            <div className="user-metric-card">
              <div className="user-metric-icon user-metric-icon--active">
                <CheckCircleOutlined />
              </div>
              <div className="user-metric-info">
                <p className="user-metric-title">Read</p>
                <p className="user-metric-value">{readCount}</p>
              </div>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div variants={blurRevealUp}>
            <AdvancedSearch filter={[
              {
                label: "Read State",
                value: isReadFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Unread Messages", value: "false" },
                  { label: "Read Messages", value: "true" }
                ],
                onChange: (val: any) => { setIsReadFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 6 }
              },
              {
                label: "Status",
                value: isBlockedFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Active Messages", value: "false" },
                  { label: "Blocked Messages", value: "true" }
                ],
                onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 6 }
              }
            ]}>
              <Col xs={24} sm={12} md={6} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Date Received Range</span>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange(dates as any);
                    setCurrent(1);
                  }}
                  className="rounded-lg h-[40px] w-full"
                />
              </Col>
              {(isReadFilter !== "all" || isBlockedFilter !== "all" || dateRange) && (
                <Col xs={24} sm={24} md={6}>
                  <Button
                    onClick={() => {
                      setIsReadFilter("all");
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
              data={messages}
              loading={isLoading || isFetching || deleteMutation.isPending}
              searchPlaceholder="Search by name, email, subject..."
              onSearch={(q) => { setSearchQuery(q); setCurrent(1); }}
              current={current}
              pageSize={pageSize}
              total={totalMessages}
              onTableChange={handleTableChange}
              fileName="contact-messages"
              title="Contact Messages"
              onExportAll={handleExportAll}
            />
          </motion.div>
        </motion.div>
      ),
    },
    {
      key: "details",
      label: (
        <span className="profile-tab-label">
          <SettingOutlined /> Contact Details Form
        </span>
      ),
      children: activeTab === "details" ? <ContactDetailsTab /> : null,
    },
  ];

  return (
    <>
      <CommonBreadcrumbs title="Contact Us" breadcrumbs={BREADCRUMBS.CONTACT || []} />
      <CommonPageWrapper className=" !h-auto !min-h-0">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="profile-tabs contact-tabs"
          size="large"
        />
      </CommonPageWrapper>

      {/* Message Detail Drawer */}
      <CommonDrawer
        title="Message Details"
        open={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        size={500}
      >
        {selectedMessage && (
          <div className="flex flex-col gap-5">
            {/* Sender Card */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-surface-muted">
              <Avatar size={52} icon={<UserOutlined />} className="border border-border shadow-sm shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-foreground text-base truncate">{selectedMessage.name}</div>
                <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <MailOutlined /> {selectedMessage.email}
                </div>
                {selectedMessage.phoneNumber && (
                  <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <PhoneOutlined /> {selectedMessage.phoneNumber}
                  </div>
                )}
              </div>
              <Tag
                icon={selectedMessage.isRead ? <CheckCircleOutlined /> : <InboxOutlined />}
                color={selectedMessage.isRead ? 'green' : 'orange'}
                className="shrink-0 m-0"
              >
                {selectedMessage.isRead ? 'Read' : 'Unread'}
              </Tag>
            </div>

            {/* Subject & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-surface">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">Subject</div>
                <div className="text-sm font-medium text-foreground">{selectedMessage.subject || <span className="text-muted italic">No subject</span>}</div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">Received</div>
                <div className="text-sm font-medium text-foreground flex items-center gap-1">
                  <ClockCircleOutlined className="text-muted" />
                  {selectedMessage.createdAt ? dayjs(selectedMessage.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="p-4 rounded-xl border border-border bg-surface">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">Message</div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap m-0">{selectedMessage.message}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-border">
              <CommonButton
                type="primary"
                icon={<MailOutlined />}
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                target="_blank"
                className="flex-1"
              >
                Reply via Email
              </CommonButton>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setIsViewDrawerOpen(false);
                  handleDeleteClick(selectedMessage);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </CommonDrawer>

      {/* Delete Confirmation Modal */}
      <CommonDeleteModal
        open={isDeleteModalOpen}
        title="Delete Message"
        itemName={msgToDelete?.name}
        loading={deleteMutation.isPending}
        onClose={() => { setIsDeleteModalOpen(false); setMsgToDelete(null); }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ContactPage;