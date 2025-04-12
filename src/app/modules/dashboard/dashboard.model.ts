// academicFaculty.model.ts
import { model, Schema } from 'mongoose';
import { TDashboard } from './dashboard.interface';

// Remove the explicit reference to `Document` in the model typing
const dashboardSchema = new Schema<TDashboard>(
  {
    academicFaculty: { type: String, required: true },
    academicSemester: { type: String, required: true },
    academicDepartment: { type: String, required: true },
    adminCount: { type: String, required: true },
    facultyCount: { type: String, required: true },
    studentCount: { type: String, required: true },
    totalCourse: { type: String, required: true },
    totalOfferedCourse: { type: String, required: true },
  }
);

export const DashboardModel = model<TDashboard>(
  'Dashboard',
  dashboardSchema,
);
