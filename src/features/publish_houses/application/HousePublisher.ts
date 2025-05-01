import type { HouseRepository } from '@/features/shared/domain/HouseRepository';
import { House } from '@/features/shared/domain/House';
import type {HousePhotoRepository} from "@/features/shared/domain/HousePhotoRepository";
import type {File} from '@/features/shared/domain/File'
import {FunnyPhrasePublishHouseGenerator} from "@/features/publish_houses/domain/FunnyPhrasePublishHouseGenerator";

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
        private readonly housePhotoRepository: HousePhotoRepository,
        private readonly funnyPhrasePublishHouseGenerator: FunnyPhrasePublishHouseGenerator) {}

    async run(input: Input): Promise<string> {
        if (!input.lat|| !input.lng || !input.description || !input.phone) {
            throw new Error('All fields are required');
        }

        const { path: photoPath } = await this.housePhotoRepository.upload(input.file);

        const house = House.create({
            ...input,
            photoUrl: photoPath
        });
        await this.houseRepository.save(house);

        return this.funnyPhrasePublishHouseGenerator.generate(
            house.description,
            house.phone,
            house.lat,
            house.lng
        )
    }
}
