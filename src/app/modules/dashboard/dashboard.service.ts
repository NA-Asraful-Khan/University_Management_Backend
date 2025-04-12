import { AcademicDepartmentModel } from "../academicDepertment/academicDepertment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { AdminModel } from "../admin/admin.model";
import { CourseModel } from "../course/course.model";
import EnrolledCourseModel from "../enrolledCourse/enrolledCourse.model";
import { FacultyModel } from "../faculty/faculty.model";
import { OfferedCourseModel } from "../offeredCourse/offeredCourse.model";
import { StudentModel } from "../student/student.model";




const getAdminDashboard = async () => {
  const result = {
    academicFaculty: (await AcademicFacultyModel.find()).length,
    academicSemester: (await AcademicSemesterModel.find()).length,
    academicDepartment: (await AcademicDepartmentModel.find()).length,
    adminCount: (await AdminModel.find()).length,
    facultyCount: (await FacultyModel.find()).length,
    studentCount: (await StudentModel.find()).length,
    totalCourse: (await CourseModel.find()).length
  }

  return result;
};

const getFacultyDashboard = async (facultyId: string,) => {
const faculty = await FacultyModel.findOne({ id: facultyId });

  // return variable 
  const studentCount = (await EnrolledCourseModel.find(
      { faculty: faculty?._id })).length
  const totalOfferedCourse= (await OfferedCourseModel.find(
      { faculty: faculty?._id }
    )).length
  const result = {
    studentCount: studentCount,
    totalOfferedCourse: totalOfferedCourse,
  }

  return result;
};


export const DashboardServices = {
  getAdminDashboard,
  getFacultyDashboard
};
