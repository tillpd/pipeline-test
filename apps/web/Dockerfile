# --- build project
FROM node:16 as base
WORKDIR /app
RUN yarn add turbo 

FROM base as builder
WORKDIR /app
COPY . .
RUN yarn turbo prune --scope=web --docker

## Install 
FROM base as installer
## In case you get errors regarding Chromium uncomment the following line
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}
RUN yarn install

## Build project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=pd-backend...
RUN yarn turbo run db:generate 


FROM installer as test
RUN yarn turbo test --filter=web...

# FROM installer as migration
# RUN turbo db:deploy

FROM node:16-alpine as release
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=installer /app .

CMD ["node", "backends/pd-backend/dist/main"]
