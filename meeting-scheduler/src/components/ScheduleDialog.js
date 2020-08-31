import React, { useState } from "react";
import "./ScheduleDialog.css";

import { useAppData } from "../services/appDataContext";

const ScheduleDialog = (props) => {
    const { meetingTime, meetingId, toggleDialog } = props;
    const { currentUser, allUsers, allRooms, allMeetings, setAllMeetings } = useAppData();

    // check if it's create a new meeting or edit existing one
    const currentMeeting = meetingId === -1 ? null : allMeetings.find(meet => meet.id === meetingId);
    const currentHost = currentMeeting ? allUsers.find(use => use.id === currentMeeting.hostId) : currentUser;
    const currentMeetingStart = currentMeeting ? new Date(currentMeeting.startTime) : null;
    const currentMeetingEnd = currentMeeting ? new Date(currentMeeting.endTime) : null;
    const editMode = currentMeeting ? (currentHost.id === currentUser.id ? true : false) : true;

    const choiceUsers = allUsers.filter(user => {
        if (meetingId < 0) {
            // for new meeting, excluse current user from invitees dropdown
            return user.id !== currentUser.id;
        } else {
            return user.id !== currentHost.id;
        }

    });

    const strCurrentMeetingStart = currentMeeting ? currentMeetingStart.toISOString().slice(0, 11) + currentMeetingStart.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
        second: '2-digit'
    }).slice(0, 8) : "";
    const strCurrentMeetingEnd = currentMeeting ? currentMeetingEnd.toISOString().slice(0, 11) + currentMeetingEnd.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
        second: '2-digit'
    }).slice(0, 8) : "";

    const strStartTime = meetingTime.toISOString().slice(0, 11) + meetingTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
        second: '2-digit'
    }).slice(0, 8);
    const endMeetTime = new Date(meetingTime);
    endMeetTime.setHours(meetingTime.getHours() + 1);
    const strEndTime = endMeetTime.toISOString().slice(0, 11) + endMeetTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
        second: '2-digit'
    }).slice(0, 8);

    const [startTime, setStartTime] = useState(currentMeeting ? strCurrentMeetingStart : strStartTime);
    const [endTime, setEndTime] = useState(currentMeeting ? strCurrentMeetingEnd : strEndTime);
    const [invitees, setInvitees] = useState(currentMeeting ? currentMeeting.invitees : []);
    const [selectedRoom, setSelectedRoom] = useState(currentMeeting ? currentMeeting.roomId : allRooms[0].id);
    const [displayWarning, setDisplayWarning] = useState(false);
    const [subject, setSubject] = useState(currentMeeting ? currentMeeting.subject : "");

    const handleCancelMeeting = () => {
        toggleDialog(-1, -1);
    }

    const handleDeleteMeeting = () => {
        // find current meeting index in allMeetings, should only happen when meetingId > 0
        if (meetingId > 0) {
            const idx = allMeetings.findIndex(meeting => meeting.id === meetingId);
            if (idx >= 0) {
                const newAllMeetings = allMeetings.slice(0, idx).concat(allMeetings.slice(idx + 1));
                setAllMeetings(newAllMeetings);
            }

            toggleDialog(-1, -1);
        }
    }


    const handleSubmitMeeting = () => {
        if (currentMeeting) {
            // edit existing meeting
            currentMeeting.subject = subject;
            currentMeeting.roomId = selectedRoom;
            currentMeeting.invitees = invitees;
            currentMeeting.startTime = startTime;
            currentMeeting.endTime = endTime;

            // update allMeetings
            const idx = allMeetings.findIndex(meeting => meeting.id === meetingId);
            const newAllMeetings = allMeetings.slice(0, idx).concat([currentMeeting], allMeetings.slice(idx + 1));
            setAllMeetings(newAllMeetings);

        } else {
            // find the max id number plus 1 to be the new id
            const newMeet = {
                id: allMeetings.reduce(((maxId, meet) => Math.max(maxId, meet.id)), 0) + 1,
                hostId: currentUser.id,
                subject: subject,
                roomId: selectedRoom,
                invitees: invitees,
                startTime: startTime,
                endTime: endTime
            };


            const newAllMeetings = [...allMeetings, newMeet];
            setAllMeetings(newAllMeetings);
        }


        //close the popup
        toggleDialog(-1, -1);
    }

    const hasConflictMeetings = (selectedIds, expectedStartTime, expectedEndTime) => {
        // check all the invitees to see if he/she has a meeting at the same period of time
        const meetStart = new Date(expectedStartTime);
        const meetEnd = new Date(expectedEndTime);
        const foundConflicked = selectedIds.filter(userId => {
            // first find this user meetings at this meet date and see if the time is completely taken 
            const result = allMeetings.filter(meeting => {
                if (meeting.hostId === userId || meeting.invitees.includes(userId)) {
                    // if the meeting happen at the same day
                    const meetingStart = new Date(meeting.startTime);
                    const meetingEnd = new Date(meeting.endTime);
                    if (meetingStart.toLocaleDateString() === meetStart.toLocaleDateString()) {
                        // check if the time cover completely startTime to endTime
                        if ((meetingStart.getTime() <= meetStart.getTime()) && (meetingEnd.getTime() >= meetEnd.getTime())) {
                            return true;
                        }
                    }
                }
                return false;
            })

            return result.length > 0 ? true : false;

        })


        return foundConflicked.length > 0 ? true : false;
    }

    const handleSelectGuests = (evt) => {
        const selectedIds = [].slice.call(evt.target.selectedOptions).map(option => parseInt(option.value))
        // const selectedIds = evt.target.options.filter(option => option.selected).map(option => option.value);
        setInvitees(selectedIds);

        // check if there is conflict of meetings
        if (hasConflictMeetings(selectedIds, startTime, endTime)) {
            setDisplayWarning(true);
        } else {
            setDisplayWarning(false);
        }
    };

    const handleChangeStartTime = (evt) => {
        setStartTime(evt.target.value);
        // check if there is conflict of meetings
        if (hasConflictMeetings(invitees, evt.target.value, endTime)) {
            setDisplayWarning(true);
        } else {
            setDisplayWarning(false);
        }
    }

    const handleChangeEndTime = (evt) => {
        setEndTime(evt.target.value);
        // check if there is conflict of meetings
        if (hasConflictMeetings(invitees, startTime, evt.target.value)) {
            setDisplayWarning(true);
        } else {
            setDisplayWarning(false);
        }
    };

    const handleSelectRoom = (evt) => {
        setSelectedRoom(evt.target.value);
    };

    const handleChangeSubject = (evt) => {
        setSubject(evt.target.value);
    }

    return (
        <div className="DialogContainer">
            <div className="DialogTitle">{currentMeeting ? (editMode ? "Edit Meeting" : "View Meeting") : "New Meeting"}</div>
            <div className="DialogContent">
                <div className="row"><label>From:</label><input type="text" disabled value={currentHost.email} /></div>
                <div className="row">
                    <label>To:</label>
                    <select multiple size={3} onChange={handleSelectGuests} value={invitees}>
                        {choiceUsers.map(user => <option key={user.id} value={user.id}>{user.displayName}</option>)}
                    </select>
                </div>
                <div className="row"><label>Subject:</label><input type="text" value={subject} onChange={handleChangeSubject} /></div>
                <div className="row">
                    <label>Location:</label>
                    <select onChange={handleSelectRoom} value={selectedRoom}>
                        {allRooms.map(room => <option key={room.id} value={room.id} selected={currentMeeting && currentMeeting.roomId === room.id ? "selected" : ""} >{room.roomName}</option>)}
                    </select>
                </div>
                <div className="row"><label>Starts:</label><input type="datetime-local" value={startTime} onChange={handleChangeStartTime} /></div>
                <div className="row"><label>Ends:</label><input type="datetime-local" value={endTime} onChange={handleChangeEndTime} /></div>
                <div className="row"></div>
                <textarea className="row" />
                {displayWarning && <div className="row warning">There is time conflict for this period of time</div>}
                <div className="ActionsContainer">
                    <button className="leftButton" onClick={handleCancelMeeting}>Cancel</button>
                    {currentMeeting && editMode && <button className="leftButton" onClick={handleDeleteMeeting}>Delete</button>}
                    {editMode && <button type="submit" onClick={handleSubmitMeeting}>Save</button>}
                </div>
            </div>
        </div>
    );
};

export default ScheduleDialog;