import { PrismaClient } from '@prisma/client';

export const seedEquipment = async (prisma: PrismaClient, siteId: string) => {
  // Базовое оборудование (идемпотентно по предопределённому id)
  const equipment = await prisma.equipment.upsert({
    where: { id: 'SEED_EQUIPMENT_1' },
    update: {},
    create: {
      id: 'SEED_EQUIPMENT_1',
      name: 'Тонометр',
      description: 'Базовое оборудование для измерения давления',
      inventoryNumber: 'INV-0001',
      siteId,
      serialNumber: 'SN-0001',
      state: 'Рабочее',
      roomNumber: '101',
    },
  });

  return equipment;
};
