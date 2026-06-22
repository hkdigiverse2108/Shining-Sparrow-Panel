import { type FC } from "react";
import type { CommonFormShellProps } from "@/Types";
import { CommonButton } from "@/Attribute";

export const CommonFormShell: FC<CommonFormShellProps> = ({
  title,
  description,
  children,
  footer,
  onClose,
  closeLabel = "Close",
  className = "",
}) => {
  return (
    <section className={`course-form-panel ${className}`.trim()}>
      <div className="course-form-panel__header">
        <div className="course-form-panel__heading">
          <h2 className="course-form-title">{title}</h2>
          {description && <p className="course-form-subtitle">{description}</p>}
        </div>
        {onClose && (
          <CommonButton
            type="text"
            onClick={onClose}
            title={closeLabel}
            className="course-button course-button--ghost course-button--compact"
          />
        )}
      </div>

      <div className="course-form-panel__body">{children}</div>

      {footer && <div className="course-form-panel__footer">{footer}</div>}
    </section>
  );
};
