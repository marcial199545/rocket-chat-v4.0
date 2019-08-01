import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../actions/auth";
import { socket } from "../notifications/ChatForm";
import { FormattedMessage } from "react-intl";
const Navbar = ({ isAuthenticated, loading, logout }: { isAuthenticated: any; loading: any; logout: any }) => {
    const handleLogout = (socket: any) => {
        logout(socket);
    };
    const authLinks = (
        <ul>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-home" />{" "}
                    <span className="hide-sm">
                        <FormattedMessage id="nav-dashboard" defaultMessage="Dashboard" />
                    </span>
                </Link>
            </li>
            <li>
                <a
                    onClick={() => {
                        handleLogout(socket);
                    }}
                    href="#!"
                >
                    <i className="fas fa-sign-out-alt" />{" "}
                    <span className="hide-sm">
                        <FormattedMessage id="nav-logout" defaultMessage="Logout" />
                    </span>
                </a>
            </li>
        </ul>
    );
    const guestlinks = (
        <ul>
            <li>
                <Link to="/register">
                    <i className="fas fa-user-plus" /> <span className="hide-sm">Register</span>
                </Link>
            </li>
            <li>
                <Link to="/login">
                    <i className="fas fa-sign-in-alt" /> <span className="hide-sm">Login</span>
                </Link>
            </li>
        </ul>
    );
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/">
                    <i className="fas fa-dice-d20" /> RocketChat
                </Link>
            </h1>
            {!loading && <Fragment>{isAuthenticated ? authLinks : guestlinks}</Fragment>}
        </nav>
    );
};

Navbar.propTypes = {
    isAuthenticated: PropTypes.bool,
    loading: PropTypes.bool,
    logout: PropTypes.func
};
const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
});

export default connect(
    mapStateToProps,
    { logout }
)(Navbar);
