export type UserRole = "admin" | "editor" | "viewer";
export type FixtureStatus = "upcoming" | "today" | "completed";
export type SeatType = "fixed" | "rotating" | "host";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: UserRole;
          must_change_password: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: UserRole;
          must_change_password?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      guests: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          dietary: string;
          notes: string | null;
          security_pin: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          dietary?: string;
          notes?: string | null;
          security_pin?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guests"]["Insert"]>;
        Relationships: [];
      };
      fixtures: {
        Row: {
          id: string;
          date: string;
          kickoff_time: string;
          opponent: string;
          opponent_primary_colour: string | null;
          opponent_secondary_colour: string | null;
          opponent_abbreviation: string | null;
          competition: string;
          venue: string;
          status: FixtureStatus;
          notes: string | null;
          football_data_fixture_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          kickoff_time: string;
          opponent: string;
          opponent_primary_colour?: string | null;
          opponent_secondary_colour?: string | null;
          opponent_abbreviation?: string | null;
          competition?: string;
          venue?: string;
          status?: FixtureStatus;
          notes?: string | null;
          football_data_fixture_id?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fixtures"]["Insert"]>;
        Relationships: [];
      };
      seat_config: {
        Row: {
          id: number;
          label: string;
          type: SeatType;
          default_guest_id: string | null;
        };
        Insert: {
          id: number;
          label: string;
          type: SeatType;
          default_guest_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["seat_config"]["Insert"]>;
        Relationships: [];
      };
      seat_allocations: {
        Row: {
          id: string;
          fixture_id: string;
          seat_id: number;
          guest_id: string | null;
          host_name: string | null;
          arrival_time: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          fixture_id: string;
          seat_id: number;
          guest_id?: string | null;
          host_name?: string | null;
          arrival_time?: string | null;
          notes?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["seat_allocations"]["Insert"]
        >;
        Relationships: [];
      };
      menus: {
        Row: {
          id: string;
          fixture_id: string;
          welcome_drinks: string | null;
          starter: string | null;
          main_course: string | null;
          dessert: string | null;
          drinks_included: string | null;
          additional_notes: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fixture_id: string;
          welcome_drinks?: string | null;
          starter?: string | null;
          main_course?: string | null;
          dessert?: string | null;
          drinks_included?: string | null;
          additional_notes?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["menus"]["Insert"]>;
        Relationships: [];
      };
      settings: {
        Row: {
          id: number;
          box_name: string;
          suite_name: string;
          hospitality_entrance: string;
          box_office_location: string;
          stadium_address: string;
          box_opens_before_ko: number;
          box_closes_after_ko: number;
          season: string;
          total_seats: number;
        };
        Insert: Partial<Database["public"]["Tables"]["settings"]["Row"]> & {
          id?: number;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Guest = Database["public"]["Tables"]["guests"]["Row"];
export type Fixture = Database["public"]["Tables"]["fixtures"]["Row"];
export type SeatConfig = Database["public"]["Tables"]["seat_config"]["Row"];
export type SeatAllocation =
  Database["public"]["Tables"]["seat_allocations"]["Row"];
export type Menu = Database["public"]["Tables"]["menus"]["Row"];
export type Settings = Database["public"]["Tables"]["settings"]["Row"];
