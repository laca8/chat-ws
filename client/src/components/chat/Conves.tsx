/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

import { useSelector, useDispatch } from "react-redux"

import type { AppDispatch } from "../../redux/store"
import Error from "../../components/features/Error"
import Loader from '../../components/features/Loader'
import { Dot, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { fetchUsers } from '../../redux/slicers/userSlice';

type Props = {
    setCurrentConversation: (currentConversation: string) => void;
}
const Users = ({ setCurrentConversation }: Props) => {
    const dispatch: AppDispatch = useDispatch()
    const userSlice = useSelector((state: { userSlice: any }) => state.userSlice)
    const { loading, error, users, user } = userSlice
    const messageSlice = useSelector((state: { messageSlice: { loading: boolean, error: string | null, messages: any[], onlineUsers: any[] } }) => state.messageSlice)
    const { onlineUsers } = messageSlice


    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    const handlChooseConversation = (con: any) => {
        setCurrentConversation(con)
        console.log(con);

    }


    return (
        <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold">Private Chats</h1>
                </div>
                {/*users*/}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search" className="pl-10" />
                </div>
            </div>
            {
                loading ? <Loader /> : error ? <Error message={error} /> :
                    users?.filter((x: any) => x._id != user?.user?._id)?.map((user: any, i: number) => (
                        <div key={i} className="p-4 border-b  cursor-pointer hover:bg-slate-50" onClick={() => handlChooseConversation(user.username)}>
                            <div className="flex justify-between items-start w-full">
                                <div className="flex gap-3 items-center justify-between w-full">
                                    <div className='flex items-center gap-4'>
                                        <Avatar>
                                            <AvatarImage src="/" alt="@shadcn" />
                                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.username}</div>
                                        </div>
                                    </div>
                                    {
                                        onlineUsers.includes(user.username) ? <Dot size={48} strokeWidth={3} className='text-green-500 ' /> : <Dot size={48} strokeWidth={3} className='text-red-500' />
                                    }
                                </div>
                            </div>
                        </div>
                    ))
            }
        </ScrollArea>
    )
}

export default Users