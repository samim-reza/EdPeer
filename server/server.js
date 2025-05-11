const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
// const errorMiddleware = require("./middleware/errorMiddleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
// const API_KEY = process.env.API_KEY;

// Middleware
app.use(helmet());
app.use(cors({ origin: "*" })); // Allow all origins for development
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://localhost:3002",
//       "https://www.oj.gubcpa.com",
//       "https://www.adminoj.gubcpa.com",
//       "https://www.idpc.gubcpa.com",
//       "https://www.idmo.gubcpa.com",
//       "https://oj.gubcpa.com",
//       "https://adminoj.gubcpa.com",
//       "https://idpc.gubcpa.com",
//       "https://idmo.gubcpa.com",
//       "https://192.168.0.106:3000",
//       "http://192.168.0.106:3000",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "x-api-key",
//       "x-frontend-client",
//     ],
//     credentials: true,
//   })
// );

app.use(express.json());

// Authentication Middleware
// app.use((req, res, next) => {
//   const userAgent = req.headers["user-agent"];
//   const apiKey = req.headers["x-api-key"];

//   console.log(apiKey);

//   // Block requests from Postman
//   // if (userAgent && userAgent.includes("PostmanRuntime")) {
//   //   return res
//   //     .status(403)
//   //     .json({ message: "Forbidden: Postman access is blocked" });
//   // }

//   // List of common browser user-agents to block
//   const blockedUserAgents = ["Mozilla", "Chrome", "Safari", "Firefox", "Edge"];

//   // ✅ Allow only React frontend (RTK Query) by checking the headers
//   // if (
//   //   userAgent &&
//   //   blockedUserAgents.some((agent) => userAgent.includes(agent))
//   // ) {
//   //   if (req.headers["x-frontend-client"] === "gubcpa-react") {
//   //     return next(); // Allow React frontend
//   //   }
//   //   return res
//   //     .status(403)
//   //     .json({ message: "Forbidden: Browser access is blocked" });
//   // }

//   // ✅ Enforce API Key Authentication
//   if (!apiKey || apiKey !== process.env.API_KEY) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized: Missing or invalid API key" });
//   }

//   next();
// });

app.set("trust proxy", 1);

// Routes
app.use("/users", userRoutes);
// app.use("/contests", require("./routes/contestRoutes"));
// app.use("/admins", require("./routes/adminRoutes"));
// app.use("/problems", require("./routes/problemRoutes"));
// app.use("/practiceProblems", require("./routes/practiceProblemsRoutes"));
// app.use("/testCases", require("./routes/testCaseRoutes"));
// app.use("/editorials", require("./routes/editorialRoutes"));
// app.use("/submissions", require("./routes/submissionRoutes"));
// app.use("/practiceSubmissions", require("./routes/practiceSubmissionRoutes"));
// app.use("/clarifications", require("./routes/clarificationRoutes"));
// app.use("/contestProblems", require("./routes/contestProblemRoutes"));
// app.use("/images/", require("./routes/imageRoutes"));
// app.use("/idpc/", require("./routes/idpcRoutes"));
// app.use("/idmo/", require("./routes/idmoRoutes"));
// app.use("/logs/", require("./routes/userLogsRoutes"));

// app.get("/current-time", (req, res) => {
//   const currentTime = new Date().toISOString(); // Get the current time in ISO format
//   res.json({ currentTime });
// });

// Error handling middleware
// app.use(errorMiddleware);

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    console.log(" Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
