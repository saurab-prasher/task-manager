import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../components/task.model';

const priority: TaskPriority = {
  low: 0,
  medium: 1,
  high: 2,
};

const status: TaskStatus = {
  pending: 0,
  completed: 1,
  closed: 2,
};

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(value: Task[], searchText: string) {
    if (searchText === 'status') {
      return value.sort((a, b) => status[a.status] - status[b.status]);
    } else if (searchText === 'priority') {
      return value.sort((a, b) => priority[b.priority] - priority[a.priority]);
    } else {
      return value;
    }
  }
}
