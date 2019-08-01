import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { loadMessages, loadGroupMessages, clearMessages } from "../../actions/messages";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import uuid from "uuid";

import { joinRoom, leaveRoom, joinAllRooms } from "../../actions/sockets";
import { addCurrentGroup } from "../../actions/groups";
import { loadContacts } from "../../actions/contacts";

import { socket } from "./ChatForm";
import Spinner from "../layout/Spinner";

import { FormattedMessage } from "react-intl";

const ChatSidebar = ({
    loadContacts,
    clearMessages,
    loadMessages,
    loadGroupMessages,
    joinRoom,
    addCurrentGroup,
    history,
    joinAllRooms,
    leaveRoom,
    currentRoom,
    contacts,
    showingGroups
}: {
    loadContacts: any;
    clearMessages: any;
    loadMessages: any;
    loadGroupMessages: any;
    addCurrentGroup: any;
    joinRoom: any;
    history: any;
    joinAllRooms: any;
    leaveRoom: any;
    currentRoom: any;
    contacts: any;
    showingGroups: any;
}) => {
    useEffect(() => {
        loadContacts();
        // eslint-disable-next-line
    }, []);

    if (contacts === null) {
        return <Spinner />;
    }

    const handleClick = (e: any, contact: any) => {
        e.preventDefault();
        loadMessages(contact);
        if (currentRoom === contact.roomId) {
            return;
        }
        if (currentRoom === null) {
            joinRoom(socket, contact.roomId);
        } else if (currentRoom !== null) {
            leaveRoom(socket, currentRoom);
            joinRoom(socket, contact.roomId);
        }
    };
    const handleClickGroup = (e: any) => {
        e.preventDefault();
        clearMessages();
        if (!showingGroups) {
            loadContacts(true);
        } else if (showingGroups) {
            loadContacts();
        }
    };
    // const handleEditGroup = (e: any, conversation: any) => {
    //     e.preventDefault();
    //     addCurrentGroup(conversation);
    //     history.push("/group/edit");
    // };
    const handleJoinGroupClick = (e: any, conversation: any) => {
        e.preventDefault();
        loadGroupMessages(conversation);
        if (currentRoom === conversation.roomId) {
            return;
        }
        if (currentRoom === null) {
            joinRoom(socket, conversation.roomId);
        } else if (currentRoom !== null) {
            leaveRoom(socket, currentRoom);
            joinRoom(socket, conversation.roomId);
        }
    };
    if (contacts.length === 0 && showingGroups) {
        return (
            <div className="chat__sidebar">
                <div id="add-contact-container">
                    {showingGroups ? (
                        <Link to="/group/add">
                            <FormattedMessage id="chatSide-add-Group" defaultMessage="Add Group" />
                        </Link>
                    ) : (
                        <Link to="/contact/add">
                            <FormattedMessage id="chatSide-add-Contact" defaultMessage="Add Contact" />
                        </Link>
                    )}
                    <button
                        id="groupButton"
                        onClick={e => {
                            handleClickGroup(e);
                        }}
                    >
                        {showingGroups ? <i className="fas fa-user-friends" /> : <i className="fas fa-users" />}
                    </button>
                </div>
                <div className="display display-info">
                    <FormattedMessage id="chatSide-No-Groups" defaultMessage="No Groups" />{" "}
                    <i className="fas fa-poop" />{" "}
                </div>
            </div>
        );
    }
    if (showingGroups && contacts.length > 0) {
        joinAllRooms(socket, contacts, true);
        return (
            <div className="chat__sidebar">
                <div id="add-contact-container">
                    {showingGroups ? (
                        <Link to="/group/add">
                            <FormattedMessage id="chatSide-add-Group" defaultMessage="Add Group" />
                        </Link>
                    ) : (
                        <Link to="/contact/add">
                            <FormattedMessage id="chatSide-add-Contact" defaultMessage="Add Contact" />
                        </Link>
                    )}
                    <button
                        id="groupButton"
                        onClick={e => {
                            handleClickGroup(e);
                        }}
                    >
                        {showingGroups ? <i className="fas fa-user-friends" /> : <i className="fas fa-users" />}
                    </button>
                </div>
                {contacts.map((conversation: any) => {
                    return (
                        <Fragment key={uuid.v4()}>
                            <div className="contact user__contact__friend">
                                <div>
                                    <img
                                        className="contact__avatar"
                                        src={conversation.avatar}
                                        alt="avatar of conversation"
                                    />
                                    <span> {conversation.groupName}</span>
                                </div>
                                <div>
                                    <button
                                        onClick={e => handleJoinGroupClick(e, conversation)}
                                        className="btn btn-light contact__button"
                                    >
                                        send message
                                    </button>
                                    {/* <button
                                        onClick={e => handleEditGroup(e, conversation)}
                                        className="btn btn-light contact__button"
                                    >
                                        Edit Group
                                    </button> */}
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        );
    }
    let friendsContacts = contacts.filter((contact: any) => {
        return contact.status === "friend";
    });
    if (friendsContacts.length === 0) {
        return (
            <div className="chat__sidebar">
                <div id="add-contact-container">
                    {showingGroups ? (
                        <Link to="/group/add">
                            <FormattedMessage id="chatSide-add-Group" defaultMessage="Add Group" />
                        </Link>
                    ) : (
                        <Link to="/contact/add">
                            <FormattedMessage id="chatSide-add-Contact" defaultMessage="Add Contact" />
                        </Link>
                    )}
                    <button
                        id="groupButton"
                        onClick={e => {
                            handleClickGroup(e);
                        }}
                    >
                        {showingGroups ? <i className="fas fa-user-friends" /> : <i className="fas fa-users" />}
                    </button>
                </div>
                <div className="display display-info">
                    <FormattedMessage id="chatSide-No-Contacts" defaultMessage="No Friends" />{" "}
                    <i className="fas fa-poop" />
                </div>
            </div>
        );
    }
    joinAllRooms(socket, contacts);
    return (
        <div className="chat__sidebar">
            <div id="add-contact-container">
                {showingGroups ? (
                    <Link to="/group/add">
                        <FormattedMessage id="chatSide-add-Group" defaultMessage="Add Group" />
                    </Link>
                ) : (
                    <Link to="/contact/add">
                        <FormattedMessage id="chatSide-add-Contact" defaultMessage="Add Contact" />
                    </Link>
                )}
                <button
                    id="groupButton"
                    onClick={e => {
                        handleClickGroup(e);
                    }}
                >
                    {showingGroups ? <i className="fas fa-user-friends" /> : <i className="fas fa-users" />}
                </button>
            </div>
            {friendsContacts.map((contact: any) => {
                return (
                    <Fragment key={uuid.v4()}>
                        <div className="contact user__contact__friend">
                            <div>
                                <img className="contact__avatar" src={contact.contactProfile.avatar} alt="" />{" "}
                                <span> {contact.contactProfile.name}</span>
                            </div>
                            <div>
                                <button
                                    onClick={e => handleClick(e, contact.contactProfile)}
                                    className="btn btn-light contact__button"
                                >
                                    <FormattedMessage id="chatSide-profile-sendMessage" defaultMessage="Add Contact" />
                                </button>
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
};
ChatSidebar.propTypes = {
    loadContacts: PropTypes.func,
    addCurrentGroup: PropTypes.func,
    loadMessages: PropTypes.func,
    clearMessages: PropTypes.func,
    loadGroupMessages: PropTypes.func,
    joinRoom: PropTypes.func,
    joinAllRooms: PropTypes.func,
    leaveRoom: PropTypes.func,
    contacts: PropTypes.array
};

const mapStateToProps = (state: any) => ({
    contacts: state.contacts.contacts,
    showingGroups: state.contacts.showingGroups,
    currentRoom: state.sockets.currentRoom
});
export default withRouter(
    //@ts-ignore
    connect(
        mapStateToProps,
        {
            loadContacts,
            loadMessages,
            joinRoom,
            joinAllRooms,
            leaveRoom,
            loadGroupMessages,
            clearMessages,
            addCurrentGroup
        }
    )(ChatSidebar)
);
