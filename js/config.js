// ============================================================
// CONFIGURATION — Replace with your actual keys
// ============================================================

const SUPABASE_URL = 'https://vrftqjovlwppiemsiuwc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnRxam92bHdwcGllbXNpdXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTAzMzgsImV4cCI6MjA5NTI4NjMzOH0.2zofF8ncepns3SMUNBQKLDWpPxzlWinQTLOefzWzOYg';
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase, RAZORPAY_KEY_ID };
