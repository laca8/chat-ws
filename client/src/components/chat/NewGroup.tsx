/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { MessageCircleMore } from 'lucide-react'

type Props = {
    sendMessage: (arg0: any) => void
}
const NewGroup = ({ sendMessage }: Props) => {
    const [group, setGroup] = useState('')
    const handleCreateGroup = () => {
        sendMessage(JSON.stringify({ groupName: group }))
        setGroup('')
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create New Group</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader className='text-center flex items-center'>
                    <DialogTitle className='flex gap-4 '>New Group <MessageCircleMore className='text-cyan-800 text-3xl' /></DialogTitle>

                </DialogHeader>
                <div className="">
                    <Input id="name" placeholder='group name' value={group} onChange={(e) => setGroup(e.target.value)} className="col-span-3" />
                </div>
                <DialogFooter>
                    <Button onClick={() => handleCreateGroup()}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewGroup