import dataSource from '../data-source';
import { regionsSeed } from './region.seed';

async function run() {
  try {
    console.log('Connecting seeds');
    const source = await dataSource.initialize();

    console.log('Processing region Seeds');
    await regionsSeed(source);

    console.log('Database seeded successfully !');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error while seeding', error);
    process.exit(1);
  }
}

run();
