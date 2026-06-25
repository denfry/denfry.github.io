import { z } from 'zod'
export const contactSchema = z.object({
  name: z.string().min(1).max(80),
  contact: z.string().min(1).max(120),
  message: z.string().min(5).max(2000),
  website: z.string().max(0).optional(), // honeypot
})
export type ContactInput = z.infer<typeof contactSchema>
