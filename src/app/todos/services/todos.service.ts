import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { BehaviorSubject } from 'rxjs'
import { DomainTodo, FilterType, Todo } from '../models/todos.models'
import { CommonResponse } from 'src/app/core/models/core.codels'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  todos$ = new BehaviorSubject<DomainTodo[]>([])

  constructor(private http: HttpClient) {}

  getTodos() {
    this.http
      .get<Todo[]>(`${environment.baseUrl}/todo-lists`)
      .pipe(
        map((todos: Todo[]) => {
          const newTodos: DomainTodo[] = todos.map(tl => ({ ...tl, filter: 'all' }))
          return newTodos
        })
      )
      .subscribe((todos: DomainTodo[]) => {
        this.todos$.next(todos)
      })
  }

  addTodo(title: string) {
    this.http
      .post<CommonResponse<{ item: Todo }>>(`${environment.baseUrl}/todo-lists`, { title })
      .pipe(
        map(res => {
          const stateTodos: DomainTodo[] = this.todos$.getValue()
          const newTodo: DomainTodo = { ...res.data.item, filter: 'all' }
          return [newTodo, ...stateTodos]
        })
      )
      .subscribe((todos: DomainTodo[]) => {
        this.todos$.next(todos)
      })
  }

  removeTodo(todoId: string) {
    this.http
      .delete<CommonResponse>(`${environment.baseUrl}/todo-lists/${todoId}`)
      .pipe(
        map(() => {
          const stateTodos = this.todos$.getValue()
          return stateTodos.filter(tl => tl.id != todoId)
        })
      )
      .subscribe(todos => {
        this.todos$.next(todos)
      })
  }

  updateTodoTitle(data: { todoId: string; title: string }) {
    this.http
      .put<CommonResponse>(`${environment.baseUrl}/todo-lists/${data.todoId}`, {
        title: data.title,
      })
      .pipe(
        map(() => {
          const stateTodos = this.todos$.getValue()
          return stateTodos.map(tl => {
            if (tl.id === data.todoId) {
              return { ...tl, title: data.title }
            } else {
              return tl
            }
          })
        })
      )
      .subscribe(todos => {
        this.todos$.next(todos)
      })
  }

  changeFilter(data: { todoId: string; filter: FilterType }) {
    const stateTodos = this.todos$.getValue()
    const newTodos = stateTodos.map(tl => {
      if (tl.id === data.todoId) {
        return { ...tl, filter: data.filter }
      } else {
        return tl
      }
    })
    this.todos$.next(newTodos)
  }
}
