import { Router } from "express";
import UserNotification from "../../models/Notifications";
import Messages from "../../models/Messages";
import uuid = require("uuid");
import gravatar from "gravatar";
const router = Router();

// @route   POST api/notifications
// @desc    Register User on Notification service with the same id as in the auth service
// @access  Public
router.post("/", async (req, res) => {
    const userID = req.body.id;
    try {
        let newUserNotification = new UserNotification({ _id: userID });
        let newMessageCollection = new Messages({ _id: userID });
        await newUserNotification.save();
        await newMessageCollection.save();
        res.send("user notification created");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route   POST api/notifications/add/contact
// @desc    Add a contact
// @access  Private
router.post("/add/contact", async (req: any, res) => {
    try {
        const { contact: contactInfo, userId } = req.body;
        let notificationUser: any = await UserNotification.findById(userId, { contacts: 1 });
        if (
            notificationUser.contacts.find((contact: any) => {
                return contact.contactProfile.email === contactInfo.email;
            })
        ) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "Friend Request already sent",
                        type: "warning",
                        alertId: "addContact-alert-requestRepeated"
                    }
                ]
            });
        }
        let contactModel = {
            contactProfile: contactInfo
        };
        notificationUser.contacts.push(contactModel);
        await notificationUser.save();

        res.json(contactInfo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});
// @route   POST api/notifications/add/contact/request
// @desc    Add a contact request
// @access  Private
router.post("/add/contact/request", async (req: any, res) => {
    const { requestedId: userRequestedId } = req.body;
    const {
        name: requesterName,
        email: requesterEmail,
        avatar: requesterAvatar,
        _id: requesterId
    } = req.body.requesterInfo;
    let notificationUser: any = await UserNotification.findById(userRequestedId, { contacts: 1 });
    let contactModel = {
        contactProfile: {
            name: requesterName,
            email: requesterEmail,
            _id: requesterId,
            avatar: requesterAvatar
        },
        status: "requested"
    };
    notificationUser.contacts.push(contactModel);
    await notificationUser.save();
    res.send("add contact request");
});

// @route   POST api/notifications/me/contacts
// @desc    get all the contacts of an user
// @access  Private
router.post("/me/contacts", async (req: any, res) => {
    let { _id: userID } = req.body;
    let contactsNotificationUser: any = await UserNotification.findById(userID);
    res.send(contactsNotificationUser);
});

// @route   POST api/notifications/handle/contact/request
// @desc    handle the contact request
// @access  Private
router.post("/handle/contact/request", async (req: any, res) => {
    const { desicion, contactInfo, currentUserInfo } = req.body;
    // NOTE Current user contacts
    let currentUserContacts: any = await UserNotification.findById(currentUserInfo._id, { contacts: 1 });
    let currentUserConversation: any = await UserNotification.findById(currentUserInfo._id, {
        conversations: 1
    });
    let currentUserMessages: any = await Messages.findById(currentUserInfo._id);

    // NOTE User being requested contacts
    let contactUserRequested: any = await UserNotification.findById(contactInfo.contact._id, { contacts: 1 });
    let conversationsUserRequested: any = await UserNotification.findById(contactInfo.contact._id, {
        conversations: 1
    });
    let contactUserMessages: any = await Messages.findById(contactInfo.contact._id);
    if (desicion === "rejected") {
        let contactToReject = currentUserContacts.contacts.find((contact: any) => {
            return contact.contactProfile.email === contactInfo.contact.email;
        });
        contactToReject.status = "rejected";
        currentUserContacts.contacts = currentUserContacts.contacts.filter((contact: any) => {
            return contact.status !== "rejected";
        });
        await currentUserContacts.save();

        let currentUserToReject = contactUserRequested.contacts.find((contact: any) => {
            return contact.contactProfile.email === currentUserInfo.email;
        });
        currentUserToReject.status = "rejected";
        contactUserRequested.contacts = contactUserRequested.contacts.filter((contact: any) => {
            return contact.status !== "rejected";
        });
        await contactUserRequested.save();
        res.send("rejected");
    } else if (desicion === "accepted") {
        let conversationsModel = {
            roomId: uuid.v4()
        };
        let messagesModel = {
            roomId: conversationsModel.roomId
        };
        let contactToAccept = currentUserContacts.contacts.find((contact: any) => {
            return contact.contactProfile.email === contactInfo.contact.email;
        });
        contactToAccept.status = "friend";
        contactToAccept.contactProfile.roomId = conversationsModel.roomId;
        currentUserConversation.conversations.push(conversationsModel);
        currentUserMessages.messages.push(messagesModel);
        await currentUserConversation.save();
        await currentUserContacts.save();
        await currentUserMessages.save();

        let currentUserToAccept = contactUserRequested.contacts.find((contact: any) => {
            return contact.contactProfile.email === currentUserInfo.email;
        });
        currentUserToAccept.status = "friend";
        currentUserToAccept.contactProfile.roomId = conversationsModel.roomId;
        conversationsUserRequested.conversations.push(conversationsModel);
        contactUserMessages.messages.push(messagesModel);
        await conversationsUserRequested.save();
        await contactUserRequested.save();
        await contactUserMessages.save();
        res.send("accepted");
    }
});
// @route   POST api/notifications/contact/conversation
// @desc    create a conversation between two contacts
// @access  Private
router.post("/contact/conversation", async (req: any, res) => {
    try {
        const { currentUserProfile, contactProfile, roomId } = req.body;
        // NOTE fetching the conversations collection
        let conversationsCurrentUser: any = await UserNotification.findById(currentUserProfile._id, {
            conversations: 1
        });
        let conversationsContact: any = await UserNotification.findById(contactProfile._id, { conversations: 1 });
        // NOTE fetching  the current conversation by the roomId
        let conversationOnCurrentUser = conversationsCurrentUser.conversations.find((conv: any) => {
            return conv.roomId === roomId;
        });
        let conversationOnContact = conversationsContact.conversations.find((conv: any) => {
            return conv.roomId === roomId;
        });
        // NOTE destructuring the participants array from the currentConvesation
        let { participants: participantsCurrentUser } = conversationOnCurrentUser;
        let { participants: participantsContact } = conversationOnContact;
        // NOTE checking if the arrays of participants is , if it is then push participants to it
        if (participantsCurrentUser.length === 0) {
            participantsCurrentUser.push(currentUserProfile, contactProfile);
            await conversationsCurrentUser.save();
        }
        if (participantsContact.length === 0) {
            participantsContact.push(contactProfile, currentUserProfile);
            await conversationsContact.save();
        }
        // NOTE Load the messages of the current user, they should be the same
        let messagesCurrentUser: any = await Messages.findById(currentUserProfile._id, { messages: 1 });
        let response = {
            messages: messagesCurrentUser.messages.filter((msgs: any) => {
                return roomId === msgs.roomId;
            }),
            roomId,
            participantsCurrentUser
        };
        res.send(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});
// @route   POST api/notifications/message
// @desc    create a new Message
// @access  Private
router.post("/message", async (req, res) => {
    let { message, currentRoom, participants, currentUserInfo } = req.body;
    let messageModelSender = {
        msg: message,
        sent: true,
        sender: {
            name: currentUserInfo.name,
            email: currentUserInfo.email,
            gravatar: currentUserInfo.avatar
        }
    };
    let messageModelReceiver = {
        msg: message,
        sent: false,
        sender: {
            name: currentUserInfo.name,
            email: currentUserInfo.email,
            gravatar: currentUserInfo.avatar
        }
    };
    participants.forEach(async (participant: any) => {
        let messagesCurrentParticipant: any = await Messages.findById(participant._id);
        let currentConvesationOnCurrentUser = messagesCurrentParticipant.messages.find((conv: any) => {
            return conv.roomId === currentRoom;
        });
        if (participant._id === currentUserInfo._id) {
            currentConvesationOnCurrentUser.messages.push(messageModelSender);
            await messagesCurrentParticipant.save();
        } else {
            currentConvesationOnCurrentUser.messages.push(messageModelReceiver);
            await messagesCurrentParticipant.save();
        }
    });
    let messagesCurrentUser: any = await Messages.findById(currentUserInfo._id);
    let currentConvesationOnCurrentUser = messagesCurrentUser.messages.find((conv: any) => {
        return conv.roomId === currentRoom;
    });
    let responseBody = {
        messages: currentConvesationOnCurrentUser.messages,
        sender: currentUserInfo._id,
        messageSender: messageModelSender,
        messageReceiver: messageModelReceiver,
        participants,
        roomId: currentRoom
    };
    res.send(responseBody);
});
// @route   POST api/notifications/group/mesage
// @desc    create a new group Message
// @access  Private
router.post("/group/mesage", async (req, res) => {
    try {
        let { message, currentRoom, participants, currentUserInfo } = req.body;
        let messageModelSender = {
            msg: message,
            sent: true,
            sender: {
                name: currentUserInfo.name,
                email: currentUserInfo.email,
                gravatar: currentUserInfo.avatar
            }
        };
        let messageModelReceiver = {
            msg: message,
            sent: false,
            sender: {
                name: currentUserInfo.name,
                email: currentUserInfo.email,
                gravatar: currentUserInfo.avatar
            }
        };
        participants.forEach(async (participant: any) => {
            let messagesCurrentParticipant: any = await Messages.findById(participant._id);
            let currentConvesationOnCurrentUser = messagesCurrentParticipant.messages.find((conv: any) => {
                return conv.roomId === currentRoom;
            });
            if (participant._id === currentUserInfo._id) {
                currentConvesationOnCurrentUser.messages.push(messageModelSender);
                await messagesCurrentParticipant.save();
            } else {
                currentConvesationOnCurrentUser.messages.push(messageModelReceiver);
                await messagesCurrentParticipant.save();
            }
        });
        let messagesCurrentUser: any = await Messages.findById(currentUserInfo._id);
        let currentConvesationOnCurrentUser = messagesCurrentUser.messages.find((conv: any) => {
            return conv.roomId === currentRoom;
        });
        let responseBody = {
            messages: currentConvesationOnCurrentUser.messages,
            sender: currentUserInfo._id,
            messageSender: messageModelSender,
            messageReceiver: messageModelReceiver,
            participants,
            roomId: currentRoom
        };

        res.send(responseBody);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});
// @route   POST api/notifications/group/conversation
// @desc    create a group conversation
// @access  Private
router.post("/group/conversation", async (req, res) => {
    try {
        const { participants, groupName } = req.body;
        const roomId = uuid.v4();
        const avatar = gravatar.url(roomId, { s: "200", r: "pg", d: "identicon" });
        const groupConversationModel = {
            groupName,
            participants,
            flag: "group",
            roomId,
            avatar
        };

        const messagesModel = {
            roomId: groupConversationModel.roomId,
            messages: []
        };

        participants.forEach(async (participant: any) => {
            let participantConversations: any = await UserNotification.findById(participant._id, { conversations: 1 });
            participantConversations.conversations.push(groupConversationModel);
            await participantConversations.save();
        });
        participants.forEach(async (participant: any) => {
            let participantMessages: any = await Messages.findById(participant._id, { messages: 1 });
            participantMessages.messages.push(messagesModel);
            await participantMessages.save();
        });

        res.send("success");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});
// @route   POST api/notifications/group/conversation
// @desc    create a group conversation
// @access  Private
router.post("/group/conversation", async (req, res) => {
    try {
        const { participants, groupName, currentConversation, messages } = req.body;
        const roomId = uuid.v4();
        const avatar = gravatar.url(roomId, { s: "200", r: "pg", d: "identicon" });
        const groupConversationModel = {
            groupName,
            participants,
            flag: "group",
            roomId: currentConversation ? currentConversation.roomId : roomId,
            avatar: currentConversation ? currentConversation.avatar : avatar
        };

        const messagesModel = {
            roomId: groupConversationModel.roomId,
            messages: messages ? [...messages] : []
        };

        participants.forEach(async (participant: any) => {
            let participantConversations: any = await UserNotification.findById(participant._id, { conversations: 1 });
            participantConversations.conversations.push(groupConversationModel);
            await participantConversations.save();
        });
        participants.forEach(async (participant: any) => {
            let participantMessages: any = await Messages.findById(participant._id, { messages: 1 });
            participantMessages.messages.push(messagesModel);
            await participantMessages.save();
        });

        res.send("success");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});
// @route   POST api/notifications/group/conversation/edit
// @desc    edit a group conversation
// @access  Private
router.put("/group/conversation/edit", async (req, res) => {
    try {
        const {
            participants: newParticipants,
            groupName: newGroupName,
            currentConversation: oldConversation
        } = req.body;
        //errase previous conversation and messages
        oldConversation.participants.forEach(async (participant: any) => {
            let participantConversations: any = await UserNotification.findById(participant._id, { conversations: 1 });
            let convRoomId = participantConversations.conversations.findIndex((conversation: any) => {
                return conversation.roomId === oldConversation.roomId;
            });
            participantConversations.conversations.splice(convRoomId, 1);

            let participantMessages: any = await Messages.findById(participant._id, { messages: 1 });
            let messagesRoomId = participantMessages.messages.findIndex((conversation: any) => {
                return conversation.roomId === oldConversation.roomId;
            });
            participantMessages.messages.splice(messagesRoomId, 1);

            await participantConversations.save();
            await participantMessages.save();
        });
        res.send("success");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route   POST api/notifications/group/conversation/messages
// @desc    load messages of a user
// @access  Private
router.post("/group/conversation/messages", async (req, res) => {
    let resMessages: any = await Messages.findById(req.body.id);
    let messagesOfConversation = resMessages.messages.find((message: any) => {
        return message.roomId === req.body.roomId;
    });
    res.send(messagesOfConversation.messages);
});
export default router;
