import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../components/task.model';

const status: TaskPriority = {
  low: 0,
  medium: 1,
  high: 2,
};

@Pipe({
  name: 'taskPriority',
  standalone: true,
})
export class TaskPriorityPipe implements PipeTransform {
  transform(value: any) {
    console.log(value);
    return value;
  }
}
