import { useMemo, type FC } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Tag, Button, Divider, Spin, Card, Row, Col } from 'antd';
import { 
  BookOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  PhoneOutlined,
  TransactionOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  ClockCircleOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { motion } from 'motion/react';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries } from '@/Api';
import { ROUTES } from '@/Constants';
import { generateInvoiceHTML } from '@/Utils/invoiceTemplate';
import dayjs from 'dayjs';

const PaymentDetails: FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isCourse = type === 'course';

  // Retrieve record from router navigation state if available
  const stateRecord = location.state?.record;

  // Fallback query if page was reloaded directly
  const { data: coursesRes, isLoading: coursesLoading } = Queries.useGetMyCourses(
    { limit: 1000 },
    { enabled: !stateRecord && isCourse }
  );

  const { data: workshopsRes, isLoading: workshopsLoading } = Queries.useGetMyWorkshops(
    { limit: 1000 },
    { enabled: !stateRecord && !isCourse }
  );

  const record = useMemo(() => {
    if (stateRecord) return stateRecord;
    
    if (isCourse) {
      const list = coursesRes?.data?.purchased_course_data || [];
      return list.find((item: any) => item._id === id);
    } else {
      const list = workshopsRes?.data?.purchased_workshop_data || [];
      return list.find((item: any) => item._id === id);
    }
  }, [stateRecord, isCourse, coursesRes, workshopsRes, id]);

  const isLoading = !stateRecord && (isCourse ? coursesLoading : workshopsLoading);

  // Status tag renderer
  const renderStatus = (status: string) => {
    const s = String(status).toLowerCase();
    if (s === 'completed' || s === 'success') {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success" className="rounded-full px-3 py-0.5 m-0 capitalize font-semibold">
          Completed
        </Tag>
      );
    }
    if (s === 'pending') {
      return (
        <Tag icon={<SyncOutlined spin />} color="warning" className="rounded-full px-3 py-0.5 m-0 capitalize font-semibold">
          Pending
        </Tag>
      );
    }
    return (
      <Tag icon={<CloseCircleOutlined />} color="error" className="rounded-full px-3 py-0.5 m-0 capitalize font-semibold">
        Failed
      </Tag>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return;
    }

    const htmlContent = generateInvoiceHTML({
      type: isCourse ? 'course' : 'workshop',
      productName: isCourse ? (product?.name || 'Unknown Course') : (product?.title || 'Unknown Workshop'),
      studentName: user?.fullName || 'Unknown User',
      studentEmail: user?.email || 'N/A',
      studentPhone: user?.phoneNumber || 'N/A',
      orderId: isCourse ? (record.razorpayOrderId || 'N/A') : (record.receiptNumber || 'N/A'),
      paymentId: isCourse ? (record.razorpayPaymentId || 'N/A') : (record.paymentId || 'N/A'),
      originalPrice: product?.price || finalAmount,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      status: record.paymentStatus || 'pending',
      date: transactionDate || new Date().toISOString(),
    });

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <Spin size="large" tip="Loading transaction summary..." />
      </div>
    );
  }

  if (!record) {
    return (
      <>
        <CommonBreadcrumbs title="Payment Details" breadcrumbs={BREADCRUMBS.PAYMENTS?.DETAILS || []} />
        <CommonPageWrapper className="h-full bg-transparent p-6">
          <Card className="text-center rounded-2xl border-border py-12">
            <h3 className="text-lg font-bold text-foreground mb-2">Transaction Not Found</h3>
            <p className="text-text-muted mb-6 text-sm">We couldn't locate this transaction record in the system.</p>
            <Button type="primary" onClick={() => navigate(ROUTES.PAYMENTS)} icon={<ArrowLeftOutlined />}>
              Back to Payments
            </Button>
          </Card>
        </CommonPageWrapper>
      </>
    );
  }

  // Common metadata resolve
  const finalAmount = isCourse 
    ? (record.courseId?.price || 0) 
    : (record.finalAmount ?? record.amount ?? 0);

  const transactionDate = isCourse 
    ? record.purchaseDate 
    : (record.transactionDate || record.createdAt);

  const discountAmount = !isCourse ? (record.discountAmount || 0) : 0;
  const user = record.userId;
  const product = isCourse ? record.courseId : record.workshopId;

  return (
    <>
      <div className="print:hidden">
        <CommonBreadcrumbs title="Payment Details" breadcrumbs={BREADCRUMBS.PAYMENTS?.DETAILS || []} />
      </div>
      <CommonPageWrapper noPadding className="h-full bg-transparent">
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="visible" 
          className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto"
        >
          {/* Action Header */}
          <div className="flex items-center justify-between border-b border-border/65 pb-4 print:hidden">
            <Button 
              type="text" 
              onClick={() => navigate(ROUTES.PAYMENTS)} 
              icon={<ArrowLeftOutlined />}
              className="hover:bg-muted text-foreground font-medium flex items-center gap-1.5"
            >
              Back to Payments
            </Button>
            <Button 
              type="default" 
              onClick={handlePrint} 
              icon={<PrinterOutlined />}
              className="hover:border-primary hover:text-primary transition-all duration-200"
            >
              Print Receipt
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {/* Left/Main Column - Receipt Details */}
            <Col xs={24} lg={16} className="space-y-6">
              
              {/* 1. Transaction Summary & Status */}
              <motion.div variants={blurRevealUp}>
                <Card className="rounded-2xl border-border bg-surface shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-primary bg-primary-soft text-xl border border-primary/10">
                        <TransactionOutlined />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg leading-tight">Transaction Summary</h3>
                        <p className="text-xs text-text-muted">
                          Date: {transactionDate ? dayjs(transactionDate).format('DD-MM-YYYY hh:mm A') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-muted">Status:</span>
                      {renderStatus(record.paymentStatus)}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-surface-muted border border-border/80 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Final Amount Paid</span>
                    <span className="text-4xl font-black text-foreground">
                      ₹{finalAmount.toLocaleString()}
                    </span>
                    {discountAmount > 0 && (
                      <span className="text-xs text-rose-500 font-semibold mt-1">
                        Discount Applied: -₹{discountAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* 2. Customer Information */}
              <motion.div variants={blurRevealUp}>
                <Card className="rounded-2xl border-border bg-surface shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2 border-b border-border pb-2">
                    <UserOutlined className="text-primary" /> Customer Profile
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Avatar 
                      size={64} 
                      src={user?.profilePhoto || undefined} 
                      icon={<UserOutlined />} 
                      className="bg-primary-soft text-primary shadow-sm border border-primary/10 shrink-0 text-2xl"
                    />
                    <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                      <h4 className="font-bold text-foreground text-base leading-snug">{user?.fullName || 'Unknown User'}</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-muted">
                          <MailOutlined className="text-primary/70 shrink-0" />
                          <span className="truncate">{user?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-muted">
                          <PhoneOutlined className="text-primary/70 shrink-0" />
                          <span>{user?.phoneNumber || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* 3. Product Details */}
              <motion.div variants={blurRevealUp}>
                <Card className="rounded-2xl border-border bg-surface shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2 border-b border-border pb-2">
                    <InfoCircleOutlined className="text-primary" /> Purchased Content
                  </h4>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Avatar 
                      shape="square" 
                      size={60} 
                      src={product?.image || undefined} 
                      icon={isCourse ? <BookOutlined /> : <CalendarOutlined />} 
                      className="bg-primary-soft text-primary rounded-xl border border-primary/10 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-foreground text-sm leading-snug">
                          {isCourse ? product?.name : product?.title}
                        </h4>
                        <Tag color={isCourse ? "blue" : "orange"} className="rounded-full px-2 py-0 text-[10px] uppercase font-bold m-0">
                          {isCourse ? "Course" : "Workshop"}
                        </Tag>
                      </div>
                      
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                        {isCourse ? product?.description : (product?.subTitle || 'No sub-title available')}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

            </Col>

            {/* Right Column - Gateway Details */}
            <Col xs={24} lg={8}>
              <motion.div variants={blurRevealUp} className="h-full">
                <Card className="rounded-2xl border-border bg-surface shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8" />
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-6 flex items-center gap-2 border-b border-border pb-2">
                      <CreditCardOutlined className="text-primary" /> Gateway & Transaction Breakout
                    </h4>

                    <div className="space-y-4">
                      {isCourse ? (
                        <>
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Razorpay Payment ID</span>
                            <span className="font-mono text-xs font-semibold text-foreground bg-surface-muted px-2.5 py-1.5 rounded-lg border border-border/60 break-all select-all">
                              {record.razorpayPaymentId || 'N/A'}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Razorpay Order ID</span>
                            <span className="font-mono text-xs font-semibold text-foreground bg-surface-muted px-2.5 py-1.5 rounded-lg border border-border/60 break-all select-all">
                              {record.razorpayOrderId || 'N/A'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm border-t border-border pt-4">
                            <span className="text-text-muted flex items-center gap-1.5">
                              <ClockCircleOutlined className="text-primary/70" /> Access Expiry
                            </span>
                            <span className="font-bold text-foreground">
                              {record.accessExpiryDate 
                                ? dayjs(record.accessExpiryDate).format('DD-MM-YYYY') 
                                : 'Lifetime Access'
                              }
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Transaction ID</span>
                            <span className="font-mono text-xs font-semibold text-foreground bg-surface-muted px-2.5 py-1.5 rounded-lg border border-border/60 break-all select-all">
                              {record.paymentId || 'N/A'}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Receipt Number</span>
                            <span className="font-mono text-xs font-semibold text-foreground bg-surface-muted px-2.5 py-1.5 rounded-lg border border-border/60 break-all select-all">
                              {record.receiptNumber || 'N/A'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm border-t border-border pt-4">
                            <span className="text-text-muted">Payment Method</span>
                            <span className="font-semibold text-foreground capitalize bg-primary-soft text-primary px-2.5 py-0.5 rounded-full text-xs">
                              {record.paymentMethod || 'N/A'}
                            </span>
                          </div>
                        </>
                      )}

                      <Divider className="my-4 border-border/40" />

                      <div className="space-y-2 text-sm pt-2">
                        <div className="flex justify-between text-text-muted">
                          <span>Base Price</span>
                          <span>₹{(product?.price || finalAmount).toLocaleString()}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-rose-500 font-medium">
                            <span>Discount Code Applied</span>
                            <span>-₹{discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-foreground font-bold border-t border-border pt-2 text-base">
                          <span>Total Charge</span>
                          <span className="text-primary">₹{finalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-8 text-center text-[10px] text-text-muted border-t border-border/40 pt-4 flex flex-col items-center gap-1">
                    <span className="font-semibold">Shining Sparrow Admin Console</span>
                    <span>For assistance, contact technical support.</span>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>

        </motion.div>
      </CommonPageWrapper>
    </>
  );
};

export default PaymentDetails;
