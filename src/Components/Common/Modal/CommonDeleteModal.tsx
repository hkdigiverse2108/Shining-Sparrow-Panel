import { type FC } from "react";
import { CommonButton } from "@/Attribute";
import type { CommonDeleteModalProps } from "@/Types";
import CommonModal from "./CommonModal";

const CommonDeleteModal: FC<CommonDeleteModalProps> = ({ open, title, description, itemName, loading = false, onClose, onConfirm }) => {
  return (
    <CommonModal title={title || "Confirm Delete"} isOpen={open} onClose={onClose} className="max-w-125">
      <p className="mt-3 mb-10 text-foreground">
        {description || "Are you sure you want to delete"}
        {itemName && <span className="font-medium"> "{itemName}"</span>}?
      </p>

      <div className="flex justify-end gap-2">
        <CommonButton variant="outlined" onClick={onClose}>
          Cancel
        </CommonButton>

        <CommonButton 
          variant="solid" 
          danger 
          onClick={onConfirm} 
          loading={loading}
          // Forcing the button to use your CSS variables for danger states
          className="!bg-danger hover:!bg-danger-dark !text-white !border-danger"
        >
          Yes, Delete It!
        </CommonButton>
      </div>
    </CommonModal>
  );
};

export default CommonDeleteModal;