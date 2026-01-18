export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const KV_REST_API_URL = process.env.KV_REST_API_URL;
    const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
    
    // Increment counter using REST API
    const response = await fetch(`${KV_REST_API_URL}/incr/page-views`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
    });
    
    const data = await response.json();
    const views = data.result;
    
    return res.status(200).json({ views, success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message, 
      success: false 
    });
  }
}
