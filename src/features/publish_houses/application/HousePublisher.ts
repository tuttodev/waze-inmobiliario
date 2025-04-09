import type { HouseRepository } from '@/features/shared/domain/HouseRepository';
import { House } from '@/features/shared/domain/House';
import type {HousePhotoRepository} from "@/features/shared/domain/HousePhotoRepository";
import type {File} from '@/features/shared/domain/File'

interface Input {
    lat: number;
    lng: number;
    file: File;
    description: string;
    phone: string;
    publishedBy: string;
}

export class HousePublisher {
    constructor(
        private readonly houseRepository: HouseRepository,
        private readonly housePhotoRepository: HousePhotoRepository
    ) {}

    async run(input: Input): Promise<void> {
        if (!input.lat|| !input.lng || !input.description || !input.phone) {
            throw new Error('All fields are required');
        }

        const { path: photoPath } = await this.housePhotoRepository.upload(input.file);

        const house = House.create({
            ...input,
            photoUrl: photoPath
        });
        await this.houseRepository.save(house);
    }
}
