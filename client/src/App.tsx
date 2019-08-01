// eslint-disable-next-line
import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// NOTE STYLES
import "./App.css";

//NOTE REDUX
import { connect } from "react-redux";
import store from "./store";
// NOTE COMPONENTS
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import Landing from "./components/layout/Landing";
import ProfileSettings from "./components/layout/ProfileSettings";
import AddContactForm from "./components/users/AddContactForm";
import AddGroupConversation from "./components/users/AddGroupConversation";
import EditGroupConversation from "./components/users/EditGroupConversation";
import friendRequests from "./components/notifications/FriendRequests";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/routing/PrivateRoute";
import Page404 from "./components/layout/Page404";
import { loadUser } from "./actions/auth";

// NOTE internationalization
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import de from "react-intl/locale-data/de";
import es from "react-intl/locale-data/es";
import ja from "react-intl/locale-data/ja";
import messages from "./internationalization/messages";
addLocaleData(en);
addLocaleData(de);
addLocaleData(es);
addLocaleData(ja);

const App = ({ user }: { user: any }) => {
    useEffect(() => {
        // @ts-ignore
        store.dispatch(loadUser());
    }, []);
    let lang = user !== null ? user.profileSettings.language : "en";
    return (
        <IntlProvider
            locale={lang}
            //@ts-ignore
            messages={messages[lang]}
        >
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <Alert />
                    <Switch>
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <PrivateRoute exact path="/dashboard" component={Dashboard} />
                        <PrivateRoute exact path="/profile/settings" component={ProfileSettings} />
                        <PrivateRoute exact path="/contact/add" component={AddContactForm} />
                        <PrivateRoute exact path="/group/add" component={AddGroupConversation} />
                        <PrivateRoute exact path="/group/edit" component={EditGroupConversation} />
                        <PrivateRoute exact path="/friendRequests" component={friendRequests} />
                        <Route component={Page404} />
                    </Switch>
                </Fragment>
            </Router>
        </IntlProvider>
    );
};
const mapStateToProps = (state: any) => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(App);
