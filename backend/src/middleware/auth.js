const { supabase, supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log('=== AUTH DEBUG ===');
    console.log('Authorization header exists:', !!authHeader);
    console.log(
      'Authorization starts Bearer:',
      authHeader?.startsWith('Bearer ')
    );
    console.log(
      'Token length:',
      authHeader ? authHeader.split(' ')[1]?.length : 0
    );

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Authorization token required',
        401,
        'UNAUTHORIZED'
      );
    }

    const token = authHeader.split(' ')[1];

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    console.log('Supabase user:', user?.email);
    console.log('Supabase auth error:', error?.message);

    if (error || !user) {
      throw new AppError(
        'Invalid or expired token',
        401,
        'UNAUTHORIZED'
      );
    }

    req.user = user;
    req.userId = user.id;

    next();
  } catch (err) {
    next(err);
  }
};
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!error && user) {
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (err) {
    next(err);
  }
};
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new AppError(
        'Authentication required',
        401,
        'UNAUTHORIZED'
      );
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', req.userId)
      .single();

    if (error || !profile) {
      throw new AppError(
        'Admin profile not found',
        403,
        'FORBIDDEN'
      );
    }

    if (!['admin', 'manager'].includes(profile.role)) {
      throw new AppError(
        'Admin access required',
        403,
        'FORBIDDEN'
      );
    }

    req.profile = profile;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth,
};