FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy ENTIRE workspace (no cherry-picking)
COPY . .

# Build Next.js properly (this was the missing piece before)
RUN npm run build

EXPOSE 3000

# Run production server (stable, no watchers)
CMD ["npm", "run", "start"]
