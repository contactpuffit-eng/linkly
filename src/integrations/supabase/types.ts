export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      affiliate_link_stats: {
        Row: {
          affiliate_code: string
          affiliate_id: string
          created_at: string | null
          event_type: string
          id: string
          product_id: string
          user_agent: string | null
          user_ip: string | null
        }
        Insert: {
          affiliate_code: string
          affiliate_id: string
          created_at?: string | null
          event_type: string
          id?: string
          product_id: string
          user_agent?: string | null
          user_ip?: string | null
        }
        Update: {
          affiliate_code?: string
          affiliate_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          product_id?: string
          user_agent?: string | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_link_stats_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "affiliate_link_stats_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_products: {
        Row: {
          affiliate_code: string
          affiliate_id: string
          created_at: string | null
          id: string
          product_id: string
          promo_code: string
        }
        Insert: {
          affiliate_code: string
          affiliate_id: string
          created_at?: string | null
          id?: string
          product_id: string
          promo_code: string
        }
        Update: {
          affiliate_code?: string
          affiliate_id?: string
          created_at?: string | null
          id?: string
          product_id?: string
          promo_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_products_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "affiliate_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_requests: {
        Row: {
          affiliate_id: string
          created_at: string | null
          id: string
          message: string | null
          product_id: string
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          created_at?: string | null
          id?: string
          message?: string | null
          product_id: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          created_at?: string | null
          id?: string
          message?: string | null
          product_id?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_requests_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "affiliate_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          ai_data: Json | null
          conversions_count: number | null
          created_at: string
          customization: Json
          id: string
          is_published: boolean | null
          media_urls: Json | null
          product_id: string
          slug: string
          theme_id: string
          title: string
          updated_at: string
          vendor_id: string
          views_count: number | null
        }
        Insert: {
          ai_data?: Json | null
          conversions_count?: number | null
          created_at?: string
          customization: Json
          id?: string
          is_published?: boolean | null
          media_urls?: Json | null
          product_id: string
          slug: string
          theme_id: string
          title: string
          updated_at?: string
          vendor_id: string
          views_count?: number | null
        }
        Update: {
          ai_data?: Json | null
          conversions_count?: number | null
          created_at?: string
          customization?: Json
          id?: string
          is_published?: boolean | null
          media_urls?: Json | null
          product_id?: string
          slug?: string
          theme_id?: string
          title?: string
          updated_at?: string
          vendor_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          affiliate_code: string | null
          affiliate_id: string | null
          amount: number
          commission_amount: number | null
          commune: string | null
          created_at: string | null
          customer_address: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          is_returned: boolean | null
          notes: string | null
          payment_method: string | null
          product_id: string
          quantity: number | null
          return_reason: string | null
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          tracking_number: string | null
          updated_at: string | null
          wilaya: string | null
        }
        Insert: {
          affiliate_code?: string | null
          affiliate_id?: string | null
          amount: number
          commission_amount?: number | null
          commune?: string | null
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          is_returned?: boolean | null
          notes?: string | null
          payment_method?: string | null
          product_id: string
          quantity?: number | null
          return_reason?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
          wilaya?: string | null
        }
        Update: {
          affiliate_code?: string | null
          affiliate_id?: string | null
          amount?: number
          commission_amount?: number | null
          commune?: string | null
          created_at?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          is_returned?: boolean | null
          notes?: string | null
          payment_method?: string | null
          product_id?: string
          quantity?: number | null
          return_reason?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
          wilaya?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"] | null
          commission_pct: number
          created_at: string | null
          description: string | null
          dimensions: string | null
          id: string
          is_active: boolean | null
          media_url: string | null
          min_stock_alert: number | null
          price: number
          restaurant_address: string | null
          restaurant_phone: string | null
          shipping_class: string | null
          sku: string | null
          stock_quantity: number | null
          title: string
          updated_at: string | null
          variants: Json | null
          vendor_id: string | null
          website_url: string | null
          weight: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["product_category"] | null
          commission_pct: number
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          id?: string
          is_active?: boolean | null
          media_url?: string | null
          min_stock_alert?: number | null
          price: number
          restaurant_address?: string | null
          restaurant_phone?: string | null
          shipping_class?: string | null
          sku?: string | null
          stock_quantity?: number | null
          title: string
          updated_at?: string | null
          variants?: Json | null
          vendor_id?: string | null
          website_url?: string | null
          weight?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"] | null
          commission_pct?: number
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          id?: string
          is_active?: boolean | null
          media_url?: string | null
          min_stock_alert?: number | null
          price?: number
          restaurant_address?: string | null
          restaurant_phone?: string | null
          shipping_class?: string | null
          sku?: string | null
          stock_quantity?: number | null
          title?: string
          updated_at?: string | null
          variants?: Json | null
          vendor_id?: string | null
          website_url?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          landing_page_enabled: boolean | null
          name: string
          role: Database["public"]["Enums"]["user_role"] | null
          theme_color: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          landing_page_enabled?: boolean | null
          name: string
          role?: Database["public"]["Enums"]["user_role"] | null
          theme_color?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          landing_page_enabled?: boolean | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          theme_color?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      restaurant_qr_codes: {
        Row: {
          affiliate_id: string
          created_at: string | null
          id: string
          product_id: string
          qr_code: string
          scans_count: number | null
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          created_at?: string | null
          id?: string
          product_id: string
          qr_code: string
          scans_count?: number | null
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          created_at?: string | null
          id?: string
          product_id?: string
          qr_code?: string
          scans_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_qr_codes_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "restaurant_qr_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          movement_type: string
          order_id: string | null
          product_id: string
          quantity: number
          reason: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type: string
          order_id?: string | null
          product_id: string
          quantity: number
          reason?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type?: string
          order_id?: string | null
          product_id?: string
          quantity?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_shipping_settings: {
        Row: {
          base_shipping_cost: number | null
          created_at: string | null
          express_shipping_cost: number | null
          free_shipping_threshold: number | null
          id: string
          processing_days: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          base_shipping_cost?: number | null
          created_at?: string | null
          express_shipping_cost?: number | null
          free_shipping_threshold?: number | null
          id?: string
          processing_days?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          base_shipping_cost?: number | null
          created_at?: string | null
          express_shipping_cost?: number | null
          free_shipping_threshold?: number | null
          id?: string
          processing_days?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          created_at: string | null
          pending_balance: number | null
          total_earned: number | null
          updated_at: string | null
          user_id: string
          validated_balance: number | null
        }
        Insert: {
          created_at?: string | null
          pending_balance?: number | null
          total_earned?: number | null
          updated_at?: string | null
          user_id: string
          validated_balance?: number | null
        }
        Update: {
          created_at?: string | null
          pending_balance?: number | null
          total_earned?: number | null
          updated_at?: string | null
          user_id?: string
          validated_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      wilayas: {
        Row: {
          code: string
          id: number
          name: string
          shipping_cost: number | null
        }
        Insert: {
          code: string
          id?: number
          name: string
          shipping_cost?: number | null
        }
        Update: {
          code?: string
          id?: number
          name?: string
          shipping_cost?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_affiliate_request: {
        Args: { request_id: string }
        Returns: Json
      }
      generate_affiliate_code: {
        Args: { affiliate_uuid: string; product_uuid: string }
        Returns: string
      }
      generate_promo_code: {
        Args: { affiliate_uuid: string; product_uuid: string }
        Returns: string
      }
      generate_unique_slug: {
        Args: { title_text: string; vendor_uuid: string }
        Returns: string
      }
      scan_qr_code: {
        Args: { qr_code_param: string; sale_amount: number }
        Returns: Json
      }
      update_order_status: {
        Args: {
          new_status: Database["public"]["Enums"]["order_status"]
          order_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "rejected"
        | "returned"
      product_category:
        | "electronics"
        | "fashion"
        | "food"
        | "health"
        | "home"
        | "sports"
        | "other"
      request_status: "pending" | "approved" | "rejected"
      user_role: "admin" | "vendor" | "affiliate"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "rejected",
        "returned",
      ],
      product_category: [
        "electronics",
        "fashion",
        "food",
        "health",
        "home",
        "sports",
        "other",
      ],
      request_status: ["pending", "approved", "rejected"],
      user_role: ["admin", "vendor", "affiliate"],
    },
  },
} as const
