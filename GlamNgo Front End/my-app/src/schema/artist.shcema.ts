import z from 'zod'

export const artistSchema = z.object({
    firstName: z.string().nonempty("this field can't be empty").min(4, 'at least 4 characters'),
    lastName: z.string().nonempty("this field can't be empty").min(4, "at least 4 characters"),
    email: z.email().nonempty("this field can't be empty"),
    phone: z.string().regex(/^01[0125][0-9]{8}$/),
    yearsOfExperience : z.number().int(),
    specialties: z.array(z.string()),
    certifications: z.string().nonempty("this field can't be empty"),
    license: z.string(),
      services: z.array(z.string()),
      priceRange: z.number(),
      travelRange: z.number(),
      portfolioDescription: z.string().nonempty("this field can't be empty"),
      instagram: z.url(),
      website: z.url(),
      idCard: z.instanceof(File),

})

export type artistSchemaType = z.infer<typeof artistSchema>
