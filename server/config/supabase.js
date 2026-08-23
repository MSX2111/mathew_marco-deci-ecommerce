import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
console.log("URL:", process.env.SUPABASE_URL);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

export default supabase;
