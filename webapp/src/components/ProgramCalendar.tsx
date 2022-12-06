import React, { useEffect } from 'react';
import { decodeHTML } from 'entities';
import { DateTime } from 'luxon';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box } from '@mui/material';

import ProgramActivityDialog from './ProgramActivityDialog';

import {
  CalendarEvent,
  ProgramWithActivities,
  ProgramActivity,
} from '../types/api';

interface ProgramCalendarProps {
  program: ProgramWithActivities;
}

let correspondingProgramTitle = '';

const activitiesForCalendar = (
  activities: ProgramActivity[]
): CalendarEvent[] => {
  return activities.map(
    activity =>
      ({
        title: decodeHTML(activity.title),
        start: new Date(activity.start_time),
        end: new Date(activity.end_time),
        description: decodeHTML(activity.description_text),
        allDay: !activity.duration,
        programTitle: correspondingProgramTitle,
      } as CalendarEvent)
  );
};

const ProgramCalendar = ({ program }: ProgramCalendarProps) => {
  const [dialogShow, setDialogShow] = React.useState(false);
  const [dialogContents, setDialogContents] = React.useState<CalendarEvent>({
    title: '',
    description: '',
    allDay: false,
    start: new Date(),
    end: new Date(),
    programTitle: '',
  });
  const [currentWidth, setCurrentWidth] = React.useState<number>(
    window.innerWidth
  );
  const [currentView, setCurrentView] = React.useState<any>(
    currentWidth <= 600 ? Views.DAY : Views.WEEK
  );
  const [views, setViews] = React.useState([
    Views.MONTH,
    Views.WEEK,
    Views.DAY,
    Views.AGENDA,
  ]);

  const handleClickActivity = (activity: CalendarEvent) => {
    setDialogShow(true);
    setDialogContents(activity);
  };

  const TimeGutter = () => <p style={{ textAlign: 'center' }}>All Day</p>;

  const closeDialog = () => setDialogShow(false);

  const handleChangingView = React.useCallback(
    newView => setCurrentView(newView),
    [setCurrentView]
  );

  const eventStyleGetter = (event: any) => {
    let style;
    if (currentView === 'week') {
      style = {
        flexDirection: 'row' as 'row',
        minHeight: '4%',
      };
    } else if (currentView === 'day') {
      style = {
        flexDirection: 'column' as 'column',
        minHeight: '4%',
      };
    } else if (currentView === 'agenda' && currentWidth <= 600) {
      style = {
        fontSize: '90%',
        wordBreak: 'break-word' as 'break-word',
      };
    }
    return { style: style };
  };

  const CustomWeekEvent = (event: any) => {
    const getValueProperty = (event: any) => {
      const durationEvent = (event.event.end - event.event.start) / 1000 / 60;
      if (durationEvent <= 60) {
        return 'nowrap';
      } else {
        return 'normal';
      }
    };

    return (
      <Box
        className="rbc-event-content-custom"
        sx={{
          display: 'block',
          height: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: getValueProperty(event),
        }}
      >
        {event.title}
      </Box>
    );
  };

  correspondingProgramTitle = program.title;

  const updateDimension = () => {
    setCurrentWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateDimension);
    return () => window.removeEventListener('resize', updateDimension);
  }, []);

  useEffect(() => {
    if (currentWidth <= 600) {
      setViews([Views.DAY, Views.AGENDA]);
    } else {
      setViews([Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]);
    }
  }, [currentWidth]);

  return (
    <>
      <Calendar
        events={activitiesForCalendar(program.activities)}
        onSelectEvent={handleClickActivity}
        localizer={luxonLocalizer(DateTime)}
        defaultView={currentView}
        startAccessor="start"
        endAccessor="end"
        getNow={() => DateTime.local().toJSDate()}
        scrollToTime={DateTime.local().set({ hour: 8, minute: 0 }).toJSDate()}
        style={{ height: 500 }}
        components={{
          timeGutterHeader: TimeGutter,
          week: { event: CustomWeekEvent },
        }}
        popup
        onView={handleChangingView}
        eventPropGetter={eventStyleGetter}
        views={views}
      />
      <ProgramActivityDialog
        show={dialogShow}
        contents={dialogContents}
        handleClose={closeDialog}
      />
    </>
  );
};

export default ProgramCalendar;
