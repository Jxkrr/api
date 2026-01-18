export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const KV_REST_API_URL = process.env.KV_REST_API_URL;
    const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
    
    // Get the site identifier from query parameters
    // Example: /api/views?site=mysite or /api/views?site=friendsite
    const site = req.query.site || 'default';
    
    // Validate the site to prevent arbitrary keys
    const allowedSites = ['mysite', 'friendsite'];
    if (!allowedSites.includes(site) && site !== 'default') {
      return res.status(400).json({ 
        error: 'Invalid site parameter. Use "mysite" or "friendsite"', 
        success: false 
      });
    }
    
    // Create a unique key for each website
    const key = `views:${site}`;
    
    // Increment counter using REST API
    const response = await fetch(`${KV_REST_API_URL}/incr/${key}`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
    });
    
    const data = await response.json();
    const views = data.result;
    
    return res.status(200).json({ 
      views, 
      success: true,
      site 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message, 
      success: false 
    });
  }
}
