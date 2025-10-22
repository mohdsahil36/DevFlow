import { z } from "zod";

export const taskValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required!")
    .max(100, "Title too long!"),
  description: z
    .string()
    .min(1, "Task description is required!")
    .max(200, "Description too long!"),
  priority: z.enum(["low", "medium", "high"], "Enter a valid priority value!"),
  dueDate: z.date().optional(),
});

export type TaskFormData = z.infer<typeof taskValidationSchema>;
