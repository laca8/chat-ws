/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useNavigate } from "react-router-dom"

import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../redux/store"
import { loginUser } from "../../redux/slicers/userSlice"
import Error from "../../components/features/Error"
import Loader from '../../components/features/Loader'
import Success from "../../components/features/Success"

export default function SignInForm() {
    const dispatch: AppDispatch = useDispatch()


    const [formData, setFormData] = useState({
        email: '',
        role: 'user'
    })
    const userSlice = useSelector((state: { userSlice: any }) => state.userSlice)
    const { loading, success, error, user } = userSlice

    const navigator = useNavigate()
    const handleChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleSubmit = () => {
        dispatch(loginUser(formData))
        if (user) {
            navigator('/')
        }

    }

    return (
        <div className="space-y-6 max-w-96 mx-auto flex flex-col  items-center justify-end py-36">

            {
                error && <Error message={error} />
            }
            {
                success && <Success message={'sign in success'} />
            }
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Sign in to your account</h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your email below to receive a sign-in link</p>
            </div>
            {
                loading ? <Loader /> : (
                    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                        <Input placeholder="you@example.com" type="email" required value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send magic link"}
                        </Button>
                    </form>
                )
            }
        </div>
    )
}

