import {Todo} from '@/models/todo';
import type {CreateTodoInput, UpdateTodoInput} from '@/validation/todo';

export async function listTodos() {
  return Todo.find().sort({createdAt: -1}).lean();
}

export async function getTodo(id: string) {
  return Todo.findById(id).lean();
}

export async function createTodo(input: CreateTodoInput) {
  const doc = await Todo.create(input);
  return doc.toObject();
}

export async function updateTodo(id: string, input: UpdateTodoInput) {
  return Todo.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).lean();
}

export async function deleteTodo(id: string) {
  return Todo.findByIdAndDelete(id).lean();
}
