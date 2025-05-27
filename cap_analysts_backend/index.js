import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import fundingRoutes from "./routes/funding.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import companyRoutes from "./routes/company.js";
import investorRoutes from "./routes/investor.js";
import peopleRoutes from "./routes/people.js";
import userRoutes from "./routes/user.js";
import authRouter from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import imageRoutes from './routes/imageRoutes.js';
import sdgFocusRoutes from './routes/sdgFocusRoutes.js';
import ticketSize from './routes/ticketSize.js';
import investmentAsk from './routes/investmentAsk.js'; // Importing the investment ask routes
import sector from './routes/sector.js';
import chartRoutes from "./routes/chartRoutes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
 

/* CONFIGURATION */
dotenv.config();
const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'https://cap-analytics-admin-1.onrender.com',
  'https://cap-analytics-admin.vercel.app',
];
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you're sending cookies/auth
}));

 


/* ROUTES */
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/general", generalRoutes);
app.use("/api/v1/management", managementRoutes);
app.use("/api/v1/sales", salesRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/investors", investorRoutes);
app.use("/api/v1/fundings", fundingRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/employees", peopleRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/sdgFocus", sdgFocusRoutes);
app.use("/api/v1/sectors", sector);
app.use("/api/v1/ticketSize", ticketSize);
app.use("/api/v1/investmentAsk", investmentAsk);



// Use image routes
app.use('/api/v1/images', imageRoutes);
app.use("/api/v1/charts", chartRoutes);
app.use("/api/v1/categories", categoryRoutes);



/* ERROR HANDLING */
app.use(errorMiddleware);



 


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running at Port: ${PORT}`));

    // Only add data one time
    // User.insertMany(dataUser);
  })
  .catch((error) => console.log(`${error} did not connect`));

 