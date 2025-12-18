import { Injectable, signal, effect } from '@angular/core';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly STORAGE_KEY = 'students_list';
  private studentsSignal = signal<Student[]>(this.getStoredData());
  students = this.studentsSignal.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.studentsSignal()));
    });
  }

  /**
   * Adds a new student record. The effect() in the constructor
   * handles the persistence to local storage automatically.
   * @param student - The student data captured from the reactive form.
   */
  addStudent(student: Student) {
    const newStudent = { ...student, id: Date.now() };
    this.studentsSignal.update((allStudents) => [...allStudents, newStudent]);
  }

  /**
   * Updates an existing student record by matching the unique ID.
   * @param updatedStudent - The modified student object.
   */
  updateStudent(updatedStudent: Student) {
    this.studentsSignal.update((allStudents) =>
      allStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  }

  /**
   * Removes a student record from the state based on the ID.
   * @param id - The unique identifier of the student to be removed.
   */
  deleteStudent(id: number) {
    this.studentsSignal.update((allStudents) =>
      allStudents.filter((s) => s.id !== id)
    );
  }

  /**
   * Loads student records from browser local storage.
   * @returns An array of Student objects or an empty array if no data is found.
   */
  private getStoredData(): Student[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
