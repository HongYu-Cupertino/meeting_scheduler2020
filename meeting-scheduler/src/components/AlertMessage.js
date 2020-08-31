import React from "react";
import { useAlert } from "../../src/services/alertContext";
import "./AlertMessage.css";


const AlertMessage = () => {
    const { alert, setAlert } = useAlert();

    if (alert) {
        // display the message in 10 second and then dismiss it
        setTimeout(() => setAlert(null), 10000);
        return <div className="alertMessage">alert</div>
    }

    return null;
}

export default AlertMessage;