# syntax=docker/dockerfile:1

FROM golang:1.16-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .


RUN go build -o /api-golang

EXPOSE 4000

CMD [ "/api-golang" ]