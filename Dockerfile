FROM node:6.7.0
MAINTAINER dammian.miller@gmail.com
RUN npm install -g postgraphql
COPY docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d/
RUN chmod +x docker-entrypoint-initdb.d/*.sh
COPY start.sh /
RUN chmod +x /start.sh
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 3000
ENV PG_SCHEMA "mission_control"
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
CMD sleep 10 &&  /start.sh
