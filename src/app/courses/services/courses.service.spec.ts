import { CoursesService } from './courses.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

fdescribe('CourseService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService,
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('Not courses retrive');
        expect(courses.length).toEqual(12, 'incorrect number of courses');
        const course = courses.find((c) => c.id === 12);
        expect(course.titles.description).toEqual('Angular Testing Course');
      });

    const controller = httpTestingController.expectOne('/api/courses');
    expect(controller.request.method).toEqual('GET');
    controller.flush({
      payload: Object.values(COURSES)
    });
  });

  it('save changes by id', () => {
    const id = 12;
    const changes: Partial<Course> = {
      titles: {
        description: 'Testing Course'
      }
    };

    coursesService.saveCourse(id, changes)
      .subscribe(course => {
        console.log(course);
        expect(course).toBeTruthy('Not course retrive');
        expect(course.id).toEqual(id, 'incorrect id of course');
        expect(course.titles.description).toEqual('Testing Course');
      });

    const controller = httpTestingController.expectOne(`/api/courses/${id}`);
    expect(controller.request.method).toEqual('PUT');
    controller.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it('should retrieve a error if the request fails', () => {
    const id = 12;
    coursesService.findCourseById(id)
      .subscribe(course => {
        fail();
      }, (error: HttpErrorResponse) => {
        expect(error.status).toEqual(500);
      });

    const controller = httpTestingController.expectOne(`/api/courses/${id}`);
    expect(controller.request.method).toEqual('GET');
    controller.flush('Save course failed', {
      status: 500,
      statusText: 'Internal Server error'
    });
  });

  it('should find a list of the lessons', () => {
    const id = 12;
    coursesService.findLessons(id)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy('lessons not retrieve');
        expect(lessons.length).toEqual(3, 'unexpect length');
      });

    const controller = httpTestingController.expectOne(req => req.url === `/api/lessons`);
    expect(controller.request.method).toEqual('GET');
    expect(controller.request.params.get('courseId')).toEqual('12');
    expect(controller.request.params.get('filter')).toEqual('');
    expect(controller.request.params.get('sortOrder')).toEqual('asc');
    expect(controller.request.params.get('pageNumber')).toEqual('0');
    expect(controller.request.params.get('pageSize')).toEqual('3');

    controller.flush({
      payload: findLessonsForCourse(id).slice(0, 3)
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
