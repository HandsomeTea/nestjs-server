FROM node:20.11.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ENV ADDRESS_BOOK_ADDR=my_addressbook
# ENV CORE_ADDR=my_core

COPY ./dist /usr/src/app
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install

EXPOSE 8010
CMD ["node", "--max-old-space-size=900", "--max_semi_space_size=64", "index.js"]
