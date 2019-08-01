import React, { Fragment, FormEvent, ChangeEvent, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import { loadContacts } from "../../actions/contacts";
import { addGroupConversation } from "../../actions/groups";
import Alert from "../layout/Alert";
import { socket } from "../notifications/ChatForm";
import uuid from "uuid";
import { FormattedMessage } from "react-intl";
const AddGroupConversation = ({
    loading,
    user,
    contacts,
    history,
    addGroupConversation,
    loadContacts
}: {
    loading: any;
    user: any;
    history: any;
    dispatch: any;
    contacts: any;
    addGroupConversation: any;
    loadContacts: any;
}) => {
    useEffect(() => {
        loadContacts();
        // eslint-disable-next-line
    }, []);

    const [formData, setFormData] = useState({
        participants: [],
        groupName: ""
    });
    const { participants, groupName } = formData;
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addGroupConversation(socket, { participants, groupName }, history);
        setFormData({ groupName: "", participants });
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
            setFormData({
                ...formData,
                participants: participants.filter((participant: any) => contact.email !== participant.email)
            });
            return;
        }
        // @ts-ignore
        setFormData({ ...formData, participants: [...participants, contact] });
    };

    return loading ? (
        <Spinner />
    ) : (
        <Fragment>
            <div className="user">
                <p className="lead">
                    <img className="user__avatar" src={user && user.avatar} alt="" /> <span> {user && user.name}</span>
                </p>
            </div>
            <h1 className="large text-primary">
                <FormattedMessage id="addGroup-createGroup" defaultMessage="Create A New Group Conversation" />
            </h1>
            <p className="lead">
                <FormattedMessage id="addGroup-addGroup" defaultMessage="Add Group" />
            </p>
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
            <h3>
                <FormattedMessage id="addGroup-participants" defaultMessage="Participants :" />
            </h3>
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
                        placeholder={
                            user.profileSettings.language === "en" || user === null
                                ? "Group Name"
                                : user.profileSettings.language === "es"
                                ? "Nombre Del Grupo"
                                : user.profileSettings.language === "de"
                                ? "Gruppenname"
                                : "グループ名"
                        }
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

AddGroupConversation.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    addGroupConversation: PropTypes.func,
    loadContacts: PropTypes.func
};
const mapStateToProps = (state: any) => ({
    loading: state.auth.loading,
    user: state.auth.user,
    contacts: state.contacts.contacts
});

export default connect(
    mapStateToProps,
    { addGroupConversation, loadContacts }
)(AddGroupConversation);
