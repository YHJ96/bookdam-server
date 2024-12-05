import { PrismaClient, Prisma } from '@prisma/client';

export type PrismaTransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
