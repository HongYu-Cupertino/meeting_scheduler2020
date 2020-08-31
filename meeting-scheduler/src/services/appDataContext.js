import React from "react";
import { useAlert } from "./alertContext";

const AppDataContext = React.createContext();

// Context provider
export const AppDataProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState({});
    const [allUsers, setAllUsers] = React.useState([]);
    const [allRooms, setAllRooms] = React.useState([]);
    const [allMeetings, setAllMeetings] = React.useState([]);
    const { setAlert } = useAlert();

    React.useEffect(() => {
        Promise.all([
            fetch('./users.json'),
            fetch('./rooms.json'),
            fetch('./meetings.json')
        ]).then(responses => {
            return Promise.all(responses.map(response => response.json())
            )
        })
            .then((dataList) => {
                setAllUsers(dataList[0]);
                // set first one to be current user
                setCurrentUser(dataList[0][0]);
                setAllRooms(dataList[1]);
                setAllMeetings(dataList[2]);
            })
            .catch((err) => {
                // display the error message at the top of the page
                setAlert("failed to load users.json");
            })
    }, [setAlert]);

    return (
        <AppDataContext.Provider value={{ currentUser, setCurrentUser, allUsers, allRooms, allMeetings, setAllMeetings }}>
            {children}
        </AppDataContext.Provider>
    );
};

// Custom hook
export const useAppData = () => {
    return React.useContext(AppDataContext);
};