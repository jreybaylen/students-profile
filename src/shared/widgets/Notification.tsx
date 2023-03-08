import { useEffect } from "react"

type NotificationProps = {
    message: string
    isOpen: boolean
    onDismiss(): void
}

export default function Notification (PROPS: NotificationProps): JSX.Element {
    useEffect(() => {
        if (PROPS.isOpen) {
            setTimeout(() => {
                PROPS.onDismiss()
            }, 3000)
        }
    }, [ PROPS.isOpen ])

    if (PROPS.isOpen) {
        return (
            <div className="fixed top-10 right-10 bg-red-500 py-5 px-8 rounded-md shadow-xl">
                <div className="flex flex-row items-center">
                    <p className="text-white">
                        Error Message: { PROPS.message }
                    </p>
                </div>
            </div>
        )
    }

    return <></>
}