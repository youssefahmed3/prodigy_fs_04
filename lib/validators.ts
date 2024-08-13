import { z } from "zod"

export const signinFormSchema = z.object({
    // username: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
})

export const registerFormSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
    confirmPassword: z.string().min(2).max(50),
})

export const CreateGroupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    private: z.boolean(),
    type: z.string(),
})

/* 
username: string;
email: string;
avatar?: string;
password?: string;
provider?: string;
*/

export const SettingsSchema = z.object({
    username: z.string(),
    email: z.string(),
    avatar: z.string(),
    password: z.string().optional(),
    provider: z.string().optional(),
})