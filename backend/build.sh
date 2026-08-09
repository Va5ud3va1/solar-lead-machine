#!/bin/bash
set -e
npm install
npx prisma generate
npm run build
