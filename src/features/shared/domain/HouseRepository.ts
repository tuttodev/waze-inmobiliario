import type { House } from './House';

export interface HouseRepository {
    save: (house: House) => Promise<void>;

    getAll: () => Promise<House[]>;

    get: (id: string) => Promise<House | null>;

    unpublish: (id: string, reason: string) => Promise<void>;

    markInterest: (id: string) => Promise<void>;
}
