import React, { useState } from "react";
import { BsGear, BsBell, BsPerson, BsPlus, BsTrash, BsX } from "react-icons/bs";
import { FaTasks, FaCog, FaBell, FaChartBar } from "react-icons/fa";

const ActionPanel = () => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete project documentation", completed: false },
    { id: 2, text: "Review team progress", completed: true },
    { id: 3, text: "Schedule client meeting", completed: false },
  ]);

  const [notificationsList] = useState([
    {
      id: 1,
      title: "New Project Assigned",
      time: "2 hours ago",
      message: "You have been assigned to Project X",
    },
    {
      id: 2,
      title: "Meeting Reminder",
      time: "1 day ago",
      message: "Team meeting scheduled for tomorrow",
    },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      text: "New Task",
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const renderTasks = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={addTask}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <BsPlus size={24} />
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-600"
            >
              <BsTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <span>Dark Mode</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              darkMode ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <span>Notifications</span>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              notifications ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notifications</h2>
      {notificationsList.map((notification) => (
        <div key={notification.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-gray-500">{notification.time}</p>
              <p className="mt-1">{notification.message}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <BsX size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Tasks Completed</h3>
          <div className="mt-2 h-32 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-500">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Activity Overview</h3>
          <div className="mt-2 h-32 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-500">Chart Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Action Panel</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <BsBell size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <BsGear size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <BsPerson size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex space-x-4">
            {[
              { id: "tasks", icon: <FaTasks />, label: "Tasks" },
              { id: "settings", icon: <FaCog />, label: "Settings" },
              { id: "notifications", icon: <FaBell />, label: "Notifications" },
              { id: "analytics", icon: <FaChartBar />, label: "Analytics" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeSection === item.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="bg-white rounded-lg shadow p-6">
          {activeSection === "tasks" && renderTasks()}
          {activeSection === "settings" && renderSettings()}
          {activeSection === "notifications" && renderNotifications()}
          {activeSection === "analytics" && renderAnalytics()}
        </main>
      </div>
    </div>
  );
};

export default ActionPanel;
