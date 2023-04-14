import { Component, Input } from '@angular/core'
import { Task } from 'src/app/todos/models/task.models'

@Component({
  selector: 'tl-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: Task

  removeTaskHandler() {}
}
