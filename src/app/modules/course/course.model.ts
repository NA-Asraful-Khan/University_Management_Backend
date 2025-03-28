/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Query, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Title is required'],
    },
    prefix: {
      type: String,
      trim: true,
      required: [true, 'Prefix is required'],
    },
    code: {
      type: String,
      trim: true,
      required: [true, 'Number is required'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 3,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    preRequisiteCourses: [preRequisiteCourseSchema],
  },
  {
    timestamps: true,
  },
);

courseSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const CourseModel = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});

export const CourseFacultyModel = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
