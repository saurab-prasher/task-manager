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
import { FilterPipe } from '../pipes/filter.pipe';

@Component({
  selector: 'app-list-task',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    TaskStatusPipe,
    FilterPipe,
  ],
})
export class TaskListComponent implements OnInit, OnDestroy {
  taskToBeEdited!: Task[];
  form!: FormGroup;

  tasks: Task[] = [];
  // @ViewChild('form', { static: true }) form!: ElementRef;
  editTaskId: string | null = null;
  filterTerm: string = '';
  openPanelIndex: number | null = null; // Track the index of the open panel

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
      priority: new FormControl(''),
    });

    this.subscription.add(
      this.taskService.taskList.subscribe({
        next: (task) => (this.tasks = task),
      })
    );
  }

  onSubmit() {
    const { title, description, status, priority } = this.form.value;
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
          priority,
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
              priority: task.priority,
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

  getPriorityClass(task: Task) {
    switch (task.priority) {
      case 'low':
        return 'low';
      case 'medium':
        return 'medium';
      case 'high':
        return 'high';
      default:
        return '';
    }
  }
  onCancel() {
    this.editTaskId = null;
    this.form.reset();
  }

  onFilterChange(term: string) {
    console.log(term);
    this.filterTerm = term;
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

  onToggleTask(index: number) {
    if (this.openPanelIndex === index) {
      this.openPanelIndex = null; // Close the currently open panel
    } else {
      this.openPanelIndex = index; // Open the clicked panel
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
