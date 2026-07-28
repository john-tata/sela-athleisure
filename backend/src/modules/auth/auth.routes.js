const express = require('express');
const router = express.Router();
const { supabase } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

// Auth is handled by Supabase client directly.
// These endpoints are thin wrappers for convenience.

router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new AppError('No token provided', 401);

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new AppError('Invalid token', 401);

    // Get profile
    const { supabaseAdmin } = require('../../config/supabase');
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({ success: true, data: { user, profile } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
