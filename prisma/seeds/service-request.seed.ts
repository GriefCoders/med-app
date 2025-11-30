import { PrismaClient } from '@prisma/client';
import { ServiceRequestStatus } from 'src/types/service-request-status';

export const seedServiceRequest = async (
  prisma: PrismaClient,
  siteId: string,
  senderEmail: string,
  equipmentId?: string
) => {
  // Находим отправителя по email
  const sender = await prisma.user.findUnique({ where: { email: senderEmail } });
  if (!sender) {
    throw new Error('Пользователь-отправитель для заявок не найден');
  }

  // Базовая заявка (идемпотентно по предопределённому id)
  const request = await prisma.serviceRequest.upsert({
    where: { id: 'SEED_REQUEST_1' },
    update: {},
    create: {
      id: 'SEED_REQUEST_1',
      senderId: sender.id,
      assigneeId: null,
      summary: 'Не работает монитор',
      equipmentId: equipmentId ?? null,
      description: 'Экран не включается после нажатия кнопки питания',
      type: 'инцидент',
      priority: 'средний',
      status: ServiceRequestStatus.OPEN,
      siteId,
    },
  });

  return request;
};


