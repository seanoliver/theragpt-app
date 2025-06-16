export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      distortion_instances: {
        Row: {
          confidence_score: number | null
          created_at: string
          description: string
          distortion_id: Database['public']['Enums']['distortion_type']
          entry_id: string
          id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          description: string
          distortion_id: Database['public']['Enums']['distortion_type']
          entry_id: string
          id?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          description?: string
          distortion_id?: Database['public']['Enums']['distortion_type']
          entry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'distortion_instances_distortion_id_fkey'
            columns: ['distortion_id']
            isOneToOne: false
            referencedRelation: 'distortions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'distortion_instances_entry_id_fkey'
            columns: ['entry_id']
            isOneToOne: false
            referencedRelation: 'entries'
            referencedColumns: ['id']
          },
        ]
      }
      distortions: {
        Row: {
          description: string
          examples: string[] | null
          id: Database['public']['Enums']['distortion_type']
          label: string
          strategies: string[] | null
        }
        Insert: {
          description: string
          examples?: string[] | null
          id: Database['public']['Enums']['distortion_type']
          label: string
          strategies?: string[] | null
        }
        Update: {
          description?: string
          examples?: string[] | null
          id?: Database['public']['Enums']['distortion_type']
          label?: string
          strategies?: string[] | null
        }
        Relationships: []
      }
      entries: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_pinned: boolean | null
          raw_text: string
          strategies: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          reframe_text: string | null
          reframe_explanation: string | null
          distortions: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          raw_text: string
          strategies?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          reframe_text?: string | null
          reframe_explanation?: string | null
          distortions?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          raw_text?: string
          strategies?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          reframe_text?: string | null
          reframe_explanation?: string | null
          distortions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'entries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      reframes: {
        Row: {
          created_at: string
          entry_id: string
          explanation: string
          id: string
          text: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          explanation: string
          id?: string
          text: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          explanation?: string
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reframes_entry_id_fkey'
            columns: ['entry_id']
            isOneToOne: false
            referencedRelation: 'entries'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      distortion_type:
        | 'all-or-nothing-thinking'
        | 'overgeneralization'
        | 'mental-filter'
        | 'disqualifying-the-positive'
        | 'jumping-to-conclusions'
        | 'magnification'
        | 'emotional-reasoning'
        | 'should-statements'
        | 'labeling'
        | 'personalization'
        | 'catastrophizing'
        | 'blaming'
        | 'fortune-telling'
        | 'mind-reading'
        | 'minimization'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      distortion_type: [
        'all-or-nothing-thinking',
        'overgeneralization',
        'mental-filter',
        'disqualifying-the-positive',
        'jumping-to-conclusions',
        'magnification',
        'emotional-reasoning',
        'should-statements',
        'labeling',
        'personalization',
        'catastrophizing',
        'blaming',
        'fortune-telling',
        'mind-reading',
        'minimization',
      ],
    },
  },
} as const