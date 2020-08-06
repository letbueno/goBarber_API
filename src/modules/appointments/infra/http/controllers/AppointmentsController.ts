import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/createAppointmentServices';

export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { provider_id, date } = request.body;
        const { user_id } = request.params;

        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({
            date,
            user_id,
            provider_id,
        });
        return response.json(appointment);
    }
}
