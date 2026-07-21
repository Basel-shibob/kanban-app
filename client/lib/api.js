const API_URL = "http://localhost:5000";

const registerUser = async (name, email, password ) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async ( email, password ) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async () =>{
  const token = localStorage.getItem('token')
  try{
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "AUthorization": `Bearer ${token}`
      }
    })
    return response.ok
  }catch(error){
    console.log(error)
  }
}

const getBoards = async () =>  {
  const token = localStorage.getItem('token');
  try{
    const response = await fetch(`${API_URL}/api/boards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  }catch(error){
    console.log(error);
  }
}

const createBoard = async (title)=>{
  const token = localStorage.getItem('token');
  try{
    const response = await fetch(`${API_URL}/api/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });
    const data = await response.json();
    return data;
  }catch(error){
    console.log(error);
  }
}

const deleteBoard = async (id) => {
  const token = localStorage.getItem('token');
  try{
    const response = await fetch(`${API_URL}/api/boards/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const data = await response.json();
    return data;
  }catch(error){
    console.log(error);
  }
}

const getTasks = async (boardId)=>{
  const token = localStorage.getItem('token');
  try{
    const response = await fetch(`${API_URL}/api/tasks/${boardId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const data = await response.json();
    return data;
  }catch(error){
    console.log(error)
  }
}

const createTask = async (title, description, boardId)=>{
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/api/tasks`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, boardId }),
    });
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

const updateTask = async (id, status)=>{
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({status})
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

const deleteTask  = async (id)=>{
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export { registerUser, loginUser, getBoards, createBoard, deleteBoard, getTasks, createTask, updateTask, deleteTask, verifyToken };
