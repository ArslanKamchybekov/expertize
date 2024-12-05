import { z } from "zod"

export const ForgotPasswordSchema = z.object({
    email: z.string().email("You must give a valid email"),
})
