import {z} from "zod";

export const SigninSchema = z.object({
    userEmail: z.string().email({ message: "Please enter a valid email address." }),
    userPassword: z.string().min(8, { message: "Password must be at least 8 characters." })
});

export type SigninData = z.infer<typeof SigninSchema>;
