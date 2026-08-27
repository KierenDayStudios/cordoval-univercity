type ContentType = 'blog' | 'book' | 'course';

function send(res: any, status: number, body: Record<string, unknown>) {
  res.status(status).json(body);
}

async function getAdminDb() {
  const { cert, getApps, initializeApp } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured');
    const serviceAccount = JSON.parse(raw);
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
    });
  }
  return getFirestore();
}

function validType(value: unknown): value is ContentType {
  return value === 'blog' || value === 'book' || value === 'course';
}

function validateContent(type: ContentType, value: any): string | null {
  if (!value || typeof value !== 'object') return 'content must be an object';

  const required = type === 'course'
    ? ['title', 'description', 'instructor', 'duration', 'slides', 'quiz', 'createdAt']
    : type === 'book'
      ? ['title', 'description', 'author', 'readTime', 'chapters', 'createdAt']
      : ['title', 'description', 'author', 'readTime', 'content', 'source', 'createdAt'];

  for (const field of required) {
    if (value[field] === undefined || value[field] === null) return `Missing field: ${field}`;
  }

  if (typeof value.title !== 'string' || !value.title.trim()) return 'title must be a non-empty string';
  if (typeof value.description !== 'string') return 'description must be a string';
  if (typeof value.createdAt !== 'number' || !Number.isFinite(value.createdAt)) return 'createdAt must be a number';
  if (value.coverImage !== undefined && value.coverImage !== '') return 'coverImage must be blank';

  if (type === 'blog') {
    if (typeof value.author !== 'string' || typeof value.readTime !== 'string' || typeof value.content !== 'string') {
      return 'Invalid blog fields';
    }
    if (value.source !== 'cordoval' && value.source !== 'blogger') return 'Invalid blog source';
  }

  if (type === 'book') {
    if (!Array.isArray(value.chapters)) return 'chapters must be an array';
    if (!value.chapters.every((chapter: any) => chapter && typeof chapter.title === 'string' && typeof chapter.content === 'string')) {
      return 'Each chapter needs a title and content';
    }
  }

  if (type === 'course') {
    if (!Array.isArray(value.slides)) return 'slides must be an array';
    if (!Array.isArray(value.quiz) || value.quiz.length !== 25) return 'quiz must contain exactly 25 questions';
    for (const question of value.quiz) {
      if (!question || typeof question.question !== 'string' || !Array.isArray(question.options) || question.options.length !== 4) {
        return 'Each quiz question needs text and exactly 4 options';
      }
      if (!Number.isInteger(question.correctAnswer) || question.correctAnswer < 0 || question.correctAnswer > 3) {
        return 'Each quiz question needs one correct answer from 0 to 3';
      }
    }
  }

  return null;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Idempotency-Key');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return send(res, 405, { success: false, error: 'Method not allowed' });

  const expectedSecret = process.env.PUBLISH_API_SECRET;
  const suppliedSecret = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return send(res, 401, { success: false, error: 'Unauthorised' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return send(res, 400, { success: false, error: 'Invalid JSON' }); }
    }
    const { type, content, idempotencyKey } = body || {};
    if (!validType(type)) return send(res, 400, { success: false, error: 'type must be blog, book, or course' });

    const validationError = validateContent(type, content);
    if (validationError) return send(res, 400, { success: false, error: validationError });

    const db = await getAdminDb();
    const contentId = String(idempotencyKey || content.id || `${type}-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 100);
    const collection = `${type}s`;
    const payload = { ...content, id: contentId, coverImage: '', updatedAt: Date.now() };

    await db.collection(collection).doc(contentId).set(payload);

    return send(res, 200, {
      success: true,
      contentId,
      type,
      status: 'published',
      url: `https://institute.cordoval.work/${type}s/${contentId}`,
    });
  } catch (error: any) {
    console.error('Publishing failed:', error);
    return send(res, 500, { success: false, error: error?.message || 'Publishing failed' });
  }
}
