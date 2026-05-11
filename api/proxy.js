export default async function handler(req, res) {
  // Allow cross-origin requests from the Vercel frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extract the target API path from the query string
  const targetPath = req.query.path;
  if (!targetPath) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // NOTE: Do not disable SSL verification in production. Use a valid backend certificate or a trusted reverse proxy.

  const targetUrl = `https://maya.technicalhub.io/node/api/${targetPath}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Spoof the Origin and Referer to bypass the backend's strict CORS check
        'Origin': 'https://maya.technicalhub.io',
        'Referer': 'https://maya.technicalhub.io/'
      }
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const backendRes = await fetch(targetUrl, fetchOptions);
    const data = await backendRes.text();

    // Check if the response is JSON
    let parsedData = data;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      // Return as text if it's not JSON
    }

    return res.status(backendRes.status).send(parsedData);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to proxy request', details: error.message });
  }
}
