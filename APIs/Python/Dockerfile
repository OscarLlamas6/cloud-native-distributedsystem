FROM python:3.8-slim-buster

WORKDIR /app

RUN pip install pymongo
RUN pip install mysql-connector 
RUN pip install python-dotenv
RUN pip install --upgrade google-cloud-pubsub

COPY . .

EXPOSE 4001

CMD [ "python", "./app.py" ]