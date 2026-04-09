import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mgqpyqocziqiyxgihjeo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BuYX6TdSyGuKr05_q6VA2Q_xGNRgI0Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
