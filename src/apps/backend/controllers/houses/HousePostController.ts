import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import type { Controller } from '../Controller';
import {HousePublisher} from "@/features/publish_houses/application/HousePublisher";
import type {UploadedFile} from "express-fileupload";
import {File} from '@/features/shared/domain/File'
import {S3HousePhotoRepository} from "@shared/infrastructure/S3HousePhotoRepository";
import {PostgresDrizzleHouseRepository} from "@shared/infrastructure/PostgresDrizzleHouseRepository";
import {
    OllamaDeepSeekFunnyPhrasePublishHouseGenerator
} from "@/features/publish_houses/infrastructure/OllamaDeepSeekFunnyPhrasePublishHouseGenerator";
import {
    OpenAIGPT3FunnyPhrasePublishHouseGenerator
} from "@/features/publish_houses/infrastructure/OpenAIGPT3FunnyPhrasePublishHouseGenerator";
import {drizzle} from "drizzle-orm/node-postgres";
import {S3Client} from "@aws-sdk/client-s3";

export default class HousesPostController implements Controller {
    async run(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query as Record<string, string>;
            const body = req.body as Record<string, string>;
            const photo = req.files?.file as UploadedFile;

            const {
                lat,
                lng,
                description,
                phone
            } = body;
            const { userId } = query

            const dbClient = drizzle(process.env.DATABASE_URL!);
            const s3Client = new S3Client({
                region: process.env.AWS_REGION,
                endpoint: process.env.S3_ENDPOINT,
                forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
            });
            const bucket = process.env.S3_BUCKET!;
            const photoRepository = new S3HousePhotoRepository(s3Client, bucket)
            const houseRepository = new PostgresDrizzleHouseRepository(dbClient)
            const funnyPhrasePublishHouseGenerator = new OpenAIGPT3FunnyPhrasePublishHouseGenerator()

            const useCase = new HousePublisher(houseRepository, photoRepository, funnyPhrasePublishHouseGenerator);
            const response = await useCase.run({
                lat: Number(lat),
                lng: Number(lng),
                file: File.create(
                    photo.name,
                    photo.mimetype,
                    photo.data
                ),
                description,
                phone,
                publishedBy: userId
            })

            res.status(httpStatus.CREATED).json({
                phrase: response
            })
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                res.status(httpStatus.BAD_REQUEST).json({
                    message: error.message
                })

                return
            }

            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
