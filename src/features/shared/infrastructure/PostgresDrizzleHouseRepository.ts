import {HouseRepository} from "@/features/shared/domain/HouseRepository";
import {House} from "@/features/shared/domain/House";
import {NodePgDatabase} from 'drizzle-orm/node-postgres';
import {houses, interests} from '@drizzleConfig/schema'
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export class PostgresDrizzleHouseRepository implements HouseRepository {
    constructor(private readonly db: NodePgDatabase) {}

    async get(id: string): Promise<House | null> {
        const housesFound = await this.db.select().from(houses).where(
            eq(houses.id, id)
        )
        const interestedPeopleCount = await this.db.$count(interests, eq(interests.houseId, id))

        return housesFound[0] ? House.create({
            ...housesFound[0],
            interestedPeopleCount
        }) : null;
    }

    async getAll(): Promise<House[]> {
        const housesFound = await this.db.select({
            id: houses.id,
            lat: houses.lat,
            lng: houses.lng,
            photoUrl: houses.photoUrl,
            description: houses.description,
            phone: houses.phone,
            publishedBy: houses.publishedBy,
            published: houses.published,
            interestedPeopleCount: this.db.$count(interests, eq(interests.houseId, houses.id))
        }).from(houses)

        return housesFound.map(house => House.create(house));
    }

    async markInterest(id: string): Promise<void> {
        await this.db.insert(interests).values({
            id: uuidv4(),
            houseId: id
        })
    }

    async save(house: House): Promise<void> {
        await this.db.insert(houses).values({
            id: house.id,
            lat: house.lat,
            lng: house.lng,
            photoUrl: house.photoUrl,
            description: house.description,
            phone: house.phone,
            publishedBy: house.publishedBy,
            published: house.published,
        })
    }

    async unpublish(id: string, reason: string): Promise<void> {
        await this.db.update(houses).set({
            published: false
        }).where(eq(houses.id, id))
    }

}
