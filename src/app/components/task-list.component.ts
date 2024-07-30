import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskService } from '../service/Task.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { map, Subscription, tap } from 'rxjs';
import { Task } from './task.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-list-task',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, ReactiveFormsModule],
})
export class TaskListComponent implements OnInit, OnDestroy {
  taskToBeEdited!: Task[];
  form!: FormGroup;

  tasks: Task[] = [];
  // @ViewChild('form', { static: true }) form!: ElementRef;
  editTaskId: string | null = null;

  subscription: Subscription = new Subscription();
  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: new FormControl(''),
      description: new FormControl(''),
    });

    this.subscription.add(
      this.taskService.taskList.subscribe({
        next: (task) => (this.tasks = task),
      })
    );
  }

  onSubmit() {
    const { title, description } = this.form.value;
    if (this.editTaskId != null) {
      const taskToBeEdited = this.taskService.editTask(this.editTaskId);

      if (taskToBeEdited != null) {
        const updatedTask = {
          ...taskToBeEdited,
          title,
          description,
        };
        this.taskService.updateTask(updatedTask);
      }
    }

    this.editTaskId = null;
  }

  onEditTask(id: string) {
    this.editTaskId = id;

    this.subscription.add(
      this.taskService
        .getTasks()
        .pipe(map((task) => task.find((task) => task.id === id)))
        .subscribe({
          next: (task) => {
            if (task) {
              this.form.patchValue({
                title: task.title,
                description: task.description,
              });
            } else {
              console.log('Task not found');
              this.form.reset();
            }
          },
        })
    );
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
  }

  onDelete(id: string) {
    this.subscription.add(this.taskService.deleteTask(id).subscribe());
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
