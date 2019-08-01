import React from "react";

const UserBadge = (props: any) => {
    return (
        <div className="user-badge">
            <img src={props.gravatar} alt="" /> <h1 className="display display-info">{props.userName}</h1>
        </div>
    );
};

export default UserBadge;
