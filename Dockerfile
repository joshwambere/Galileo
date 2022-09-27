# Common build stage
FROM --platform=amd64 node:14-alpine3.14 as common-build-stage



COPY . ./app
RUN rm -rf /app/node_modules

WORKDIR /app
RUN yarn

EXPOSE 3000
EXPOSE 4000
EXPOSE 6000

  # Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "dev"]

  # Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]
