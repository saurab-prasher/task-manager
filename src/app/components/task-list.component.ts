import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../service/Task.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { Task } from './task.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TaskStatusPipe } from '../pipes/status.pipe';

@Component({
  selector: 'app-list-task',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, ReactiveFormsModule, TaskStatusPipe],
})
export class TaskListComponent implements OnInit, OnDestroy {
  taskToBeEdited!: Task[];
  form!: FormGroup;

  tasks: Task[] = [];
  // @ViewChild('form', { static: true }) form!: ElementRef;
  editTaskId: string | null = null;

  subscription: Subscription = new Subscription();

  private editTaskSubscription: Subscription | null = null;
  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl(''),
    });

    this.subscription.add(
      this.taskService.taskList.subscribe({
        next: (task) => (this.tasks = task),
      })
    );
  }

  onSubmit() {
    const { title, description, status } = this.form.value;
    if (this.editTaskId != null) {
      const taskToBeEdited = this.tasks.find(
        (task) => task.id === this.editTaskId
      );

      if (taskToBeEdited) {
        const updatedTask = {
          ...taskToBeEdited,
          title,
          description,
          status,
        };

        this.taskService.updateTask(updatedTask);
      }
    }

    this.editTaskId = null;
    this.form.reset();
  }

  onEditTask(id: string) {
    // Unsubscribe from any previous edit task subscription
    if (this.editTaskSubscription) {
      this.editTaskSubscription.unsubscribe();
    }
    this.editTaskId = id;

    this.editTaskSubscription = this.taskService
      .getTaskById(this.editTaskId)
      .subscribe({
        next: (task) => {
          if (task) {
            this.form.patchValue({
              title: task.title,
              description: task.description,
              status: task.status,
            });
          } else {
            if (this.editTaskId !== null) {
              // Ensure editTaskId has not been reset
              console.log('Task not found');
            }
            this.form.reset();
          }
        },
      });
    // Add the new subscription to the main subscription for cleanup
    this.subscription.add(this.editTaskSubscription);
  }
  getTaskClass(task: Task) {
    switch (task.status) {
      case 'pending':
        return 'pending';
      case 'completed':
        return 'completed';
      case 'closed':
        return 'closed';
      default:
        return '';
    }
  }

  onCancel() {
    this.editTaskId = null;
    this.form.reset();
  }

  onDelete(id: string) {
    this.subscription.add(
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          if (this.editTaskId === id) {
            this.editTaskId = null;
            this.form.reset();
          }
        },
        error: (err) => console.error('Error deleting task', err),
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
