// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

console.log("Starting CRUD API Function!");

// Define the expected request body shape
interface RequestBody {
  table: string;
  data?: Record<string, any>;
  id?: string | number;
}

Deno.serve(async (req) => {
  try {
    // Extract method and request body
    const method = req.method;
    const { table, data, id } = (await req.json()) as RequestBody;

    let result, error;

    // Handle CRUD operations based on HTTP method
    if (method === "POST") {
      ({ data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select());
    } else if (method === "GET") {
      ({ data: result, error } = await supabase
        .from(table)
        .select());
    } else if (method === "PUT") {
      if (!id) throw new Error("ID is required for PUT operation");
      ({ data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq("id", id)
        .select());
    } else if (method === "DELETE") {
      if (!id) throw new Error("ID is required for DELETE operation");
      ({ data: result, error } = await supabase
        .from(table)
        .delete()
        .eq("id", id));
    } else {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return response
    return new Response(
      JSON.stringify({ result, error }),
      {
        status: error ? 400 : 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    // Handle unexpected errors
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/crud-api' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

  3. Deploy the function:
  supabase functions deploy crud-api
  
*/
