/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MotivazioneperditaProprietaService } from 'app/entities/motivazioneperdita-proprieta/motivazioneperdita-proprieta.service';
import { MotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';
import { SERVER_API_URL } from 'app/app.constants';

describe('Service Tests', () => {
    describe('MotivazioneperditaProprieta Service', () => {
        let injector: TestBed;
        let service: MotivazioneperditaProprietaService;
        let httpMock: HttpTestingController;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(MotivazioneperditaProprietaService);
            httpMock = injector.get(HttpTestingController);
        });

        describe('Service methods', () => {
            it('should call correct URL', () => {
                service.find(123).subscribe(() => {});

                const req = httpMock.expectOne({ method: 'GET' });

                const resourceUrl = SERVER_API_URL + 'api/motivazioneperdita-proprietas';
                expect(req.request.url).toEqual(resourceUrl + '/' + 123);
            });

            it('should create a MotivazioneperditaProprieta', () => {
                service.create(new MotivazioneperditaProprieta(null)).subscribe(received => {
                    expect(received.body.id).toEqual(null);
                });

                const req = httpMock.expectOne({ method: 'POST' });
                req.flush({ id: null });
            });

            it('should update a MotivazioneperditaProprieta', () => {
                service.update(new MotivazioneperditaProprieta(123)).subscribe(received => {
                    expect(received.body.id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush({ id: 123 });
            });

            it('should return a MotivazioneperditaProprieta', () => {
                service.find(123).subscribe(received => {
                    expect(received.body.id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush({ id: 123 });
            });

            it('should return a list of MotivazioneperditaProprieta', () => {
                service.query(null).subscribe(received => {
                    expect(received.body[0].id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush([new MotivazioneperditaProprieta(123)]);
            });

            it('should delete a MotivazioneperditaProprieta', () => {
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
