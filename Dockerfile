FROM php:8.3-apache-bookworm

WORKDIR /var/www/html

COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY *.html ./
COPY assets/ ./assets/
COPY forms/ ./forms/
