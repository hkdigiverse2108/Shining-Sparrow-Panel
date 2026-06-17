import { useState, useMemo, type FC } from "react";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { PlusOutlined } from "@ant-design/icons";
import { message } from "antd";
import { CalendarHeader, CommonBreadcrumbs, CommonPageWrapper, DayTimeline, EventForm, SchedulePanel } from "@/Components";
import { CommonDrawer } from "@/Components/Common/CommonDrawer";
import { blurRevealUp, staggerContainer } from "@/Utils/animations";
import { BREADCRUMBS } from "@/Data";
import { useAppSelector, useAppDispatch } from "@/Store/hooks";
import { addCustomEvent, editCustomEvent, deleteCustomEvent } from "@/Store/Slices/customEventSlice";

const addEventInitialValues = { title: '', date: '', time: '', type: 'meeting' };

const CalendarAll: FC = () => {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [viewMode, setViewMode] = useState<"month" | "year" | "day">("month");
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Redux data
  const courses = useAppSelector(state => state.courses.data);
  const workshops = useAppSelector(state => state.workshops.data);
  const customEvents = useAppSelector(state => state.customEvents.data);

  const handleAddEvent = (values: any) => {
    dispatch(addCustomEvent(values));
    setIsDrawerOpen(false);
    message.success("Event added!");
  };

  const handleEditEvent = (values: any) => {
    dispatch(editCustomEvent({ ...editingEvent, ...values }));
    setEditingEvent(null);
    message.success("Event updated!");
  };

  const handleDeleteEvent = (id: number) => {
    dispatch(deleteCustomEvent(id));
    message.success("Event deleted!");
  };

  const scheduleData = useMemo(() => {
    const schedule: Record<string, any[]> = {};
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    let dayOffset = 1;
    courses.forEach((course) => {
      course.curriculum?.forEach((lecture) => {
        let date = dayjs(new Date(currentYear, currentMonth, dayOffset));
        while (date.day() === 0 || date.day() === 6) { dayOffset++; date = dayjs(new Date(currentYear, currentMonth, dayOffset)); }
        const dateKey = date.format("YYYY-MM-DD");
        if (!schedule[dateKey]) schedule[dateKey] = [];
        schedule[dateKey].push({ type: "lecture", title: lecture.title, course: course.title, time: dayOffset % 2 === 0 ? "10:00 AM" : "02:00 PM", instructor: course.instructor });
        dayOffset++; if (dayOffset > 28) dayOffset = 1;
      });
    });
    workshops.forEach((ws: any) => {
      if (!ws.date) return;
      const dateKey = dayjs(new Date(ws.date)).format("YYYY-MM-DD");
      if (dateKey === "Invalid Date") return;
      if (!schedule[dateKey]) schedule[dateKey] = [];
      if (Array.isArray(ws.agenda)) {
        ws.agenda.forEach((item: any) => {
          schedule[dateKey].push({ type: "workshop", title: item.title || ws.title, course: ws.title, time: item.time?.split(" - ")[0] || "12:00 PM", instructor: ws.speaker?.name || "Unknown" });
        });
      } else {
        const time = typeof ws.agenda === "string" ? ws.agenda.split(" - ")[0] : (ws.time ? ws.time.split(" - ")[0] : "12:00 PM");
        schedule[dateKey].push({ type: "workshop", title: ws.title, course: ws.title, time, instructor: ws.speaker?.name || "Unknown" });
      }
    });
    customEvents.forEach((ev: any) => {
      if (!ev.date) return;
      const dateKey = dayjs(new Date(ev.date)).format("YYYY-MM-DD");
      if (dateKey === "Invalid Date") return;
      if (!schedule[dateKey]) schedule[dateKey] = [];
      schedule[dateKey].push({ id: ev.id, type: ev.type, title: ev.title, course: "Custom Event", time: ev.time || "12:00 PM", instructor: "" });
    });

    return schedule;
  }, [courses, workshops, customEvents]);

  const dateSelect = (date: Dayjs) => { setSelectedDate(date); if (viewMode === "year") setViewMode("month"); };
  const handleNavigate = (direction: "prev" | "next") => {
    const unit = viewMode === "year" ? "year" : viewMode === "day" ? "day" : "month";
    setSelectedDate(prev => direction === "prev" ? prev.subtract(1, unit) : prev.add(1, unit));
  };

  const dateCellRender = (date: Dayjs) => {
    const dateKey = date.format("YYYY-MM-DD");
    const events = scheduleData[dateKey];
    return (
      <div className="calendar-cell-content">
        <div className="calendar-date-number">{date.date()}</div>
        {events && (
          <div className="calendar-event-dots">
            {events.some(e => e.type === "lecture") && <span className="calendar-dot calendar-dot-lecture" />}
            {events.some(e => e.type === "workshop") && <span className="calendar-dot calendar-dot-workshop" />}
            {events.some(e => e.type === "holiday") && <span className="calendar-dot calendar-dot-holiday" />}
            {events.some(e => e.type === "meeting") && <span className="calendar-dot calendar-dot-meeting" />}
            {events.some(e => e.type === "other") && <span className="calendar-dot calendar-dot-other" />}
          </div>
        )}
      </div>
    );
  };

  const selectedDateKey = selectedDate.format("YYYY-MM-DD");
  const dayEvents = scheduleData[selectedDateKey] || [];

  return (
    <>
      <CommonBreadcrumbs title="Schedule" breadcrumbs={BREADCRUMBS.CALENDAR || []} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={blurRevealUp} className="calendar-split-grid">
            
            <div className="calendar-panel">
              <div className="flex items-center justify-between mb-4">
                <CalendarHeader viewMode={viewMode} setViewMode={setViewMode} selectedDate={selectedDate} onNavigate={handleNavigate} />
                <button className="calendar-add-btn" onClick={() => { setEditingEvent(null); setIsDrawerOpen(true); }}>
                  <PlusOutlined />
                </button>
              </div>

              {viewMode === "day" ? (
                <DayTimeline dayEvents={dayEvents} />
              ) : (
                <Calendar mode={viewMode} fullscreen={false} value={selectedDate} onSelect={dateSelect} onPanelChange={(date, mode) => { setSelectedDate(date); setViewMode(mode as any); }} headerRender={() => null} cellRender={(current, info) => info.type === 'date' ? dateCellRender(current) : info.originNode}
                />
              )}
            </div>

            <SchedulePanel selectedDate={selectedDate} dayEvents={dayEvents} onEdit={(ev) => setEditingEvent(ev)} onDelete={handleDeleteEvent}/>
          </motion.div>
        </motion.div>
      </CommonPageWrapper>
      <CommonDrawer title="Add Custom Event" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <EventForm initialValues={addEventInitialValues} onSubmit={handleAddEvent} isEditing={false} />
      </CommonDrawer>
      <CommonDrawer title="Edit Event" open={!!editingEvent} onClose={() => setEditingEvent(null)}>
        {editingEvent && (
          <EventForm initialValues={editingEvent} onSubmit={handleEditEvent} isEditing={true} />
        )}
      </CommonDrawer>
    </>
  );
};

export default CalendarAll;