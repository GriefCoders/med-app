import { PrismaClient, Role } from '@prisma/client';

export const seedUser = async (prisma: PrismaClient, siteId: string) => {
  // Базовый пользователь, привязанный к сайту (идемпотентно по email)
  await prisma.user.upsert({
    where: { email: 'string@gmail.com' },
    update: {},
    create: {
      email: 'string@gmail.com',
      // захешированный пароль "string"
      password: '$2a$04$3EuFgtfrKleWTT2lHiioTOfk7d6r0vz.B.Scf4rKGEaJSQ6bfiFBi',
      role: Role.ADMIN,
      fullName: 'Администратор',
      siteId,
    },
  });
};
