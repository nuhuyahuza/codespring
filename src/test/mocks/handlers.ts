import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('/api/auth/signup', async ({ }) => {
    return HttpResponse.json(
      {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'STUDENT',
        },
        token: 'fake-jwt-token',
      },
      { status: 201 }
    );
  }),

  http.post('/api/auth/login', async ({  }) => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
      },
      token: 'fake-jwt-token',
    });
  }),

  // Course handlers
  http.get('/api/courses', () => {
    return HttpResponse.json({
      courses: [
        {
          id: '1',
          title: 'Test Course',
          description: 'Test Description',
          price: 99.99,
          instructor: {
            id: '1',
            name: 'Test Instructor',
          },
        },
      ],
    });
  }),

  http.get('/api/courses/:id', ({ params:{number,string} }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      title: 'Test Course',
      description: 'Test Description',
      price: 99.99,
      instructor: {
        id: '1',
        name: 'Test Instructor',
      },
      lessons: [
        {
          id: '1',
          title: 'Test Lesson',
          content: 'Test Content',
          order: 1,
        },
      ],
    });
  }),

  // Enrollment handlers
  http.post('/api/enrollments', () => {
    return HttpResponse.json(
      {
        id: '1',
        courseId: '1',
        userId: '1',
        status: 'ACTIVE',
      },
      { status: 201 }
    );
  }),

  // Group handlers
  http.get('/api/groups/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: 'Test Group',
      members: [
        {
          id: '1',
          name: 'Test User',
          role: 'MEMBER',
        },
      ],
    });
  }),

  // Live Session handlers
  http.get('/api/sessions', () => {
    return HttpResponse.json({
      sessions: [
        {
          id: '1',
          title: 'Introduction to React',
          startTime: new Date().toISOString(),
          duration: 60,
          courseId: '1',
          instructor: {
            id: '1',
            name: 'Test Instructor',
          },
        },
      ],
    });
  }),

  http.post('/api/sessions', async ({ request }) => {
    return HttpResponse.json(
      {
        id: '1',
        title: 'New Session',
        startTime: new Date().toISOString(),
        duration: 60,
        courseId: '1',
      },
      { status: 201 }
    );
  }),

  http.get('/api/sessions/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      title: 'Test Session',
      startTime: new Date().toISOString(),
      duration: 60,
      courseId: '1',
      instructor: {
        id: '1',
        name: 'Test Instructor',
      },
      attendees: [
        {
          id: '1',
          name: 'Test Student',
        },
      ],
    });
  }),
]; 