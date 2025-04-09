import type { HousePhotoRepository } from '../../domain/HousePhotoRepository';
import type {File} from '@/features/shared/domain/File'

export class InMemoryHousePhotoRepository implements HousePhotoRepository {
    private readonly storage = new Map<string, string>();

    async upload(file: File): Promise<{ path: string }> {
        const fakePath = `in-memory://photos/${file.name}`;
        this.storage.set(file.name, fakePath);

        return { path: fakePath };
    }
}
