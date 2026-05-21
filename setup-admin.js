const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://goujqsklmwvdayhodrnu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdWpxc2tsbXd2ZGF5aG9kcm51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODEwOTY4MywiZXhwIjoyMDkzNjg1NjgzfQ.UtHrwVmNqqkeMI26rWpOR5w_xLAcfHYBiXmBv7wwh94';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  const email = 'hussainyusuf393@gmail.com';
  const password = 'YusufHussain';

  console.log(`Setting up admin: ${email}`);

  // 1. Create in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log('User already exists in Auth.');
    } else {
      console.error('Error creating user in Auth:', authError.message);
      return;
    }
  } else {
    console.log('User created in Auth successfully.');
  }

  // 2. Add to admins table
  const { error: dbError } = await supabase.from('admins').upsert({ email }, { onConflict: 'email' });
  if (dbError) {
    console.error('Error adding user to admins table:', dbError.message);
  } else {
    console.log('User added to admins table successfully.');
  }
}

setupAdmin();
