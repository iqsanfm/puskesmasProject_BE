import express from "express";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use('/api', userRoutes)

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