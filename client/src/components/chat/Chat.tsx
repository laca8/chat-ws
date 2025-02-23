/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '../ui/avatar'
import { CircleCheckBig, Clock, LogIn, LogOut, Mic, Send, Smile } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from '../ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import Loader from '../features/Loader'
import Error from '../features/Error'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slicers/userSlice'
import { AppDispatch } from '../../redux/store'
const emojis = ["✌", "😂", "😝", "😁", "😱", "👉", "🙌", "🍻", "🔥", "🌈", "☀", "🎈", "🌹", "💄", "🎀", "⚽", "🎾", "🏁", "😡", "👿", "🐻", "🐶", "🐬", "🐟", "🍀", "👀", "🚗", "🍎", "💝", "💙", "👌", "❤", "😍", "😉", "😓", "😳", "💪", "💩", "🍸", "🔑", "💖", "🌟", "🎉", "🌺", "🎶", "👠", "🏈", "⚾", "🏆", "👽", "💀", "🐵", "🐮", "🐩", "🐎", "💣", "👃", "👂", "🍓", "💘", "💜", "👊", "💋", "😘", "😜", "😵", "🙏", "👋", "🚽", "💃", "💎", "🚀", "🌙", "🎁", "⛄", "🌊", "⛵", "🏀", "🎱", "💰", "👶", "👸", "🐰", "🐷", "🐍", "🐫", "🔫", "👄", "🚲", "🍉", "💛", "💚"]

type Props = {
    currentConversation: string,
    isGroup: boolean,
    newMessage: string,
    setNewMessage: (arg0: string) => void,
    sendMessage: (arg0: any) => void
}

const Chat = ({ isGroup, currentConversation, newMessage, setNewMessage, sendMessage }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigator = useNavigate()
    const dispatch: AppDispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        window.location.href = '/signIn'
    }
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const messageSlice = useSelector((state: { messageSlice: { loading: boolean, error: string | null, messages: any[], onlineUsers: any[] } }) => state.messageSlice)
    const { loading, error, messages } = messageSlice
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [hoveredEmoji, setHoveredEmoji] = useState('');
    const handleEmojiClick = (emoji: string) => {
        setSelectedEmoji(emoji);
        setNewMessage(newMessage + emoji)
        // You can add additional handling here, like a callback function
    };
    const handleSendMessage = () => {
        if (isGroup) {
            sendMessage(JSON.stringify({ sender: user.user.username, toGroup: currentConversation, message: newMessage }))
            setNewMessage('')
        } else {
            sendMessage(JSON.stringify({ sender: user.user.username, to: currentConversation, message: newMessage }))
            setNewMessage('')
        }
    }
    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    return (
        <div className="flex-1 flex flex-col">
            {/* <div>
                <strong>Notifications:</strong>
                <ul>
                    {notifications.map((note, index) => (
                        <li key={index}>{note}</li>
                    ))}
                </ul>
            </div> */}
            <div className="p-4 border-b bg-white flex justify-between items-center">
                <div className="flex items-center gap-3">

                    <Avatar>
                        <AvatarImage src="/" alt="@shadcn" />
                        <AvatarFallback>{currentConversation && currentConversation[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{currentConversation && currentConversation}</span>
                </div>
                <div className="">
                    {
                        user?.user?.email ? (
                            <div className="">

                                <Button onClick={() => handleLogout()} variant="destructive">
                                    Sign Out <LogOut />
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => navigator('/signIn')}>
                                Sign In <LogIn />
                            </Button>
                        )
                    }
                </div>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {
                        error && <Error message={error} />
                    }

                    {
                        loading ? <Loader /> :
                            messages?.map((message, i) => (
                                <div
                                    key={i}
                                    className={`flex items-end  ${message.sender === user?.user?.username ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <Avatar>
                                        <AvatarImage src="/" alt="@shadcn" />
                                        <AvatarFallback className='bg-gray-200'>{message?.sender && message?.sender[0]}</AvatarFallback>
                                    </Avatar>
                                    <Card className={`max-w-[80%] text-white ${message.sender === user?.user?.username
                                        ? "bg-blue-600"
                                        : "bg-gray-700"
                                        }`}>
                                        <CardContent className="p-3">
                                            <p>{message.content}</p>
                                            <div className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(message.createdAt).toUTCString()}
                                            </div>
                                        </CardContent>
                                        {
                                            message?.is_read && (
                                                <CircleCheckBig className={`text-blue-400 h-4 w-4 m-2 `} />

                                            )
                                        }
                                    </Card>
                                </div>
                            ))
                    }
                    {/* Messages would go here */}
                    {/* Invisible div for scroll reference */}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {
                currentConversation != '' && (
                    <div className="p-4 border-t bg-white">
                        <div className="flex items-center gap-2">

                            <HoverCard>
                                <HoverCardTrigger>
                                    <Smile className="w-6 h-6 text-gray-400" />
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <div className="grid grid-cols-8 gap-2 md:grid-cols-12 max-w-64">
                                        {emojis.map((emoji: string, index) => (
                                            <div
                                                key={index}
                                                className={`
                flex items-center justify-center p-2 rounded-lg cursor-pointer
                transition-all duration-200 ease-in-out
                hover:bg-gray-100 dark:hover:bg-gray-800
                transform hover:scale-110
                ${selectedEmoji === emoji ? 'bg-gray-200 dark:bg-gray-700' : ''}
              `}
                                                onMouseEnter={() => setHoveredEmoji(emoji)}
                                                onMouseLeave={() => setHoveredEmoji('')}
                                                onClick={() => handleEmojiClick(emoji)}
                                            >
                                                <span className="text-md">
                                                    {emoji}
                                                </span>

                                                {hoveredEmoji === emoji && (
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
                                                        Click to select
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </HoverCardContent>
                            </HoverCard>

                            <Input placeholder="Type your message here..." className="flex-1" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                            <Button size="icon" variant="ghost">
                                <Mic className="w-5 h-5" />
                            </Button>
                            <Button onClick={() => handleSendMessage()} >
                                <Send className="w-4 h-4 mr-2" />
                                Send
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Chat