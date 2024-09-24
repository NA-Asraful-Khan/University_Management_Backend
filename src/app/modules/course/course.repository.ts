import { BaseRepository } from '../base/base.repository';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';

export class CourseRepository extends BaseRepository<TCourse> {
  constructor() {
    super(CourseModel);
  }
  async findAll(): Promise<TCourse[]> {
    const rerult = await this.model.find().populate({
      path: 'preRequisiteCourses.course',
      populate: { path: 'preRequisiteCourses.course' },
    });
    return rerult as unknown as Promise<TCourse[]>;
  }
  async update(id: string, payload: Partial<TCourse>): Promise<TCourse> {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    // Step One:
    await this.model.findByIdAndUpdate(id, courseRemainingData, {
      new: true,
      runValidators: true,
    });

    // Step Two:
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisite = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      await this.model.findByIdAndUpdate(id, {
        $pull: {
          preRequisiteCourses: { course: { $in: deletedPreRequisite } },
        },
      });

      // Step Three:
      const newPreRequisite = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      await this.model.findByIdAndUpdate(id, {
        $addToSet: { preRequisiteCourses: { $each: newPreRequisite } },
      });
    }
    const result = await this.model.findById(id).populate({
      path: 'preRequisiteCourses.course',
      populate: { path: 'preRequisiteCourses.course' },
    });
    return result as TCourse;
  }
}
