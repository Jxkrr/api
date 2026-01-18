import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Allow requests from your main site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const views = await kv.incr('page-views');
    
    return res.status(200).json({ 
      views: views,
      success: true 
    });
  } catch (error) {
    console.error('Redis Error:', error);
    return res.status(500).json({ 
      error: 'Failed to update views',
      success: false 
    });
  }
}