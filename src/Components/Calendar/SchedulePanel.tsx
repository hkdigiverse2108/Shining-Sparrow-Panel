import { type FC } from "react";
import { UserOutlined, ClockCircleOutlined, BookOutlined, RocketOutlined, CalendarOutlined, TeamOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { SchedulePanelProps } from "@/Types";

const getEventBadge = (type: string) => {
  switch (type) {
    case 'lecture': return <><BookOutlined className="mr-1" /> Lecture</>;
    case 'workshop': return <><RocketOutlined className="mr-1" /> Workshop</>;
    case 'holiday': return <><CalendarOutlined className="mr-1" /> Holiday</>;
    case 'meeting': return <><TeamOutlined className="mr-1" /> Meeting</>;
    default: return <><CalendarOutlined className="mr-1" /> Event</>;
  }
};

const SchedulePanel: FC<SchedulePanelProps> = ({ selectedDate, dayEvents, onEdit, onDelete }) => {
  return (
    <div className="calendar-agenda-panel">
      <div className="calendar-agenda-header">
        <h3 className="calendar-agenda-date">{selectedDate.format("MMMM D, YYYY")}</h3>
        <p className="calendar-agenda-day">{selectedDate.format("dddd")}</p>
      </div>

      {dayEvents.length > 0 ? (
        <div className="calendar-agenda-list">
          {dayEvents.map((event, index) => (
            <div key={index} className={`calendar-event-card calendar-event-type-${event.type}`}>
              <div className="flex items-start justify-between gap-2">
                <span className={`calendar-event-badge badge-${event.type}`}>
                  {getEventBadge(event.type)}
                </span>
                {event.id && event.course === "Custom Event" && (
                  <div className="flex gap-2">
                    <EditOutlined className="text-xs text-muted hover:text-primary cursor-pointer" onClick={() => onEdit(event)} />
                    <DeleteOutlined className="text-xs text-muted hover:text-danger cursor-pointer" onClick={() => onDelete(event.id)} />
                  </div>
                )}
              </div>
              <h4 className="calendar-event-title">{event.title}</h4>
              <div className="calendar-event-meta">
                {event.course && event.course !== "Custom Event" && (
                  <span className="flex items-center gap-1"><BookOutlined /> {event.course}</span>
                )}
                {event.time && (
                  <span className="flex items-center gap-1"><ClockCircleOutlined /> {event.time}</span>
                )}
                {event.instructor && (
                  <span className="flex items-center gap-1"><UserOutlined /> {event.instructor}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar-agenda-empty">
          <CalendarOutlined className="text-4xl text-border mb-3" />
          <p className="text-sm font-semibold text-foreground">No events scheduled</p>
          <p className="text-xs text-muted mt-1">Enjoy your free day or add a new event!</p>
        </div>
      )}
    </div>
  );
};

export default SchedulePanel;