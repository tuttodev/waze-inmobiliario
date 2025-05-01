import {PostgreSqlContainer, StartedPostgreSqlContainer} from "@testcontainers/postgresql";
import {PostgresDrizzleHouseRepository} from "@shared/infrastructure/PostgresDrizzleHouseRepository";
import {drizzle, NodePgDatabase} from "drizzle-orm/node-postgres";
import {houses, interests, users} from "@drizzleConfig/schema";
import {House} from "@shared/domain/House";
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import {User} from "@shared/domain/User";
import {eq} from "drizzle-orm";

describe('PostgresDrizzleHouseRepository', () => {
    let repository: PostgresDrizzleHouseRepository
    let container: StartedPostgreSqlContainer
    let client: NodePgDatabase
    let user: User
    let houseCreated: House

    beforeAll(async () => {
        container = await new PostgreSqlContainer()
            .withDatabase("waze_inmobiliario")
            .start();

        client = drizzle(container.getConnectionUri())
        await migrate(client, { migrationsFolder: 'src/features/shared/infrastructure/drizzle-config/out' })

        repository = new PostgresDrizzleHouseRepository(client);
    })

    beforeAll(async () => {
        user = User.create({
            name: 'tuttodev',
            isSubscriptionActive: true
        });
        houseCreated = House.create({
            lat: 1,
            lng: 1,
            photoUrl: 'http://example.com/photo.jpg',
            description: 'Test House',
            phone: '1234567890',
            publishedBy: user.id
        })

        await client.insert(users).values({
            id: user.id,
            name: user.name,
            isSubscriptionActive: user.isSubscriptionActive,
            interestCount: user.interestCount
        })
        await client.insert(houses).values({
            id: houseCreated.id,
            lat: houseCreated.lat,
            lng: houseCreated.lng,
            photoUrl: houseCreated.photoUrl,
            description: houseCreated.description,
            phone: houseCreated.phone,
            publishedBy: houseCreated.publishedBy,
            published: houseCreated.published,
        })
    })

    afterAll(async () => {
        await container.stop();
    })

    it('should get a house by ID', async () => {
        const house = await repository.get(houseCreated.id)
        expect(house).toBeDefined()
        expect(house?.id).toEqual(houseCreated.id)
    })

    it('should get all houses', async () => {
        const houses = await repository.getAll()
        expect(houses).toBeInstanceOf(Array)
        expect(houses.length).toBeGreaterThan(0)
    })

    it('should mark interest in a house', async () => {
        await repository.markInterest(houseCreated.id)

        const houseCount = await client.$count(interests, eq(interests.houseId, houseCreated.id))

        expect(houseCount).toBe(1)
    })

    it('should save a house', async () => {
        const house = House.create({
            lat: 2,
            lng: 2,
            photoUrl: 'http://example.com/photo.jpg',
            description: 'Test House',
            phone: '1234567890',
            publishedBy: user.id,
        })
        await repository.save(house)
    })

    it('should unpublish a house', async () => {
        await repository.unpublish(houseCreated.id, 'No longer available')

        const houseFind = await client.select().from(houses).where(
            eq(houses.id, houseCreated.id)
        )

        const house = houseFind[0]
        expect(house.published).toBeFalsy()
    })
})
