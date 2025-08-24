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
          type: 'STRATEGIC' | 'TECHNOLOGICAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'ECONOMIC'
          status: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
          expected_experts: number
          tags: string[]
          is_public: boolean
          creator_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: 'STRATEGIC' | 'TECHNOLOGICAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'ECONOMIC'
          status?: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
          expected_experts?: number
          tags?: string[]
          is_public?: boolean
          creator_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'STRATEGIC' | 'TECHNOLOGICAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'ECONOMIC'
          status?: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
          expected_experts?: number
          tags?: string[]
          is_public?: boolean
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
          category: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          order?: number
          category?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          order?: number
          category?: string | null
          color?: string | null
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
          status: 'INVITED' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'DECLINED'
          invited_at: string
          invited_by: string
          responded_at: string | null
          last_activity: string | null
          voting_progress: number
          notes: string | null
          email_notifications: boolean
          in_app_notifications: boolean
          reminder_notifications: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          expert_id: string
          user_id?: string | null
          status?: 'INVITED' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'DECLINED'
          invited_at?: string
          invited_by: string
          responded_at?: string | null
          last_activity?: string | null
          voting_progress?: number
          notes?: string | null
          email_notifications?: boolean
          in_app_notifications?: boolean
          reminder_notifications?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          expert_id?: string
          user_id?: string | null
          status?: 'INVITED' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'DECLINED'
          invited_at?: string
          invited_by?: string
          responded_at?: string | null
          last_activity?: string | null
          voting_progress?: number
          notes?: string | null
          email_notifications?: boolean
          in_app_notifications?: boolean
          reminder_notifications?: boolean
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
          notes: string | null
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
          notes?: string | null
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
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      status_changes: {
        Row: {
          id: string
          project_id: string
          from: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED' | null
          to: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
          changed_by: string
          reason: string | null
          notes: string | null
          changed_at: string
        }
        Insert: {
          id?: string
          project_id: string
          from?: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED' | null
          to: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
          changed_by: string
          reason?: string | null
          notes?: string | null
          changed_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          from?: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED' | null
          to?: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
          changed_by?: string
          reason?: string | null
          notes?: string | null
          changed_at?: string
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
      project_type: 'STRATEGIC' | 'TECHNOLOGICAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'ECONOMIC'
      project_status: 'DRAFT' | 'SETUP' | 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'ARCHIVED'
      project_expert_status: 'INVITED' | 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'DECLINED'
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
