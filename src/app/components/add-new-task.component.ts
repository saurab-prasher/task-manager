import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../service/Task.service';
import { NgIf } from '@angular/common';

interface Task {
  title: string;
  description: string;
}

@Component({
  selector: 'app-new-task',
  templateUrl: './add-new-task.component.html',
  standalone: true,
  imports: [FormsModule, NgIf],
})
export class NewTaskComponent {
  title = '';
  description = '';
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  onSubmit() {
    if (!this.title && !this.description) {
      this.errorMessage = 'Title and description are required.';
      return;
    }
    this.taskService.addTask({
      id: Date.now().toString(),
      title: this.title,
      description: this.description,
      status: 'pending',
    });

    this.title = '';
    this.description = '';
    this.errorMessage = '';
  }
}
