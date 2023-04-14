import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TaskStatusEnum } from 'src/app/core/enums/taskStatus.enum'
import { Task, UpdateTaskModel } from 'src/app/todos/models/task.models'

@Component({
  selector: 'tl-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: Task
  @Output() removeTaskEvent = new EventEmitter<{ todoId: string; taskId: string }>()
  @Output() changeTaskEvent = new EventEmitter<{
    todoId: string
    taskId: string
    model: UpdateTaskModel
  }>()

  taskStatusEnum = TaskStatusEnum

  removeTaskHandler() {
    this.removeTaskEvent.emit({ todoId: this.task.todoListId, taskId: this.task.id })
  }

  changeTaskStatusHandler(event: MouseEvent) {
    const newStatus = (event.currentTarget as HTMLInputElement).checked
    const model: UpdateTaskModel = {
      ...this.task,
      status: newStatus ? this.taskStatusEnum.complited : this.taskStatusEnum.active,
    }
    this.changeTaskEvent.emit({ todoId: this.task.todoListId, taskId: this.task.id, model })
  }
}
