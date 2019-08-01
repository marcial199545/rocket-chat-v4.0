import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import User from "../users/User";
import Chat from "../notifications/Chat";
import PropTypes from "prop-types";
import { clearMessages } from "../../actions/messages";
import { FormattedMessage } from "react-intl";
const Dashboard = ({ loading, clearMessages }: { loading?: boolean; clearMessages?: any }) => {
    useEffect(() => {
        clearMessages();
    });
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
    clearMessages: PropTypes.func
};

const mapStateToProps = (state: any) => ({
    loading: state.auth.loading
});

export default connect(
    mapStateToProps,
    { clearMessages }
)(Dashboard);
