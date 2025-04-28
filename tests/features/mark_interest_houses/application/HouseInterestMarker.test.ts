import {HouseInterestMarker} from "@/features/mark_interest_houses/application/HouseInterestMarker";
import {House} from "@shared/domain/House";
import {User} from "@shared/domain/User";

describe('HouseInterestMarker', () => {
    describe('Should mark a house as interested', () => {
        it('should mark more thant two times', async () => {
            const housesRepository = {
                get: jest.fn().mockResolvedValue(House.create({
                    lat: 1,
                    lng: 1,
                    photoUrl: 'photoUrl',
                    description: 'description',
                    phone: '123456789',
                    publishedBy: '123'
                })),
                markInterest: jest.fn()
            } as any
            const userGetter = {
                run: jest.fn().mockResolvedValue(User.create({
                    isSubscriptionActive: true,
                    interestCount: 3,
                    name: "Shira",
                })),
            } as any
            const userRepository = {
                increaseInterestCount: jest.fn(),
            } as any

            const useCase = new HouseInterestMarker(housesRepository, userRepository, userGetter)
            await useCase.run({
                houseId: '123',
                userId: '123',
            })

            expect(housesRepository.get).toHaveBeenCalled()
            expect(userRepository.increaseInterestCount).toHaveBeenCalled()
        })
    })

    it('Throw error because it should mark less than two times', async () => {
        const housesRepository = {
            get: jest.fn().mockResolvedValue(House.create({
                lat: 1,
                lng: 1,
                photoUrl: 'photoUrl',
                description: 'description',
                phone: '123456789',
                publishedBy: '123'
            })),
            markInterest: jest.fn()
        } as any
        const userGetter = {
            run: jest.fn().mockResolvedValue(User.create({
                isSubscriptionActive: false,
                interestCount: 2,
                name: "Shira",
            })),
        } as any
        const userRepository = {
            increaseInterestCount: jest.fn(),
        } as any

        const useCase = new HouseInterestMarker(housesRepository, userRepository, userGetter)
        await expect(async () => {
            await useCase.run({
                houseId: '123',
                userId: '123',
            })
        }).rejects.toThrow('User with ID 123 has already marked 2 houses as interested');
    })

    it('Throw error because house not found', async () => {
        const housesRepository = {
            get: jest.fn().mockResolvedValue(null),
            markInterest: jest.fn()
        } as any
        const userGetter = {
            run: jest.fn().mockResolvedValue(User.create({
                isSubscriptionActive: true,
                interestCount: 1,
                name: "Shira",
            })),
        } as any
        const userRepository = {
            increaseInterestCount: jest.fn(),
        } as any

        const useCase = new HouseInterestMarker(housesRepository, userRepository, userGetter)
        await expect(async () => {
            await useCase.run({
                houseId: '123',
                userId: '123',
            })
        }).rejects.toThrow('House with ID 123 not found');
    })
})
