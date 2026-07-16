import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Validate the middleware secret token to prevent spam
  const secret = req.headers['x-middleware-secret'];
  const expectedSecret = process.env.MIDDLEWARE_SECRET || 'fallback-secret-key-123';
  
  if (!secret || secret !== expectedSecret) {
    return res.status(403).json({ error: 'Forbidden: Access is denied' });
  }

  const { ip_address, city, region, country, user_agent, visited_url } = req.body;

  const detectSuspiciousBehavior = (url, ua) => {
    if (!url || !ua) return false;
    const urlLower = url.toLowerCase();
    const uaLower = ua.toLowerCase();

    const sensitiveKeywords = ['.env', 'wp-admin', 'wp-login', 'phpmyadmin', 'config', 'admin', 'eval('];
    const hasSensitiveKeyword = sensitiveKeywords.some((keyword) => urlLower.includes(keyword));

    const botSignatures = ['curl', 'python', 'postman', 'axios', 'bot', 'crawler'];
    const hasBotSignature = botSignatures.some((sig) => uaLower.includes(sig));

    return hasSensitiveKeyword || hasBotSignature;
  };

  const is_suspicious = detectSuspiciousBehavior(visited_url, user_agent);

  try {
    const { error } = await supabase
      .from('sys_visitor_logs')
      .insert([
        {
          ip_address,
          city,
          region,
          country,
          user_agent,
          visited_url,
          is_suspicious
        }
      ]);

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true, message: 'Log written successfully' });
  } catch (err) {
    console.error('Error writing sys_visitor_logs:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
