import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StudentService } from './core/services/student.service';
import { Student } from './core/models/student.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  
  private fb = inject(FormBuilder);
  protected studentService = inject(StudentService);
  editingId = signal<number | null>(null);
  courses = ['Angular', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Django', 'Machine Learning', 'Data Science'];
  displayedColumns: string[] = ['name', 'email', 'course', 'gender', 'actions'];
  studentForm = this.fb.nonNullable.group({
    id: [0],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    course: ['', Validators.required],
    gender: ['Male'],
    hobbies: [false],
    bio: [''],
  });

  /**
   * Handles form submission. 
   * Determines whether to add a new record or update an existing one based on editingId.
   */
  onSubmit() {
    if (this.studentForm.valid) {
      const data = this.studentForm.value as Student;
      if (this.editingId()) {
        this.studentService.updateStudent({ ...data, id: this.editingId()! });
      } else {
        this.studentService.addStudent(data);
      }
      this.resetForm();
    }
  }

  /**
   * Prepares the form for editing an existing student record.
   * @param student - The student object selected from the table.
   */
  onEdit(student: Student) {
    this.editingId.set(student.id!);
    this.studentForm.patchValue(student);
  }

  /**
   * Requests the service to delete a student record by ID.
   * @param id - The unique identifier of the student.
   */
  onDelete(id: number) {
    this.studentService.deleteStudent(id);
  }

  /**
   * Resets the form state and clears the current editing ID.
   * Returns the form to its default initial values.
   */
  resetForm() {
    this.editingId.set(null);
    this.studentForm.reset({ gender: 'Male', hobbies: false });
  }
}
