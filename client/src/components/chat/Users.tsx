import { useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { useSelector, useDispatch } from "react-redux"

import type { AppDispatch } from "../../redux/store"
import { fetchUsers } from "../../redux/slicers/userSlice"
import Error from "../../components/features/Error"
import Loader from '../../components/features/Loader'


const Users = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const dispatch: AppDispatch = useDispatch()
    const userSlice = useSelector((state: { userSlice: { loading: boolean, error: string | null, users: Array<{ _id: string, username: string }> } }) => state.userSlice)
    const { loading, error, users } = userSlice

    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    return (
        <ScrollArea className="h-[calc(100vh-9rem)] w-full">
            {
                loading ? <Loader /> : error ? <Error message={error} /> : (
                    users?.filter((x) => x?._id !== user?.user?._id)?.map((conv, i) => (
                        <div key={i} className="p-4 border-b  cursor-pointer">
                            <div className="flex justify-between items-start w-full">
                                <div className="flex gap-3 items-center justify-between w-full">
                                    <Avatar>
                                        <AvatarImage src="/" alt="@shadcn" />
                                        <AvatarFallback>{conv.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{conv.username}</div>

                                    </div>
                                    <Button>Add</Button>
                                </div>

                            </div>
                        </div>
                    ))
                )
            }
        </ScrollArea>
    )
}

export default Users