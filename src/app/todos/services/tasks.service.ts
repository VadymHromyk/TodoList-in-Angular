import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, map } from 'rxjs'
import { ResultCodeEnum } from 'src/app/core/enums/resultCode.enum'
import { CommonResponse } from 'src/app/core/models/core.codels'
import { environment } from 'src/environments/environment'
import {
  DomainTask,
  GetTasksResponse,
  Task,
  TaskErrorMessage,
  UpdateTaskModel,
} from '../models/task.models'

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks$ = new BehaviorSubject<DomainTask>({})
  errorMessage$ = new BehaviorSubject<TaskErrorMessage | null>(null)

  constructor(private http: HttpClient) {}

  getTasks(todoId: string) {
    this.http
      .get<GetTasksResponse>(`${environment.baseUrl}/todo-lists/${todoId}/tasks`)
      .pipe(map(t => t.items))
      .subscribe((tasks: Task[]) => {
        const stateTasks = this.tasks$.getValue()
        stateTasks[todoId] = tasks
        this.tasks$.next(stateTasks)
      })
  }

  addTask(data: { todoId: string; title: string }) {
    this.http
      .post<CommonResponse<{ item: Task }>>(
        `${environment.baseUrl}/todo-lists/${data.todoId}/tasks`,
        {
          title: data.title,
        }
      )
      .subscribe(res => {
        const isSuccess = res.resultCode === ResultCodeEnum.success
        if (isSuccess) {
          const stateTasks = this.tasks$.getValue()
          const newTask = res.data.item
          const newTasks = [newTask, ...stateTasks[data.todoId]]
          stateTasks[data.todoId] = newTasks
          this.tasks$.next(stateTasks)
        } else {
          this.errorMessage$.next({ todoId: data.todoId, message: res.messages[0] })
        }
      })
  }

  removeTask(data: { todoId: string; taskId: string }) {
    this.http
      .delete<CommonResponse>(
        `${environment.baseUrl}/todo-lists/${data.todoId}/tasks/${data.taskId}`
      )
      .pipe(
        map(() => {
          const stateTasks = this.tasks$.getValue()
          const newTasks = stateTasks[data.todoId].filter(task => task.id != data.taskId)
          stateTasks[data.todoId] = newTasks
          return stateTasks
        })
      )
      .subscribe((tasks: DomainTask) => {
        this.tasks$.next(tasks)
      })
  }

  updateTask(data: { todoId: string; taskId: string; model: UpdateTaskModel }) {
    this.http
      .put<CommonResponse>(
        `${environment.baseUrl}/todo-lists/${data.todoId}/tasks/${data.taskId}`,
        data.model
      )
      .pipe(
        map(() => {
          const stateTasks = this.tasks$.getValue()
          const newTasks = stateTasks[data.todoId].map(task => {
            if (task.id === data.taskId) {
              return { ...task, ...data.model }
            } else {
              return task
            }
          })
          stateTasks[data.todoId] = newTasks
          return stateTasks
        })
      )
      .subscribe((tasks: DomainTask) => {
        this.tasks$.next(tasks)
      })
  }
}
