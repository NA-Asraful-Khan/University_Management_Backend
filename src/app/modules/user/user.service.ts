import config from '../../config';
import { StudentInterface } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { UserInterface } from './user.interface';

import { UserModel } from './user.model';

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

  //Set Menuall Generated ID
  userData.id = '2030100002';
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
