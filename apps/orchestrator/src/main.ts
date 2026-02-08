console.log('[Orchestrator] File main.ts loaded');
console.log('[Orchestrator] Current Directory:', process.cwd());
process.on('uncaughtException', (err) => {
  console.error('[Orchestrator] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Orchestrator] Unhandled Rejection at:', promise, 'reason:', reason);
});

import { Runtime } from '@temporalio/worker';
Runtime.install({ shutdownSignals: [] });

import 'source-map-support/register';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  console.log('[Orchestrator] Starting Nest application...');
  try {
    const app = await NestFactory.create(AppModule);
    app.enableShutdownHooks();
    
    const port = process.env.PORT || 8081;
    console.log(`[Orchestrator] Attempting to listen on port: ${port} (0.0.0.0)`);
    
    await app.listen(port, '0.0.0.0');
    console.log(`[Orchestrator] Nest application is listening and healthy on port: ${port}`);
  } catch (err) {
    console.error('[Orchestrator] Failed to initialize Nest application:', err);
    process.exit(1);
  }
}

bootstrap();
