
-- Drop existing policies that allow anonymous access
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can view categories" ON public.categories;

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;

-- Enable Row Level Security on all tables if not already enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create new policies that specifically target authenticated users only
-- Categories policies
CREATE POLICY "Authenticated users can view categories" 
ON public.categories 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert own categories" 
ON public.categories 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own categories" 
ON public.categories 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own categories" 
ON public.categories 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Authenticated users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Authenticated users can view own tasks" 
ON public.tasks 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own tasks" 
ON public.tasks 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own tasks" 
ON public.tasks 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own tasks" 
ON public.tasks 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
