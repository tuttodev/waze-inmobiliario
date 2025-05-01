import {HousePublisher} from "@/features/publish_houses/application/HousePublisher";

describe('HousePublisher', () => {
    it('Should publish a house', async () => {
        const housesRepository = {
            save: jest.fn()
        } as any

        const housePhotoRepository = {
            upload: jest.fn().mockResolvedValue({ path: 'photoUrl' })
        }

        const funnyPhrasePublishHouseGenerator = {
            generate: jest.fn().mockResolvedValue('Funny phrase')
        }

        const useCase = new HousePublisher(housesRepository, housePhotoRepository, funnyPhrasePublishHouseGenerator)

        const result = await useCase.run({
            lat: 1,
            lng: 1,
            file: {} as any,
            description: 'description',
            phone: '123456789',
            publishedBy: '123'
        })

        expect(result).toBe('Funny phrase')
        expect(housesRepository.save).toHaveBeenCalled()
        expect(housePhotoRepository.upload).toHaveBeenCalled()
    })

    it('Should throw error if lat or lng or description or phone is missing', async () => {
        const housesRepository = {
            save: jest.fn()
        } as any

        const housePhotoRepository = {
            upload: jest.fn().mockResolvedValue({ path: 'photoUrl' })
        }

        const funnyPhrasePublishHouseGenerator = {
            generate: jest.fn().mockResolvedValue('Funny phrase')
        }

        const useCase = new HousePublisher(housesRepository, housePhotoRepository, funnyPhrasePublishHouseGenerator)

        await expect(async () => {
            await useCase.run({
                lat: undefined as any,
                lng: 1,
                file: {} as any,
                description: '',
                phone: '123456789',
                publishedBy: '123'
            })
        }).rejects.toThrow('All fields are required')
    })
})
