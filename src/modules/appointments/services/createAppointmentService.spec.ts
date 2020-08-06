import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/fakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './createAppointmentServices';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '101010',
            provider_id: '1545215',
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1545215');
    });

    it('should be not able to create a two appointment on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        const appointmentDate = new Date(2020, 4, 10, 13);
        await createAppointment.execute({
            date: appointmentDate,
            user_id: '101010',
            provider_id: '1545215',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '101010',
                provider_id: '1545215',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: '101010',
                provider_id: '1545215',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: '101010',
                provider_id: '101010',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 7),
                user_id: '101010',
                provider_id: '232313',
            }),
        ).rejects.toBeInstanceOf(AppError);
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 18),
                user_id: '101010',
                provider_id: '232313',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
