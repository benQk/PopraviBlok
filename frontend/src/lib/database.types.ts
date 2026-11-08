
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "buildings": {
                  Row: {
                    "address": string,"created_at": string,"id": string,"invite_code": string | null,"name": string,"requested_by": string,"status": Database["public"]['Enums']["approval_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "address": string,"created_at"?: string,"id"?: string,"invite_code"?: string | null,"name": string,"requested_by"?: string,"status"?: Database["public"]['Enums']["approval_status"]
                  }
                  Update: {
                    "address"?: string,"created_at"?: string,"id"?: string,"invite_code"?: string | null,"name"?: string,"requested_by"?: string,"status"?: Database["public"]['Enums']["approval_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "buildings_requested_by_fkey"
      columns: ["requested_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"categories": {
                  Row: {
                    "id": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"name": string
                  }
                  Update: {
                    "id"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"issue_events": {
                  Row: {
                    "actor_id": string,"created_at": string,"from_status": Database["public"]['Enums']["issue_status"] | null,"id": string,"issue_id": string,"note": string | null,"to_status": Database["public"]['Enums']["issue_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "actor_id": string,"created_at"?: string,"from_status"?: Database["public"]['Enums']["issue_status"] | null,"id"?: string,"issue_id": string,"note"?: string | null,"to_status": Database["public"]['Enums']["issue_status"]
                  }
                  Update: {
                    "actor_id"?: string,"created_at"?: string,"from_status"?: Database["public"]['Enums']["issue_status"] | null,"id"?: string,"issue_id"?: string,"note"?: string | null,"to_status"?: Database["public"]['Enums']["issue_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "issue_events_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "issue_events_issue_id_fkey"
      columns: ["issue_id"]
isOneToOne: false
      referencedRelation: "issues"
      referencedColumns: ["id"]
    }
                  ]
                },"issues": {
                  Row: {
                    "assignee_id": string | null,"building_id": string,"category_id": string,"created_at": string,"description": string,"id": string,"location": string,"merged_into_id": string | null,"photo_path": string | null,"priority": Database["public"]['Enums']["issue_priority"],"reporter_id": string,"resolved_at": string | null,"status": Database["public"]['Enums']["issue_status"],"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "assignee_id"?: string | null,"building_id": string,"category_id": string,"created_at"?: string,"description": string,"id"?: string,"location": string,"merged_into_id"?: string | null,"photo_path"?: string | null,"priority"?: Database["public"]['Enums']["issue_priority"],"reporter_id"?: string,"resolved_at"?: string | null,"status"?: Database["public"]['Enums']["issue_status"],"title": string,"updated_at"?: string
                  }
                  Update: {
                    "assignee_id"?: string | null,"building_id"?: string,"category_id"?: string,"created_at"?: string,"description"?: string,"id"?: string,"location"?: string,"merged_into_id"?: string | null,"photo_path"?: string | null,"priority"?: Database["public"]['Enums']["issue_priority"],"reporter_id"?: string,"resolved_at"?: string | null,"status"?: Database["public"]['Enums']["issue_status"],"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "issues_assignee_id_fkey"
      columns: ["assignee_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "issues_building_id_fkey"
      columns: ["building_id"]
isOneToOne: false
      referencedRelation: "buildings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "issues_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "issues_merged_into_id_fkey"
      columns: ["merged_into_id"]
isOneToOne: false
      referencedRelation: "issues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "issues_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"memberships": {
                  Row: {
                    "apartment": string | null,"building_id": string,"category_id": string | null,"created_at": string,"id": string,"role": Database["public"]['Enums']["member_role"],"status": Database["public"]['Enums']["approval_status"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "apartment"?: string | null,"building_id": string,"category_id"?: string | null,"created_at"?: string,"id"?: string,"role": Database["public"]['Enums']["member_role"],"status"?: Database["public"]['Enums']["approval_status"],"user_id": string
                  }
                  Update: {
                    "apartment"?: string | null,"building_id"?: string,"category_id"?: string | null,"created_at"?: string,"id"?: string,"role"?: Database["public"]['Enums']["member_role"],"status"?: Database["public"]['Enums']["approval_status"],"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "memberships_building_id_fkey"
      columns: ["building_id"]
isOneToOne: false
      referencedRelation: "buildings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "memberships_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "memberships_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"email": string,"full_name": string,"id": string,"is_admin": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"email": string,"full_name"?: string,"id": string,"is_admin"?: boolean
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"full_name"?: string,"id"?: string,"is_admin"?: boolean
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "add_technician":
{ Args: { "p_building": string,"p_category": string,"p_email": string }; Returns: {
              "apartment": string | null,
"building_id": string,
"category_id": string | null,
"created_at": string,
"id": string,
"role": Database["public"]['Enums']["member_role"],
"status": Database["public"]['Enums']["approval_status"],
"user_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "memberships"
        isOneToOne: true
        isSetofReturn: false
      } },
"can_read_issues":
{ Args: { "b": string }; Returns: boolean
                           },
"create_issue":
{ Args: { "p_building": string,"p_category": string,"p_description": string,"p_location": string,"p_title": string }; Returns: {
              "assignee_id": string | null,
"building_id": string,
"category_id": string,
"created_at": string,
"description": string,
"id": string,
"location": string,
"merged_into_id": string | null,
"photo_path": string | null,
"priority": Database["public"]['Enums']["issue_priority"],
"reporter_id": string,
"resolved_at": string | null,
"status": Database["public"]['Enums']["issue_status"],
"title": string,
"updated_at": string
            }
                          SetofOptions: {
        from: "*"
        to: "issues"
        isOneToOne: true
        isSetofReturn: false
      } },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_manager_of":
{ Args: { "b": string }; Returns: boolean
                           },
"join_building":
{ Args: { "p_apartment": string,"p_code": string }; Returns: {
              "apartment": string | null,
"building_id": string,
"category_id": string | null,
"created_at": string,
"id": string,
"role": Database["public"]['Enums']["member_role"],
"status": Database["public"]['Enums']["approval_status"],
"user_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "memberships"
        isOneToOne: true
        isSetofReturn: false
      } },
"request_building":
{ Args: { "p_address": string,"p_name": string }; Returns: {
              "address": string,
"created_at": string,
"id": string,
"invite_code": string | null,
"name": string,
"requested_by": string,
"status": Database["public"]['Enums']["approval_status"]
            }
                          SetofOptions: {
        from: "*"
        to: "buildings"
        isOneToOne: true
        isSetofReturn: false
      } },
"review_building":
{ Args: { "p_approve": boolean,"p_building": string }; Returns: undefined
                           },
"review_membership":
{ Args: { "p_approve": boolean,"p_membership": string }; Returns: undefined
                           },
"transition_issue":
{ Args: { "p_issue": string,"p_note"?: string,"p_to": Database["public"]['Enums']["issue_status"] }; Returns: {
              "assignee_id": string | null,
"building_id": string,
"category_id": string,
"created_at": string,
"description": string,
"id": string,
"location": string,
"merged_into_id": string | null,
"photo_path": string | null,
"priority": Database["public"]['Enums']["issue_priority"],
"reporter_id": string,
"resolved_at": string | null,
"status": Database["public"]['Enums']["issue_status"],
"title": string,
"updated_at": string
            }
                          SetofOptions: {
        from: "*"
        to: "issues"
        isOneToOne: true
        isSetofReturn: false
      } },
"triage_issue":
{ Args: { "p_assignee": string,"p_issue": string,"p_priority": Database["public"]['Enums']["issue_priority"] }; Returns: {
              "assignee_id": string | null,
"building_id": string,
"category_id": string,
"created_at": string,
"description": string,
"id": string,
"location": string,
"merged_into_id": string | null,
"photo_path": string | null,
"priority": Database["public"]['Enums']["issue_priority"],
"reporter_id": string,
"resolved_at": string | null,
"status": Database["public"]['Enums']["issue_status"],
"title": string,
"updated_at": string
            }
                          SetofOptions: {
        from: "*"
        to: "issues"
        isOneToOne: true
        isSetofReturn: false
      } }
          }
          Enums: {
            "approval_status": "PENDING"|"APPROVED"|"REJECTED","issue_priority": "LOW"|"NORMAL"|"URGENT","issue_status": "NEW"|"ASSIGNED"|"IN_PROGRESS"|"RESOLVED"|"CLOSED"|"REOPENED"|"REJECTED"|"MERGED","member_role": "MANAGER"|"RESIDENT"|"TECHNICIAN"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "approval_status": ["PENDING", "APPROVED", "REJECTED"],"issue_priority": ["LOW", "NORMAL", "URGENT"],"issue_status": ["NEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED", "REJECTED", "MERGED"],"member_role": ["MANAGER", "RESIDENT", "TECHNICIAN"]
          }
        }
} as const
