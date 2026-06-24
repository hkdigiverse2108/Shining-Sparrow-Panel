import { type FC, useMemo, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from "@/Attribute";
import type { UserFormProps } from "@/Types";
import { EditUserSchema, UserSchema } from "@/Utils";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  IdcardOutlined, 
  BookOutlined, 
  LockOutlined
} from "@ant-design/icons";

// State master list of districts in Gujarat (since government API is offline or key-restricted)
const GUJARAT_DISTRICTS = [
  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", 
  "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhumi Dwarka", 
  "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", 
  "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", 
  "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", 
  "Tapi", "Vadodara", "Valsad"
];

export const UserForm: FC<UserFormProps> = ({ open, onClose, onSave, editingUser }) => {
  const defaults = { 
    fullName: "", 
    email: "", 
    password: "", 
    profilePhoto: "", 
    phoneNumber: "", 
    designation: "", 
    district: "",
    std: "",
    reachFrom: "",
    schoolName: "",
    address: ""
  };
  
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

  const [districts, setDistricts] = useState<string[]>(GUJARAT_DISTRICTS);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Try fetching district data from open data catalog dynamically as fallback
  useEffect(() => {
    setLoadingDistricts(true);
    fetch("https://raw.githubusercontent.com/somen-das/indian-states-and-districts-json/master/states-and-districts.json")
      .then(res => res.json())
      .then(data => {
        // Find Gujarat or default state records
        const gujState = data.states?.find((s: any) => s.state === "Gujarat");
        if (gujState && Array.isArray(gujState.districts)) {
          setDistricts(gujState.districts.sort());
        }
      })
      .catch(() => {
        // Fallback silently to static list on error
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
          description="Configure account details and academic information."
          onClose={onClose}
          closeLabel="Cancel"
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Account Profile">
              <CommonImageUpload name="profilePhoto" label="Profile Image" shape="circle" size={100} className="col-span-full" />
              <CommonValidationTextField name="fullName" label="Full Name" startIcon={<UserOutlined />} required />
              <CommonValidationTextField name="email" label="Email" startIcon={<MailOutlined />} required />
              <CommonValidationTextField name="phoneNumber" label="Phone Number" startIcon={<PhoneOutlined />} />
              <CommonValidationTextField name="designation" label="Designation" startIcon={<IdcardOutlined />} />
              
              {!editingUser && (
                <CommonValidationTextField name="password" label="Password" type="password" startIcon={<LockOutlined />} showPasswordToggle placeholder="Enter password" required />
              )}
            </CommonFormSection>

            <CommonFormSection title="Academic & Location details">
              <CommonValidationTextField name="schoolName" label="School Name" startIcon={<BookOutlined />} />
              <CommonValidationSelect 
                name="std" 
                label="Standard (Std)" 
                options={[
                  { label: "Standard 1", value: "standard 1" },
                  { label: "Standard 2", value: "standard 2" },
                  { label: "Standard 3", value: "standard 3" },
                  { label: "Standard 4", value: "standard 4" },
                  { label: "Standard 5", value: "standard 5" },
                  { label: "Standard 6", value: "standard 6" },
                  { label: "Standard 7", value: "standard 7" },
                  { label: "Standard 8", value: "standard 8" },
                  { label: "Standard 9", value: "standard 9" },
                  { label: "Standard 10", value: "standard 10" },
                  { label: "Adult Learner", value: "adult learner" }
                ]}
              />
              <CommonValidationSelect 
                name="district" 
                label="District (Gujarat)" 
                isLoading={loadingDistricts}
                showSearch={true}
                options={districts.map(d => ({ label: d, value: d }))} 
              />
              {editingUser && (
                <CommonValidationTextField name="address" label="Address" multiline rows={3} className="col-span-full" />
              )}
            </CommonFormSection>

            <CommonFormSection title="Referral Source">
              <CommonValidationSelect 
                name="reachFrom" 
                label="Referral Source (Reach From)" 
                options={[
                  { label: "Website", value: "website" },
                  { label: "Friend/Relative", value: "friend/relative" }
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