import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentService;
let fakeCacheProvider: FakeCacheProvider;
describe('ListProviderAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointments = new ListProviderAppointmentService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });
    it('should be able to list the appointments on a specific day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user_provider',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user_provider',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        const appointments = await listProviderAppointments.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
