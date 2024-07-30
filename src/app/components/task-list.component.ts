import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskService } from '../service/Task.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { Task } from './task.model';

@Component({
  selector: 'app-list-task',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  // @ViewChild('form', { static: true }) form!: ElementRef;
  editTaskId: string | null = null;

  subscription: Subscription = new Subscription();
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.taskService.taskList.subscribe({
        next: (task) => (this.tasks = task),
      })
    );
  }

  onEditTask(id: string) {
    this.editTaskId = id;
    // this.taskService.editTask(id).subscribe();
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

  onDelete(id: string) {
    this.subscription.add(this.taskService.deleteTask(id).subscribe());
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
