import { StudentInterface } from './student.interface';
import { StudentModel } from './student.model';

const createStudent = async (student: StudentInterface) => {
  const result = await StudentModel.create(student);
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
