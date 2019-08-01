import React from "react";
import moment from "moment";
const Message = (props: any) => {
    return (
        <div className={props.sent ? "message__sent" : "message__received"}>
            <div>
                <span>
                    <img className="contact__avatar" src={props.sender.gravatar} alt="" />
                </span>
                <span className="message__user">{props.sender.name}</span>
                <span className="message__meta">{moment(props.date).format("LT")}</span>
                <p>{props.msg}</p>
            </div>
        </div>
    );
};
export default Message;
