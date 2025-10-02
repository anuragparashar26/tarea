import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

// Types
interface Note {
  id: string
  title: string
  content: string
  position: number
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

interface CreateNoteData {
  title: string
  content: string
  isPinned?: boolean
}

interface UpdateNoteData {
  title?: string
  content?: string
  isPinned?: boolean
  isArchived?: boolean
}

// API functions
const fetchNotes = async (): Promise<{ notes: Note[] }> => {
  const response = await fetch('/api/notes')
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return response.json()
}

const createNote = async (data: CreateNoteData): Promise<{ note: Note }> => {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  return response.json()
}

const updateNote = async (id: string, data: UpdateNoteData): Promise<{ note: Note }> => {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update note')
  }
  return response.json()
}

const deleteNote = async (id: string): Promise<void> => {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete note')
  }
}

// Hooks
export function useNotes() {
  const { data: session } = useSession()
  
  return useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    enabled: !!session,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteData }) => updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export type { Note, CreateNoteData, UpdateNoteData }