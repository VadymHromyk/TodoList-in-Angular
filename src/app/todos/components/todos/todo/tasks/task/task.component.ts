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

  isEditMode = false
  newTitle = ''

  removeTaskHandler() {
    this.removeTaskEvent.emit({ todoId: this.task.todoListId, taskId: this.task.id })
  }

  activateEditModeHandler() {
    this.isEditMode = true
    this.newTitle = this.task.title
  }

  changeTaskStatusHandler(completed: boolean) {
    this.changeTask({
      status: completed ? this.taskStatusEnum.completed : this.taskStatusEnum.active,
    })
  }

  editTaskTitleHandler() {
    this.changeTask({ title: this.newTitle })
    this.isEditMode = false
    this.newTitle = ''
  }

  changeTask(patch: Partial<UpdateTaskModel>) {
    const model: UpdateTaskModel = {
      ...this.task,
      ...patch,
    }
    this.changeTaskEvent.emit({ todoId: this.task.todoListId, taskId: this.task.id, model })
  }
}
