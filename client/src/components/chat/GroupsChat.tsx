/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { AppDispatch } from '../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups } from '../../redux/slicers/groupSlice'
import Loader from '../features/Loader'
import Error from '../features/Error'
import NewGroup from './NewGroup'

type Props = {
    setCurrentConversation: (currentConversation: string) => void;
    sendMessage: (arg0: any) => void

}

const GroupsChat = ({ setCurrentConversation, sendMessage }: Props) => {
    const userSlice = useSelector((state: { userSlice: any }) => state.userSlice)
    const { user } = userSlice
    const dispatch: AppDispatch = useDispatch()
    const groupSlice = useSelector((state: { groupSlice: { loading: boolean, error: string | null, groups: { name: string }[] } }) => state.groupSlice)
    const { loading, error, groups } = groupSlice

    useEffect(() => {
        dispatch(getGroups())
    }, [])
    // Material Design colors
    const materialColors = [
        'bg-orange-500', // Orange
        'bg-yellow-500', // Yellow
        'bg-green-500', // Green
        'bg-blue-500', // Blue
        'bg-indigo-500', // Indigo
        'bg-violet-500', // Violet
        'bg-pink-500', // Pink
        'bg-purple-500', // Purple
        'bg-purple-700', // Deep Purple
        'bg-indigo-700', // Indigo
        'bg-blue-300', // Blue
        'bg-blue-700', // Light Blue
        'bg-cyan-500'  // Cyan

    ];
    const handlChooseConversation = (con: any) => {
        sendMessage(JSON.stringify({ joinGroup: con, username: user.user.username }))
        setCurrentConversation(con)
    }

    return (
        <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold">Groups Chats</h1>
                    <NewGroup sendMessage={sendMessage} />
                </div>
                {/*users*/}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search" className="pl-10" />
                </div>
            </div>
            {
                error && <Error message={error} />
            }
            {
                loading ? <Loader /> :

                    groups?.map((conv: any, i) => (
                        <div key={i} className="p-4 border-b  cursor-pointer hover:bg-slate-100" onClick={() => handlChooseConversation(conv.group_name)}>
                            <div className="flex justify-between items-start w-full">
                                <div className="flex gap-3 items-center justify-start w-full">
                                    <Avatar >
                                        <AvatarImage src="/" alt="@shadcn" />
                                        <AvatarFallback className={`${materialColors[i]} text-white font-medium shadow-lg`}>{conv?.group_name[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{conv?.group_name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))
            }
        </ScrollArea>
    )
}

export default GroupsChat