import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../service/Task.service';

@Component({
  selector: 'app-new-task-search',
  templateUrl: './add-task-search.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class NewTaskSearchComponent {
  title = '';
  priority: 'low' | 'medium' | 'high' = 'low';
  constructor(private taskService: TaskService) {}

  onSubmit() {
    if (!this.title) {
      return;
    }
    this.taskService.addTask({
      id: Date.now().toString(),
      title: this.title,
      status: 'pending',
      priority: this.priority,
    });
    this.title = '';
    this.priority = 'low';
  }

  onCancel() {
    this.title = '';
  }
}
