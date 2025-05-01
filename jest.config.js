/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  roots: ['<rootDir>/tests'],
  testTimeout: 45000,
  moduleNameMapper: {
    "^@/(.*)$": ["<rootDir>/src/$1"],
    "^@shared/(.*)$": ["<rootDir>/src/features/shared/$1"],
    "^@drizzleConfig/(.*)$": ["<rootDir>/src/features/shared/infrastructure/drizzle-config/$1"],
  }
};
