import React, { Fragment, FormEvent, ChangeEvent, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import { loadContacts } from "../../actions/contacts";
import { editConversationGroup } from "../../actions/groups";
import Alert from "../layout/Alert";
// eslint-disable-next-line
import { socket } from "../notifications/ChatForm";
import uuid from "uuid";
// import contacts from "../../reducers/contacts";
const EditGroupConversation = ({
    loadingUser,
    loadingGroup,
    currentConversation,
    user,
    messages,
    contacts,
    history,
    editConversationGroup,
    loadContacts
}: {
    loadingUser: any;
    loadingGroup: any;
    currentConversation: any;
    user: any;
    messages: any;
    history: any;
    dispatch: any;
    contacts: any;
    editConversationGroup: any;
    loadContacts: any;
}) => {
    const [formData, setFormData] = useState({
        participants: [],
        groupName: ""
    });
    useEffect(() => {
        loadContacts();
        //@ts-ignore
        setFormData({
            participants:
                loadingGroup || currentConversation.participants.length === 0
                    ? []
                    : [...currentConversation.participants],
            groupName: loadingGroup || currentConversation.groupName.length === 0 ? "" : currentConversation.groupName
        });
        // eslint-disable-next-line
    }, []);

    const { participants, groupName } = formData;
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editConversationGroup(socket, { participants, groupName, currentConversation, messages });
        setFormData({ groupName: "", participants });
        history.push("/dashboard");
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onClick = (e: any, contact: any) => {
        e.preventDefault();
        if (
            participants.find((participant: any) => {
                return participant.email === contact.email;
            })
        ) {
            // @ts-ignore
            setFormData({
                ...formData,
                participants: participants.filter((participant: any) => contact.email !== participant.email)
            });
            return;
        }
        // @ts-ignore
        setFormData({ ...formData, participants: [...participants, contact] });
    };
    if (currentConversation === null) {
        return <Redirect to="/dashboard" />;
    }
    return loadingUser ? (
        <Spinner />
    ) : (
        <Fragment>
            <div className="user">
                <p className="lead">
                    <img className="user__avatar" src={user && user.avatar} alt="" /> <span> {user && user.name}</span>
                </p>
            </div>
            <h1 className="large text-primary">Create a new Group Conversation</h1>
            <p className="lead">Add Group Participants</p>
            <Alert />
            <div className="container__groupConversation">
                {contacts !== null &&
                    contacts
                        .filter((contact: any) => {
                            return contact.status === "friend";
                        })
                        .map((contact: any) => {
                            return (
                                <div key={uuid.v4()}>
                                    <button
                                        className="badge__contact__addGroup badge-dark"
                                        onClick={(e: any) => {
                                            onClick(e, contact.contactProfile);
                                        }}
                                    >
                                        <img
                                            className="contact__avatar"
                                            src={contact.contactProfile.avatar}
                                            alt="user avatar"
                                        />
                                        <span className="contactName">{contact.contactProfile.name}</span>
                                    </button>
                                </div>
                            );
                        })}
            </div>
            <h3>Participants:</h3>
            {participants.length > 0 && (
                <div className="container__participants">
                    {participants.map((participant: any) => {
                        return (
                            <div key={uuid.v4()}>
                                <button
                                    className="badge__contact__addGroup badge-dark"
                                    onClick={(e: any) => {
                                        onClick(e, participant);
                                    }}
                                >
                                    <img className="contact__avatar" src={participant.avatar} alt="user avatar" />
                                    <span className="contactName">{participant.name}</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            <form onSubmit={e => onSubmit(e)} className="form">
                <div className="form-group social-input__group">
                    <i className="fas fa-users fa-2x" />
                    <input
                        value={groupName}
                        onChange={e => onChange(e)}
                        type="text"
                        required
                        placeholder="Group Name"
                        name="groupName"
                    />
                </div>
                <button type="submit" className="btn btn-primary my-1">
                    <i className="fas fa-users" /> <i className="fas fa-plus" />
                </button>
                <Link className="btn btn-dark my-1" to="/dashboard">
                    <i className="fas fa-chevron-left" />
                </Link>
            </form>
        </Fragment>
    );
};

EditGroupConversation.propTypes = {
    user: PropTypes.object,
    currentConversation: PropTypes.object,
    loading: PropTypes.bool,
    messages: PropTypes.array,
    addGroupConversation: PropTypes.func,
    loadContacts: PropTypes.func
};
const mapStateToProps = (state: any) => ({
    loadingUser: state.auth.loading,
    loadingGroup: state.groups.loading,
    user: state.auth.user,
    messages: state.messages.messages,
    contacts: state.contacts.contacts,
    currentConversation: state.groups.currentGroup
});

export default connect(
    mapStateToProps,
    { editConversationGroup, loadContacts }
)(EditGroupConversation);
