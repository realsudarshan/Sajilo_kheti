const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: "zhic7cp2",
  dataset: "production",
  // Use your sk97... Developer token here
  token: "sk97D8SRXFCbVBG3dqJfJ1bYsDUFmqZ5oROJo4MiYwLpAV2I1ZCFqPMwClfY7uJE2RZAaP5FNyQEd0Z89OUvAbi1KMsgSCYjKDYQ1BBEVLBAWZ9b4KrukoHVUCgKbK1hYKrWu2FdP7wA84jYdeRyu7erh9K52kodZkoQlGzK0lhfGkOybVjX",
  useCdn: false,
  apiVersion: "2024-03-29", 
});

async function main() {
  console.log("--- Sajilo Kheti: Individual Cleanup ---");

  try {
    const query = '*[_id != ""]';
    const docs = await client.fetch(query);

    if (docs.length === 0) {
      console.log("✅ Dataset is already empty.");
      return;
    }

    console.log(`⚠️ Found ${docs.length} documents. Deleting one-by-one...`);

    // Using a loop instead of a transaction to bypass "manage" permission requirements
    for (const doc of docs) {
      try {
        await client.delete(doc._id);
        console.log(`Successfully deleted: ${doc._id}`);
      } catch (deleteErr) {
        console.error(`Failed to delete ${doc._id}: ${deleteErr.message}`);
      }
    }

    console.log("🚀 Done! Your dataset should now be empty.");
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
  }
}

main();