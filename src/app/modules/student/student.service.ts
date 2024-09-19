import { StudentModel } from './student.model';

const getAllStudents = async () => {
  const result = await StudentModel.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepertment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id: id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepertment',
      populate: { path: 'academicFaculty' },
    });

  return result;
};
const deleteStudent = async (id: string) => {
  const result = await StudentModel.updateOne({ id: id }, { isDeleted: true });
  return result;
};

export const StundentServices = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
