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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                <p className="mt-2 text-gray-600">{description}</p>
                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className={cn("text-gray-600")}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={cn("bg-red-500 text-white")}
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    )
}
