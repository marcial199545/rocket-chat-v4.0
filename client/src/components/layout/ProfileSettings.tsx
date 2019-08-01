import React, { Fragment, useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { updateProfileSettings } from "../../actions/profile";
import { FormattedMessage } from "react-intl";
const ProfileSettings = ({
    user,
    loading,
    updateProfileSettings
}: {
    user: any;
    loading: any;
    updateProfileSettings: any;
}) => {
    const [formData, setFormData] = useState({
        language: "",
        twitter: "",
        facebook: "",
        instagram: ""
    });
    const { language, twitter, facebook, instagram } = formData;
    useEffect(() => {
        setFormData({
            language: loading || !user.profileSettings.language ? "" : user.profileSettings.language,
            twitter: loading || !user.profileSettings.socials ? "" : user.profileSettings.socials.twitter,
            facebook: loading || !user.profileSettings.socials ? "" : user.profileSettings.socials.facebook,
            instagram: loading || !user.profileSettings.socials ? "" : user.profileSettings.socials.instagram
        });
        // eslint-disable-next-line
    }, [loading]);
    const [displaySocialInputs, toogleSocialInputs] = useState(false);
    const onChange = (e: ChangeEvent<any>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateProfileSettings(formData);
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
                <FormattedMessage id="profileSettings-profileSettings" defaultMessage="Profile Settings" />
            </h1>
            <p className="lead">
                <i className="fas fa-user-cog" />{" "}
                <FormattedMessage id="profileSettings-info" defaultMessage="Edit profile settings here" />
            </p>
            <form onSubmit={e => onSubmit(e)} className="form">
                <div className="form-group">
                    <select name="language" value={language} onChange={e => onChange(e)}>
                        <option value="en">English</option>
                        <option value="de">Deutsche</option>
                        <option value="es">Español</option>
                        <option value="ja">日本人</option>
                    </select>
                    <small className="form-text">
                        <FormattedMessage id="profileSettings-info-lang" defaultMessage="Change Language" />{" "}
                        <i className="fas fa-language" />
                    </small>
                </div>
                <div className="my-2">
                    <button
                        onClick={() => toogleSocialInputs(!displaySocialInputs)}
                        type="button"
                        className="btn btn-light"
                    >
                        <FormattedMessage id="profileSettings-add-socials" defaultMessage="Add Social Network Links" />
                    </button>
                    <span>
                        <FormattedMessage id="profileSettings-optional" defaultMessage="Optional" />
                    </span>
                </div>
                {displaySocialInputs && (
                    <Fragment>
                        <div className="form-group social-input">
                            <i className="fab fa-twitter fa-2x" />
                            <input
                                value={twitter}
                                onChange={e => onChange(e)}
                                type="text"
                                placeholder="Twitter URL"
                                name="twitter"
                            />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-facebook fa-2x" />
                            <input
                                value={facebook}
                                onChange={e => onChange(e)}
                                type="text"
                                placeholder="Facebook URL"
                                name="facebook"
                            />
                        </div>

                        <div className="form-group social-input">
                            <i className="fab fa-instagram fa-2x" />
                            <input
                                value={instagram}
                                onChange={e => onChange(e)}
                                type="text"
                                placeholder="Instagram URL"
                                name="instagram"
                            />
                        </div>
                    </Fragment>
                )}
                <button type="submit" className="btn btn-primary my-1">
                    <i className="fas fa-user-edit" />
                </button>
                <Link className="btn btn-dark my-1" to="/dashboard">
                    <i className="fas fa-chevron-left" />
                </Link>
            </form>
        </Fragment>
    );
};

ProfileSettings.propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    updateProfileSettings: PropTypes.func
};
const mapStateToProps = (state: any) => ({
    loading: state.auth.loading,
    user: state.auth.user
});

export default connect(
    mapStateToProps,
    { updateProfileSettings }
)(ProfileSettings);
