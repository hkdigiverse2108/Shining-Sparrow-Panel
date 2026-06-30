import { type FC, useMemo, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from "@/Attribute";
import type { UserFormProps } from "@/Types";
import { EditUserSchema, UserSchema } from "@/Utils";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, BookOutlined } from "@ant-design/icons";

export const UserForm: FC<UserFormProps> = ({ open, onClose, onSave, editingUser }) => {
  const defaults = { fullName: "", email: "", password: "", profilePhoto: "", phoneNumber: "", designation: "", district: "", std: "", reachFrom: "", schoolName: "", address: "" };
  
  const initialValues = useMemo(() => editingUser ? { 
    ...defaults, 
    ...(editingUser as any), 
    password: "",
    district: (editingUser as any).district || "",
    std: (editingUser as any).std || "",
    reachFrom: (editingUser as any).reachFrom || "",
    schoolName: (editingUser as any).schoolName || "",
    address: (editingUser as any).address || ""
  } : defaults, [editingUser]);

  const [districts, setDistricts] = useState<string[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  useEffect(() => {
    setLoadingDistricts(true);
    fetch("https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json")
      .then(res => res.json())
      .then(data => {
        const statesList = Array.isArray(data) ? data : (data?.states || []);
        if (Array.isArray(statesList)) {
          const allDistricts = statesList.reduce((acc: string[], stateObj: any) => {
            if (Array.isArray(stateObj.districts)) {
              acc.push(...stateObj.districts);
            }
            return acc;
          }, []);
          // Deduplicate and sort
          const sortedUnique = Array.from(new Set(allDistricts)).sort() as string[];
          setDistricts(sortedUnique);
        }
      })
      .catch(() => {
        // Fallback silently if offline or request fails
      })
      .finally(() => {
        setLoadingDistricts(false);
      });
  }, []);

  const validationSchema = editingUser ? EditUserSchema : UserSchema;

  const handleSubmit = (v: any) => {
    const payload: any = {};

    payload.fullName = v.fullName;
    payload.email = v.email;
    payload.phoneNumber = v.phoneNumber;
    payload.profilePhoto = v.profilePhoto;
    payload.designation = v.designation;
    payload.district = v.district;
    payload.std = v.std;
    payload.reachFrom = v.reachFrom;
    payload.schoolName = v.schoolName;

    if (editingUser) {
      payload.userId = (editingUser as any)._id || editingUser.id;
      // 'address' is only supported by editUserSchema on the backend, not addUserSchema
      payload.address = v.address;
    }

    onSave(payload);
  };

  if (!open) return null;

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {() => (
        <CommonFormShell title={editingUser ? "Edit User" : "Add User"} description="Configure account details and academic information." onClose={onClose} closeLabel="Cancel" >
          <Form className="course-form-shell">
            <CommonFormSection title="Account Profile">
              <CommonImageUpload name="profilePhoto" label="Profile Image" shape="circle" size={100} className="col-span-full" />
              <CommonValidationTextField name="fullName" label="Full Name" startIcon={<UserOutlined />} required />
              <CommonValidationTextField name="email" label="Email" startIcon={<MailOutlined />} required />
              <CommonValidationTextField name="phoneNumber" label="Phone Number" startIcon={<PhoneOutlined />} required />
              <CommonValidationTextField name="designation" label="Designation" startIcon={<IdcardOutlined />} />
              
            </CommonFormSection>

            <CommonFormSection title="Academic & Location details">
              <CommonValidationTextField name="schoolName" label="School Name" startIcon={<BookOutlined />} />
              <CommonValidationSelect 
                name="std" 
                label="Standard" 
                options={[
                  { label: "1st Standard", value: "1st Standard" },
                  { label: "2nd Standard", value: "2nd Standard" },
                  { label: "3rd Standard", value: "3rd Standard" },
                  { label: "4th Standard", value: "4th Standard" },
                  { label: "5th Standard", value: "5th Standard" },
                  { label: "6th Standard", value: "6th Standard" },
                  { label: "7th Standard", value: "7th Standard" },
                  { label: "8th Standard", value: "8th Standard" },
                  { label: "9th Standard", value: "9th Standard" },
                  { label: "10th Standard", value: "10th Standard" },
                  { label: "11th Standard", value: "11th Standard" },
                  { label: "12th Standard", value: "12th Standard" },
                  { label: "Adult Learner", value: "Adult Learner" }
                ]}
              />
              <CommonValidationSelect name="district" label="District" isLoading={loadingDistricts} showSearch={true} options={districts.map(d => ({ label: d, value: d }))} />
              {editingUser && (
                <CommonValidationTextField name="address" label="Address" multiline rows={3} className="col-span-full" />
              )}
            </CommonFormSection>

            <CommonFormSection title="Referral Source">
              <CommonValidationSelect 
                name="reachFrom" 
                label="Referral Source (Reach From)" 
                options={[
                  { label: "Instagram", value: "Instagram" },
                  { label: "Facebook", value: "Facebook" },
                  { label: "LinkedIn", value: "LinkedIn" },
                  { label: "Friends/relatives", value: "Friends/relatives" },
                  { label: "Webinars", value: "Webinars" },
                  { label: "Offline branch visit", value: "Offline branch visit" },
                  { label: "Web search", value: "Web search" },
                  { label: "Schools", value: "Schools" },
                  { label: "Others", value: "Others" }
                ]} 
              />
            </CommonFormSection>
            
            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editingUser ? "Update User" : "Create User"} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};