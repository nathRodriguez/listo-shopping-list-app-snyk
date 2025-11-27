import type { NextConfig } from "next";
import { loadEnvConfig } from '@next/env';
import path from 'path';

// Load .env from the project root
const projectDir = path.resolve(__dirname, '../..');
loadEnvConfig(projectDir);

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
