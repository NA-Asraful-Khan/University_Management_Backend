// academicFaculty.model.ts
import { model, Schema } from 'mongoose';
import { TDashboard } from './dashboard.interface';

// Remove the explicit reference to `Document` in the model typing
const dashboardSchema = new Schema<TDashboard>(
  {
    academicFaculty: { type: String, required: true, default: '0' },
    academicSemester: { type: String, required: true, default: '0' },
    academicDepartment: { type: String, required: true, default: '0' },
    adminCount: { type: String, required: true, default: '0' },
    facultyCount: { type: String, required: true, default: '0' },
    studentCount: { type: String, required: true, default: '0' },
    totalCourse: { type: String, required: true, default: '0' },
    totalOfferedCourse: { type: String, required: true, default: '0' },
    myOfferedCourses: { type: String, required: true, default: '0' },
    totalCompletedCredit: { type: String, required: true, default: '0' },
    myEnrolledCourses: { type: String, required: true, default: '0' },
  }
);

export const DashboardModel = model<TDashboard>(
  'Dashboard',
  dashboardSchema,
);
