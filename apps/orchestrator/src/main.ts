console.log('[Orchestrator] File main.ts loaded');
process.on('uncaughtException', (err) => {
  console.error('[Orchestrator] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Orchestrator] Unhandled Rejection at:', promise, 'reason:', reason);
});
import 'source-map-support/register';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@gitroom/orchestrator/app.module';
import * as dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  console.log('[Orchestrator] Starting Nest application context...');
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    app.enableShutdownHooks();
    console.log('[Orchestrator] Nest application context initialized successfully.');
    
    // Keep-alive interval to prevent process from exiting if Temporal takes time to connect
    setInterval(() => {
      // Just to keep the event loop busy
    }, 1000 * 60 * 60);
  } catch (err) {
    console.error('[Orchestrator] Failed to initialize Nest application context:', err);
    process.exit(1);
  }
}

bootstrap();
