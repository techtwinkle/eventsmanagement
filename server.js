import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Image proxy endpoint
app.get('/api/image/*', async (req, res) => {
  const url = req.params[0];
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    let githubUrl;
    
    // If it's already a full URL, process it
    if (url.startsWith('http')) {
      // Convert GitHub blob URLs to raw URLs
      if (url.includes('github.com') && url.includes('/blob/')) {
        githubUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      } else {
        githubUrl = url;
      }
    } else {
      // Fallback: treat as filename for backward compatibility
      githubUrl = `https://raw.githubusercontent.com/AnishKMBtech/images/main/${url}`;
    }
    
    const response = await fetch(githubUrl);
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Determine content type based on file extension
    const extension = githubUrl.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'mp4':
        contentType = 'video/mp4';
        break;
      case 'webm':
        contentType = 'video/webm';
        break;
      case 'mov':
        contentType = 'video/quicktime';
        break;
    }

    // Set proper headers
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Access-Control-Allow-Origin': '*',
    });

    // Send the image buffer
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Image proxy server running on http://localhost:${PORT}`);
});