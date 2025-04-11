import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import type { Controller } from '../Controller';
import {InMemoryHouseRepository} from "@/features/shared/infrastructure/in_memory/InMemoryHouseRepository";
import {InMemoryHousePhotoRepository} from "@/features/shared/infrastructure/in_memory/InMemoryPhotoRepository";
import {HousePublisher} from "@/features/publish_houses/application/HousePublisher";
import type {UploadedFile} from "express-fileupload";
import {File} from '@/features/shared/domain/File'
import {S3HousePhotoRepository} from "@shared/infrastructure/S3HousePhotoRepository";
import {PostgresDrizzleHouseRepository} from "@shared/infrastructure/PostgresDrizzleHouseRepository";

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

            // const photoRepository = new InMemoryHousePhotoRepository()
            // const houseRepository = new InMemoryHouseRepository()
            const photoRepository = new S3HousePhotoRepository()
            const houseRepository = new PostgresDrizzleHouseRepository()

            const useCase = new HousePublisher(houseRepository, photoRepository);
            await useCase.run({
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

            res.sendStatus(httpStatus.CREATED)
        } catch (error) {
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
