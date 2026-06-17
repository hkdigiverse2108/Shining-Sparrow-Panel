import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import dayjs from "dayjs";
import { genderOptions, permissionOptions, roleOptions, statusOptions } from "@/Data";
import { CommonDrawer, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from "@/Attribute";
import type { UserDrawerProps } from "@/Types";
import { EditUserSchema, UserSchema } from "@/Utils";

export const UserDrawer: FC<UserDrawerProps> = ({ open, onClose, onSave, editingUser }) => {
  const defaults = { username: "", email: "", password: "", profileImage: "", role: "", status: "", phone: "", gender: "", dateOfBirth: "", address: "", permissions: [] as string[] };
  
  const initialValues = useMemo(() => editingUser ? { ...defaults, ...editingUser, password: "" } : defaults, [editingUser]);

  // Select the correct schema based on whether we are editing or adding
  const validationSchema = editingUser ? EditUserSchema : UserSchema;

  const handleSubmit = (v: any) => {
    const payload = { ...editingUser, ...v, dateOfBirth: v.dateOfBirth ? dayjs(v.dateOfBirth).format("YYYY-MM-DD") : undefined, createdAt: editingUser?.createdAt || new Date().toISOString() };
    if (editingUser && !payload.password) delete payload.password;
    onSave(payload);
  };

  return (
    <CommonDrawer title={editingUser ? "Edit User" : "Add User"} open={open} onClose={onClose}>
      <Formik 
        enableReinitialize 
        initialValues={initialValues} 
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <CommonImageUpload name="profileImage" label="Profile Image" shape="circle" size={100} />
            
            <CommonFormSection title="Account Details">
              <CommonValidationTextField name="username" label="Username" />
              <CommonValidationTextField name="email" label="Email" />
              <CommonValidationTextField 
                name="password" 
                label="Password" 
                type="password" 
                showPasswordToggle 
                placeholder={editingUser ? "Leave blank to keep unchanged" : "Enter password"} 
                required={!editingUser} 
              />
            </CommonFormSection>
            
            <CommonFormSection title="Access & Status">
              <CommonValidationSelect name="role" label="Role" options={roleOptions.filter(o => o.value !== "all")}  />
              <CommonValidationSelect name="status" label="Status" options={statusOptions.filter(o => o.value !== "all")} />    
              <CommonValidationSelect name="permissions" label="Permissions" multiple options={permissionOptions} fullWidth maxTagCount={3} />
            </CommonFormSection>
            
            <CommonFormSection title="Personal Information">
              <CommonValidationTextField name="phone" label="Phone" />
              <CommonValidationSelect name="gender" label="Gender" options={genderOptions} />
              <CommonValidationTextField name="address" label="Address" />
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