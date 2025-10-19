import {NextRequest} from 'next/server';
import {POST as signup} from '@/app/api/auth/signup/route';
import {POST as login} from '@/app/api/auth/login/route';
import {User} from '@/models/user';

// Mock DB and User model
jest.mock('@/lib/db');
jest.mock('@/models/user', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Authentication API Routes', () => {
  afterEach(() => jest.clearAllMocks());

  // ===== POST /api/auth/signup =====
  describe('POST /api/auth/signup', () => {
    it('creates a new user successfully', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        toObject: jest.fn().mockReturnValue({
          _id: 'user123',
          email: 'test@example.com',
        }),
      };
      (User.findOne as jest.Mock).mockResolvedValue(null); // User doesn't exist
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const req = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const res = await signup(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.message).toBe('User created successfully');
      expect(json.data.user.email).toBe('test@example.com');
      expect(json.data.token).toBeDefined();
    });

    it('returns 409 if user already exists', async () => {
      const existingUser = {_id: 'user123', email: 'test@example.com'};
      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      const req = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const res = await signup(req);
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.error).toBe('User with this email already exists');
    });

    it('returns validation error for invalid email', async () => {
      const req = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
        }),
      });

      const res = await signup(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation error');
      expect(json.issues).toBeDefined();
    });

    it('returns validation error for short password', async () => {
      const req = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123',
        }),
      });

      const res = await signup(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation error');
      expect(json.issues).toBeDefined();
    });

    it('handles database errors', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const req = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const res = await signup(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Failed to create user');
      expect(json.details).toBe('Database connection failed');
    });
  });

  // ===== POST /api/auth/login =====
  describe('POST /api/auth/login', () => {
    it('logs in user successfully', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const res = await login(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toBe('Login successful');
      expect(json.data.user.email).toBe('test@example.com');
      expect(json.data.token).toBeDefined();
    });

    it('returns 401 for non-existent user', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      });

      const res = await login(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe('Invalid email or password');
    });

    it('returns 401 for incorrect password', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      });

      const res = await login(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe('Invalid email or password');
    });

    it('returns validation error for invalid email', async () => {
      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
        }),
      });

      const res = await login(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation error');
      expect(json.issues).toBeDefined();
    });

    it('handles database errors', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const res = await login(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Failed to login');
      expect(json.details).toBe('Database connection failed');
    });
  });
});
