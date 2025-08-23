/**
 * 🗄️ Database Types para MIC MAC Pro
 * Tipos generados automáticamente desde Prisma Schema
 */

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
          role: 'MODERATOR' | 'EXPERT'
          name: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'MODERATOR' | 'EXPERT'
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'MODERATOR' | 'EXPERT'
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'DRAFT' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'ARCHIVED'
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'DRAFT' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'ARCHIVED'
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'DRAFT' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'ARCHIVED'
          creator_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      variables: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      experts: {
        Row: {
          id: string
          name: string
          email: string
          organization: string | null
          expertise_areas: string[]
          avatar: string | null
          years_experience: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          organization?: string | null
          expertise_areas: string[]
          avatar?: string | null
          years_experience?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          organization?: string | null
          expertise_areas?: string[]
          avatar?: string | null
          years_experience?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      project_experts: {
        Row: {
          id: string
          project_id: string
          expert_id: string
          user_id: string | null
          status: 'INVITED' | 'ACCEPTED' | 'VOTING' | 'COMPLETED' | 'DECLINED'
          invited_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          expert_id: string
          user_id?: string | null
          status?: 'INVITED' | 'ACCEPTED' | 'VOTING' | 'COMPLETED' | 'DECLINED'
          invited_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          expert_id?: string
          user_id?: string | null
          status?: 'INVITED' | 'ACCEPTED' | 'VOTING' | 'COMPLETED' | 'DECLINED'
          invited_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          project_id: string
          expert_id: string
          user_id: string | null
          variable_a_id: string
          variable_b_id: string
          value: number
          confidence: number | null
          time_spent: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          expert_id: string
          user_id?: string | null
          variable_a_id: string
          variable_b_id: string
          value: number
          confidence?: number | null
          time_spent?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          expert_id?: string
          user_id?: string | null
          variable_a_id?: string
          variable_b_id?: string
          value?: number
          confidence?: number | null
          time_spent?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'MODERATOR' | 'EXPERT'
      project_status: 'DRAFT' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'ARCHIVED'
      project_expert_status: 'INVITED' | 'ACCEPTED' | 'VOTING' | 'COMPLETED' | 'DECLINED'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos helper para uso en la aplicación
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tipos específicos para la aplicación
export type User = Tables<'users'>
export type Project = Tables<'projects'>
export type Variable = Tables<'variables'>
export type Expert = Tables<'experts'>
export type ProjectExpert = Tables<'project_experts'>
export type Evaluation = Tables<'evaluations'>

// Tipos para inserts
export type UserInsert = TablesInsert<'users'>
export type ProjectInsert = TablesInsert<'projects'>
export type VariableInsert = TablesInsert<'variables'>
export type ExpertInsert = TablesInsert<'experts'>
export type ProjectExpertInsert = TablesInsert<'project_experts'>
export type EvaluationInsert = TablesInsert<'evaluations'>

// Tipos para updates
export type UserUpdate = TablesUpdate<'users'>
export type ProjectUpdate = TablesUpdate<'projects'>
export type VariableUpdate = TablesUpdate<'variables'>
export type ExpertUpdate = TablesUpdate<'experts'>
export type ProjectExpertUpdate = TablesUpdate<'project_experts'>
export type EvaluationUpdate = TablesUpdate<'evaluations'>

// Enums
export type UserRole = Database['public']['Enums']['user_role']
export type ProjectStatus = Database['public']['Enums']['project_status']
export type ProjectExpertStatus = Database['public']['Enums']['project_expert_status']
