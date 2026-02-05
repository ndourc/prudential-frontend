import { z } from "zod";

export const createAssessmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  details: z.string().optional(),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
