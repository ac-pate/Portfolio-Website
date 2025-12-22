import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Secure Admin Config Route
 * 
 * This API route serves the Decap CMS config.yml file with environment variables
 * injected securely. The actual API keys never appear in the committed codebase.
 * 
 * Environment variables required:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 */
export async function GET() {
  try {
    // Read the config template file
    const configPath = path.join(process.cwd(), 'public', 'admin', 'config.yml');
    let configContent = fs.readFileSync(configPath, 'utf8');

    // Get environment variables (these come from Vercel environment variables)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    // Validate that environment variables are set
    if (!cloudName || !apiKey) {
      console.error('Missing Cloudinary environment variables');
      // In development, return config with placeholders (so CMS still loads)
      // In production, you should fail or show an error
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Cloudinary credentials not configured. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY in Vercel environment variables.' },
          { status: 500 }
        );
      }
      // In development, keep placeholders so user can still use CMS
      // but warn them
      console.warn('⚠️  CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY not set. Using placeholders.');
    } else {
      // Replace placeholders with actual environment variables
      configContent = configContent.replace(
        /cloud_name:\s*YOUR_CLOUD_NAME_HERE/g,
        `cloud_name: ${cloudName}`
      );
      configContent = configContent.replace(
        /api_key:\s*YOUR_API_KEY_HERE/g,
        `api_key: ${apiKey}`
      );
    }

    // Return the config as YAML
    return new NextResponse(configContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/yaml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error serving admin config:', error);
    return NextResponse.json(
      { error: 'Failed to load admin configuration' },
      { status: 500 }
    );
  }
}

