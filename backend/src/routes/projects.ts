import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { CreateProjectDto, UpdateProjectDto } from '../types';

const router = Router();

// GET all projects with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (req.query.status) {
      query = query.eq('status', req.query.status as string);
    }

    if (req.query.search) {
      const search = req.query.search as string;
      query = query.or(
        `project.ilike.%${search}%,subproduct.ilike.%${search}%,observations.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project with comments and history
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [projectRes, commentsRes, historyRes] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase
        .from('comments')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: true }),
      supabase
        .from('history')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (projectRes.error) throw projectRes.error;

    res.json({
      data: {
        ...projectRes.data,
        comments: commentsRes.data ?? [],
        history: historyRes.data ?? [],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST create project
router.post('/', async (req: Request, res: Response) => {
  try {
    const dto: CreateProjectDto = req.body;

    const { data, error } = await supabase
      .from('projects')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update project (with history tracking)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { updated_by, ...fields }: UpdateProjectDto = req.body;

    // Fetch current project for diff
    const { data: current, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Build history entries
    const historyEntries = Object.entries(fields)
      .filter(([key, value]) => current[key] !== value)
      .map(([key, value]) => ({
        project_id: id,
        changed_by: updated_by,
        field_name: key,
        old_value: current[key] != null ? String(current[key]) : null,
        new_value: value != null ? String(value) : null,
      }));

    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Insert history
    if (historyEntries.length > 0) {
      await supabase.from('history').insert(historyEntries);
    }

    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Projeto excluído com sucesso' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;