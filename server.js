import express from 'express';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '12mb' }));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
const limiter = rateLimit({ windowMs: 60_000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false });
app.get('/api/health', (_req, res) => res.json({ ready: Boolean(process.env.OPENAI_API_KEY) }));
app.post('/api/analyze', limiter, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: '服务器尚未配置 OPENAI_API_KEY。' });
    const { image, mode = 'study' } = req.body || {};
    if (typeof image !== 'string' || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)) {
      return res.status(400).json({ error: '请上传 JPG、PNG 或 WebP 图片。' });
    }
    if (image.length > 11_000_000) return res.status(413).json({ error: '图片太大，请压缩后重试。' });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 45000 });
    const prompt = mode === 'practice'
      ? '你是耐心的课程辅导老师。先完整转录图片里的题目和选项，然后给出解题提示，不要直接透露答案。'
      : '你是耐心的课程辅导老师。先完整转录图片里的题目和选项，再给出最可能的正确选项及中文解析，并简要说明其他选项为何不正确。若题目不清晰、缺少信息或有多个合理答案，请明确指出不确定性，禁止猜测。';
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      max_output_tokens: 1100,
      instructions: '仅用于课后学习、练习和复习。用简体中文回复，保留英文专业术语。不得声称百分之百准确。',
      input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: image, detail: 'high' }] }]
    });
    res.json({ result: response.output_text || '未获得可用结果，请重试。' });
  } catch (err) {
    console.error('Analysis failed:', err?.status || err?.message || err);
    res.status(502).json({ error: '分析失败。请检查 API 额度、模型权限或网络后重试。' });
  }
});
app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('QuizLens ready'));
