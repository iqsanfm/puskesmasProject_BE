// Script untuk testing API login
// Jalankan dengan: node test-login.js

const testLogin = async () => {
  try {
    console.log("🔐 Testing Login API...\n");

    const response = await fetch("http://localhost:9090/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "iqsanfm@gmail.com",
        password: "admin123", // Password yang baru saja diupdate
      }),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success && data.data.token) {
      console.log("\n✅ Login berhasil!");
      console.log("\n📋 Copy token ini untuk testing endpoint lain:");
      console.log(data.data.token);
      console.log("\n📝 Cara pakai:");
      console.log("Authorization: Bearer " + data.data.token);
    } else {
      console.log("\n❌ Login gagal!");
      console.log("Pesan:", data.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

testLogin();
