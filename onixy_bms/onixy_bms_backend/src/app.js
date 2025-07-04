import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import performanceReviewRoutes from './routes/performanceReview.routes.js';
import leaveRequestRoutes from './routes/leaveRequest.routes.js';
import contractRoutes from './routes/contract.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import payrollRoutes from './routes/payroll.routes.js';
import complianceRoutes from './routes/complianceDocument.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import automationRoutes from './routes/automation.routes.js';
import engagementSurveyRoutes from './routes/engagementSurvey.routes.js';
import { detectLocale } from './middlewares/localeMiddleware.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // your Next.js frontend
  credentials: true,               // allow httpOnly cookies
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(detectLocale);

// Example route
app.get('/', (_req, res) => {
  res.send('Onixy BMS API is running');
});

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/warehouses', warehouseRoutes);
app.use('/api/v1/performance-reviews', performanceReviewRoutes);
app.use('/api/v1/leave-requests', leaveRequestRoutes);
app.use('/api/v1/contracts', contractRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/payrolls', payrollRoutes);
app.use('/api/v1/compliance-documents', complianceRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/automation-tasks', automationRoutes);
app.use('/api/v1/engagement-surveys', engagementSurveyRoutes);




// Export app correctly using ESM syntax
export default app;
