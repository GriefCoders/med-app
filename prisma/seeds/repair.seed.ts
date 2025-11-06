import { PrismaClient } from '@prisma/client';

export const seedRepair = async (prisma: PrismaClient, equipmentId: string) => {
  // Базовый ремонт (идемпотентно по предопределённому id)
  const repair = await prisma.repair.upsert({
    where: { id: 'SEED_REPAIR_1' },
    update: {},
    create: {
      id: 'SEED_REPAIR_1',
      date: new Date(),
      equipmentId,
    },
  });

  return repair;
};


