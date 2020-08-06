// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfile from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;

let showProfile: ShowProfile;
describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfile(fakeUsersRepository);
    });
    it('should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '12345678963',
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });
        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@gmail.com');
    });

    it('should not be able to show the from non-existing user', async () => {
        expect(
            showProfile.execute({
                user_id: 'non-existing',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
