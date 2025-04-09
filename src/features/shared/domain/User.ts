export interface UserProps {
    id?: string;
    name: string;
    isSubscriptionActive: boolean;
    interestCount?: number;
}

export class User {
    readonly id: string;
    readonly name: string;
    readonly isSubscriptionActive: boolean;
    readonly interestCount: number;

    constructor({
        id,
        name,
        isSubscriptionActive,
        interestCount
    }: UserProps) {
        this.id = id ?? crypto.randomUUID();
        this.name = name;
        this.isSubscriptionActive = isSubscriptionActive;
        this.interestCount = interestCount ?? 0;
    }

    static create(input: UserProps): User {
        return new User(input);
    }

    toPrimitives(): {
        id: string;
        name: string;
        isSubscriptionActive: boolean;
        interestCount: number;
    } {
        return {
            id: this.id,
            name: this.name,
            isSubscriptionActive: this.isSubscriptionActive,
            interestCount: this.interestCount,
        }
    }

    canMarkMoreInterest(): boolean {
        return this.isSubscriptionActive || this.interestCount < 2;
    }
}
