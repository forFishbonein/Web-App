import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import isSameDay from "date-fns/isSameDay";
import enGB from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box } from "@mui/material";
import useTrainerApi from "../../../apis/trainer";
import dayjs from "dayjs";

const locales = {
  "en-GB": enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AvailabilityCalendar = ({
  events = [],
  onSlotAdd = () => {},
  onSlotRemove = () => {},
  editable = false,
  showSnackbar = () => {},
}) => {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const { updateAvailability } = useTrainerApi();

  const calendarEvents = events.map((e) => ({
    ...e,
    title: "Available",
  }));

  const handleSelectSlot = ({ start, end }) => {
    if (!editable) return;
  
    const now = new Date();
    if (start < now) {
      showSnackbar({
        message: "You cannot add availability in the past.",
        severity: "warning",
      });
      return;
    }
  
    const newSlot = {
      id: `${start.toISOString()}_${end.toISOString()}`,
      start,
      end,
    };
    onSlotAdd(newSlot);
  };
  

  const handleSelectEvent = (event) => {
    if (!editable) return;
    onSlotRemove(event.id);
  };

  return (
    <Box
      sx={{
        "& .rbc-calendar": {
          height: "75vh !important",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: 2,
          overflow: "hidden",
        },
        "& .rbc-today": {
          backgroundColor: "#f0faff",
        },
        "& .rbc-label": {
          fontSize: "0.9rem",
        },
        "& .rbc-event": {
          backgroundColor: "#1976d2",
          color: "#fff",
          fontSize: "0.8rem",
          padding: "4px 8px",
          borderRadius: "8px",
          border: "1px solid #1565c0",
          transition: "0.3s ease",
          "&:hover": {
            backgroundColor: "#1565c0",
            cursor: "pointer",
          },
        },
      }}
    >
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        views={[Views.WEEK, Views.DAY]}
        view={view}
        date={date}
        onView={(newView) => setView(newView)}
        onNavigate={(newDate) => setDate(newDate)}
        step={30}
        timeslots={2}
        selectable={editable}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        messages={{
          today: "Current",
          previous: "Previous",
          next: "Next",
        }}
      />
    </Box>
  );
};

export default AvailabilityCalendar;
