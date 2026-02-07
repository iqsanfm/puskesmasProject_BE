// Test login user faisal dan get health data
// Jalankan dengan: node test-faisal.js

const testFaisal = async () => {
  try {
    // 1. Login dulu
    console.log("🔐 Step 1: Login user faisal@gmail.com...\n");

    const loginResponse = await fetch("http://localhost:9090/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "faisal@gmail.com",
        password: "admin123", // Ganti dengan password yang benar
      }),
    });

    const loginData = await loginResponse.json();
    console.log("Login Status:", loginResponse.status);
    console.log("Login Response:", JSON.stringify(loginData, null, 2));

    if (!loginData.success) {
      console.log(
        "\n❌ Login gagal! Update password dulu dengan script update-password.js",
      );
      return;
    }

    const token = loginData.data.token;
    console.log("\n✅ Login berhasil!");
    console.log("Token:", token.substring(0, 50) + "...");
    console.log("User:", loginData.data.user);

    // 2. Test get health data
    console.log("\n\n🏥 Step 2: Get health data...\n");

    const healthDataResponse = await fetch(
      "http://localhost:9090/api/health-data",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const healthData = await healthDataResponse.json();
    console.log("Health Data Status:", healthDataResponse.status);
    console.log("Health Data Response:", JSON.stringify(healthData, null, 2));

    if (healthData.success) {
      console.log("\n✅ Berhasil get health data!");
      console.log(`📊 Total data: ${healthData.data.length}`);
    } else {
      console.log("\n❌ Gagal get health data!");
      console.log("Error:", healthData.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

testFaisal();
