import OpenAI from "openai";
import {FunnyPhrasePublishHouseGenerator} from "@/features/publish_houses/domain/FunnyPhrasePublishHouseGenerator";

export class OllamaDeepSeekFunnyPhrasePublishHouseGenerator implements FunnyPhrasePublishHouseGenerator {
    private readonly client: OpenAI;

    private prompt = `
Eres un personaje alegre y vaquero como Buddy de Toy Story. Una persona acaba de encontrar una casa y quiere compartirla en nuestra app. 
Tu tarea es generar una frase graciosa y corta (máximo 1-2 frases) que refleje el espíritu de la vivienda, usando la siguiente información:

*{data}*

La frase debe ser divertida, algo exagerada, con un estilo vaquero juguetón, como si Buddy la estuviera diciendo en una aventura. No expliques nada más, solo responde con la frase graciosa.
`;

    constructor() {
        this.client = new OpenAI({
            apiKey: 'ollama',
            baseURL: 'http://localhost:11434/v1',
        });
    }

    async generate(description: string, phone: string, lat: number, lng: number): Promise<string> {

        const prompt = this.prompt.replace('*{data}*', `
- 📍 Latitud: ${lat}
- 📍 Longitud: ${lng}
- 🏡 Descripción de la casa: ${description}
- 📞 Teléfono de contacto: ${phone}
        `)

        const response = await this.client.completions.create({
            model: "deepseek-r1:7b",
            prompt: prompt,
        });

        const raw = response.choices[0].text.trim();
        const cleaned = raw.includes("</think>")
            ? raw.split("</think>").pop()!.trim()
            : raw;

        return cleaned;
    }

}
