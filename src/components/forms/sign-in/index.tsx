"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { APP_CONSTANTS } from "@/constants"
import { useAuthSignIn } from "@/hooks/authentication"

type Props = {}

const SignInForm = (props: Props) => {
    const { isPending, onAuthenticateUser, register, errors } = useAuthSignIn()

    return (
        <form
            className="flex flex-col gap-3 mt-10"
            onSubmit={onAuthenticateUser}
        >
            {APP_CONSTANTS.signInForm.map((field) => (
                <FormGenerator
                    {...field}
                    key={field.id}
                    register={register}
                    errors={errors}
                />
            ))}
            <div className="text-themeTextGray text-xs text-right mb-3">
                <a href="/forgot-password">Forgot password?</a>
            </div>
            <Button type="submit" className="rounded-2xl">
                <Loader loading={isPending}>Sign In</Loader>
            </Button>
        </form>
    )
}

export default SignInForm
