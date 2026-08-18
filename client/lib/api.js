const API_URL = process.env.NEXT_PUBLIC_API_URL;

const request = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const data = await response.json();
  if(!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }
  return data;
};

const registerUser = (name, email, password) => request("/api/auth/register", {
  method: "POST",
  body: { name, email, password },
});
const loginUser = (email, password) => request("/api/auth/login", {
  method: "POST",
  body: { email, password },
});

const verifyToken = () => request("/api/auth/verify");

const getBoards = () => request("/api/boards");

const createBoard = (title) => request("/api/boards", {
  method: "POST",
  body: { title },
});

const deleteBoard = (id) => request(`/api/boards/${id}`, {
  method: "DELETE",
});

const getTasks = (boardId) => request(`/api/tasks/${boardId}`);

const createTask = (title, description, boardId) => request("/api/tasks", {
  method: "POST",
  body: { title, description, boardId },
});

const updateTask = (id, status) => request(`/api/tasks/${id}`, {
  method: "PATCH",
  body: { status },
});

const deleteTask = (id) => request(`/api/tasks/${id}`, {
  method: "DELETE",
});

export { registerUser, loginUser, getBoards, createBoard, deleteBoard, getTasks, createTask, updateTask, deleteTask, verifyToken };
