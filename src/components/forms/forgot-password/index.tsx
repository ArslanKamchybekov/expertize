"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { GROUPLE_CONSTANTS } from "@/constants"
import { useAuthForgotPassword } from "@/hooks/authentication"

type Props = {}

const ForgotPasswordForm = (props: Props) => {
    const { register, errors, onSendResetLink, isSubmitting } = useAuthForgotPassword()

    return (
        <form
            className="flex flex-col gap-3 mt-4"
            onSubmit={onSendResetLink}
        >
            {GROUPLE_CONSTANTS.forgotPasswordForm.map((field) => (
                <FormGenerator
                    {...field}
                    key={field.id}
                    register={register}
                    errors={errors}
                />
            ))}
            <Button type="submit" className="rounded-2xl">
                <Loader loading={isSubmitting}>Send Reset Link</Loader>
            </Button>
        </form>
    )
}

export default ForgotPasswordForm
