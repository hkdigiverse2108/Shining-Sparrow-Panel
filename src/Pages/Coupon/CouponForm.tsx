import { type FC, useMemo, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect, CommonDatePicker } from "@/Attribute";
import { Select } from "antd";
import dayjs from "dayjs";

interface CouponFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  editing: any | null;
  loading?: boolean;
  courses: { value: string; label: string }[];
  workshops: { value: string; label: string }[];
}

import { CouponCodeSchema } from "@/Utils";

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed Amount (₹)", value: "flat" },
];

const APPLIES_TO_OPTIONS = [
  { label: "All (Default)", value: "default" },
  { label: "Specific Course", value: "course" },
  { label: "Specific Workshop", value: "workshop" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Expired", value: "expired" },
];

const AppliesToWatcher: FC<{ appliesTo: string; setFieldValue: (field: string, value: any) => void }> = ({ appliesTo, setFieldValue }) => {
  const prevAppliesTo = useRef(appliesTo);
  useEffect(() => {
    if (prevAppliesTo.current !== appliesTo) {
      setFieldValue("specificIds", []);
      prevAppliesTo.current = appliesTo;
    }
  }, [appliesTo, setFieldValue]);
  return null;
};

export const CouponForm: FC<CouponFormProps> = ({ 
  open, 
  onClose, 
  onSave, 
  editing, 
  loading = false,
  courses,
  workshops
}) => {
  const defaults = { 
    title: "", 
    code: "", 
    discountType: "percentage", 
    discountValue: "", 
    minOrderAmount: 0, 
    maxDiscountAmount: "", 
    startDate: "", 
    endDate: "", 
    usageLimit: "", 
    appliesTo: "default", 
    specificIds: [],
    status: "active",
  };

  const initialValues = useMemo(() => {
    if (editing) {
      return {
        ...defaults,
        ...editing,
        discountValue: editing.discountValue ?? "",
        minOrderAmount: editing.minOrderAmount ?? 0,
        maxDiscountAmount: editing.maxDiscountAmount ?? "",
        usageLimit: editing.usageLimit ?? "",
        specificIds: editing.specificIds || [],
        startDate: editing.startDate ? dayjs(editing.startDate).format("MMM DD, YYYY") : "",
        endDate: editing.endDate ? dayjs(editing.endDate).format("MMM DD, YYYY") : "",
      };
    }
    return defaults;
  }, [editing]);

  if (!open) return null;

  const handleSubmit = (v: any) => {
    const payload: any = {
      title: v.title,
      code: v.code.toUpperCase(),
      discountType: v.discountType,
      discountValue: Number(v.discountValue),
      minOrderAmount: Number(v.minOrderAmount || 0),
      startDate: v.startDate ? dayjs(v.startDate).startOf('day').toISOString() : undefined,
      endDate: v.endDate ? dayjs(v.endDate).endOf('day').toISOString() : undefined,
      usageLimit: v.usageLimit ? Number(v.usageLimit) : null,
      appliesTo: v.appliesTo,
      specificIds: v.appliesTo === "default" ? [] : v.specificIds || [],
      status: v.status,
    };

    if (v.maxDiscountAmount !== "" && v.maxDiscountAmount !== null && v.maxDiscountAmount !== undefined) {
      payload.maxDiscountAmount = Number(v.maxDiscountAmount);
    }

    if (editing) {
      payload.couponCodeId = editing._id;
    }
    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={CouponCodeSchema} onSubmit={handleSubmit}>
      {({ setFieldValue, values }) => (
        <CommonFormShell 
          title={editing ? "Edit Coupon Code" : "Create Coupon Code"} 
          description="Setup promotional discount codes, validity periods, and applicability targets." 
          onClose={onClose} 
          closeLabel="Cancel"
        >
          <Form className="course-form-shell space-y-6">
            <CommonFormSection title="General Information">
              <CommonValidationTextField name="title" label="Promotion Title" required placeholder="e.g. Monsoon Special Offer" />
              <CommonValidationTextField name="code" label="Coupon Code" required placeholder="e.g. MONSOON50" />
              <CommonValidationSelect name="status" label="Status" options={STATUS_OPTIONS} required />
            </CommonFormSection>

            <CommonFormSection title="Discount Rules">
              <CommonValidationSelect name="discountType" label="Discount Type" options={DISCOUNT_TYPE_OPTIONS} required />
              <CommonValidationTextField name="discountValue" label="Discount Value" type="number" required placeholder={values.discountType === "percentage" ? "e.g. 15 (%)" : "e.g. 199 (₹)"} />
              <CommonValidationTextField name="minOrderAmount" label="Minimum Cart Amount (₹)" type="number" placeholder="e.g. 499" />
              {values.discountType === "percentage" && (
                <CommonValidationTextField name="maxDiscountAmount" label="Maximum Discount (₹)" type="number" placeholder="e.g. 500 (Optional)" />
              )}
            </CommonFormSection>

            <CommonFormSection title="Validity & Limits">
              <CommonDatePicker name="startDate" label="Start Date" required placeholder="Select start date" />
              <CommonDatePicker name="endDate" label="End Date" required placeholder="Select end date" />
              <CommonValidationTextField name="usageLimit" label="Total Usage Limit (Times)" type="number" required placeholder="e.g. 100" />
            </CommonFormSection>

            <CommonFormSection title="Applicability Target">
              <AppliesToWatcher appliesTo={values.appliesTo} setFieldValue={setFieldValue} />
              <CommonValidationSelect 
                name="appliesTo" 
                label="Applies To" 
                options={APPLIES_TO_OPTIONS} 
                required 
              />

              {values.appliesTo !== "default" && (
                <div className="col-span-full">
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">
                    Select {values.appliesTo === "course" ? "Courses" : "Workshops"}
                  </label>
                  <Select
                    mode="multiple"
                    value={values.specificIds}
                    onChange={(val) => setFieldValue("specificIds", val)}
                    options={values.appliesTo === "course" ? courses : workshops}
                    className="w-full"
                    placeholder={`Select specific ${values.appliesTo === "course" ? "courses" : "workshops"}`}
                    size="large"
                    filterOption={(input, option) =>
                      (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </div>
              )}
            </CommonFormSection>



            <div className="course-form-actions">
              <CommonButton 
                htmlType="submit" 
                type="primary" 
                title={editing ? "Update Coupon" : "Publish Coupon"} 
                loading={loading} 
                block 
                className="course-button course-button--primary" 
              />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
