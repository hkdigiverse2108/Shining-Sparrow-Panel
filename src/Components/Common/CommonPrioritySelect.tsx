import React, { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { Select } from 'antd';

interface CommonPrioritySelectProps {
  name: string;
  label: string;
  usedPriorities: number[];
  editingId?: string | null;
  editingPriority?: number | string;
  required?: boolean;
}

export const CommonPrioritySelect: React.FC<CommonPrioritySelectProps> = ({
  name,
  label,
  usedPriorities = [],
  editingId = null,
  editingPriority = '',
  required = false,
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();

  // Determine max priority to display (e.g. max used + 1, or at least 5 for empty lists)
  const maxUsed = usedPriorities.length > 0 ? Math.max(...usedPriorities) : 0;
  const totalOptions = Math.max(maxUsed + 1, 5);

  const options = useMemo(() => {
    const opts = [];
    const usedSet = new Set(usedPriorities.map(Number));

    // If editing, allow selection of its current priority
    if (editingId && editingPriority !== undefined && editingPriority !== '') {
      usedSet.delete(Number(editingPriority));
    }

    for (let i = 1; i <= totalOptions; i++) {
      const isUsed = usedSet.has(i);
      opts.push({
        label: `${i}${isUsed ? ' (Already Used)' : ''}`,
        value: i,
        disabled: isUsed,
      });
    }
    return opts;
  }, [usedPriorities, editingId, editingPriority, totalOptions]);

  // Set default priority for new items if not already set
  React.useEffect(() => {
    if (!editingId && (values[name] === undefined || values[name] === null || values[name] === '')) {
      // Find first unused priority
      const usedSet = new Set(usedPriorities.map(Number));
      let nextPriority = 1;
      while (usedSet.has(nextPriority)) {
        nextPriority++;
      }
      setFieldValue(name, nextPriority);
    }
  }, [editingId, name, usedPriorities, setFieldValue, values]);

  const hasError = touched[name] && errors[name];

  return (
    <div className={`form-group flex flex-col gap-1.5 ${hasError ? 'has-error' : ''}`}>
      <label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <Select
        id={name}
        value={values[name] ? Number(values[name]) : undefined}
        onChange={(val) => setFieldValue(name, val)}
        options={options}
        className="w-full h-10"
        placeholder="Select priority"
      />
      {hasError && (
        <span className="text-xs text-danger mt-0.5">{String(errors[name])}</span>
      )}
    </div>
  );
};
