import { Component, Input, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
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

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.tasks$ = this.tasksService.getTasks(this.todoId)
  }
}
