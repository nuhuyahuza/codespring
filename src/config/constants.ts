export const IMAGES = {
  COURSE: {
    DEFAULT: '/images/placeholders/course-default.jpg',
    THUMBNAIL: '/images/placeholders/course-thumbnail.jpg'
  }
} as const;

export const DEFAULT_COURSE_IMAGE = IMAGES.COURSE.DEFAULT;

// Course levels
export const COURSE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

// Course content types
export const CONTENT_TYPES = {
  VIDEO: 'video',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
} as const; 