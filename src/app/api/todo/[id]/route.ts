// app/api/todos/[id]/route.ts
import {NextRequest, NextResponse} from 'next/server';
import '@/lib/db';
import {getTodo, updateTodo, deleteTodo} from '@/controllers/todoController';
import {updateTodoSchema} from '@/validation/todo';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, context: {params: {id: string}}) {
  try {
    const {params} = context;
    const id = params.id;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({error: 'Invalid ID'}, {status: 400});
    }
    const todo = await getTodo(id);
    if (!todo) return NextResponse.json({error: 'Not found'}, {status: 404});
    return NextResponse.json({data: todo}, {status: 200});
  } catch (err: any) {
    return NextResponse.json({error: 'Failed to fetch todo', details: err.message}, {status: 500});
  }
}

export async function PUT(req: NextRequest, context: {params: {id: string}}) {
  try {
    const {params} = context;
    const id = params.id;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({error: 'Invalid ID'}, {status: 400});
    }
    const body = await req.json();
    const parsed = updateTodoSchema.parse(body);
    const updated = await updateTodo(id, parsed);
    if (!updated) return NextResponse.json({error: 'Not found'}, {status: 404});
    return NextResponse.json({data: updated}, {status: 200});
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({error: 'Validation error', issues: err.issues}, {status: 400});
    }
    return NextResponse.json({error: 'Failed to update todo', details: err.message}, {status: 500});
  }
}

export async function DELETE(_req: NextRequest, {params}: {params: {id: string}}) {
  try {
    const {id} = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({error: 'Invalid ID'}, {status: 400});
    }
    const deleted = await deleteTodo(id);
    if (!deleted) return NextResponse.json({error: 'Not found'}, {status: 404});
    return NextResponse.json({message: 'Deleted successful'}, {status: 200});
  } catch (err: any) {
    return NextResponse.json({error: 'Failed to delete todo', details: err.message}, {status: 500});
  }
}
