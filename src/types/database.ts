export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface Package {
  id: string
  name: string
  slug: string
  short_description: string | null
  full_description: string | null
  price: number
  discount_price: number | null
  duration_days: number
  duration_nights: number | null
  destination: string
  country: string | null
  category_id: string | null
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: ItineraryDay[]
  images: string[]
  featured: boolean
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  categories?: Category
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
}

export interface Enquiry {
  id: string
  package_id: string | null
  package_name: string | null
  name: string
  email: string
  phone: string
  travel_date: string | null
  adults: number
  children: number
  rooms: number
  budget: string | null
  message: string | null
  status: 'new' | 'contacted' | 'converted' | 'closed'
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
}
