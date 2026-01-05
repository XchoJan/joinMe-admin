export interface User {
  id: number
  name: string
  email: string
  phone?: string
  city?: string
  photo?: string
  premium: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  city: string
  participantLimit: number
  authorId: number
  author?: User
  participants?: User[]
  createdAt: string
  updatedAt: string
}

export interface Chat {
  id: number
  eventId: number
  event?: Event
  messages?: Message[]
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: number
  chatId: number
  userId: number
  user?: User
  text: string
  createdAt: string
  updatedAt: string
}

export interface EventRequest {
  id: number
  eventId: number
  userId: number
  user?: User
  event?: Event
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

