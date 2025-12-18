export interface Student {
  id?: number;          // Optional for new students, required for existing ones
  name: string;
  email: string;
  course: string;
  gender: 'Male' | 'Female' | 'Other';    // Using literal types for better safety
  hobbies: boolean;
  bio: string;          // For the textarea
}