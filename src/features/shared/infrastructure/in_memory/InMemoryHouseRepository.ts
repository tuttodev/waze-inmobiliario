import type { HouseRepository } from '../../domain/HouseRepository';
import { House } from '../../domain/House';
import houses from './houses.json';

export class InMemoryHouseRepository implements HouseRepository {
    async save(house: House): Promise<void> {
        houses.push(house.toPrimitive());
    }

    async getAll(): Promise<House[]> {
        return houses.map(house => House.create(house));
    }

    async get(id: string): Promise<House | null> {
        const house = houses.find((house) => house.id === id)

        return house ? House.create(house) : null;
    }

    async unpublish(id: string, reason: string): Promise<void> {
        const index = houses.findIndex(h => h.id === id);
        if (index !== -1) {
            houses[index].published = false;
        }
    }

    async markInterest(id: string): Promise<void> {
        const index = houses.findIndex(h => h.id === id);
        if (index !== -1) {
            houses[index].interestedPeopleCount += 1;
        }
    }
}

