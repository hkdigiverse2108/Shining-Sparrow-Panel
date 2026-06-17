import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { CommonFormModalProps } from '@/Types';

const CommonFormModal: React.FC<CommonFormModalProps> = ({ open, onCancel, onSubmit, title, okText, fields, initialValues }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);
  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit(values);
    });
  };

  return (
    <Modal title={title} open={open} onOk={handleOk} onCancel={onCancel} okText={okText} destroyOnHidden centered bodyStyle={{ overflow: 'hidden' }} >
      <Form form={form} layout="vertical" className="mt-4">
        {fields.map(field => (
          <Form.Item key={Array.isArray(field.name) ? field.name.join('.') : field.name} name={field.name} label={field.label} rules={field.rules} >
            {field.type === 'textarea' ? (
              <Input.TextArea rows={4} placeholder={field.placeholder} />
            ) : (
              <Input placeholder={field.placeholder} />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default CommonFormModal;