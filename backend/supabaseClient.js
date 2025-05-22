// backend/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in .env file. Please check your .env configuration.");
  // You might want to throw an error or exit the process if these are critical
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;