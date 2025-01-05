import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const providers = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'email profile',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
    scope: 'email',
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  },
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const provider = url.pathname.split('/').pop() as keyof typeof providers;
    const code = url.searchParams.get('code');

    if (!providers[provider]) {
      return new Response(
        JSON.stringify({ error: 'Invalid provider' }),
        { status: 400 }
      );
    }

    if (!code) {
      // Redirect to provider's auth page
      const params = new URLSearchParams({
        client_id: providers[provider].clientId!,
        redirect_uri: `${process.env.FRONTEND_URL}/api/auth/${provider}`,
        response_type: 'code',
        scope: providers[provider].scope,
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: `${providers[provider].authUrl}?${params.toString()}`,
        },
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch(providers[provider].tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: providers[provider].clientId!,
        client_secret: providers[provider].clientSecret!,
        code,
        redirect_uri: `${process.env.FRONTEND_URL}/api/auth/${provider}`,
        grant_type: 'authorization_code',
      }),
    });

    const { access_token } = await tokenResponse.json();

    // Get user profile from provider
    let profile;
    if (provider === 'google') {
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      profile = await userResponse.json();
    } else if (provider === 'facebook') {
      const userResponse = await fetch('https://graph.facebook.com/me?fields=id,name,email', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      profile = await userResponse.json();
    }

    if (!profile) {
      throw new Error('Failed to get user profile');
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: {
        email: profile.email,
      },
      update: {
        [`${provider}Id`]: profile.id,
      },
      create: {
        email: profile.email,
        name: profile.name,
        [`${provider}Id`]: profile.id,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
      {
        expiresIn: '24h',
      }
    );

    // Return success HTML that sends message to parent window
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            window.opener.postMessage(
              {
                token: '${token}',
                user: ${JSON.stringify({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                })}
              },
              '${process.env.FRONTEND_URL}'
            );
            window.close();
          </script>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 