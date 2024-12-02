const colors = [
  '#893101',
  '#ed7117',
  '#d16002',
  '#cc5801',
  '#b56727',
  '#d67229',
];

const title = document.getElementById('taskTitle');
const desc = document.getElementById('taskDesc');
const priority = document.getElementById('priority');
const deadline = document.getElementById('deadline');
const add = document.getElementById('add');
const allTasks = document.querySelector('.allTasks');

// Elements for filtering and searching
const searchInput = document.getElementById('searchTasks');
const filterPriority = document.getElementById('filterPriority');
const clearFilters = document.getElementById('clearFilters');

let tasksFromServer = [];

// Function to render tasks
function renderTasks(tasks) {
  allTasks.innerHTML = ''; // Clear current tasks
  tasks.forEach((task) => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');
    taskItem.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    taskItem.setAttribute('data-id', task._id); // Add unique identifier (assumes _id is the identifier)
    taskItem.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div>
        <p>Priority: ${task.priority}</p>
        <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
      </div>
      <div>
        <span class="edit">Edit</span>
        <span class="delete">Delete</span>
      </div>
    `;

    // Add event listeners for edit and delete buttons
    taskItem.querySelector('.edit').addEventListener('click', () => editTask(task._id));
    taskItem.querySelector('.delete').addEventListener('click', () => deleteTask(task._id));

    allTasks.appendChild(taskItem);
  });
}

// Fetch tasks from the server
function fetchTasks() {
  fetch('http://localhost:3000/api/tasks/get-tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    })
    .then((data) => {
      tasksFromServer = data; // Store fetched tasks
      renderTasks(tasksFromServer); // Render all tasks initially
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error fetching tasks.');
    });
}

// Add a new task
add.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    title.value === '' ||
    desc.value === '' ||
    priority.value === '' ||
    deadline.value === ''
  ) {
    alert('All fields are required');
    return;
  }

  const taskData = {
    title: title.value,
    description: desc.value,
    priority: priority.value,
    deadline: new Date(deadline.value),
  };

  fetch('http://localhost:3000/api/tasks/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Task created:', data);
      alert('Task created successfully');
      title.value = '';
      desc.value = '';
      priority.value = '';
      deadline.value = '';
      fetchTasks(); // Refresh task list
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error creating the task.');
    });
});
// Handle logout
const logOutButton = document.querySelector('.logOut');

logOutButton.addEventListener('click', () => {
  // Make a request to the server to log the user out
  fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST', // Assuming your API expects a POST request for logout
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies if using session-based authentication
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Logout successful', data);
      // Redirect to login page after successful logout
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error logging out.');
    });
});

// Edit a task
function editTask(taskId) {
  const taskToEdit = tasksFromServer.find(task => task._id === taskId);

  // Pre-populate input fields with current task data
  title.value = taskToEdit.title;
  desc.value = taskToEdit.description;
  priority.value = taskToEdit.priority;
  deadline.value = new Date(taskToEdit.deadline).toISOString().split('T')[0];

  // Update task on form submission
  add.removeEventListener('click', createTask); // Ensure no duplicate listeners
  add.addEventListener('click', (e) => {
    e.preventDefault();

    if (
      title.value === '' ||
      desc.value === '' ||
      priority.value === '' ||
      deadline.value === ''
    ) {
      alert('All fields are required');
      return;
    }

    const updatedTaskData = {
      title: title.value,
      description: desc.value,
      priority: priority.value,
      deadline: new Date(deadline.value),
    };

    fetch(`http://localhost:3000/api/tasks/update/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTaskData),
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Task updated:', data);
        alert('Task updated successfully');
        title.value = '';
        desc.value = '';
        priority.value = '';
        deadline.value = '';
        fetchTasks(); // Refresh task list
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was an error updating the task.');
      });
  });
}

// Delete a task
function deleteTask(taskId) {
  const confirmation = confirm('Are you sure you want to delete this task?');
  if (confirmation) {
    fetch(`http://localhost:3000/api/tasks/delete/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Task deleted:', data);
        alert('Task deleted successfully');
        fetchTasks(); // Refresh task list
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was an error deleting the task.');
      });
  }
}

// Search tasks by title
searchInput.addEventListener('input', () => {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredTasks = tasksFromServer.filter(task =>
    task.title.toLowerCase().includes(searchQuery)
  );
  renderTasks(filteredTasks);
});

// Filter tasks by priority
filterPriority.addEventListener('change', () => {
  const priority = filterPriority.value;
  const filteredTasks = priority
    ? tasksFromServer.filter(task => task.priority === priority)
    : tasksFromServer;
  renderTasks(filteredTasks);
});

// Clear filters and show all tasks
clearFilters.addEventListener('click', () => {
  searchInput.value = '';
  filterPriority.value = '';
  renderTasks(tasksFromServer);
});

// Fetch and render tasks when page loads
window.addEventListener('load', fetchTasks);
