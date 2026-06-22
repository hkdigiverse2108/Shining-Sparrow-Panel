import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonDrawer, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from "@/Attribute";
import type { UserFormProps } from "@/Types";
import { EditUserSchema, UserSchema } from "@/Utils";

export const UserForm: FC<UserFormProps> = ({ open, onClose, onSave, editingUser }) => {
  const defaults = { fullName: "", email: "", password: "", profilePhoto: "", isBlocked: "false", phoneNumber: "", designation: "", isEmailVerified: "false" };
  
  const initialValues = useMemo(() => editingUser ? { 
    ...defaults, 
    ...editingUser, 
    password: "",
    isBlocked: String(editingUser.isBlocked || false),
    isEmailVerified: String(editingUser.isEmailVerified || false)
  } : defaults, [editingUser]);

  const validationSchema = editingUser ? EditUserSchema : UserSchema;

  const handleSubmit = (v: any) => {
    const payload: any = {};

    if (editingUser) {
      payload.userId = editingUser.id; 
      payload.fullName = v.fullName;
      payload.email = v.email;
      payload.phoneNumber = v.phoneNumber;
      payload.profilePhoto = v.profilePhoto;
      payload.isBlocked = v.isBlocked === "true";
      payload.designation = v.designation;
      payload.isEmailVerified = v.isEmailVerified === "true";
    } else {
      payload.fullName = v.fullName;
      payload.email = v.email;
      payload.phoneNumber = v.phoneNumber;
      payload.password = v.password;
      payload.profilePhoto = v.profilePhoto;
      payload.isBlocked = v.isBlocked === "true";
      payload.designation = v.designation;
      payload.isEmailVerified = v.isEmailVerified === "true";
    }

    onSave(payload);
  };

  return (
    <CommonDrawer title={editingUser ? "Edit User" : "Add User"} open={open} onClose={onClose}>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <CommonImageUpload name="profilePhoto" label="Profile Image" shape="circle" size={100} />
            
            <CommonFormSection title="Account Details">
              <CommonValidationTextField name="fullName" label="Full Name" />
              <CommonValidationTextField name="email" label="Email" />
              <CommonValidationTextField name="phoneNumber" label="Phone Number" />
              <CommonValidationTextField name="designation" label="Designation" />
              
              {!editingUser && (
                <CommonValidationTextField name="password" label="Password" type="password" showPasswordToggle placeholder="Enter password" required />
              )}
            </CommonFormSection>
            
            <CommonFormSection title="Access & Status">
              <CommonValidationSelect name="isBlocked" label="Blocked Status" options={[ { label: "Active", value: "false" }, { label: "Blocked", value: "true" } ]} />    
              <CommonValidationSelect name="isEmailVerified" label="Email Verified" options={[ { label: "Verified", value: "true" }, { label: "Not Verified", value: "false" } ]} />    
            </CommonFormSection>
            
            <div className="user-drawer-footer">
              <CommonButton htmlType="submit" type="primary" title={editingUser ? "Update User" : "Create User"} block />
            </div>
          </Form>
        )}
      </Formik>
    </CommonDrawer>
  );
};