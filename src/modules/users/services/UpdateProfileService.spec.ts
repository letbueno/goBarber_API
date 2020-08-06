// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfile from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfile;
describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfile(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '12345678963',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
        });
        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('johntre@example.com');
    });
    it('should not be able to updated the from non-existing user', async () => {
        expect(
            updateProfile.execute({
                user_id: 'non-existing',
                name: 'Test',
                email: 'test@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '12345678963',
        });

        const user = await fakeUsersRepository.create({
            name: 'Teste',
            email: 'teste@gmail.com',
            password: '12345678963',
        });

        expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'johndoe@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123123',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            old_password: '123123',
            password: '123123',
        });
        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123123',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@example.com',

                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123123',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@example.com',
                old_password: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
