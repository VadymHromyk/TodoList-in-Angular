import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, map } from 'rxjs'
import { environment } from 'src/environments/environment'
import { DomainTask, GetTasksResponse, Task, UpdateTaskModel } from '../models/task.models'
import { CommonResponse } from 'src/app/core/models/core.codels'

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks$ = new BehaviorSubject<DomainTask>({})

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
      .pipe(
        map(res => {
          const stateTasks = this.tasks$.getValue()
          const newTask = res.data.item
          const newTasks = [newTask, ...stateTasks[data.todoId]]
          stateTasks[data.todoId] = newTasks
          return stateTasks
        })
      )
      .subscribe((tasks: DomainTask) => {
        this.tasks$.next(tasks)
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
