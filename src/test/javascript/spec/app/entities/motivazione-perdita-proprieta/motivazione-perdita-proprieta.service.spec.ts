/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MotivazionePerditaProprietaService } from 'app/entities/motivazione-perdita-proprieta/motivazione-perdita-proprieta.service';
import { MotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';
import { SERVER_API_URL } from 'app/app.constants';

describe('Service Tests', () => {
    describe('MotivazionePerditaProprieta Service', () => {
        let injector: TestBed;
        let service: MotivazionePerditaProprietaService;
        let httpMock: HttpTestingController;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(MotivazionePerditaProprietaService);
            httpMock = injector.get(HttpTestingController);
        });

        describe('Service methods', () => {
            it('should call correct URL', () => {
                service.find(123).subscribe(() => {});

                const req = httpMock.expectOne({ method: 'GET' });

                const resourceUrl = SERVER_API_URL + 'api/motivazione-perdita-proprietas';
                expect(req.request.url).toEqual(resourceUrl + '/' + 123);
            });

            it('should create a MotivazionePerditaProprieta', () => {
                service.create(new MotivazionePerditaProprieta(null)).subscribe(received => {
                    expect(received.body.id).toEqual(null);
                });

                const req = httpMock.expectOne({ method: 'POST' });
                req.flush({ id: null });
            });

            it('should update a MotivazionePerditaProprieta', () => {
                service.update(new MotivazionePerditaProprieta(123)).subscribe(received => {
                    expect(received.body.id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush({ id: 123 });
            });

            it('should return a MotivazionePerditaProprieta', () => {
                service.find(123).subscribe(received => {
                    expect(received.body.id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush({ id: 123 });
            });

            it('should return a list of MotivazionePerditaProprieta', () => {
                service.query(null).subscribe(received => {
                    expect(received.body[0].id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush([new MotivazionePerditaProprieta(123)]);
            });

            it('should delete a MotivazionePerditaProprieta', () => {
                service.delete(123).subscribe(received => {
                    expect(received.url).toContain('/' + 123);
                });

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush(null);
            });

            it('should propagate not found response', () => {
                service.find(123).subscribe(null, (_error: any) => {
                    expect(_error.status).toEqual(404);
                });

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush('Invalid request parameters', {
                    status: 404,
                    statusText: 'Bad Request'
                });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
