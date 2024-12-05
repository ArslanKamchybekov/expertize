import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ModalProps = {
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    onCancel: () => void
}

export const Modal = ({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
}: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
            <div className="bg-black rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-800">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <p className="mt-2 text-white">{description}</p>
                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className={cn("text-white")}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={cn("bg-red-500 text-white hover:bg-red-800")}
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    )
}
