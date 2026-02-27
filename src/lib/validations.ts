import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  content: z.string().min(0).max(10000, 'Content too long'),
  isPinned: z.boolean().optional().default(false),
})

export const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  content: z.string().min(0).max(10000, 'Content too long').optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  position: z.number().optional(),
})

export const reorderNotesSchema = z.object({
  notes: z.array(
    z.object({
      id: z.string(),
      position: z.number(),
    })
  ),
})

export const createTaskListSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  color: z.string().optional().default('#3b82f6'),
})

export const updateTaskListSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  color: z.string().optional(),
  position: z.number().optional(),
})

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  reminder: z.string().optional().nullable(),
  isMyDay: z.boolean().optional().default(false),
  isImportant: z.boolean().optional().default(false),
  taskListId: z.string().min(1, 'Task list is required'),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  description: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  reminder: z.string().optional().nullable(),
  completed: z.boolean().optional(),
  position: z.number().optional(),
  isMyDay: z.boolean().optional(),
  isImportant: z.boolean().optional(),
  taskListId: z.string().optional(),
})

export const reorderTasksSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      position: z.number(),
    })
  ),
})

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  image: z.string().url('Invalid image URL').optional(),
}).refine(
  data => data.name !== undefined || data.email !== undefined || data.image !== undefined,
  {
    message: 'At least one field must be provided',
    path: [],
  }
)