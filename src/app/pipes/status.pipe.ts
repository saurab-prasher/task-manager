import { Pipe, PipeTransform } from '@angular/core';
import type { Task, TaskStatus } from '../components/task.model';
const status: TaskStatus = {
  pending: 0,
  completed: 1,
  closed: 2,
};

@Pipe({
  name: 'taskStatus',
  standalone: true,
})
export class TaskStatusPipe implements PipeTransform {
  transform(value: Task[]) {
    return value.sort((a, b) => status[a.status] - status[b.status]);
  }
}
