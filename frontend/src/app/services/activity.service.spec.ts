import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivityService, Activity, Note } from './activity.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/leads';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivityService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ActivityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no unmatched requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch activities for a lead', () => {
    // Arrange: Mock data
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'STATUS_CHANGED',
        details: 'Status changed from NEW to CONTACTED',
        leadId: 'lead-1',
        userId: 'user-1',
        createdAt: '2024-01-01T00:00:00Z',
        user: { id: 'user-1', name: 'Test User', email: 'test@test.com', role: 'ADMIN' }
      }
    ];

    // Act: Call the service
    service.getActivities('lead-1').subscribe(activities => {
      // Assert: Check the result
      expect(activities).toEqual(mockActivities);
    });

    // Assert: Check the HTTP request
    const req = httpMock.expectOne(req => req.url.includes('/lead-1/activities'));
    expect(req.request.method).toBe('GET');
    
    // Respond with mock data
    req.flush(mockActivities);
  });

  it('should fetch notes for a lead', () => {
    const mockNotes: Note[] = [
      {
        id: '1',
        content: 'Test note',
        leadId: 'lead-1',
        userId: 'user-1',
        createdAt: '2024-01-01T00:00:00Z',
        user: { id: 'user-1', name: 'Test User', email: 'test@test.com' }
      }
    ];

    service.getNotes('lead-1').subscribe(notes => {
      expect(notes).toEqual(mockNotes);
    });

    const req = httpMock.expectOne(req => req.url.includes('/lead-1/notes'));
    expect(req.request.method).toBe('GET');
    
    req.flush(mockNotes);
  });

  it('should add a note', () => {
    const mockNote: Note = {
      id: '1',
      content: 'New note',
      leadId: 'lead-1',
      userId: 'user-1',
      createdAt: '2024-01-01T00:00:00Z',
      user: { id: 'user-1', name: 'Test User', email: 'test@test.com' }
    };

    service.addNote('lead-1', 'New note').subscribe(note => {
      expect(note).toEqual(mockNote);
    });

    const req = httpMock.expectOne(req => req.url.includes("/lead-1/notes"));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'New note' });
    
    req.flush(mockNote);
  });
});
