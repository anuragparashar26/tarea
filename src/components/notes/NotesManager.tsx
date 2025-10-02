'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StickyNote, Pin, Trash2, X, Check, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Note {
  id: string
  title: string
  content: string
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
}

// Debounce hook for auto-saving
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function NotesManager() {
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [originalNote, setOriginalNote] = useState<Note | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [showNewNote, setShowNewNote] = useState(false)
  const queryClient = useQueryClient()
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch('/api/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      const data = await response.json()
      return data.notes || []
    },
  })

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string }) => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      })
      if (!response.ok) {
        throw new Error('Failed to create note')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setNewNote({ title: '', content: '' })
      setShowNewNote(false)
      toast.success('Note created!')
    },
    onError: () => {
      toast.error('Failed to create note')
    }
  })

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Note> & { id: string }) => {
      setIsSaving(true)
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update note')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setIsSaving(false)
    },
    onError: () => {
      toast.error('Failed to save note')
      setIsSaving(false)
    }
  })

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete note')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      toast.success('Note deleted!')
      setEditingNote(null)
    },
    onError: () => {
      toast.error('Failed to delete note')
    }
  })

  // Auto-save logic with debouncing
  const debouncedEditingNote = useDebounce(editingNote, 1000)

  useEffect(() => {
    if (debouncedEditingNote && originalNote && (
      originalNote.title !== debouncedEditingNote.title ||
      originalNote.content !== debouncedEditingNote.content
    )) {
      updateNoteMutation.mutate({
        id: debouncedEditingNote.id,
        title: debouncedEditingNote.title,
        content: debouncedEditingNote.content
      })
      setOriginalNote(debouncedEditingNote)
    }
  }, [debouncedEditingNote, originalNote, updateNoteMutation])

  const handleNoteClick = useCallback((note: Note) => {
    setEditingNote({ ...note })
    setOriginalNote({ ...note })
  }, [])

  const handleNoteChange = useCallback((field: keyof Note, value: string | boolean) => {
    setEditingNote(prev => prev ? {
      ...prev,
      [field]: value
    } : null)
  }, [])

  const handleCreateNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) {
      setShowNewNote(false)
      return
    }
    if (!newNote.title.trim()) {
      setNewNote(prev => ({ ...prev, title: 'Untitled' }))
    }
    createNoteMutation.mutate(newNote)
  }

  const handleNewNoteClick = () => {
    setShowNewNote(true)
    setTimeout(() => titleInputRef.current?.focus(), 100)
  }

  const handleTogglePin = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation()
    updateNoteMutation.mutate({ id: note.id, isPinned: !note.isPinned })
  }

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setEditingNote(null)
    setOriginalNote(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-black dark:text-white" />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Notes
        </h2>
      </div>

      {/* New Note Creation */}
      {showNewNote && (
        <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            <Input
              ref={titleInputRef}
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Title"
              className="border-none text-lg font-medium bg-transparent focus:ring-0 focus:outline-none p-0"
            />
            <Textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Take a note..."
              className="border-none bg-transparent resize-none focus:ring-0 focus:outline-none p-0"
              rows={3}
            />
            <div className="flex justify-end items-center pt-2">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewNote(false)
                    setNewNote({ title: '', content: '' })
                  }}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateNote}
                  disabled={createNoteMutation.isPending}
                  className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {createNoteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Done'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Take a note prompt */}
      {!showNewNote && (
        <div 
          onClick={handleNewNoteClick}
          className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 cursor-text hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <StickyNote className="h-5 w-5 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">Take a note...</span>
          </div>
        </div>
      )}

      {notes.length === 0 && !showNewNote ? (
        <div className="text-center py-12">
          <StickyNote className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Click above to create your first note!
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {notes.map((note) => (
            <motion.div
              key={note.id}
              variants={itemVariants}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 cursor-pointer relative group hover:shadow-md"
              onClick={() => handleNoteClick(note)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Pin indicator */}
              {note.isPinned && (
                <Pin className="absolute top-2 right-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}

              {/* Action buttons (visible on hover) */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => handleTogglePin(note, e)}
                  className="p-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-sm"
                  title={note.isPinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className={`h-3 w-3 ${note.isPinned ? 'text-black dark:text-white' : 'text-gray-500'}`} />
                </button>
                <button
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="p-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-sm"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-black dark:text-white mb-2 pr-8">
                  {note.title}
                </h3>
                {note.content && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap line-clamp-4">
                    {note.content}
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit Note Modal */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 w-[95vw]">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-black dark:text-white">
                Edit Note
              </DialogTitle>
              <div className="flex items-center space-x-2">
                {isSaving && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </div>
                )}
                {/* Removed custom close button - DialogContent has built-in close button */}
              </div>
            </div>
          </DialogHeader>
          
          {editingNote && (
            <div className="space-y-6 py-4">
              <div>
                <Input
                  value={editingNote.title}
                  onChange={(e) => handleNoteChange('title', e.target.value)}
                  placeholder="Note title..."
                  className="text-xl font-semibold border-none bg-transparent focus:ring-0 focus:outline-none p-0"
                />
              </div>
              
              <div className="flex-1">
                <Textarea
                  value={editingNote.content}
                  onChange={(e) => handleNoteChange('content', e.target.value)}
                  placeholder="Start writing your note..."
                  className="border-none bg-transparent resize-none focus:ring-0 focus:outline-none p-0 min-h-[300px]"
                />
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(editingNote.updatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}