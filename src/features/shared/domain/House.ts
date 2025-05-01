export interface HouseProps {
    id?: string;
    lat: number;
    lng: number;
    photoUrl: string;
    description: string;
    phone: string;
    publishedBy: string;
    interestedPeopleCount?: number;
    published?: boolean
}

export class House {
    readonly id: string;
    readonly lat: number;
    readonly lng: number;
    readonly photoUrl: string;
    readonly description: string;
    readonly phone: string;
    readonly publishedBy: string;
    readonly interestedPeopleCount: number;
    readonly published: boolean;

    constructor({
        id,
        lat,
        lng,
        photoUrl,
        description,
        phone,
        publishedBy,
        interestedPeopleCount,
        published,
    }: HouseProps) {
        const DEFAULT_INTERESTED_PEOPLE_COUNT = 0;

        this.id = id ?? crypto.randomUUID();
        this.lat = lat;
        this.lng = lng;
        this.photoUrl = photoUrl;
        this.description = description;
        this.phone = phone;
        this.publishedBy = publishedBy;
        this.interestedPeopleCount = interestedPeopleCount ?? DEFAULT_INTERESTED_PEOPLE_COUNT;
        this.published = published ?? true;
    }

    static create(input: HouseProps): House {
        return new House(input);
    }

    toPrimitive(): {
        id: string;
        lat: number;
        lng: number;
        photoUrl: string;
        description: string;
        phone: string;
        publishedBy: string;
        interestedPeopleCount: number;
        published: boolean;
    } {
        return {
            id: this.id,
            lat: this.lat,
            lng: this.lng,
            photoUrl: this.photoUrl,
            description: this.description,
            phone: this.phone,
            publishedBy: this.publishedBy,
            interestedPeopleCount: this.interestedPeopleCount,
            published: this.published,
        };
    }
}
