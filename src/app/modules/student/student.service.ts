import { StudentModel } from './student.model';

const getAllStudents = async () => {
  const result = await StudentModel.find();
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id: id });
  if (!result) {
    throw new Error('Student not Found With this ID');
  }
  return result;
};
const deleteStudent = async (id: string) => {
  const student = await StudentModel.findOne({ id: id });
  if (!student) {
    throw new Error('Student not Found With this ID');
  }
  const result = await StudentModel.updateOne({ id: id }, { isDeleted: true });
  return result;
};

export const StundentServices = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
