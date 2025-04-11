import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/features/shared/infrastructure/drizzle-config/out',
    schema: './src/features/shared/infrastructure/drizzle-config/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
