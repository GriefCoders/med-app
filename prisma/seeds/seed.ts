import { PrismaClient } from '@prisma/client';
import { seedSite } from './site.seed';
import { seedUser } from './user.seed';
import { seedEquipment } from './equipment.seed';
import { seedServiceRequest } from './service-request.seed';
import { seedRepair } from './repair.seed';

const prisma = new PrismaClient();

async function main() {
  const site = await seedSite(prisma);
  console.log('[+] Сайт создан');

  await seedUser(prisma, site.id);
  console.log('[+] Пользователь создан');

  const equipment = await seedEquipment(prisma, site.id);
  console.log('[+] Оборудование создано');

  await seedServiceRequest(prisma, site.id, 'string@gmail.com', equipment.id);
  console.log('[+] Заявка создана');

  await seedRepair(prisma, equipment.id);
  console.log('[+] Ремонт создан');

  console.log('[+] Готово');
}

main()
  .catch((e) => {
    console.error('Ошибка при выполнении сидов:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
