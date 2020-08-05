import React, { useState, Fragment, ChangeEvent } from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { sendMessage, sendGroupMessage } from "../../actions/sockets";
// eslint-disable-next-line
export const socket = io("localhost:5001");
socket.on("SOCKET_NEW_FRIEND_REQUEST", (data: any) => {
    console.log(`New Friend Request from ${data.email}`);
});
const ChatForm = ({
    currentRoom,
    participants,
    showingGroups,
    user,
    sendMessage,
    sendGroupMessage
}: {
    currentRoom: any;
    participants: any;
    user: any;
    showingGroups: any;
    sendMessage: any;
    sendGroupMessage: any;
}) => {
    const [formData, setFormData] = useState({
        message: ""
    });
    const { message } = formData;
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async (e: any) => {
        e.preventDefault();
        let message = e.target.elements.message.value;
        if (showingGroups) {
            if (message.trim() !== "") {
                sendGroupMessage(socket, { message, currentRoom, participants });
                setFormData({ message: "" });
                return;
            }
        }
        if (message.trim() !== "") {
            sendMessage(socket, { message, currentRoom, participants });
            setFormData({ message: "" });
        }
    };
    return (
        <Fragment>
            <form id="message__form" onSubmit={e => onSubmit(e)}>
                <input
                    autoComplete="false"
                    disabled={currentRoom ? false : true}
                    value={message}
                    onChange={e => onChange(e)}
                    type="text"
                    placeholder={
                        user === null || user.profileSettings.language === "en"
                            ? "message"
                            : user.profileSettings.language === "es"
                            ? "mensaje"
                            : user.profileSettings.language === "de"
                            ? "Natchricth"
                            : "メッセージ"
                    }
                    name="message"
                />
                {currentRoom && (
                    <button type="submit">
                        <i className="fas fa-arrow-circle-right" />
                    </button>
                )}
            </form>
        </Fragment>
    );
};
ChatForm.propTypes = {
    currentRoom: PropTypes.string,
    participants: PropTypes.array,
    user: PropTypes.object,
    showingGroups: PropTypes.bool,
    sendMessage: PropTypes.func,
    sendGroupMessage: PropTypes.func
};

const mapStateToProps = (state: any) => ({
    currentRoom: state.sockets.currentRoom,
    showingGroups: state.contacts.showingGroups,
    participants: state.messages.participants,
    user: state.auth.user
});
export default connect(
    mapStateToProps,
    { sendMessage, sendGroupMessage }
)(ChatForm);
