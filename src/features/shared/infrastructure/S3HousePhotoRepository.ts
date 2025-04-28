import {HousePhotoRepository} from "@shared/domain/HousePhotoRepository";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { File } from '@shared/domain/File';

export class S3HousePhotoRepository implements HousePhotoRepository {
    constructor(
        private readonly client: S3Client,
        private readonly bucket: string
    ) {
    }

    async upload(file: File): Promise<{ path: string }> {
        const fileName = `house-photos/${Date.now()}-${file.name}`

        const params: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: fileName,
            Body: file.data,
            ContentType: file.mimeType,
        }

        await this.client.send(new PutObjectCommand(params));

        return {
            path: fileName,
        }
    }
}
