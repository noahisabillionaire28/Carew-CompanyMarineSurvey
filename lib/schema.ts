import { z } from "zod";
import { services } from "@/data/services";
import { equipmentTypes, locations } from "@/data/site";

export const serviceTitles = services.map((s) => s.title) as [string, ...string[]];
export const equipmentOptions = [...equipmentTypes, "Other"] as [string, ...string[]];
export const locationOptions = [...locations] as [string, ...string[]];

export const requestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  company: z.string().trim().min(2, "Please enter your company name.").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(30)
    .regex(/^[0-9+()\-.\s]+$/, "Please enter a valid phone number."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  service: z.enum(serviceTitles, { message: "Please choose a service." }),
  equipment: z.enum(equipmentOptions, { message: "Please choose an equipment type." }),
  location: z.enum(locationOptions, { message: "Please choose a location." }),
  units: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(100000)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  preferredDate: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
  // Honeypot — must stay empty
  website: z.string().max(200).optional().or(z.literal("")),
});

export type RequestInput = z.input<typeof requestSchema>;
export type RequestData = z.output<typeof requestSchema>;

/** Same fields without the honeypot — used by the staff CRM's manual entry form. */
export const leadInputSchema = requestSchema.omit({ website: true });
export type LeadFormInput = z.input<typeof leadInputSchema>;
export type LeadFormData = z.output<typeof leadInputSchema>;
