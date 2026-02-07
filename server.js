import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import villageRoutes from "./src/routes/village.routes.js";
import practicePlaceRoutes from "./src/routes/practicePlace.routes.js";
import healthDataRoutes from "./src/routes/healthData.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", healthDataRoutes); // Pindahkan ke atas sebelum userRoutes
app.use("/api", villageRoutes);
app.use("/api", practicePlaceRoutes);
app.use("/api", userRoutes); // Pindahkan ke bawah karena punya middleware ADMIN global

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", async (req, res) => {
  try {
    // Import dynamic to avoid top-level await issues if not supported, though likely fine in node 20
    const prisma = (await import("./lib/prisma.js")).default;
    await prisma.$connect();
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
