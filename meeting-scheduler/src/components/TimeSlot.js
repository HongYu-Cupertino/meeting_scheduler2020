import React from "react";
import "./TimeSlot.css";


const TimeSlot = (props) => {
    const { meetings, row, count } = props;

    if (meetings === null || meetings.length === 0) {
        return null;
    }

    // calculate the meeting percentage in width and height of one timeslot(1hr per time slot)
    const wPercentage = (100 / count) + "%";

    const mSpans = meetings.map((meeting, index) => {
        let divStyle = { width: wPercentage };
        let spanStyle = { background: "#dddddd", width: "100%", borderLeft: "2px solid black" };

        // calculate the top position of the colored span in pixels
        const theTop = meeting.startTimeOfDay < row ? 0 : Math.round((new Date(meeting.startTime).getMinutes()) / 60 * 50);

        // check if endTime is beyong the timeslot
        const isBeyond = meeting.endTimeOfDay > row ? true : false;
        const theBottom = isBeyond ? 50 : Math.round((new Date(meeting.endTime).getMinutes()) / 60 * 50);
        spanStyle.height = (theBottom - theTop) + "px";

        return (<div key={index} className="OneMeetingContainer" style={divStyle}>
            <span style={{ width: "100%", height: theTop + "px" }}></span>
            <span style={spanStyle} title={meeting.id}>{meeting.startTimeOfDay === row ? meeting.subject : ""}</span>
        </div>);

    });

    return (<div className="MeetingsContainer">
        {mSpans}
    </div>);
}

export default TimeSlot;