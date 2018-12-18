#!/bin/sh
echo "Deploy production.."

npm run build
gcloud config set project word-trans
gcloud app deploy --quiet