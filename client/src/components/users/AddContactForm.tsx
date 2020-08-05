import React, { Fragment, FormEvent, ChangeEvent, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import { addContact } from "../../actions/contacts";
import { socket } from "../notifications/ChatForm";
import { FormattedMessage } from "react-intl";
const AddContactForm = ({ loading, user, addContact }: { loading: any; user: any; addContact: any }) => {
    const [formData, setFormData] = useState({
        email: ""
    });
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addContact(socket, email);
        setFormData({ email: "" });
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const { email } = formData;
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
                <FormattedMessage id="addContact-addContact" defaultMessage="Add Contact" />
            </h1>
            <p className="lead">
                <FormattedMessage id="addContact-info" defaultMessage="Enter The Email To Send A Friend Request" />
            </p>
            <form onSubmit={e => onSubmit(e)} className="form">
                <div className="form-group social-input">
                    <i className="fas fa-user-friends fa-2x" />
                    <input
                        value={email}
                        onChange={e => onChange(e)}
                        type="email"
                        placeholder={
                            user.profileSettings.language === "en" || user === null
                                ? "Contact E-mail"
                                : user.profileSettings.language === "es"
                                ? "E-mail del contacto"
                                : user.profileSettings.language === "de"
                                ? "Kontakt E-mail"
                                : "連絡先メールアドレス"
                        }
                        autoComplete="false"
                        name="email"
                    />
                </div>
                <button type="submit" className="btn btn-primary my-1">
                    <i className="fas fa-user-plus" />
                </button>
                <Link className="btn btn-dark my-1" to="/dashboard">
                    <i className="fas fa-chevron-left" />
                </Link>
            </form>
        </Fragment>
    );
};

AddContactForm.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    addContact: PropTypes.func
};
const mapStateToProps = (state: any) => ({
    loading: state.auth.loading,
    user: state.auth.user
});

export default connect(
    mapStateToProps,
    { addContact }
)(AddContactForm);
