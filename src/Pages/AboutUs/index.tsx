import { type FC, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Spin } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { BREADCRUMBS } from "@/Data";
import { KEYS } from "@/Constants";
import { CommonBreadcrumbs, CommonPageWrapper, CommonFormSection } from "@/Components";
import { CommonRichTextEditor, CommonButton } from "@/Attribute";
import { Mutations, Queries } from "@/Api";

const AboutUsSchema = Yup.object({
  aboutUs: Yup.string().required("About Us content is required"),
});

const AboutUs: FC = () => {
  const queryClient = useQueryClient();

  const { data: responseData, isLoading } = Queries.useGetAboutUs();
  const updateMutation = Mutations.useUpdateAboutUs();

  const existingAboutUs = responseData?.data?.aboutUs ?? "";

  const handleSubmit = (values: { aboutUs: string }, { setSubmitting }: any) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.ABOUT_US.BASE] });
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <CommonBreadcrumbs title="About Us" breadcrumbs={BREADCRUMBS.ABOUT_US.BASE} />
        <CommonPageWrapper>
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        </CommonPageWrapper>
      </>
    );
  }

  return (
    <>
      <CommonBreadcrumbs title="About Us" breadcrumbs={BREADCRUMBS.ABOUT_US.BASE} />
      <CommonPageWrapper>
        <div className="course-container course-container--narrow">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">About Us</h1>
            <p className="text-text-muted mt-1">
              Edit the content displayed in the About Us section of your application.
            </p>
          </div>

          <Formik
            enableReinitialize
            initialValues={{ aboutUs: existingAboutUs }}
            validationSchema={AboutUsSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <CommonFormSection title="About Us Content">
                  <CommonRichTextEditor
                    name="aboutUs"
                    label="Content"
                    required
                    value={values.aboutUs}
                    onChange={(val) => setFieldValue("aboutUs", val)}
                    className="col-span-full"
                    placeholder="Write about your organization, mission, and values..."
                  />
                </CommonFormSection>

                <div className="course-form-actions mt-6">
                  <CommonButton
                    htmlType="submit"
                    type="primary"
                    title="Save Changes"
                    icon={<SaveOutlined />}
                    loading={isSubmitting || updateMutation.isPending}
                    className="course-button course-button--primary"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default AboutUs;
