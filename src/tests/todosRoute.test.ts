import {NextRequest} from 'next/server';
import {GET as getTodos, POST as postTodo} from '@/app/api/todo/route';
import {GET as getTodoById, PUT as putTodo, DELETE as deleteTodo} from '@/app/api/todo/[id]/route';
import {Todo} from '@/models/todo';
import mongoose from 'mongoose';

// Mock DB and Todo model
jest.mock('@/lib/db');
jest.mock('@/models/todo', () => ({
  Todo: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn(),
    create: jest.fn(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
  },
}));

describe('Todos API Routes', () => {
  afterEach(() => jest.clearAllMocks());

  const validId = new mongoose.Types.ObjectId().toString();
  const invalidId = '123';

  // ===== GET /api/todos =====
  describe('GET /api/todos', () => {
    it('returns todos successfully', async () => {
      const mockTodos = [{id: 1, title: 'Test Todo'}];
      (Todo.find().sort().lean as jest.Mock).mockResolvedValue(mockTodos);

      const res = await getTodos();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toEqual(mockTodos);
    });

    it('handles errors', async () => {
      (Todo.find().sort().lean as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await getTodos();
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Failed to fetch todos');
      expect(json.details).toBe('DB error');
    });
  });

  // ===== POST /api/todos =====
  describe('POST /api/todos', () => {
    it('creates a todo successfully', async () => {
      const mockTodo = {id: 1, title: 'New Todo'};
      const mockDoc = {toObject: jest.fn().mockReturnValue(mockTodo)};
      (Todo.create as jest.Mock).mockResolvedValue(mockDoc);

      const req = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify({title: 'New Todo'}),
      }) as any;

      const res = await postTodo(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.data).toEqual(mockTodo);
    });

    it('returns validation error', async () => {
      const req = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify({}), // invalid
      }) as any;

      const res = await postTodo(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation error');
      expect(json.issues).toBeDefined();
    });

    it('handles creation failure', async () => {
      (Todo.create as jest.Mock).mockRejectedValue(new Error('DB insert error'));

      const req = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify({title: 'Fail Todo'}),
      }) as any;

      const res = await postTodo(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Failed to create todo');
      expect(json.details).toBe('DB insert error');
    });
  });

  // ===== GET /api/todos/[id] =====
  describe('GET /api/todos/[id]', () => {
    it('returns a todo successfully', async () => {
      const mockTodo = {id: validId, title: 'Test Todo'};
      (Todo.findById().lean as jest.Mock).mockResolvedValue(mockTodo);

      const res = await getTodoById({} as any, {params: Promise.resolve({id: validId})});
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toEqual(mockTodo);
    });

    it('returns 404 if not found', async () => {
      (Todo.findById().lean as jest.Mock).mockResolvedValue(null);

      const res = await getTodoById({} as any, {params: Promise.resolve({id: validId})});
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error).toBe('Not found');
    });

    it('returns 400 for invalid ID', async () => {
      const res = await getTodoById({} as any, {params: Promise.resolve({id: invalidId})});
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Invalid ID');
    });
  });

  // ===== PUT /api/todos/[id] =====
  describe('PUT /api/todos/[id]', () => {
    it('updates a todo successfully', async () => {
      const updatedTodo = {id: validId, title: 'Updated Todo'};
      (Todo.findByIdAndUpdate().lean as jest.Mock).mockResolvedValue(updatedTodo);

      const req = new NextRequest('http://localhost/api/todos', {
        method: 'PUT',
        body: JSON.stringify({title: 'Updated Todo'}),
      }) as any;

      const res = await putTodo(req, {params: Promise.resolve({id: validId})});
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toEqual(updatedTodo);
    });

    it('returns validation error', async () => {
      const req = new NextRequest('http://localhost/api/todos', {
        method: 'PUT',
        body: JSON.stringify({}), // invalid
      }) as any;

      const res = await putTodo(req, {params: Promise.resolve({id: validId})});
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation error');
    });

    it('returns 404 if not found', async () => {
      (Todo.findByIdAndUpdate().lean as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/todos', {
        method: 'PUT',
        body: JSON.stringify({title: 'Updated Todo'}),
      }) as any;

      const res = await putTodo(req, {params: Promise.resolve({id: validId})});
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error).toBe('Not found');
    });
  });

  // ===== DELETE /api/todos/[id] =====
  describe('DELETE /api/todos/[id]', () => {
    it('deletes a todo successfully', async () => {
      (Todo.findByIdAndDelete().lean as jest.Mock).mockResolvedValue(true);

      const res = await deleteTodo({} as any, {params: Promise.resolve({id: validId})});
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toBe('Deleted successful');
    });

    it('returns 404 if not found', async () => {
      (Todo.findByIdAndDelete().lean as jest.Mock).mockResolvedValue(false);

      const res = await deleteTodo({} as any, {params: Promise.resolve({id: validId})});
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error).toBe('Not found');
    });

    it('returns 400 for invalid ID', async () => {
      const res = await deleteTodo({} as any, {params: Promise.resolve({id: invalidId})});
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Invalid ID');
    });
  });
});
