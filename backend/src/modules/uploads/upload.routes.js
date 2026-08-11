const express = require('express');
const router = express.Router();
const multer = require('multer');
const { z } = require('zod');
const { supabaseAdmin } = require('../../config/supabase');
const validate = require('../../middleware/validate');
const AppError = require('../../utils/AppError');
const { requireAuth, requireAdmin } = require('../../middleware/auth');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Helper: upload buffer to Supabase Storage
async function uploadToStorage(buffer, filename, mimetype, folder = 'uploads') {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'sela-assets';
  const path = `${folder}/${Date.now()}-${filename}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: mimetype, upsert: false });

  if (error) throw new AppError(error.message, 500, 'STORAGE_UPLOAD_ERROR');

  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);

  return { path: data.path, url: urlData.publicUrl };
}

// POST /api/v1/uploads/image - direct image upload
router.post('/image', requireAuth,
  requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No image file provided', 400, 'VALIDATION_ERROR');

    const folder = req.body.folder || 'uploads';
    const result = await uploadToStorage(req.file.buffer, req.file.originalname, req.file.mimetype, folder);

    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/uploads/video - direct video upload
router.post(
  "/video",
  requireAuth,
  requireAdmin,
  upload.single("video"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError(
          "No video provided",
          400,
          "VALIDATION_ERROR"
        );
      }

      validateVideo(req.file);

      const result = await uploadToStorage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        "videos"
      );

      res.json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/uploads/images - upload multiple images
router.post('/images', requireAuth, requireAdmin, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError('No image files provided', 400, 'VALIDATION_ERROR');
    }

    const folder = req.body.folder || 'uploads';
    const results = [];

    for (const file of req.files) {
      const result = await uploadToStorage(file.buffer, file.originalname, file.mimetype, folder);
      results.push(result);
    }

    res.json({ status: 'success', data: { uploaded: results.length, images: results } });
  } catch (err) {
    next(err);
  }
});

function validateVideo(file) {
  if (!file.mimetype.startsWith("video/")) {
    throw new AppError(
      "Only video files are allowed",
      400,
      "VALIDATION_ERROR"
    );
  }

  const maxSize = 100 * 1024 * 1024; //100MB

  if (file.size > maxSize) {
    throw new AppError(
      "Video must be under 100MB",
      400,
      "VALIDATION_ERROR"
    );
  }
}

// DELETE /api/v1/uploads/image - delete from storage by path
router.delete('/image', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { path } = req.body;
    if (!path) throw new AppError('Storage path is required', 400, 'VALIDATION_ERROR');

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'sela-assets';
    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

    if (error) throw new AppError(error.message, 500, 'STORAGE_DELETE_ERROR');

    res.json({ status: 'success', message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
});

// Legacy: POST /api/v1/uploads/presigned - get presigned URL
const presignedSchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  contentType: z.string().min(1),
});

router.post('/presigned', requireAuth, requireAdmin, validate(presignedSchema), async (req, res, next) => {
  try {
    const { bucket, path, contentType } = req.body;
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(path);
    if (error) throw new AppError(error.message, 400, 'STORAGE_ERROR');
    res.json({ status: 'success', data: { signedUrl: data.signedUrl, path: data.path, token: data.token } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
