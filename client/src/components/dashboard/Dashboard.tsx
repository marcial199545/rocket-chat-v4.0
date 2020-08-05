import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import User from "../users/User";
import Chat from "../notifications/Chat";
import { socket } from "../notifications/ChatForm";
import PropTypes from "prop-types";
import { clearMessages } from "../../actions/messages";
import { FormattedMessage } from "react-intl";
import { joinOwnRoom } from "../../actions/sockets";
const Dashboard = ({
    loading,
    clearMessages,
    user,
    joinOwnRoom
}: {
    loading?: boolean;
    clearMessages?: any;
    user: any;
    joinOwnRoom: any;
}) => {
    useEffect(() => {
        clearMessages();
    });
    if (!loading && user !== null) {
        joinOwnRoom(socket, user.contactId);
    }
    return loading ? (
        <Spinner />
    ) : (
        <Fragment>
            <section className="container container__dashboard">
                <h1 className="large text-primary">
                    <FormattedMessage id="dash-greeting" defaultMessage="Welcome" />
                </h1>
                <div className="user">
                    <User />
                </div>
                <Chat />
            </section>
        </Fragment>
    );
};
Dashboard.propTypes = {
    loading: PropTypes.bool,
    clearMessages: PropTypes.func,
    joinOwnRoom: PropTypes.func
};

const mapStateToProps = (state: any) => ({
    loading: state.auth.loading,
    user: state.auth.user
});

export default connect(
    mapStateToProps,
    { clearMessages, joinOwnRoom }
)(Dashboard);
