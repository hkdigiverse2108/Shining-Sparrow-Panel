import { type FC } from "react";
import { UserOutlined, BookOutlined, RocketOutlined, CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { DayTimelineProps } from "@/Types";

const parseTimeToHour = (timeStr: string) => {
  if (!timeStr) return -1;
  const [time, modifier] = timeStr.split(" ");
  let [hours] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours;
};

const getEventBadge = (type: string) => {
  switch (type) {
    case 'lecture': return <><BookOutlined className="mr-1" /> Lecture</>;
    case 'workshop': return <><RocketOutlined className="mr-1" /> Workshop</>;
    case 'holiday': return <><CalendarOutlined className="mr-1" /> Holiday</>;
    case 'meeting': return <><TeamOutlined className="mr-1" /> Meeting</>;
    default: return <><CalendarOutlined className="mr-1" /> Event</>;
  }
};

const DayTimeline: FC<DayTimelineProps> = ({ dayEvents }) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  return (
    <div className="day-timeline-container">
      {hours.map((hour) => {
        const timeStr = dayjs().hour(hour).minute(0).format("h A");
        const hourEvents = dayEvents.filter((e) => parseTimeToHour(e.time) === hour);
        return (
          <div key={hour} className="day-timeline-row">
            <div className="day-timeline-time">{timeStr}</div>
            <div className="day-timeline-events">
              {hourEvents.map((event, idx) => (
                <div key={idx} className={`day-timeline-event day-timeline-event-${event.type}`}>
                  <span className={`calendar-event-badge badge-${event.type}`}>
                    {getEventBadge(event.type)}
                  </span>
                  <h4 className="text-xs font-bold text-foreground mt-1">{event.title}</h4>
                  {event.instructor && (
                    <div className="calendar-event-meta mt-1">
                      <span className="flex items-center gap-1"><UserOutlined /> {event.instructor}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayTimeline;