export const autoScroll = () => {
    //NOTE grab the chat messages element
    let chat: any = document.querySelector(".chat__messages");
    chat.scrollTop = chat.scrollHeight;
    //NOTE grab the last element child which will be the new Message
    let newMessage = chat.lastElementChild;
    //NOTE height of the last message
    const newMessageStyles: any = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeigth = newMessage.offsetHeight + newMessageMargin;

    //NOTE get the visible height
    const visibleHeight = chat.offsetHeight;
    //NOTE get the total height of messages container
    const messagesContainerHeight = chat.scrollHeight;
    //NOTE how far are we scrolled
    const scrollOffset = chat.scrollTop + visibleHeight;
    if (messagesContainerHeight - newMessageHeigth <= scrollOffset) {
        chat.scrollTop = chat.scrollHeight;
    }
};
