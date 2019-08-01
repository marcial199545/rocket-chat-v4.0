import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
const Contact = ({ auth: { user } }: { auth: any }) => {
    return (
        <div className="user user__contact">
            <p>
                <img className="contact__avatar" src={user && user.avatar} alt="" /> <span> {user && user.name}</span>
            </p>
        </div>
    );
};

Contact.propTypes = {
    auth: PropTypes.object
};
const mapStateToProps = (state: any) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Contact);
