import { z } from "zod";
import { validateUniversityEmail } from "./domain-validator";

export const emailAuthSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email format")
    .refine((val) => validateUniversityEmail(val).isValid, {
      message: "Email must be from an allowed university domain (e.g. @lpu.in, @thapar.edu)",
    }),
  consentDpdp: z.boolean().refine((val) => val === true, {
    message: "You must accept the DPDP Privacy Notice & Terms to register",
  }),
});

export const otpVerifySchema = z.object({
  otp: z
    .string()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain digits only"),
});

export const onboardingStep1Schema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .trim(),
  age: z
    .number({ invalid_type_error: "Age is required" })
    .min(18, "You must be at least 18 years old to join Vibe Check")
    .max(40, "Please enter a valid student age"),
  gender: z.enum(["Male", "Female", "Non-binary", "Prefer not to say"]),
  phone: z
    .string()
    .regex(/^[+]?[0-9\s-]{10,15}$/, "Please provide a valid phone number (e.g. +91 9876543210)")
    .optional()
    .or(z.literal("")),
  course: z.string().min(2, "Please select or enter your course"),
  branch: z.string().min(2, "Please enter your department or branch"),
  year: z.number().min(1, "Year must be 1 to 5").max(5, "Year must be 1 to 5"),
  hostel_or_day: z.enum(["Hostel", "Day Scholar"]),
  avatar_url: z.string().url("Please provide a valid avatar URL").optional().or(z.literal("")),
  bio: z
    .string()
    .max(150, "Bio cannot exceed 150 characters")
    .min(10, "Bio should be at least 10 characters so peers know a bit about you"),
});

export const onboardingStep2Schema = z.object({
  likes: z.array(z.string()).min(3, "Please choose at least 3 interests you like"),
  dislikes: z.array(z.string()).optional(),
  topLikes: z
    .array(z.string())
    .max(3, "You can pick up to 3 top interests")
    .refine((val) => val.length <= 3, "Max 3 top interests"),
  customInterest: z.string().max(40).optional(),
});

export const onboardingStep3Schema = z.object({
  purposes: z
    .array(
      z.enum([
        "Friends",
        "Study Partners",
        "Project Teammates",
        "Sports & Hobbies",
        "Event Buddies",
      ])
    )
    .min(1, "Please select at least 1 campus goal"),
  availability: z
    .array(
      z.enum([
        "Weekday Evenings",
        "Weekends",
        "Between Classes",
        "Anytime Flexible",
      ])
    )
    .min(1, "Please select your typical availability"),
  languages: z.array(z.string()).min(1, "Please select at least one language"),
});

export const sayHiSchema = z.object({
  receiverId: z.string().min(1),
  message: z
    .string()
    .max(200, "Intro note cannot exceed 200 characters")
    .default("Hey! Saw your profile on Vibe Check and would love to connect."),
});

export const reportSchema = z.object({
  reportedId: z.string().min(1),
  reason: z.enum([
    "Inappropriate or offensive behavior",
    "Spam, advertising or commercial promotion",
    "Fake or impersonated profile",
    "Harassment or unwanted contact",
    "Romantic / dating propositions",
    "Other violation",
  ]),
  details: z.string().max(500, "Details cannot exceed 500 characters").optional(),
});
