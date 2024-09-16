import { StudentInterface } from './student.interface';
import { StudentModel } from './student.model';

const createStudent = async (studentData: StudentInterface) => {
  if (await StudentModel.isUserExist(studentData.id)) {
    throw new Error('User with this ID already exist');
  }

  const result = await StudentModel.create(studentData);

  // instance Method
  // const student = new StudentModel(studentData);

  // if (await student.isUserExist(studentData.id)) {
  //   throw new Error('User with this ID already exist');
  // }

  // const result = await student.save();
  return result;
};

const getAllStudents = async () => {
  const result = await StudentModel.find();
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id: id });
  return result;
};

export const StundentServices = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
