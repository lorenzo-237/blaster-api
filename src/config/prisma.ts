import { PrismaClient as ClientBlaster } from '../prisma/generated/blaster-cli';
import { PrismaClient as ClientMantis } from '../prisma/generated/mantis-cli';

export const PrismaBlaster = new ClientBlaster();

export const PrismaMantis = new ClientMantis();
