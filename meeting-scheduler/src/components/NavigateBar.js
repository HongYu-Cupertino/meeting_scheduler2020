import React from "react";
import "./NavigateBar.css";
import { useAppData } from "../services/appDataContext";

const NavigateBar = (props) => {
    const { firstWeekDay, setFirstWeekDay } = props;
    const { allUsers, currentUser, setCurrentUser } = useAppData();
    const tmpDate = new Date(firstWeekDay);
    const lastWeekDay = new Date(tmpDate.setDate(tmpDate.getDate() + 6));

    const handleChangeUser = (evt) => {
        const newUserId = parseInt(evt.target.value);
        const newUser = allUsers.find(user => user.id === newUserId);
        setCurrentUser(newUser);
    }

    const previousWeek = () => {
        setFirstWeekDay(new Date(firstWeekDay.setDate(firstWeekDay.getDate() - 7)));
    }

    const nextWeek = () => {
        setFirstWeekDay(new Date(firstWeekDay.setDate(firstWeekDay.getDate() + 7)));
    }

    return (<div className="navigateBar">
        <p onClick={previousWeek}><i className="arrow left"></i></p>
        <p onClick={nextWeek}><i className="arrow right"></i></p>
        <p>{firstWeekDay.toLocaleString('en-us', { month: 'long', year: 'numeric', day: 'numeric' })}</p>
        <p> {`-----`}</p>
        <p>{lastWeekDay.toLocaleString('en-us', { month: 'long', year: 'numeric', day: 'numeric' })}</p>

        <select className="usersDropdown" value={currentUser.id} onChange={handleChangeUser}>
            {allUsers.map(user => <option key={user.id} value={user.id}>{user.displayName}</option>)}
        </select>
    </div>)
}

export default NavigateBar;