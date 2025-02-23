/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Conves from '../../components/chat/Conves';
import Chat from '../../components/chat/Chat';

import GroupsChat from '../../components/chat/GroupsChat';
import { useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { addMessage, getGroupsMessages, getPrivateMessages, setOnlineUsers } from '../../redux/slicers/messageSlice';
import { AppDispatch } from '../../redux/store';
import Error from '../../components/features/Error';
const SOCKET_URL = 'ws://localhost:5000';

const WorkhubsChat = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    useEffect(() => {
        if (!user) {
            window.location.href = '/signIn'
        }
    }, [user])
    const [currentConversation, setCurrentConversation] = useState<string>('');
    const [isGroup, setIsGroup] = useState(false)

    const [newMessage, setNewMessage] = useState('');

    const [connected, setConnected] = useState(false);

    const [msg, setMsg] = useState('')


    const dispatch: AppDispatch = useDispatch()


    const { sendMessage } = useWebSocket(SOCKET_URL, {
        onOpen: () => setConnected(true),
        onClose: () => setConnected(false),
        onMessage: (event) => {
            try {
                console.log(connected);
                const receivedMessage = JSON.parse(event.data);
                console.log(receivedMessage);

                if (receivedMessage.error) {
                    setMsg(receivedMessage.error);  // Display the error
                } else if (receivedMessage.type == 'online') {
                    console.log(receivedMessage);
                    // setNotifications((prev) => [...prev, `${receivedMessage.username} is online`]);
                    dispatch(setOnlineUsers(receivedMessage.users));

                } else if (receivedMessage.type == 'private' || receivedMessage.type == 'group') {
                    console.log(receivedMessage);
                    dispatch(addMessage(receivedMessage))
                }
            } catch (err) {
                setMsg('Error receiving message from server');
                console.error('Error parsing WebSocket message:', err);
            }
        },
    })


    const handleChangeChatToGroup = () => {
        setIsGroup(true)
    }
    const handleChangeChatToPrivate = () => {
        setIsGroup(false)
    }
    useEffect(() => {
        sendMessage(JSON.stringify({ type: 'connect', username: user?.user?.username }))
    }, [user?.user?.username, sendMessage])

    useEffect(() => {
        if (currentConversation == '') {
            return
        } else {
            if (isGroup) {
                dispatch(getGroupsMessages(currentConversation))


            } else {
                dispatch(getPrivateMessages(currentConversation))

            }
        }

    }, [isGroup, currentConversation, dispatch])

    return (
        <div className="h-[100vh] bg-gray-50 flex">
            <div className='p-4 h-full flex flex-col items-center justify-center gap-6'>
                <img onClick={() => handleChangeChatToGroup()} className='w-14 rounded-full shadow-md hover:scale-95 hover:opacity-70 cursor-pointer p-2' src='https://img.freepik.com/premium-vector/consultative-team-icon-3d-illustration-from-corporate-development-collection-creative-consultative-team-3d-icon-web-design-templates-infographics-more_676904-656.jpg' />
                <img onClick={() => handleChangeChatToPrivate()} className='w-14 rounded-full shadow-md hover:scale-95 hover:opacity-70 cursor-pointer p-2' src='https://img.freepik.com/premium-vector/discussing-icon-3d-illustration-from-customer-support-collection-creative-discussing-3d-icon-web-design-templates-infographics-more_676904-2603.jpg?w=360' />
            </div>
            {
                msg && <Error message={msg} />
            }

            {
                !isGroup ? (

                    <div className="w-80 border-r bg-white max-md:w-60 max-sm:40">
                        <Conves setCurrentConversation={setCurrentConversation} />
                    </div>
                ) : (

                    <div className="w-80 border-r bg-white">
                        <GroupsChat setCurrentConversation={setCurrentConversation} sendMessage={sendMessage} />
                    </div>
                )
            }


            {/* Chat Area */}
            <Chat isGroup={isGroup} currentConversation={currentConversation} newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />
        </div>
    );
};

export default WorkhubsChat;