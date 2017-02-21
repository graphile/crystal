FROM postgres:9.5
MAINTAINER dammian.miller@gmail.com / kuldins@gmail.com
ENV PG_MAJOR 9.5


# copy init scripts to entrypoint path
COPY docker-entrypoint-initdb.d/*.sql /docker-entrypoint-initdb.d/
COPY docker-entrypoint-initdb.d/*.sh /docker-entrypoint-initdb.d/
RUN chmod +x docker-entrypoint-initdb.d/*.sh

WORKDIR /home/postgres

EXPOSE 5432

CMD ["postgres"]
