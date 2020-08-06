import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

@injectable()
class ListProviderAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequest): Promise<Appointment[]> {
        const cachekey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>(
            cachekey,
        );

        if (!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider(
                {
                    provider_id,
                    year,
                    month,
                    day,
                },
            );

            await this.cacheProvider.save(cachekey, classToClass(appointments));
        }

        return appointments;
    }
}

export default ListProviderAppointmentService;
