// 'use client';

// import {useState} from 'react';

// interface User {
//   id: string;
//   email: string;
// }

// interface Todo {
//   _id: string;
//   title: string;
//   description?: string;
//   status: 'pending' | 'completed';
//   createdAt: string;
// }

// export default function Home() {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   // Auth functions
//   const signup = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({email, password}),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setUser(data.data.user);
//         setToken(data.data.token);
//         setMessage('Signup successful!');
//       } else {
//         setMessage(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       setMessage('Network error');
//     }
//     setLoading(false);
//   };

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({email, password}),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setUser(data.data.user);
//         setToken(data.data.token);
//         setMessage('Login successful!');
//         fetchTodos();
//       } else {
//         setMessage(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       setMessage('Network error');
//     }
//     setLoading(false);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     setTodos([]);
//     setMessage('Logged out');
//   };

//   // Todo functions
//   const fetchTodos = async () => {
//     if (!token) return;

//     try {
//       const response = await fetch('/api/todo', {
//         headers: {Authorization: `Bearer ${token}`},
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setTodos(data.data);
//       } else {
//         setMessage(`Error fetching todos: ${data.error}`);
//       }
//     } catch (error) {
//       setMessage('Network error');
//     }
//   };

//   const createTodo = async (title: string, description?: string) => {
//     if (!token) return;

//     try {
//       const response = await fetch('/api/todo', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({title, description}),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setTodos([data.data, ...todos]);
//         setMessage('Todo created!');
//       } else {
//         setMessage(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       setMessage('Network error');
//     }
//   };

//   const updateTodo = async (id: string, status: 'pending' | 'completed') => {
//     if (!token) return;

//     try {
//       const response = await fetch(`/api/todo/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({status}),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         setTodos(todos.map((todo) => (todo._id === id ? {...todo, status} : todo)));
//         setMessage('Todo updated!');
//       } else {
//         setMessage(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       setMessage('Network error');
//     }
//   };

//   const deleteTodo = async (id: string) => {
//     if (!token) return;

//     try {
//       const response = await fetch(`/api/todo/${id}`, {
//         method: 'DELETE',
//         headers: {Authorization: `Bearer ${token}`},
//       });

//       if (response.ok) {
//         setTodos(todos.filter((todo) => todo._id !== id));
//         setMessage('Todo deleted!');
//       } else {
//         const data = await response.json();
//         setMessage(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       setMessage('Network error');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-center mb-8">Todo App with Authentication</h1>

//         {message && <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">{message}</div>}

//         {!user ? (
//           <AuthForm onSignup={signup} onLogin={login} loading={loading} />
//         ) : (
//           <div>
//             <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//               Welcome, {user.email}!
//               <button onClick={logout} className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
//                 Logout
//               </button>
//             </div>

//             <TodoApp todos={todos} onCreateTodo={createTodo} onUpdateTodo={updateTodo} onDeleteTodo={deleteTodo} onFetchTodos={fetchTodos} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function AuthForm({
//   onSignup,
//   onLogin,
//   loading,
// }: {
//   onSignup: (email: string, password: string) => void;
//   onLogin: (email: string, password: string) => void;
//   loading: boolean;
// }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(true);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isLogin) {
//       onLogin(email, password);
//     } else {
//       onSignup(email, password);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50">
//           {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
//         </button>
//       </form>

//       <p className="text-center mt-4">
//         {isLogin ? "Don't have an account? " : 'Already have an account? '}
//         <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline">
//           {isLogin ? 'Sign up' : 'Login'}
//         </button>
//       </p>
//     </div>
//   );
// }

// function TodoApp({
//   todos,
//   onCreateTodo,
//   onUpdateTodo,
//   onDeleteTodo,
//   onFetchTodos,
// }: {
//   todos: Todo[];
//   onCreateTodo: (title: string, description?: string) => void;
//   onUpdateTodo: (id: string, status: 'pending' | 'completed') => void;
//   onDeleteTodo: (id: string) => void;
//   onFetchTodos: () => void;
// }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (title.trim()) {
//       onCreateTodo(title.trim(), description.trim() || undefined);
//       setTitle('');
//       setDescription('');
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-6">
//         <button onClick={onFetchTodos} className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
//           Refresh Todos
//         </button>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <input
//               type="text"
//               placeholder="Todo title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="Description (optional)"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
//             Add Todo
//           </button>
//         </form>
//       </div>

//       <div className="space-y-2">
//         {todos.length === 0 ? (
//           <p className="text-gray-500 text-center">No todos yet. Create one above!</p>
//         ) : (
//           todos.map((todo) => (
//             <div
//               key={todo._id}
//               className={`p-4 border rounded-lg ${todo.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <h3 className={`font-medium ${todo.status === 'completed' ? 'line-through text-gray-500' : ''}`}>{todo.title}</h3>
//                   {todo.description && (
//                     <p className={`text-sm text-gray-600 ${todo.status === 'completed' ? 'line-through' : ''}`}>{todo.description}</p>
//                   )}
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => onUpdateTodo(todo._id, todo.status === 'completed' ? 'pending' : 'completed')}
//                     className={`px-3 py-1 rounded text-sm ${
//                       todo.status === 'completed' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-500 text-white hover:bg-green-600'
//                     }`}
//                   >
//                     {todo.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
//                   </button>
//                   <button onClick={() => onDeleteTodo(todo._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import React from 'react';

export default function page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-3xl">This is Todo App "Task Managment System"</div>
    </div>
  );
}
