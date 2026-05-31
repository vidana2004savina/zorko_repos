import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gasgpjnivemwgzzkvgnc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_kCnTvgKwo3_Fr_mT9xOqHg_zhNuQIxp'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  role: 'brand' | 'blogger'
  full_name: string
  avatar_url?: string
  company_name?: string
  bio?: string
  social_links?: Record<string, string>
  created_at?: string
}

export type Campaign = {
  id: string
  brand_id: string
  title: string
  category: string
  scale: 'local' | 'federal'
  location?: string
  has_delivery: boolean
  description: string
  target_audience: string
  goal: string
  budget_range: string
  requirements: string[]
  platforms: string[]
  status: 'draft' | 'active' | 'completed'
  created_at: string
}

export type Proposal = {
  id: string
  campaign_id: string
  blogger_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  message?: string
  created_at: string
}
