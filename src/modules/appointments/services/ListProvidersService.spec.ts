import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let listProviders: ListProvidersService;
describe('listProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviders = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });
    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '12345678963',
        });
        const user2 = await fakeUsersRepository.create({
            name: 'John Tre',
            email: 'johntre@gmail.com',
            password: '12345678963',
        });
        const logged = await fakeUsersRepository.create({
            name: 'John For',
            email: 'johnfor@gmail.com',
            password: '12345678963',
        });

        const providers = await listProviders.execute({
            user_id: logged.id,
        });
        expect(providers).toEqual([user1, user2]);
    });
});
