#!/bin/bash
git pull
npm install
su vsapp -c "npm run build
screen -X -S VSAPP quit || true
screen -S VSAPP npm run serve"
