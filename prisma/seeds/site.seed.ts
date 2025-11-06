import { PrismaClient } from '@prisma/client';

export const seedSite = async (prisma: PrismaClient) => {
  // Базовый сайт (идемпотентно по уникальному полю code)
  const site = await prisma.site.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: {
      name: 'Главная клиника',
      address: 'Центральная, 1',
      code: 'MAIN',
    },
  });

  return site;
};


