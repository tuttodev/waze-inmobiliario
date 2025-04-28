import {HousesGetter} from "@/features/get_houses/application/HousesGetter";
import {House} from "@shared/domain/House";


describe('Houses Getter', () => {
    describe('Correct responses', () => {
        it('Should return all properties with a user subscription active', async () => {
            const housesRepository = {
                getAll: jest.fn().mockResolvedValue([
                    House.create({
                        lat: 1,
                        lng: 1,
                        photoUrl: 'photoUrl',
                        description: 'description',
                        phone: '123456789',
                        publishedBy: '123'
                    })
                ]),
            } as any
            const userGetter = {
                run: jest.fn().mockResolvedValue({
                    isSubscriptionActive: true,
                }),
            } as any
            const useCase = new HousesGetter(
                housesRepository,
                userGetter
            )

            const response = await useCase.run({
                userId: '123',
            })

            const house = response.houses[0]


            expect(house).toHaveProperty('peopleInterestedCount')
            expect(house).toHaveProperty('phone')
        })

        it('Should return all properties with a user subscription inactive', async () => {
            const housesRepository = {
                getAll: jest.fn().mockResolvedValue([
                    House.create({
                        lat: 1,
                        lng: 1,
                        photoUrl: 'photoUrl',
                        description: 'description',
                        phone: '123456789',
                        publishedBy: '123'
                    })
                ]),
            } as any
            const userGetter = {
                run: jest.fn().mockResolvedValue({
                    isSubscriptionActive: false,
                }),
            } as any
            const useCase = new HousesGetter(
                housesRepository,
                userGetter
            )

            const response = await useCase.run({
                userId: '123',
            })

            const house = response.houses[0]

            expect(house.peopleInterestedCount).toBeUndefined()
            expect(house.phone).toBeUndefined()
        })
    })

})
