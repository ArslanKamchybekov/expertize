'use client'

import ForgotPasswordForm from "@/components/forms/forgot-password"

const ForgotPasswordPage = () => {
    return (
        <>
            <h5 className="font-bold text-base text-themeTextWhite">Forgot Password</h5>
            <p className="text-themeTextGray leading-tight">
                Enter your email address and we will send you a link to reset your password.
            </p>
            <ForgotPasswordForm/>
        </>
    )
}

export default ForgotPasswordPage
