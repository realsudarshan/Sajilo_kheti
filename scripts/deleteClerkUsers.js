const { createClerkClient } = require('@clerk/backend');

// 1. Initialize the Clerk Client
// Replace with your actual Secret Key from the Clerk Dashboard
const clerkClient = createClerkClient({ secretKey: 'sk_test_qlnCUnzvo95Nvi8IZ49OpU2rnpymNwL3ilD0DpFZu6' });

async function main() {
  console.log("--- Initializing Clerk User Wipe ---");

  try {
    // 2. Fetch all users
    const users = await clerkClient.users.getUserList();

    if (users.data.length === 0) {
      console.log("✅ No users found in Clerk.");
      return;
    }

    console.log(`⚠️ Found ${users.totalCount} users. Deleting one-by-one...`);

    // 3. Loop and delete
    for (const user of users.data) {
      try {
        await clerkClient.users.deleteUser(user.id);
        console.log(`Successfully deleted user: ${user.id} (${user.emailAddresses[0]?.emailAddress || 'No Email'})`);
      } catch (err) {
        console.error(`❌ Failed to delete ${user.id}:`, err.message);
      }
    }

    console.log("🚀 Success! Clerk instance is now empty.");

  } catch (error) {
    console.error("❌ Critical Error:", error.message);
  }
}

main();