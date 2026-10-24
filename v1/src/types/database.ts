export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string
          rating: number
          bio: string | null
          location: string
          joined_date: string
          birth_date: string
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar?: string
          rating?: number
          bio?: string | null
          location: string
          joined_date?: string
          birth_date: string
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar?: string
          rating?: number
          bio?: string | null
          location?: string
          joined_date?: string
          birth_date?: string
          verified?: boolean
          created_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          url: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          url: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          url?: string
          is_public?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          date: string
          time: string
          location: string
          created_by: string
          status: string
          event_type: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          date: string
          time: string
          location: string
          created_by: string
          status?: string
          event_type: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          date?: string
          time?: string
          location?: string
          created_by?: string
          status?: string
          event_type?: string
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          event_id: string
          user_id: string
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          message?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}