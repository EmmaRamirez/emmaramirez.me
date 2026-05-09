import { PrismaClient } from '$generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '$env/dynamic/private';

function createPrismaClient(): PrismaClient {
	const connectionString = env.DATABASE_URL;

	if (!connectionString) {
		throw new Error(
			'DATABASE_URL environment variable is not set. Please configure your database connection.'
		);
	}

	const adapter = new PrismaPg({ connectionString });
	return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
