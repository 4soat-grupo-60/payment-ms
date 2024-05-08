echo "running migrations"
cd /var/www && ./node_modules/.bin/prisma migrate dev --schema=./src/external/prisma/schema.prisma