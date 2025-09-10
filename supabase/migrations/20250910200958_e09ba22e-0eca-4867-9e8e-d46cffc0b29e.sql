-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('teacher', 'student');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  student_id TEXT, -- only for students
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create QR logs table
CREATE TABLE public.qr_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code TEXT NOT NULL UNIQUE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  generated_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'present',
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for classes
CREATE POLICY "Teachers can view their own classes" 
ON public.classes FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'teacher' AND teacher_id = auth.uid());

CREATE POLICY "Students can view classes for attendance" 
ON public.classes FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'student');

CREATE POLICY "Teachers can create classes" 
ON public.classes FOR INSERT 
WITH CHECK (public.get_user_role(auth.uid()) = 'teacher' AND teacher_id = auth.uid());

CREATE POLICY "Teachers can update their classes" 
ON public.classes FOR UPDATE 
USING (public.get_user_role(auth.uid()) = 'teacher' AND teacher_id = auth.uid());

-- RLS Policies for QR logs
CREATE POLICY "Teachers can manage QR codes for their classes" 
ON public.qr_logs FOR ALL 
USING (
  public.get_user_role(auth.uid()) = 'teacher' AND 
  class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
);

CREATE POLICY "Students can view active QR codes" 
ON public.qr_logs FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'student' AND is_active = true AND expiry_time > now());

-- RLS Policies for attendance
CREATE POLICY "Students can view their own attendance" 
ON public.attendance FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'student' AND student_id = auth.uid());

CREATE POLICY "Students can mark their own attendance" 
ON public.attendance FOR INSERT 
WITH CHECK (public.get_user_role(auth.uid()) = 'student' AND student_id = auth.uid());

CREATE POLICY "Teachers can view attendance for their classes" 
ON public.attendance FOR SELECT 
USING (
  public.get_user_role(auth.uid()) = 'teacher' AND 
  class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();