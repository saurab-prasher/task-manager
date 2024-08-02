import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus } from '../components/task.model';

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
      return value.sort((a, b) => status[a.status] - status[b.status]);
    } else {
      return value;
    }
  }
}
