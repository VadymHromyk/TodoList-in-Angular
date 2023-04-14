import { Component, Input, OnInit } from '@angular/core'
import { Observable, map } from 'rxjs'
import { Task } from 'src/app/todos/models/task.models'
import { TasksService } from 'src/app/todos/services/tasks.service'

@Component({
  selector: 'tl-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  @Input() todoId!: string

  tasks$?: Observable<Task[]>

  taskTitle = ''

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    // subscribe
    this.tasks$ = this.tasksService.tasks$.pipe(map(allTasks => allTasks[this.todoId])) //map from DomainTasks -> our tasks
    this.tasksService.getTasks(this.todoId)
  }

  addTaskHandler() {
    this.tasksService.addTask({ todoId: this.todoId, title: this.taskTitle })
    this.taskTitle = ''
  }
}
