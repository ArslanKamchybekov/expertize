"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { APP_CONSTANTS } from "@/constants"
import { useAuthResetPassword } from "@/hooks/authentication"

type Props = {}

const ResetPasswordForm = (props: Props) => {
    const { register, errors, onResetPassword, isResetting } =
        useAuthResetPassword()

    return (
        <form className="flex flex-col gap-3 mt-4" onSubmit={onResetPassword}>
            {APP_CONSTANTS.forgotPasswordForm.map((field) => (
                <FormGenerator
                    {...field}
                    key={field.id}
                    register={register}
                    errors={errors}
                />
            ))}
            <Button type="submit" className="rounded-2xl">
                <Loader loading={isResetting}>Reset Password</Loader>
            </Button>
        </form>
    )
}

export default ResetPasswordForm
