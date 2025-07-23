FROM node:22.14.0-alpine AS base
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S user
RUN chown -R user /opt/app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . ./
USER user
CMD ["sh"]
