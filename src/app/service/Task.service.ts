import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { Task } from '../components/task.model';

// DUMMY tasks
const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    title: 'Organize Team Meeting',
    description:
      'Schedule and organize the monthly team meeting to discuss project updates, upcoming deadlines, and address any team concerns. Prepare an agenda and send out invites to all team members.',

    status: 'pending',
  },
  {
    id: '2',
    title: 'Update Project Documentation',
    description:
      'Review and update the project documentation to reflect recent changes and additions. Ensure all sections are accurate and comprehensive, and add any new information that has emerged during the latest development phase.',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Conduct User Testing',
    description:
      'Plan and conduct user testing for the new feature release. Recruit participants, prepare test scenarios, and gather feedback. Analyze the results to identify any usability issues or areas for improvement.',
    status: 'closed',
  },
  {
    id: '4',
    title: 'Design Marketing Campaign',
    description:
      'Develop a comprehensive marketing campaign for the upcoming product launch. Create promotional materials, plan social media content, and coordinate with the sales team to align on goals and messaging. Set up tracking to measure campaign effectiveness.',
    status: 'pending',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  taskList = new BehaviorSubject<Task[]>(DUMMY_TASKS);

  addTask(task: Task) {
    this.taskList.next([...this.taskList.getValue(), task]);
  }

  getTasks(): Observable<Task[]> {
    return this.taskList.asObservable();
  }

  getTaskById(id: string) {
    return this.taskList.pipe(
      map((tasks) => tasks.find((task) => task.id === id))
    );
  }
  editTask(id: string): Task | null {
    return this.taskList.getValue().find((task) => task.id === id) || null;
  }

  updateTask(task: Task) {
    const tasks = this.taskList.getValue();

    const taskIndex = tasks.findIndex((t) => t.id === task.id);

    if (taskIndex > -1) {
      tasks[taskIndex] = task;
      this.taskList.next([...tasks]);
    }
  }
  deleteTask(id: string): Observable<void> {
    const tasks = this.taskList.getValue().filter((task) => task.id !== id);
    this.taskList.next(tasks);
    return of();
  }
}
