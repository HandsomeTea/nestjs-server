FROM node:18.16

RUN mkdir -p /usr/local/app

WORKDIR /usr/local/app

# ENV ADDRESS_BOOK_ADDR=surpass_addressbook
# ENV SURPASS_CORE_ADDR=surpass_surpasscore

COPY . /usr/local/app

RUN cd /usr/local/app
RUN npm install

EXPOSE 5003

CMD [ "node", "/usr/local/app/main.js" ]
