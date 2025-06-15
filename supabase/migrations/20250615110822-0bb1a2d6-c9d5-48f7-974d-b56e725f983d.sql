
-- 1. Create a table to store each child's growth records.
CREATE TABLE public.growth_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    date date NOT NULL,
    weight numeric(5,2) NOT NULL,
    height numeric(5,2) NOT NULL,
    has_edema boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security on the table
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;

-- 3. Policy: allow insert/select/update/delete if user owns the child referenced
CREATE POLICY "Allow child's owner to manage growth records"
  ON public.growth_records
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.children
      WHERE children.id = growth_records.child_id
      AND children.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children
      WHERE children.id = growth_records.child_id
      AND children.user_id = auth.uid()
    )
  );
