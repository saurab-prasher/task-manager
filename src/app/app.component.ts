import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { NewTaskComponent } from './components/add-new-task.component';
import { TaskListComponent } from './components/task-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewTaskSearchComponent } from './components/add-task-search.component';
import { TaskDetailsComponent } from './components/task-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

    TaskListComponent,
    FontAwesomeModule,
    NewTaskSearchComponent,
    TaskDetailsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'task-manager';
}
