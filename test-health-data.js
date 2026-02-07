// Script untuk testing API health-data dengan token
// Jalankan dengan: node test-health-data.js

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODdkNjUyMDUtMGJkMS00NjI4LWI2MTMtNzZiNjJlZWUzYmIwIiwiZW1haWwiOiJpcXNhbmZtQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3MDQ3NTg0OSwiZXhwIjoxNzcxMDgwNjQ5fQ.ejDp4whCj7b3Ha-DUDecOUm5YWT4KOabgj1bFyvNGe4";

const testHealthData = async () => {
  try {
    console.log("🏥 Testing Health Data API...\n");

    const response = await fetch("http://localhost:9090/api/health-data", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("\n✅ Request berhasil!");
      console.log(`📊 Total data: ${data.data.length}`);
    } else {
      console.log("\n❌ Request gagal!");
      console.log("Pesan:", data.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

testHealthData();
