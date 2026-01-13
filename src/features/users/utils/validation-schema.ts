import { ROLE_VALUES, ROLES } from '@/types/roles';
import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const userProfileSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length >= 1, 'Profile picture is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max file size is 5MB.'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    )
    .optional()
    .or(z.string()),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  role: z.enum(ROLE_VALUES, {
    message: 'Please select a valid role.'
  })
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
