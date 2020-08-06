import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '12345678963',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '123123',
            token: userToken.token,
        });

        const updateUser = await fakeUsersRepository.findById(user.id);
        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updateUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const userToken = await fakeUserTokensRepository.generate(
            'non-existing-user',
        );
        expect(
            resetPasswordService.execute({
                token: userToken.token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '12345678963',
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: '123123',
                token: userToken.token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
