import React, { useState } from "react";
import { useAppData } from "../services/appDataContext";
import NavigateBar from "./NavigateBar";
import Calendar from "./Calendar";
import ScheduleDialog from "./ScheduleDialog";


const Main = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay();
    const [firstWeekDay, setFirstWeekDay] = useState((new Date(today.setDate(first))));
    const { currentUser, allMeetings } = useAppData();
    const [openDialog, setOpenDialog] = useState(false);
    const [meetingTime, setMeetingTime] = useState(null);
    const [meetingId, setMeetingId] = useState(-1);

    const toggleDialog = (row, column, selectedMeetingId = -1) => {
        if (row < 0 && column < 0) {
            // close the dialog when click cancel or save from disalog
            setMeetingTime(null);
            setOpenDialog(false);
            setMeetingId(-1);
        } else {
            // to open the popup
            // calculate meetingTime
            const meetingDate = firstWeekDay.getDate() + column;
            let tmpTime = new Date(firstWeekDay.toLocaleDateString());
            tmpTime.setDate(meetingDate);
            tmpTime.setHours(row);
            setMeetingTime(tmpTime);
            setOpenDialog(true);
            setMeetingId(selectedMeetingId);
        }

    }
    const getCurrentUserMeetingsByWeek = () => {

        // find all meetings that current user is in and meet at current week
        const currentUserMeetings = allMeetings.filter(meeting => {
            if (meeting.hostId === currentUser.id || meeting.invitees.includes(currentUser.id)) {
                const meetingDate = new Date(meeting.startTime).getDate();
                // check if the meeting date is within the current week
                if (meetingDate >= firstWeekDay.getDate() && meetingDate <= (firstWeekDay.getDate() + 6)) {
                    return true;
                }
                return false;
            }
            return false;
        })

        // generate a new array of meetings that has the timeslot(startRow, endRow, dayInWeek)
        // startRow and endRow indicate which time period of the day, tell the rows it belongs
        // dayInWeek indicate which day of the week it belong. so with these info, we can draw in 
        // meeting in the calendar table
        const myMeetingsThisWeek = currentUserMeetings.map(meeting => {
            // check the time to see which timeslot it fall into
            const meet = JSON.parse(JSON.stringify(meeting));
            meet.dayInWeek = new Date(meet.startTime).getDay() - firstWeekDay.getDay();
            meet.startTimeOfDay = new Date(meet.startTime).getHours();
            meet.endTimeOfDay = new Date(meet.endTime).getHours();
            return meet;
        })

        return myMeetingsThisWeek;
    }

    return (allMeetings && allMeetings.length > 0 &&
        <>
            <NavigateBar firstWeekDay={firstWeekDay} setFirstWeekDay={setFirstWeekDay} />
            <Calendar firstWeekDay={firstWeekDay} userMeetings={getCurrentUserMeetingsByWeek()} toggleDialog={toggleDialog} />
            {openDialog && meetingTime && <ScheduleDialog meetingTime={meetingTime} meetingId={parseInt(meetingId)} toggleDialog={toggleDialog} />}
        </>
    )

}

export default Main;