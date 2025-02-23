import { useEffect } from 'react'

type Props = {
    message: string
}
import { ToastContainer, toast } from "react-toastify";
const Success = ({ message }: Props) => {
    useEffect(() => {
        const showToastMessage = () => {
            toast.success(message, {
                position: "bottom-right"
            });
        };
        showToastMessage()
    }, [message])
    return (
        <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    )
}

export default Success