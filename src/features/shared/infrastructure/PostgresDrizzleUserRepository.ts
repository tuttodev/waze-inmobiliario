import {UserRepository} from "@shared/domain/UserRepository";
import {User} from "@shared/domain/User";
import {drizzle, NodePgDatabase} from "drizzle-orm/node-postgres";
import {users} from '@drizzleConfig/schema'
import { eq, sql } from 'drizzle-orm';

export class PostgresDrizzleUserRepository implements UserRepository {
    private readonly db: NodePgDatabase

    constructor() {
        this.db = drizzle(process.env.DATABASE_URL!);
    }

    async getById(id: string): Promise<User | null> {
        const usersFound = await this.db.select().from(users).where(
            eq(users.id, id)
        )

        return usersFound[0] ? User.create(usersFound[0]) : null;
    }

    async increaseInterestCount(id: string): Promise<void> {
        await this.db.update(users).set({
            interestCount: sql`${users.interestCount} + 1`,
        }).where(eq(users.id, id))
    }

}
