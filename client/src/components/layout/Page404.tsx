import React from "react";
import { Link } from "react-router-dom";
const Page404 = () => {
    return (
        <div className="jumbotron jumbotron-fluid m-3">
            <h1 className="display-1">
                Page not found <i className="fas fa-frown" />
            </h1>
            <p className="lead">Sorry but we were unable to find the page provided</p>
            <span>
                <Link to="/">Go Home</Link>
            </span>
        </div>
    );
};

export default Page404;
