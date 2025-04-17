export interface FunnyPhrasePublishHouseGenerator {
    generate: (description: string, phone: string, lat: number, lng: number) => Promise<string>
}
