FROM nginx:alpine

RUN apk add --no-cache git

RUN git clone https://github.com/Jordandennis/clear-water-painting.git /tmp/repo \
    && cp /tmp/repo/index.html /usr/share/nginx/html/ \
    && cp /tmp/repo/styles.css /usr/share/nginx/html/ \
    && cp -r /tmp/repo/images /usr/share/nginx/html/ \
    && cp -r /tmp/repo/fonts /usr/share/nginx/html/ \
    && rm -rf /tmp/repo

EXPOSE 80
