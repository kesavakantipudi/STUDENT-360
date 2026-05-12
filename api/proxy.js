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

  // Handle result submission endpoints locally (don't proxy to external API)
  if (targetPath.startsWith('submit-result') || targetPath.startsWith('results/')) {
    return handleResultSubmission(req, res, targetPath);
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

/**
 * Handle result submission from Electron app
 */
async function handleResultSubmission(req, res, targetPath) {
  try {
    if (req.method === 'POST' && targetPath === 'submit-result') {
      // Import the result submission function dynamically
      const { submitExamResult } = await import('../scripts/importResults.js');

      const resultData = req.body;
      if (!resultData) {
        return res.status(400).json({ error: 'Missing result data' });
      }

      const result = await submitExamResult(resultData);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Result submitted successfully',
          resultId: result.resultId
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }
    }

    if (req.method === 'GET' && targetPath.startsWith('results/student/')) {
      // Get results for a specific student
      const rollNo = targetPath.split('/')[2];
      const { getStudentResults } = await import('../scripts/importResults.js');

      const results = await getStudentResults(rollNo);
      return res.status(200).json({ success: true, results });
    }

    if (req.method === 'GET' && targetPath.startsWith('results/exam/')) {
      // Get results for a specific exam
      const examId = targetPath.split('/')[2];
      const { getExamResults } = await import('../scripts/importResults.js');

      const results = await getExamResults(examId);
      return res.status(200).json({ success: true, results });
    }

    return res.status(404).json({ error: 'Result endpoint not found' });

  } catch (error) {
    console.error('Result submission error:', error);
    return res.status(500).json({ error: 'Failed to process result', details: error.message });
  }
}
