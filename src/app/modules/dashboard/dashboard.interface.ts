import { Document } from 'mongoose';

export interface TDashboard extends Document {
  academicFaculty: string;
  academicSemester: string;
  academicDepartment: string;
  adminCount: string;
  facultyCount: string;
  studentCount: string;
  totalCourse: string;
  totalOfferedCourse: string;
  myOfferedCourses: string;
  totalCompletedCredit: string;
  myEnrolledCourses: string;
  
}
