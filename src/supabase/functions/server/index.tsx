import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Create a Supabase client with service role key for admin operations
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
};

app.post('/make-server-ea24b08c/signup', async (c) => {
  try {
    const { firstName, lastName, email, password, userType } = await c.req.json();

    if (!firstName || !lastName || !email || !password || !userType) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    if (!['student', 'college'].includes(userType)) {
      return c.json({ error: 'Invalid user type. Must be student or college.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Create the user with email confirmation automatically set to true
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        userType
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'Account created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        userType: data.user.user_metadata.userType
      }
    });

  } catch (error) {
    console.log('Server error during signup:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-ea24b08c/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Signin error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'Signed in successfully',
      session: data.session,
      user: data.user
    });

  } catch (error) {
    console.log('Server error during signin:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);