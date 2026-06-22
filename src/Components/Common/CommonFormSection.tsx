import { type FC, type ReactNode } from "react";

interface CommonFormSectionProps {
  title?: string;
  children: ReactNode;
}

export const CommonFormSection: FC<CommonFormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6 last:mb-0">
      {title && (
        <div className="mb-4 border-b border-border pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
            {title}
          </h3>
        </div>
      )}
      
      {/* Responsive grid applied automatically */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0">
        {children}
      </div>
    </div>
  );
};