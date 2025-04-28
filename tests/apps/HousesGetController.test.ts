import request from 'supertest';
import {Server} from "@/apps/backend/server";
import express from 'express';
import {PostgreSqlContainer, StartedPostgreSqlContainer} from "@testcontainers/postgresql";
import {User} from "@shared/domain/User";
import {houses, users} from "@drizzleConfig/schema";
import {drizzle, NodePgDatabase} from "drizzle-orm/node-postgres";
import {migrate} from "drizzle-orm/node-postgres/migrator";
import {House} from "@shared/domain/House";


describe('HousesGetController', () => {
  let app: express.Express
  let container: StartedPostgreSqlContainer
  let client: NodePgDatabase
  let user: User
  let houseCreated: House

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
        .withDatabase("waze_inmobiliario")
        .start();

    const uri = container.getConnectionUri()

    process.env.DATABASE_URL = uri

    client = drizzle(uri)
    await migrate(client, { migrationsFolder: 'src/features/shared/infrastructure/drizzle-config/out' })

    const server = new Server();
    app = server.getHTTPServer()!;
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
    await container.stop()
  })

  it('should return 200 and a list of houses', async () => {
    const response = await request(app)
      .get('/v1/houses')
      .query({ userId: user.id })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
  });
});
