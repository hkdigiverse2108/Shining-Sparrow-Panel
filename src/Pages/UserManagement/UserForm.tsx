import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from "@/Attribute";
import type { UserFormProps } from "@/Types";
import { EditUserSchema, UserSchema } from "@/Utils";

export const UserForm: FC<UserFormProps> = ({ open, onClose, onSave, editingUser }) => {
  const defaults = { 
    fullName: "", 
    email: "", 
    password: "", 
    profilePhoto: "", 
    isBlocked: "false", 
    phoneNumber: "", 
    designation: "", 
    isEmailVerified: "false",
    district: "",
    std: "",
    reachFrom: "",
    schoolName: "",
    referralCode: ""
  };
  
  const initialValues = useMemo(() => editingUser ? { 
    ...defaults, 
    ...(editingUser as any), 
    password: "",
    isBlocked: String(editingUser.isBlocked || false),
    isEmailVerified: String(editingUser.isEmailVerified || false),
    district: (editingUser as any).district || "",
    std: (editingUser as any).std || "",
    reachFrom: (editingUser as any).reachFrom || "",
    schoolName: (editingUser as any).schoolName || "",
    referralCode: (editingUser as any).referralCode || ""
  } : defaults, [editingUser]);

  const validationSchema = editingUser ? EditUserSchema : UserSchema;

  const handleSubmit = (v: any) => {
    const payload: any = {};

    payload.fullName = v.fullName;
    payload.email = v.email;
    payload.phoneNumber = v.phoneNumber;
    payload.profilePhoto = v.profilePhoto;
    payload.isBlocked = v.isBlocked === "true";
    payload.designation = v.designation;
    payload.isEmailVerified = v.isEmailVerified === "true";
    payload.district = v.district;
    payload.std = v.std;
    payload.reachFrom = v.reachFrom;
    payload.schoolName = v.schoolName;
    payload.referralCode = v.referralCode;

    if (editingUser) {
      payload.userId = (editingUser as any)._id || editingUser.id; 
    } else {
      payload.password = v.password;
    }

    onSave(payload);
  };

  if (!open) return null;

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {() => (
        <CommonFormShell
          title={editingUser ? "Edit User" : "Add User"}
          description="Configure account details, designation, and status permissions."
          onClose={onClose}
          closeLabel="Cancel"
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Account Profile">
              <CommonImageUpload name="profilePhoto" label="Profile Image" shape="circle" size={100} className="col-span-full" />
              <CommonValidationTextField name="fullName" label="Full Name" required />
              <CommonValidationTextField name="email" label="Email" required />
              <CommonValidationTextField name="phoneNumber" label="Phone Number" />
              <CommonValidationTextField name="designation" label="Designation" />
              
              {!editingUser && (
                <CommonValidationTextField name="password" label="Password" type="password" showPasswordToggle placeholder="Enter password" required />
              )}
            </CommonFormSection>

            <CommonFormSection title="Academic & Referral Details">
              <CommonValidationTextField name="schoolName" label="School Name" />
              <CommonValidationTextField name="std" label="Standard (Std)" />
              <CommonValidationTextField name="district" label="District" />
              <CommonValidationTextField name="reachFrom" label="Referral Source (Reach From)" />
              <CommonValidationTextField name="referralCode" label="Referral Code" />
            </CommonFormSection>
            
            <CommonFormSection title="Access & Status">
              <CommonValidationSelect name="isBlocked" label="Blocked Status" options={[ { label: "Active", value: "false" }, { label: "Blocked", value: "true" } ]} />    
              <CommonValidationSelect name="isEmailVerified" label="Email Verified" options={[ { label: "Verified", value: "true" }, { label: "Not Verified", value: "false" } ]} />    
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