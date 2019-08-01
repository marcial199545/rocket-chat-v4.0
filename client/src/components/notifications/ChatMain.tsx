import React, { useEffect } from "react";
import ChatForm from "./ChatForm";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import UserBadge from "../users/UserBadge";
import Message from "./Message";
import { autoScroll } from "../../helpers";
import uuid from "uuid";
import { FormattedMessage } from "react-intl";
const ChatMain = ({
    messages,
    participants,
    roomId,
    showingGroups,
    conversations,
    loading
}: {
    messages?: any;
    participants?: any;
    roomId?: string;
    showingGroups?: boolean;
    conversations?: any;
    loading?: boolean;
}) => {
    useEffect(() => {
        autoScroll();
    }, []);
    if (messages === null || loading === true) {
        if (showingGroups) {
            return (
                <div className="chat__main">
                    <div className="chat__messages">
                        <div className="badge">
                            <h1 className="display display-info">
                                <FormattedMessage id="chatMain-No-Messages" defaultMessage="No Messages" />
                            </h1>
                        </div>
                    </div>
                    <div className="compose">
                        <ChatForm />
                    </div>
                </div>
            );
        }
        return (
            <div className="chat__main">
                <div className="chat__messages">
                    <div className="badge">
                        <h1 className="display display-info">
                            <FormattedMessage id="chatMain-No-Messages" defaultMessage="No Messages" />
                        </h1>
                    </div>
                </div>
                <div className="compose">
                    <ChatForm />
                </div>
            </div>
        );
    } else if (messages !== null && messages.length === 0 && conversations !== null) {
        if (showingGroups) {
            let currentConversation = conversations.find((conversation: any) => {
                return conversation.roomId === roomId;
            });
            return (
                <div className="chat__main">
                    <UserBadge userName={currentConversation.groupName} gravatar={currentConversation.avatar} />
                    <div className="chat__messages">
                        <div className="badge">
                            <h1 className="display display-info">
                                <FormattedMessage id="chatMain-No-Messages" defaultMessage="No Messages" />
                            </h1>
                        </div>
                    </div>
                    <div className="compose">
                        <ChatForm />
                    </div>
                </div>
            );
        }
        const contact = participants[1];
        return (
            <div className="chat__main">
                <UserBadge userName={contact.name} gravatar={contact.avatar} />
                <div className="chat__messages">
                    <div className="badge">
                        <h1 className="display display-info">
                            <FormattedMessage id="chatMain-No-Messages" defaultMessage="No Messages" />
                        </h1>
                    </div>
                </div>
                <div className="compose">
                    <ChatForm />
                </div>
            </div>
        );
    }
    if (showingGroups && conversations !== null) {
        const currentConversation = conversations.find((conversation: any) => {
            return conversation.roomId === roomId;
        });
        return (
            <div className="chat__main">
                {currentConversation && (
                    <UserBadge userName={currentConversation.groupName} gravatar={currentConversation.avatar} />
                )}
                <div className="chat__messages">
                    {messages.map((message: any) => {
                        return (
                            <Message
                                key={uuid.v4()}
                                sent={message.sent}
                                sender={message.sender}
                                date={message.date}
                                msg={message.msg}
                            />
                        );
                    })}
                </div>
                <div className="compose">
                    <ChatForm />
                </div>
            </div>
        );
    }
    const contact = participants[1];
    return (
        <div className="chat__main">
            <UserBadge userName={contact.name} gravatar={contact.avatar} />
            <div className="chat__messages">
                {messages.map((message: any) => {
                    return (
                        <Message
                            key={uuid.v4()}
                            sent={message.sent}
                            sender={message.sender}
                            date={message.date}
                            msg={message.msg}
                        />
                    );
                })}
            </div>
            <div className="compose">
                <ChatForm />
            </div>
        </div>
    );
};
ChatMain.propTypes = {
    messages: PropTypes.array,
    participants: PropTypes.array,
    roomId: PropTypes.string,
    conversations: PropTypes.array,
    showingGroups: PropTypes.bool,
    loading: PropTypes.bool
};

const mapStateToProps = (state: any) => ({
    messages: state.messages.messages,
    participants: state.messages.participants,
    roomId: state.messages.roomId,
    showingGroups: state.contacts.showingGroups,
    conversations: state.contacts.contacts,
    loading: state.messages.loading
});

export default connect(mapStateToProps)(ChatMain);
