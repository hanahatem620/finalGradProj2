import z from 'zod'

export const signUpSchema = z.object({
    name: z.string().nonempty("this field can't be empty").min(10, "at least 10 characters"),
    email: z.email().nonempty("this field can't be empty"),
    password: z.string().nonempty("this field can't be empty").min(6, "at least 6 characters"),
})

export type signUpSchemaType = z.infer<typeof signUpSchema>
