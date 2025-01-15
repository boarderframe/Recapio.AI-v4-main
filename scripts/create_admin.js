const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
    try {
        // Create the user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: 'cosburn@yahoo.com',
            password: 'changeme123',
            email_confirm: true,
            user_metadata: {
                first_name: 'Carl',
                last_name: 'Osburn',
                roles: ['admin']
            }
        });

        if (authError) throw authError;

        console.log('Auth user created:', authData);

        // Create the public user record
        const { data: publicData, error: publicError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: 'cosburn@yahoo.com',
                roles: ['admin']
            })
            .select()
            .single();

        if (publicError) throw publicError;

        console.log('Public user created:', publicData);
        console.log('\nAdmin user created successfully:');
        console.log('Email:', 'cosburn@yahoo.com');
        console.log('Password:', 'changeme123');
        console.log('User ID:', authData.user.id);
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

createAdminUser(); 