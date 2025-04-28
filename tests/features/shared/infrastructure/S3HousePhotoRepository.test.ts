import {S3HousePhotoRepository} from "@shared/infrastructure/S3HousePhotoRepository";
import {LocalstackContainer, StartedLocalStackContainer} from "@testcontainers/localstack";
import {CreateBucketCommand, GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {File} from "@shared/domain/File";

describe('S3HousePhotoRepository', () => {
    let repository: S3HousePhotoRepository
    let container: StartedLocalStackContainer
    let client: S3Client
    let bucket: string = 'waze-inmobiliario-uploads'

    beforeAll(async () => {
        container = await new LocalstackContainer()
            .start();

        client = new S3Client({
            region: 'us-east-1',
            endpoint: container.getConnectionUri(),
            credentials: {
                secretAccessKey: "test",
                accessKeyId: "test",
            },
            forcePathStyle: true,
        });
        repository = new S3HousePhotoRepository(client, bucket);

        const input = {
            Bucket: bucket,
        };
        const command = new CreateBucketCommand(input);
        await client.send(command);
    })

    afterAll(async () => {
        await container.stop();
    })

    it('should upload a file to S3', async () => {
        const file = new File(
            'test.jpg',
            'image/jpeg',
            Buffer.from('test content')
        )
        const { path } = await repository.upload(file)

        const getObjectCommand = new GetObjectCommand({
            Bucket: bucket,
            Key: path,
        });
        const response = await client.send(getObjectCommand);

        expect(response.Body).toBeDefined();
        expect(response.ContentType).toBe('image/jpeg');
    })
})
