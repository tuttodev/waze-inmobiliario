export class File {
    readonly name: string;
    readonly mimeType: string;
    readonly data: Buffer;

    constructor(
        name: string,
        mimeType: string,
        data: Buffer
    ) {
        this.name = name;
        this.mimeType = mimeType;
        this.data = data;
    }

    static create (
        name: string,
        mimeType: string,
        data: Buffer
    ): File {
        return new File(name, mimeType, data);
    }
}
