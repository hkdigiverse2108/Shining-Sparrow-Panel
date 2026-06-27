import React from 'react';
import { Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface CommonSimplePaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [
  { label: '10 / page', value: 10 },
  { label: '20 / page', value: 20 },
  { label: '50 / page', value: 50 },
  { label: '100 / page', value: 100 },
];

export const CommonSimplePagination: React.FC<CommonSimplePaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  className = '',
}) => {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  // Build visible page numbers: at most current-1, current, current+1 clamped to valid range
  const pages: number[] = [];
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.push(p);
  }

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onChange(page, pageSize);
  };

  return (
    <div className={`simple-pager ${className}`}>
      {/* Total */}
      <span className="simple-pager__total">{start}-{end} of {total} items</span>

      {/* Prev button */}
      <button
        className="simple-pager__btn"
        disabled={current <= 1}
        onClick={() => goTo(current - 1)}
        aria-label="Previous page"
      >
        <LeftOutlined />
      </button>

      {/* Page number buttons */}
      {pages.map((p) => (
        <button
          key={p}
          className={`simple-pager__btn simple-pager__btn--page ${p === current ? 'simple-pager__btn--active' : ''}`}
          onClick={() => goTo(p)}
          aria-current={p === current ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {/* Next button */}
      <button
        className="simple-pager__btn"
        disabled={current >= totalPages}
        onClick={() => goTo(current + 1)}
        aria-label="Next page"
      >
        <RightOutlined />
      </button>

      {/* Page size selector */}
      <Select
        value={pageSize}
        onChange={(val) => onChange(1, val)}
        options={PAGE_SIZE_OPTIONS}
        className="simple-pager__size-select"
        popupMatchSelectWidth={false}
      />
    </div>
  );
};
