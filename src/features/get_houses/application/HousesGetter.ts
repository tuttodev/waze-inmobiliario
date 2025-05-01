import type { HouseRepository } from "@/features/shared/domain/HouseRepository";
import type {UserGetter} from "@/features/shared/domain/UserGetter";

interface Input {
    userId: string;
}

interface Output {
    houses: Array<{
        id: string
        phone?: string
        lat: number
        lng: number
        photoUrl: string
        description: string
        peopleInterestedCount?: number
    }>
}

export class HousesGetter {
    constructor(
        private readonly housesRepository: HouseRepository,
        private readonly userGetter: UserGetter
    ) {}

    async run(input: Input): Promise<Output> {
        const user = await this.userGetter.run(input.userId)

        const houses = await this.housesRepository.getAll();

        return {
            houses: houses.filter(
                house => house.published
            ).map(house => ({
                id: house.id,
                phone: user.isSubscriptionActive ? house.phone : undefined,
                lat: house.lat,
                lng: house.lng,
                photoUrl: house.photoUrl,
                description: house.description,
                peopleInterestedCount: user.isSubscriptionActive ? house.interestedPeopleCount : undefined,
            }))
        }
    }
}
