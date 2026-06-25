import { useState, useEffect, type FC } from 'react';
import { Tabs, Card, Spin } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { CommonRichTextEditor, CommonButton } from '@/Attribute';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/Constants';

const LegalitySchema = Yup.object({
  content: Yup.string().required('Content is required'),
});

const LegalityPage: FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'privacyPolicy' | 'termsCondition' | 'refundPolicy'>('privacyPolicy');

  // Fetch legality content for active tab
  const { data: legalityRes, isLoading, isFetching } = Queries.useGetLegalityByType(activeTab);
  
  const saveMutation = Mutations.useAddLegality();

  const handleSave = (values: { content: string }, { setSubmitting }: any) => {
    saveMutation.mutate(
      {
        type: activeTab,
        content: values.content,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.LEGALITY.BASE] });
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        },
      }
    );
  };

  const legalityData = legalityRes?.data || null;

  return (
    <>
      <CommonBreadcrumbs title="Privacy & Terms" breadcrumbs={BREADCRUMBS.LEGALITY.BASE} />
      <CommonPageWrapper>
        <Card className="shadow-sm rounded-2xl border-border bg-surface">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as any)}
            className="modern-tabs"
            items={[
              {
                key: 'privacyPolicy',
                label: 'Privacy Policy',
              },
              {
                key: 'termsCondition',
                label: 'Terms & Conditions',
              },
              {
                key: 'refundPolicy',
                label: 'Refund Policy',
              },
            ]}
          />

          <div className="mt-6 relative">
            {isLoading || isFetching ? (
              <div className="flex justify-center items-center py-20 min-h-[300px]">
                <Spin size="large" tip="Loading legal document..." />
              </div>
            ) : (
              <Formik
                enableReinitialize
                initialValues={{
                  content: legalityData?.content || '',
                }}
                validationSchema={LegalitySchema}
                onSubmit={handleSave}
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form className="space-y-6">
                    <div className="rounded-xl overflow-hidden">
                      <CommonRichTextEditor
                        name="content"
                        label={`Edit ${activeTab === 'privacyPolicy' ? 'Privacy Policy' : activeTab === 'termsCondition' ? 'Terms & Conditions' : 'Refund Policy'} Content`}
                        required
                        placeholder="Write the legality documentation here..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                      <CommonButton
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting || saveMutation.isPending}
                        disabled={!isValid || !dirty}
                        title="Save Changes"
                        icon={<FileProtectOutlined />}
                        className="course-button course-button--primary"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </Card>
      </CommonPageWrapper>
    </>
  );
};

export default LegalityPage;
