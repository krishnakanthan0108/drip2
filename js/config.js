// ============================================================
// CONFIGURATION — Replace with your actual keys
// ============================================================

const SUPABASE_URL = 'https://eeovvcrffeaksbnobcbx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlb3Z2Y3JmZmVha3Nibm9iY2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTg2ODEsImV4cCI6MjA5NTI3NDY4MX0.gqybzc3rvS6Hv2g2rS4aDKz7tVrw1PQRFjxBmQbIyBo';
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase, RAZORPAY_KEY_ID };
