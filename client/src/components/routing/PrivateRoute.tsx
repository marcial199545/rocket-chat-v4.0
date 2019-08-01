import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// interface IProps {
//     component: any;
//     auth: any;
//     rest: any;
// }
const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }: any) => {
    return (
        <Route
            {...rest}
            render={(props: any) =>
                !isAuthenticated && !loading ? <Redirect to="/login" /> : <Component {...props} />
            }
        />
    );
};

PrivateRoute.propTypes = {
    auth: PropTypes.object
};
const mapStateToProps = (state: any) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
