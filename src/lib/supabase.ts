import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Event = {
  id: string
  title: string
  description: string
  media_type: 'image' | 'video'
  media_url: string
  link?: string
  department: string // This is the club name
  tags: string[]
  event_category: 'technical' | 'non-technical'
  event_datetime?: string
  created_at: string
}