import React, { useEffect, Fragment } from "react";
import uuid from "uuid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { handleFriendRequest, loadContacts, clearContacts } from "../../actions/contacts";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
const FriendRequests = ({
    contacts,
    loadContacts,
    clearContacts,
    handleFriendRequest
}: {
    contacts: any;
    loadContacts: any;
    clearContacts: any;
    handleFriendRequest: any;
}) => {
    useEffect(() => {
        clearContacts();
        loadContacts();
        // eslint-disable-next-line
    }, []);

    if (contacts === null) {
        return <Spinner />;
    }

    const friendRequest = contacts.filter((contact: any) => {
        return contact.status === "requested";
    });
    const handleClick = (e: any, contact: any) => {
        const { email } = contact;
        if (e.target.name === "rejected") {
            // TODO Reject friend request
            handleFriendRequest("rejected", email);
        } else {
            // TODO accept friend request
            handleFriendRequest("accepted", email);
        }
    };
    return (
        <Fragment>
            <div className="container container__friendRequest">
                {friendRequest.length === 0 ? (
                    <Fragment>
                        <h1 className="display-1">
                            <FormattedMessage id="friendRequests-noFriends-title" defaultMessage="No friend request" />{" "}
                            <i className="fas fa-poop" />
                        </h1>
                        <p className="lead">
                            <FormattedMessage
                                id="friendRequests-noFriends-text"
                                defaultMessage="Sorry but you do not have any friend request"
                            />
                        </p>
                    </Fragment>
                ) : (
                    friendRequest.map((contact: any) => {
                        return (
                            <Fragment key={uuid.v4()}>
                                <div className="contact user__contact__friend user__contact__friend__request">
                                    <div>
                                        <img className="contact__avatar" src={contact.contactProfile.avatar} alt="" />{" "}
                                        <p> {contact.contactProfile.name}</p>
                                        <p> {contact.contactProfile.email}</p>
                                    </div>
                                    <div id="requests__buttons">
                                        <button
                                            onClick={e => handleClick(e, { email: contact.contactProfile.email })}
                                            name="accept"
                                            className="btn btn-light contact__button"
                                        >
                                            <FormattedMessage id="friendRequests-accept" defaultMessage="Accept" />
                                        </button>
                                        <button
                                            onClick={e => handleClick(e, { email: contact.contactProfile.email })}
                                            className="btn btn-light contact__button contact__button__danger"
                                            name="rejected"
                                        >
                                            <FormattedMessage id="friendRequests-reject" defaultMessage="Reject" />
                                        </button>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })
                )}
                <Link to="/dashboard">
                    <FormattedMessage id="friendRequests-goHome" defaultMessage="Go Home" />
                </Link>
            </div>
        </Fragment>
    );
};
FriendRequests.propTypes = {
    contacts: PropTypes.array,
    loadContacts: PropTypes.func,
    clearContacts: PropTypes.func,
    handleFriendRequest: PropTypes.func
};

const mapStateToProps = (state: any) => ({
    contacts: state.contacts.contacts
});

export default connect(
    mapStateToProps,
    { loadContacts, clearContacts, handleFriendRequest }
)(FriendRequests);
