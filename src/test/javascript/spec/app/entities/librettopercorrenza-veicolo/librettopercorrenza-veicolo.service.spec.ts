/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LibrettopercorrenzaVeicoloService } from 'app/entities/librettopercorrenza-veicolo/librettopercorrenza-veicolo.service';
import { LibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';
import { SERVER_API_URL } from 'app/app.constants';

describe('Service Tests', () => {
    describe('LibrettopercorrenzaVeicolo Service', () => {
        let injector: TestBed;
        let service: LibrettopercorrenzaVeicoloService;
        let httpMock: HttpTestingController;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(LibrettopercorrenzaVeicoloService);
            httpMock = injector.get(HttpTestingController);
        });

        describe('Service methods', () => {
            it('should call correct URL', () => {
                service.find(123).subscribe(() => {});

                const req = httpMock.expectOne({ method: 'GET' });

                const resourceUrl = SERVER_API_URL + 'api/librettopercorrenza-veicolos';
                expect(req.request.url).toEqual(resourceUrl + '/' + 123);
            });

            it('should create a LibrettopercorrenzaVeicolo', () => {
                service.create(new LibrettopercorrenzaVeicolo(null)).subscribe(received => {
                    expect(received.body.id).toEqual(null);
                });

                const req = httpMock.expectOne({ method: 'POST' });
                req.flush({ id: null });
            });

            it('should update a LibrettopercorrenzaVeicolo', () => {
                service.update(new LibrettopercorrenzaVeicolo(123)).subscribe(received => {
                    expect(received.body.id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush({ id: 123 });
            });

            it('should return a LibrettopercorrenzaVeicolo', () => {
                service.find(123).subscribe(received => {
                    expect(received.body.id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush({ id: 123 });
            });

            it('should return a list of LibrettopercorrenzaVeicolo', () => {
                service.query(null).subscribe(received => {
                    expect(received.body[0].id).toEqual(123);
                });

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush([new LibrettopercorrenzaVeicolo(123)]);
            });

            it('should delete a LibrettopercorrenzaVeicolo', () => {
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
