import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { CreateCommentDto } from '../types';

const router = Router();

// POST create comment
router.post('/', async (req: Request, res: Response) => {
  try {
    const dto: CreateCommentDto = req.body;

    const { data, error } = await supabase
      .from('comments')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE comment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Comentário excluído' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;