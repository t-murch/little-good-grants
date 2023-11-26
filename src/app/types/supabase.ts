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
      listings: {
        Row: {
          amount: number
          approved: boolean
          dateadded: string
          deadlineduedate: string
          description: string | null
          id: number
          industriesserved: string
          lastupdated: string | null
          name: string
          organizationname: string
          populationserved: string
          submissiondate: string | null
          submitted: boolean
          url: string
        }
        Insert: {
          amount: number
          approved?: boolean
          dateadded?: string
          deadlineduedate: string
          description?: string | null
          id?: number
          industriesserved: string
          lastupdated?: string | null
          name: string
          organizationname: string
          populationserved: string
          submissiondate?: string | null
          submitted?: boolean
          url: string
        }
        Update: {
          amount?: number
          approved?: boolean
          dateadded?: string
          deadlineduedate?: string
          description?: string | null
          id?: number
          industriesserved?: string
          lastupdated?: string | null
          name?: string
          organizationname?: string
          populationserved?: string
          submissiondate?: string | null
          submitted?: boolean
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
