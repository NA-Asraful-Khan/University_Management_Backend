import { TAcademicDepertment } from './academicDepertment.interface';
import { AcademicDepertmentModel } from './academicDepertment.model';

const createAcademicDepertment = async (payload: TAcademicDepertment) => {
  const result = await AcademicDepertmentModel.create(payload);

  return result;
};

const getAllAcademicDepertment = async () => {
  const result =
    await AcademicDepertmentModel.find().populate('academicFaculty');
  return result;
};

const getSingleAcademicDepertment = async (id: string) => {
  const result =
    await AcademicDepertmentModel.findById(id).populate('academicFaculty');
  return result;
};

const updateAcademicDepertment = async (
  id: string,
  payload: TAcademicDepertment,
) => {
  const result = await AcademicDepertmentModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );

  return result;
};

export const AcademicDepertmentServices = {
  createAcademicDepertment,
  getAllAcademicDepertment,
  getSingleAcademicDepertment,
  updateAcademicDepertment,
};
