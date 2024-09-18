import config from '../../config';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { StudentInterface } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserInterface } from './user.interface';

import { UserModel } from './user.model';
import { generateStudentId } from './user.utils';

const createStudent = async (
  password: string,
  studentData: StudentInterface,
) => {
  //Create a User Object
  const userData: Partial<UserInterface> = {};
  //Use Default Password
  userData.password = password || (config.default_password as string);

  // set Student role
  userData.role = 'student';

  //Auto Generate Id

  const admissionSemester = await AcademicSemesterModel.findById(
    studentData.admissionSemester,
  );

  userData.id = await generateStudentId(admissionSemester!);
  //Create a User
  const newUser = await UserModel.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudent,
};
