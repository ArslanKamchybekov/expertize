import { z } from "zod"

export const CreateCommentSchema = z.object({
    comment: z
        .string()
        .min(1, { message: "Comment must have at least 1 character" }),
})
