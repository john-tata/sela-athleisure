const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

const getFavorites = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('favorites')
    .select(`
      id,
      product_id,
      created_at,
      products (
        id,
        name,
        slug,
        base_price,
        compare_price,
        is_bestseller,
        is_new,
        is_featured,
        is_active,
        product_images (
          id,
          url,
          alt_text,
          sort_order,
          is_primary
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get favorites error:', error);
    throw new AppError(
      'Failed to fetch favorites',
      500,
      'FAVORITES_FETCH_FAILED'
    );
  }

  return data || [];
};

const isFavorite = async (userId, productId) => {
  const { data, error } = await supabaseAdmin
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (error) {
    console.error('Check favorite error:', error);
    throw new AppError(
      'Failed to check favorite',
      500,
      'FAVORITE_CHECK_FAILED'
    );
  }

  return !!data;
};

const addFavorite = async (userId, productId) => {
  // Make sure product exists
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('id', productId)
    .eq('is_active', true)
    .maybeSingle();

  if (productError) {
    console.error('Product lookup error:', productError);
    throw new AppError(
      'Failed to find product',
      500,
      'PRODUCT_LOOKUP_FAILED'
    );
  }

  if (!product) {
    throw new AppError(
      'Product not found',
      404,
      'PRODUCT_NOT_FOUND'
    );
  }

  // Insert favorite
  const { data, error } = await supabaseAdmin
    .from('favorites')
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select(`
      id,
      product_id,
      created_at
    `)
    .single();

  // Duplicate favorite
  if (error?.code === '23505') {
    return {
      alreadyFavorite: true,
      favorite: await getFavoriteByProduct(userId, productId),
    };
  }

  if (error) {
    console.error('Add favorite error:', error);
    throw new AppError(
      'Failed to add favorite',
      500,
      'FAVORITE_ADD_FAILED'
    );
  }

  return {
    alreadyFavorite: false,
    favorite: data,
  };
};

const removeFavorite = async (userId, productId) => {
  const { data, error } = await supabaseAdmin
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Remove favorite error:', error);
    throw new AppError(
      'Failed to remove favorite',
      500,
      'FAVORITE_REMOVE_FAILED'
    );
  }

  return {
    removed: !!data,
  };
};

const getFavoriteByProduct = async (userId, productId) => {
  const { data, error } = await supabaseAdmin
    .from('favorites')
    .select('id, product_id, created_at')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (error) {
    console.error('Get favorite error:', error);
    throw new AppError(
      'Failed to fetch favorite',
      500,
      'FAVORITE_FETCH_FAILED'
    );
  }

  return data;
};

module.exports = {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
};