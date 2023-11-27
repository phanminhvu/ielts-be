FROM node:14.19.1-alpine

# Create app directory
WORKDIR /var/www/ielts-api

# Install app dependencies - For NPM use: `COPY package.json package-lock.lock ./`
COPY package.json yarn.lock ./ 
# For NPM use: `RUN npm ci`
RUN yarn --pure-lockfile

# Copy important files - Add ormconfig.ts here if using Typeorm
COPY .eslintrc.js nest-cli.json tsconfig.json tsconfig.build.json ./
COPY . .

# Copy env
RUN rm -rfv .env
COPY .env.example .env
RUN yarn build

CMD [ "yarn", "start:prod" ]
EXPOSE 8686