import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oqwpghymavhxckztygee.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xd3BnaHltYXZoeGNrenR5Z2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODg2NDksImV4cCI6MjA5Njc2NDY0OX0.v3vdg9fcwfWYAuOdArshwMOLEvxIoHxXPX_i9LWQBco";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
