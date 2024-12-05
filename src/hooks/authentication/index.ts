import { onSignUpUser } from "@/actions/auth"
import { SignUpSchema } from "@/components/forms/sign-up/schema"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { ForgotPasswordSchema } from "../../components/forms/forgot-password/schema"
import { ResetPasswordSchema } from "../../components/forms/reset-password/schema"
import { SignInSchema } from "../../components/forms/sign-in/schema"

export const useAuthSignIn = () => {
    const { isLoaded, setActive, signIn } = useSignIn()
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        mode: "onBlur",
    })

    const router = useRouter()
    const onClerkAuth = async (email: string, password: string) => {
        if (!isLoaded)
            return toast("Error", {
                description: "Oops! something went wrong",
            })
        try {
            const authenticated = await signIn.create({
                identifier: email,
                password: password,
            })

            if (authenticated.status === "complete") {
                reset()
                await setActive({ session: authenticated.createdSessionId })
                toast("Success", {
                    description: "Welcome back!",
                })
                router.push("/callback/sign-in")
            }
        } catch (error: any) {
            if (error.errors[0].code === "form_password_incorrect")
                toast("Error", {
                    description: "email/password is incorrect try again",
                })
        }
    }

    const { mutate: InitiateLoginFlow, isPending } = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string
            password: string
        }) => onClerkAuth(email, password),
    })

    const onAuthenticateUser = handleSubmit(async (values) => {
        InitiateLoginFlow({ email: values.email, password: values.password })
    })

    return {
        onAuthenticateUser,
        isPending,
        register,
        errors,
    }
}

export const useAuthSignUp = () => {
    const { setActive, isLoaded, signUp } = useSignUp()
    const [creating, setCreating] = useState<boolean>(false)
    const [verifying, setVerifying] = useState<boolean>(false)
    const [code, setCode] = useState<string>("")

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        getValues,
    } = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        mode: "onBlur",
    })

    const router = useRouter()

    const onGenerateCode = async (email: string, password: string) => {
        if (!isLoaded)
            return toast("Error", {
                description: "Oops! something went wrong",
            })
        try {
            if (email && password) {
                await signUp.create({
                    emailAddress: getValues("email"),
                    password: getValues("password"),
                })

                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                })

                setVerifying(true)
            } else {
                return toast("Error", {
                    description: "No fields must be empty",
                })
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2))
        }
    }

    const onInitiateUserRegistration = handleSubmit(async (values) => {
        if (!isLoaded)
            return toast("Error", {
                description: "Oops! something went wrong",
            })

        try {
            setCreating(true)
            const completeSignUp = await signUp.attemptEmailAddressVerification(
                {
                    code,
                },
            )

            if (completeSignUp.status !== "complete") {
                return toast("Error", {
                    description:
                        "Oops! something went wrong, status in complete",
                })
            }

            if (completeSignUp.status === "complete") {
                if (!signUp.createdUserId) return
                const user = await onSignUpUser({
                    firstname: values.firstname,
                    lastname: values.lastname,
                    clerkId: signUp.createdUserId,
                    image: "",
                })

                reset()

                if (user.status === 200) {
                    toast("Success", {
                        description: user.message,
                    })
                    await setActive({
                        session: completeSignUp.createdSessionId,
                    })
                    router.push(`/group/create`)
                }
                if (user.status !== 200) {
                    toast("Error", {
                        description: user.message + "action failed",
                    })
                    router.refresh
                }
                setCreating(false)
                setVerifying(false)
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2))
        }
    })

    return {
        register,
        errors,
        onGenerateCode,
        onInitiateUserRegistration,
        verifying,
        creating,
        code,
        setCode,
        getValues,
    }
}

export const useGoogleAuth = () => {
    const { signIn, isLoaded: LoadedSignIn } = useSignIn()
    const { signUp, isLoaded: LoadedSignUp } = useSignUp()

    const signInWith = (strategy: OAuthStrategy) => {
        if (!LoadedSignIn) return
        try {
            return signIn.authenticateWithRedirect({
                // @ts-ignore
                strategy,
                redirectUrl: "/callback",
                redirectUrlComplete: "/callback/sign-in",
            })
        } catch (error) {
            console.error(error)
        }
    }

    const signUpWith = (strategy: OAuthStrategy) => {
        if (!LoadedSignUp) return
        try {
            return signUp.authenticateWithRedirect({
                // @ts-ignore
                strategy,
                redirectUrl: "/callback",
                redirectUrlComplete: "/callback/complete",
            })
        } catch (error) {
            console.error(error)
        }
    }

    return { signUpWith, signInWith }
}

export const useAuthForgotPassword = () => {
    const { isLoaded, signIn } = useSignIn()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        mode: "onBlur",
    })

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const onSendResetLink = handleSubmit(async ({ email }) => {
        if (!isLoaded) {
            return toast("Error", {
                description: "Oops! something went wrong",
            })
        }

        try {
            setIsSubmitting(true)
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            })

            toast("Success", {
                description: "A reset link has been sent to your email.",
            })
        } catch (error) {
            toast("Error", {
                description: "Could not send reset link. Please try again.",
            })
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    })

    return {
        register,
        errors,
        onSendResetLink,
        isSubmitting,
    }
}

export const useAuthResetPassword = () => {
    const { isLoaded, signIn } = useSignIn()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        mode: "onBlur",
    })

    const [isResetting, setIsResetting] = useState<boolean>(false)

    const onResetPassword = handleSubmit(
        async ({ password, confirmPassword }) => {
            if (!isLoaded) {
                return toast("Error", {
                    description: "Oops! something went wrong",
                })
            }

            try {
                setIsResetting(true)
                await signIn.attemptFirstFactor({
                    strategy: "reset_password_email_code",
                    code: password,
                    password: confirmPassword,
                })

                toast("Success", {
                    description: "Your password has been successfully reset.",
                })
            } catch (error) {
                toast("Error", {
                    description: "Failed to reset password. Please try again.",
                })
                console.error(error)
            } finally {
                setIsResetting(false)
            }
        },
    )

    return {
        register,
        errors,
        onResetPassword,
        isResetting,
    }
}
