FROM node:8

RUN mkdir /data

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY app/package*.json ./

RUN npm install
# For production
# RUN npm install --only=production

# Bundle app source
COPY app .

EXPOSE 8080
CMD [ "npm", "start" ]
