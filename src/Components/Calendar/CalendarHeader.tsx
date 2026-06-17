import { type FC } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { CalendarHeaderProps } from "@/Types";

const CalendarHeader: FC<CalendarHeaderProps> = ({ viewMode, setViewMode, selectedDate, onNavigate }) => {
  const title = viewMode === "year" 
    ? selectedDate.year() 
    : viewMode === "day" 
      ? selectedDate.format("MMMM D, YYYY") 
      : selectedDate.format("MMMM YYYY");

  return (
    <div className="calendar-custom-header">
      <div className="calendar-header-nav">
        <button className="calendar-header-btn" onClick={() => onNavigate("prev")}>
          <LeftOutlined />
        </button>
        <span className="calendar-header-title">{title}</span>
        <button className="calendar-header-btn" onClick={() => onNavigate("next")}>
          <RightOutlined />
        </button>
      </div>
      <div className="calendar-header-modes">
        {(["month", "year", "day"] as const).map((mode) => (
          <button
            key={mode}
            className={`calendar-mode-btn ${viewMode === mode ? "calendar-mode-btn-active" : ""}`}
            onClick={() => setViewMode(mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;