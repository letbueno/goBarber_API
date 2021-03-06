import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListDayAvailabilityService from './ListDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listDayAvailability: ListDayAvailabilityService;
describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listDayAvailability = new ListDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });
    it('should be able to list the day availability from providers', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user_provider',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user_provider',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime();
        });
        const availability = await listDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 10, available: false },
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 11, available: false },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
                { hour: 13, available: true },
            ]),
        );
    });
});
