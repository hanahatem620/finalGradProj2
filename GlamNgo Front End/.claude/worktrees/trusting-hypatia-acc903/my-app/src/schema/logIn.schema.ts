import z from 'zod'

export const loginSchema = z.object({
    email: z.email().nonempty("this field can't be empty"),
    password: z.string().nonempty("this field can't be empty").min(6, "at least 6 characters"),
})

export type loginSchemaType = z.infer<typeof loginSchema>
