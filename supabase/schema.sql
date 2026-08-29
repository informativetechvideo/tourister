-- ============================================
-- Tourister Database Schema for Supabase
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  price NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2),
  duration_days INT NOT NULL,
  duration_nights INT,
  destination TEXT NOT NULL,
  country TEXT,
  category_id UUID REFERENCES categories(id),
  highlights JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES packages(id),
  package_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  travel_date DATE,
  adults INT DEFAULT 2,
  children INT DEFAULT 0,
  rooms INT DEFAULT 1,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Functions
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own, admins see all
CREATE POLICY "Users see own profile, admins see all"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Categories: public read active, admin full access
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins have full access to categories"
  ON categories FOR ALL
  USING (public.is_admin());

-- Packages: public read active, admin full access
CREATE POLICY "Public can view active packages"
  ON packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins have full access to packages"
  ON packages FOR ALL
  USING (public.is_admin());

-- Enquiries: anyone can insert, only admin can read/update/delete
CREATE POLICY "Anyone can submit enquiry"
  ON enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all enquiries"
  ON enquiries FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update enquiries"
  ON enquiries FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete enquiries"
  ON enquiries FOR DELETE
  USING (public.is_admin());

-- ============================================
-- Storage Buckets (run via Supabase Dashboard)
-- ============================================
-- Go to Storage > New Bucket:
--   Name: package-images
--   Public: Yes
--   File size limit: 5MB
--   Allowed MIME types: image/*
--
-- Then add storage policies via SQL:
-- ============================================

-- Storage policies for package-images bucket
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'package-images');

CREATE POLICY "Public read access for images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'package-images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'package-images');

-- ============================================
-- Setup Instructions:
-- ============================================
-- 1. Run this entire SQL in Supabase SQL Editor
-- 2. Create storage bucket "package-images" (public)
-- 3. Create your admin user via Supabase Auth > Users
-- 4. Update the profiles table to set role = 'admin' for that user:
--    UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
-- ============================================
