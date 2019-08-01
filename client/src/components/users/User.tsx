import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
const User = ({ user, contacts }: { user: any; contacts: any }) => {
    if (user === null || contacts === null) {
        return <Spinner />;
    }
    const friendRequests = contacts.filter((contact: any) => {
        return contact.status === "requested";
    });
    const { instagram, twitter, facebook } = user.profileSettings.socials;
    const instagramLink = `https://www.instagram.com/${instagram}`;
    const twitterLink = `https://www.twitter.com/${twitter}`;
    const facebookLink = `https://www.facebook.com/${facebook.replace(/\s+/g, "")}`;
    var socials = (
        <Fragment>
            <span className="social-input__user ">
                <Link to="/profile/settings">
                    <i className="fas fa-user-cog fa-2x" />
                </Link>
            </span>
            <span className="social-input__user hide-sm">
                <Link to={"/friendRequests"}>
                    <i className="fas fa-address-card fa-2x" /> {friendRequests.length}
                </Link>
            </span>
            {twitter && (
                <span className="social-input__user hide-sm">
                    <a target="_blank" rel="noopener noreferrer" href={twitterLink}>
                        <i className="fab fa-twitter fa-2x" />
                    </a>
                </span>
            )}
            {facebook && (
                <span className="social-input__user hide-sm">
                    <a target="_blank" rel="noopener noreferrer" href={facebookLink}>
                        <i className="fab fa-facebook fa-2x" />
                    </a>
                </span>
            )}
            {instagram && (
                <span className="social-input__user hide-sm">
                    <a target="_blank" rel="noopener noreferrer" href={instagramLink}>
                        <i className="fab fa-instagram fa-2x" />
                    </a>
                </span>
            )}
        </Fragment>
    );
    return (
        <div className="user">
            <div>
                <img className="user__avatar" src={user && user.avatar} alt="" />{" "}
                <span>
                    <h1>{user && user.name}</h1>
                </span>
            </div>
            {socials}
        </div>
    );
};

User.propTypes = {
    user: PropTypes.object
};
const mapStateToProps = (state: any) => ({
    user: state.auth.user,
    contacts: state.contacts.contacts
});

export default connect(mapStateToProps)(User);
