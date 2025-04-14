import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicDepartmentModel } from "../academicDepertment/academicDepertment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { AdminModel } from "../admin/admin.model";
import { CourseModel } from "../course/course.model";
import EnrolledCourseModel from "../enrolledCourse/enrolledCourse.model";
import { FacultyModel } from "../faculty/faculty.model";
import { OfferedCourseModel } from "../offeredCourse/offeredCourse.model";
import { StudentModel } from "../student/student.model";
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model";




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

const getStudentDashboard = async (studentId: string) => {
  const student = await StudentModel.findOne({ id: studentId });

  // Enrolled courses count
  const enrolledCourses = (await EnrolledCourseModel.find(
    { student: student?._id }
  )).length;

  // Completed courses with credit info
  const completedCourses = await EnrolledCourseModel.find(
    { student: student?._id, isCompleted: true }
  ).populate({
    path: 'course',
    model: 'Course', // Ensure the correct model is specified
    select: 'credits'
  });

  // Total credit sum
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalCredit = completedCourses.reduce((acc, course: any) => {
    return acc + (course.course?.credits || 0); // Use 'any' to handle populated course
  }, 0);

  // Offered courses count


  const currentOngoingSemester = await SemesterRegistrationModel.findOne({
        status: 'ONGOING',
      });
      if (!currentOngoingSemester) {
        throw new AppError(httpStatus.NOT_FOUND, 'No Ongoing Semester');
      }
     
  
      const aggregationQuery = [
  {
    $match: {
      semesterRegistration: currentOngoingSemester?._id,
      academicFaculty: student?.academicFaculty,
      academicDepartment: student?.academicDepartment,
    },
  },
  {
    $lookup: {
      from: 'courses',
      localField: 'course',
      foreignField: '_id',
      as: 'course',
    },
  },
  {
    $unwind: '$course',
  },
  {
    $lookup: {
      from: 'faculties',
      localField: 'faculty',
      foreignField: '_id',
      as: 'faculty',
    },
  },
  {
    $lookup: {
      from: 'enrolledcourses',
      let: {
        currentOngoingSemester: currentOngoingSemester?._id,
        currentStudent: student?._id,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$semesterRegistration', '$$currentOngoingSemester'] },
                { $eq: ['$student', '$$currentStudent'] },
                { $eq: ['$isEnrolled', true] },
              ],
            },
          },
        },
      ],
      as: 'enrolledcourses',
    },
  },
  {
    $lookup: {
      from: 'enrolledcourses',
      let: {
        currentStudent: student?._id,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$student', '$$currentStudent'] },
                { $eq: ['$isCompleted', true] },
              ],
            },
          },
        },
      ],
      as: 'completedcourses',
    },
  },
  {
    $addFields: {
      completedCourseIds: {
        $map: {
          input: '$completedcourses',
          as: 'completed',
          in: '$$completed.course',
        },
      },
    },
  },
  {
    $addFields: {
      isPreRequisitesFulFilled: {
        $or: [
          { $eq: ['$course.preRequisiteCourses', []] },
          {
            $setIsSubset: [
              '$course.preRequisiteCourses.course',
              { $ifNull: ['$completedCourseIds', []] },
            ],
          },
        ],
      },
      isAlreadyEnrolled: {
        $in: [
          '$course._id',
          {
            $map: {
              input: '$enrolledcourses',
              as: 'enroll',
              in: '$$enroll.course',
            },
          },
        ],
      },
    },
  },
  {
    $match: {
      isAlreadyEnrolled: false,
      isPreRequisitesFulFilled: true,
    },
  },
  // ✅ Ensure uniqueness by grouping by course._id
  {
    $group: {
      _id: '$course._id',
    },
  },
  {
    $count: 'totalAvailableCourses',
  },
];


       const offeredCoursesResult = await OfferedCourseModel.aggregate([...aggregationQuery]);

// Return the first object or a default if it's empty
const totalOfferedCourse = offeredCoursesResult[0].totalAvailableCourses || { totalAvailableCourses: 0 };

  const result = {
    myEnrolledCourses: enrolledCourses,
    totalOfferedCourse: totalOfferedCourse,
    totalCompletedCredit: totalCredit,  // ✅ Add this line to show the sum
  };

  return result;
};



export const DashboardServices = {
  getAdminDashboard,
  getFacultyDashboard,
  getStudentDashboard
};
