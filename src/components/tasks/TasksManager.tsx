'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckSquare, Plus, Edit, Trash2, Check, Square, Calendar, Menu, X, Star, Sun, List, BarChart3, Search, Filter } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: string
  reminder?: string
  isMyDay: boolean
  isImportant: boolean
  createdAt: string
  updatedAt: string
  taskListId?: string
  taskList?: {
    id: string
    name: string
  }
}

interface TaskList {
  id: string
  name: string
  description?: string
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const listItemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 20,
      mass: 1
    }
  }
}

const taskItemVariants = {
  hidden: { x: -30, opacity: 0, scale: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 25,
      mass: 0.8
    }
  },
  exit: {
    x: 30,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
}

const sidebarItemVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98
  }
}

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.95
  }
}

export default function TasksManager() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({
    open: false, title: '', message: '', onConfirm: () => {}
  })
  const [selectedListId, setSelectedListId] = useState<string | 'myday' | 'important' | null>('myday')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'pending' | 'completed'>('all')
  const [newTaskList, setNewTaskList] = useState({ name: '', description: '' })
  const [newTask, setNewTask] = useState<{
    title: string
    description: string
    dueDate: string
    isMyDay: boolean
    isImportant: boolean
  }>({
    title: '',
    description: '',
    dueDate: '',
    isMyDay: false,
    isImportant: false
  })
  const queryClient = useQueryClient()

  // Fetch task lists
  const { data: taskLists = [], isLoading } = useQuery<TaskList[]>({
    queryKey: ['taskLists'],
    queryFn: async () => {
      const response = await fetch('/api/task-lists')
      if (!response.ok) {
        throw new Error('Failed to fetch task lists')
      }
      const data = await response.json()
      return data.taskLists || []
    },
  })

  // Create task list mutation
  const createTaskListMutation = useMutation({
    mutationFn: async (listData: { name: string; description: string }) => {
      const response = await fetch('/api/task-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listData),
      })
      if (!response.ok) {
        throw new Error('Failed to create task list')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] })
      setNewTaskList({ name: '', description: '' })
      setIsCreateListOpen(false)
      toast.success('Task list created successfully!')
    },
    onError: () => {
      toast.error('Failed to create task list')
    }
  })

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: {
      title: string
      description: string
      dueDate?: string
      isMyDay: boolean
      isImportant: boolean
      taskListId: string
    }) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) {
        throw new Error('Failed to create task')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] })
      setNewTask({ title: '', description: '', dueDate: '', isMyDay: false, isImportant: false })
      setIsCreateTaskOpen(false)
      toast.success('Task created successfully!')
    },
    onError: () => {
      toast.error('Failed to create task')
    }
  })

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: string }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] })
      setEditingTask(null)
      toast.success('Task updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update task')
    }
  })

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] })
      toast.success('Task deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete task')
    }
  })

  // Delete task list mutation
  const deleteTaskListMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/task-lists/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete task list')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] })
      toast.success('Task list deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete task list')
    }
  })

  const handleCreateTaskList = () => {
    if (!newTaskList.name.trim()) {
      toast.error('Please enter a list name')
      return
    }
    createTaskListMutation.mutate(newTaskList)
  }

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    if (!selectedListId || selectedListId === 'myday' || selectedListId === 'important') {
      toast.error('Please select a specific task list to create a task')
      return
    }
    createTaskMutation.mutate({
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate || undefined,
      isMyDay: newTask.isMyDay,
      isImportant: newTask.isImportant,
      taskListId: selectedListId as string,
    })
  }

  const handleToggleComplete = (task: Task) => {
    updateTaskMutation.mutate({ id: task.id, completed: !task.completed })
  }

  const handleDeleteTask = (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      onConfirm: () => {
        deleteTaskMutation.mutate(id)
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleDeleteTaskList = (id: string, name: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Task List',
      message: `Are you sure you want to delete "${name}" and all its tasks? This action cannot be undone.`,
      onConfirm: () => {
        deleteTaskListMutation.mutate(id)
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
  <div className="flex h-full w-full overflow-hidden bg-white dark:bg-gray-950">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
          <h3 className="font-medium text-gray-900 dark:text-white">Menu</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="space-y-1 mb-6 flex-shrink-0">
            <motion.button
              onClick={() => setSelectedListId(null)}
              variants={sidebarItemVariants}
              whileHover="hover"
              whileTap="tap"
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedListId === null
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <List className="h-4 w-4" />
                  <div>
                    <span className="font-medium text-sm">All Tasks</span>
                    <div className={`text-xs ${selectedListId === null ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                      {(() => {
                        const total = taskLists.reduce((total, list) => total + list.tasks.length, 0)
                        const completed = taskLists.reduce((total, list) => total + list.tasks.filter(t => t.completed).length, 0)
                        return `${completed}/${total} completed`
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setSelectedListId('myday')}
              variants={sidebarItemVariants}
              whileHover="hover"
              whileTap="tap"
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedListId === 'myday'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sun className="h-4 w-4" />
                <div>
                  <span className="font-medium text-sm">My Day</span>
                  <div className={`text-xs ${selectedListId === 'myday' ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                    {(() => {
                      const total = taskLists.reduce((total, list) => total + list.tasks.filter(t => t.isMyDay).length, 0)
                      const completed = taskLists.reduce((total, list) => total + list.tasks.filter(t => t.isMyDay && t.completed).length, 0)
                      return `${completed}/${total} completed`
                    })()}
                  </div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setSelectedListId('important')}
              variants={sidebarItemVariants}
              whileHover="hover"
              whileTap="tap"
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedListId === 'important'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Star className="h-4 w-4" />
                <div>
                  <span className="font-medium text-sm">Important</span>
                  <div className={`text-xs ${selectedListId === 'important' ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                    {(() => {
                      const total = taskLists.reduce((total, list) => total + list.tasks.filter(t => t.isImportant).length, 0)
                      const completed = taskLists.reduce((total, list) => total + list.tasks.filter(t => t.isImportant && t.completed).length, 0)
                      return `${completed}/${total} completed`
                    })()}
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="space-y-1 overflow-y-auto overflow-x-hidden flex-1">
              {taskLists.map((list) => (
                <div key={list.id} className="group relative">
                  <motion.button
                    onClick={() => setSelectedListId(list.id)}
                    variants={sidebarItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`w-full text-left p-3 pr-10 rounded-lg transition-colors ${
                      selectedListId === list.id
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CheckSquare className="h-4 w-4" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-sm truncate block">{list.name}</span>
                        <div className={`text-xs ${selectedListId === list.id ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                          {list.tasks.length} tasks
                        </div>
                      </div>
                    </div>
                  </motion.button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTaskList(list.id, list.name)}
                    aria-label={`Delete list ${list.name}`}
                    title="Delete list"
                    className="absolute top-2 right-2 h-9 w-9 p-0 z-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={() => setIsCreateListOpen(true)}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              New List
            </Button>
          </motion.div>
        </div>
      </div>

  {/* Main Content */}
  <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedListId === null && 'All Tasks'}
                {selectedListId === 'myday' && 'My Day'}
                {selectedListId === 'important' && 'Important'}
                {typeof selectedListId === 'string' && taskLists.find(l => l.id === selectedListId)?.name}
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 md:w-80 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                
                {selectedListId && selectedListId !== 'myday' && selectedListId !== 'important' && (
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      onClick={() => setIsCreateTaskOpen(true)}
                      className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

  {/* Task Content */}
  <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Task Display */}
          {(() => {
            // Filter tasks based on selected list
            let filteredTasks: Task[] = []
            if (selectedListId === null) {
              // All tasks
              filteredTasks = taskLists.flatMap(list => list.tasks)
            } else if (selectedListId === 'myday') {
              // My Day tasks
              filteredTasks = taskLists.flatMap(list => list.tasks.filter(task => task.isMyDay))
            } else if (selectedListId === 'important') {
              // Important tasks
              filteredTasks = taskLists.flatMap(list => list.tasks.filter(task => task.isImportant))
            } else {
              // Specific list tasks
              const list = taskLists.find(l => l.id === selectedListId)
              filteredTasks = list ? list.tasks : []
            }

            // Apply search filter
            if (searchQuery.trim()) {
              filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (task.taskList?.name && task.taskList.name.toLowerCase().includes(searchQuery.toLowerCase()))
              )
            }

            // Apply status filter
            if (filterBy !== 'all') {
              if (filterBy === 'pending') {
                filteredTasks = filteredTasks.filter(task => !task.completed)
              } else if (filterBy === 'completed') {
                filteredTasks = filteredTasks.filter(task => task.completed)
              }
            }

            if (filteredTasks.length === 0) {
              return (
                <motion.div
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  {selectedListId === null && (
                    <>
                      <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <List className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Create your first task list to get started.
                      </p>
                    </>
                  )}
                  {selectedListId === 'myday' && (
                    <>
                      <div className="w-20 h-20 mb-5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Sun className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your day is clear</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No tasks scheduled for today.
                      </p>
                    </>
                  )}
                  {selectedListId === 'important' && (
                    <>
                      <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No important tasks</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Mark tasks as important to see them here.
                      </p>
                    </>
                  )}
                  {typeof selectedListId === 'string' && taskLists.find(l => l.id === selectedListId) && (
                    <>
                      <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <CheckSquare className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">List is empty</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        Add your first task to &quot;{taskLists.find(l => l.id === selectedListId)?.name}&quot;.
                      </p>
                      <Button
                        onClick={() => setIsCreateTaskOpen(true)}
                        variant="outline"
                        className="border-gray-300 dark:border-gray-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    </>
                  )}
                </motion.div>
              )
            }

            return (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 pb-24"
              >
                  {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all duration-200 relative ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3 min-h-[24px]">
                      {task.isImportant && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs px-2 py-1 rounded-md font-medium">
                          ⭐ Important
                        </div>
                      )}
                      {task.isMyDay && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-md font-medium">
                          📅 My Day
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className="flex-shrink-0 mt-0.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        {task.completed ? (
                          <div className="h-5 w-5 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-white dark:text-gray-900" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-900 dark:hover:border-gray-100 transition-colors duration-200">
                          </div>
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0 pr-20">
                        <h3 className={`font-medium text-gray-900 dark:text-white mb-1.5 break-words ${
                          task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2.5 break-words">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          {task.dueDate && (
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {task.taskList && (
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                              <CheckSquare className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{task.taskList.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex gap-1.5 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTask(task)}
                          className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="Edit task"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-9 w-9 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete task"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))}
              </motion.div>
            )
          })()}

          {/* Confirm Dialog */}
          <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
            <DialogContent className="sm:max-w-[380px]">
              <DialogHeader>
                <DialogTitle>{confirmDialog.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-600 dark:text-gray-400">{confirmDialog.message}</p>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmDialog.onConfirm}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create Task List Dialog */}
          <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Create Task List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <Input
                    value={newTaskList.name}
                    onChange={(e) => setNewTaskList({ ...newTaskList, name: e.target.value })}
                    placeholder="Enter list name..."
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateListOpen(false)}
                    disabled={createTaskListMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTaskList}
                    disabled={createTaskListMutation.isPending}
                  >
                    {createTaskListMutation.isPending ? 'Creating...' : 'Create List'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create Task Dialog */}
          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter description..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTask.isMyDay}
                      onChange={(e) => setNewTask({ ...newTask, isMyDay: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">📅 Add to My Day</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTask.isImportant}
                      onChange={(e) => setNewTask({ ...newTask, isImportant: e.target.checked })}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">⭐ Mark as Important</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateTaskOpen(false)}
                    disabled={createTaskMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTask}
                    disabled={createTaskMutation.isPending}
                  >
                    {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Task Dialog */}
          {editingTask && (
            <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <Input
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <Textarea
                      value={editingTask.description || ''}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingTask.isMyDay}
                        onChange={(e) => setEditingTask({ ...editingTask, isMyDay: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">📅 Add to My Day</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingTask.isImportant}
                        onChange={(e) => setEditingTask({ ...editingTask, isImportant: e.target.checked })}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">⭐ Mark as Important</span>
                    </label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingTask(null)}
                      disabled={updateTaskMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => updateTaskMutation.mutate({
                        id: editingTask.id,
                        title: editingTask.title,
                        description: editingTask.description,
                        dueDate: editingTask.dueDate,
                        isMyDay: editingTask.isMyDay,
                        isImportant: editingTask.isImportant
                      })}
                      disabled={updateTaskMutation.isPending}
                    >
                      {updateTaskMutation.isPending ? 'Updating...' : 'Update Task'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}