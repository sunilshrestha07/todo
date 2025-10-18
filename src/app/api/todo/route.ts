// app/api/todos/route.ts
import {NextRequest, NextResponse} from 'next/server';
import '@/lib/db';
import {Todo} from '@/models/todo';
import {createTodoSchema} from '@/validation/todo';

export async function GET() {
  try {
    const todos = await Todo.find().sort({createdAt: -1}).lean();
    return NextResponse.json({data: todos}, {status: 200});
  } catch (err: any) {
    return NextResponse.json({error: 'Failed to fetch todos', details: err.message}, {status: 500});
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createTodoSchema.parse(body);
    const doc = await Todo.create(parsed);
    const todo = doc.toObject();
    return NextResponse.json({data: todo}, {status: 201});
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({error: 'Validation error', issues: err.issues}, {status: 400});
    }
    return NextResponse.json({error: 'Failed to create todo', details: err.message}, {status: 500});
  }
}
