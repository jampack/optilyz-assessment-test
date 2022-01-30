import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  dotenv.config();
} else {
  dotenv.config({path: `.env.${env.toLowerCase()}`});
}

import createMappings from './mappings';

// Register mappings for automapper
createMappings();

export * from './app';
export * from './server';


