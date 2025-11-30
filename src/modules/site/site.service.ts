import { Injectable } from '@nestjs/common';
import { SiteRepository } from './site.repository';

@Injectable()
export class SiteService {
  constructor(private readonly siteRepository: SiteRepository) {}

  async search(query: string) {
    return this.siteRepository.search(query);
  }
}
