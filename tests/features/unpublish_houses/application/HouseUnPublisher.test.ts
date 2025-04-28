import {HouseUnPublisher} from "@/features/unpublish_houses/application/HouseUnPublisher";
import {House} from "@shared/domain/House";

describe("HouseUnPublisher", () => {
    it("should unpublish a house", async () => {
        const housesRepository = {
            get: jest.fn().mockResolvedValue(House.create({
                lat: 1,
                lng: 1,
                photoUrl: 'photoUrl',
                description: 'description',
                phone: '123456789',
                publishedBy: '123'
            })),
            unpublish: jest.fn().mockResolvedValue(undefined)
        } as any

        const useCase = new HouseUnPublisher(housesRepository)

        await useCase.run({
            houseId: '123',
            reason: 'not needed anymore',
            userId: '1234'
        })

        expect(housesRepository.unpublish).toHaveBeenCalled()
    })

    it('should throw an error if the house is not found', async () => {
        const housesRepository = {
            get: jest.fn().mockResolvedValue(null),
            unpublish: jest.fn()
        } as any

        const useCase = new HouseUnPublisher(housesRepository)

        await expect(useCase.run({
            houseId: '123',
            reason: 'not needed anymore',
            userId: '1234'
        })).rejects.toThrow('House with ID 123 not found')
    })

    it('should throw an error if the user is not authorized to unpublish the house', async () => {
        const housesRepository = {
            get: jest.fn().mockResolvedValue(House.create({
                lat: 1,
                lng: 1,
                photoUrl: 'photoUrl',
                description: 'description',
                phone: '123456789',
                publishedBy: '1234'
            })),
            unpublish: jest.fn()
        } as any

        const useCase = new HouseUnPublisher(housesRepository)

        await expect(useCase.run({
            houseId: '123',
            reason: 'not needed anymore',
            userId: '1234'
        })).rejects.toThrow('User 1234 is not authorized to unpublish this house')
    })
})
