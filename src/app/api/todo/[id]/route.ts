// app/api/todos/[id]/route.ts
import {NextRequest, NextResponse} from 'next/server';
import '@/lib/db';
import {Todo} from '@/models/todo';
import {updateTodoSchema} from '@/validation/todo';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, context: {params: Promise<{id: string}>}) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({error: 'Invalid ID'}, {status: 400});
    }
    const todo = await Todo.findById(id).lean();
    if (!todo) return NextResponse.json({error: 'Not found'}, {status: 404});
    return NextResponse.json({data: todo}, {status: 200});
  } catch (err: any) {
    return NextResponse.json({error: 'Failed to fetch todo', details: err.message}, {status: 500});
  }
}

export async function PUT(req: NextRequest, context: {params: Promise<{id: string}>}) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({error: 'Invalid ID'}, {status: 400});
    }
    const body = await req.json();
    const parsed = updateTodoSchema.parse(body);
    const updated = await Todo.findByIdAndUpdate(id, parsed, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) return NextResponse.json({error: 'Not found'}, {status: 404});
    return NextResponse.json({data: updated}, {status: 200});
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({error: 'Validation error', issues: err.issues}, {status: 400});
    }
    return NextResponse.json({error: 'Failed to update todo', details: err.message}, {status: 500});
  }
}

export async function DELETE(_req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
    const resolvedParams = await params;
    const {id} = resolvedParams;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({error: 'Invalid ID'}, {status: 400});
    }
    const deleted = await Todo.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({error: 'Not found'}, {status: 404});
    return NextResponse.json({message: 'Deleted successful'}, {status: 200});
  } catch (err: any) {
    return NextResponse.json({error: 'Failed to delete todo', details: err.message}, {status: 500});
  }
}
