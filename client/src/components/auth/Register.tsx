import React, { Fragment, useState, FormEvent, ChangeEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { socket } from "../notifications/ChatForm";
import PropTypes from "prop-types";
import { setAlert } from "../../actions/alert";
import { registerUser } from "../../actions/auth";

const Register = ({
    setAlert,
    registerUser,
    isAuthenticated
}: {
    setAlert: any;
    registerUser: any;
    isAuthenticated: boolean;
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });
    const { name, email, password, password2 } = formData;
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async (e: FormEvent<HTMLFormElement>, socket: any) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert("Passwords do not match", "danger");
        } else {
            console.log(`success`);
            registerUser({ name, email, password, socket });
        }
        setFormData({ email: "", password: "", name: "", password2: "" });
    };
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }
    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead">
                    <i className="fas fa-user" /> Create Your Account
                </p>
                <form className="form" onSubmit={e => onSubmit(e, socket)}>
                    <div className="form-group">
                        <input
                            value={name}
                            onChange={e => onChange(e)}
                            type="text"
                            placeholder="Name"
                            name="name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            value={email}
                            onChange={e => onChange(e)}
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            required
                        />
                        <small className="form-text">
                            This site uses Gravatar so if you want a profile image, use a Gravatar email
                        </small>
                    </div>
                    <div className="form-group">
                        <input
                            value={password}
                            onChange={e => onChange(e)}
                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            value={password2}
                            onChange={e => onChange(e)}
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            minLength={6}
                            required
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">sign In</Link>
                </p>
            </section>
        </Fragment>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};
const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { setAlert, registerUser }
)(Register);
