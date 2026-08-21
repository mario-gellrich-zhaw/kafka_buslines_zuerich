# Kafka Buslines Event Streaming

1. [Prerequisites](#prerequisites)
2. [Folder Structure](#folder-structure)
3. [Docker Compose Configuration](#docker-compose-configuration)
4. [Executing Docker Compose](#executing-docker-compose)
5. [Checking Running Containers](#checking-running-containers)
6. [Starting the Producers](#starting-the-producers)
7. [Starting the Consumer](#starting-the-consumer)
8. [Showing the Web Application](#showing-the-web-application)

## Prerequisites

You need a GitHub account and a fork of the GitHub repository: https://github.com/mario-gellrich-zhaw/kafka_buslines_zuerich.

Based on the fork, create a new GitHub Codespaces environment.

## Folder Structure

The Folder 'Kafka_Buslines_Zuerich' contains:
  
```bash
Kafka_Buslines_Zuerich
├── data
│   ├── bus1.json
│   ├── bus2.json
│   └── bus3.json
├── Kafka
├── static
│   └── leaf.js
├── templates
│   └── index.html
├── app.py
├── busdata1.py
├── busdata2.py
├── busdata3.py
├── docker-compose.yml
├── README.md
└── requirements.txt
```

## Docker Compose Configuration

The file 'docker-compose.yml' contains:  

```bash
# Define custom networks
networks:
  myNetwork:

services:

  # Zookeeper service configuration
  zookeeper:
    image: 'confluentinc/cp-zookeeper:7.6.1'
    ports:
      - '2181:2181'
    environment:
      - ZOOKEEPER_CLIENT_PORT=2181
      - ZOOKEEPER_TICK_TIME=2000
    networks:
      - myNetwork

  # Kafka service configuration
  kafka:
    image: 'confluentinc/cp-kafka:7.6.1'
    ports:
      - '9092:9092'
    environment:
      - KAFKA_BROKER_ID=1
      - KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_AUTO_CREATE_TOPICS_ENABLE=true
      - KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
    volumes:
      - ./Kafka:/var/lib/kafka/data
    networks:
      - myNetwork
    depends_on:
      - zookeeper
```

> **Note:** The images were switched from Bitnami's Docker Hub images (`bitnami/zookeeper`, `bitnami/kafka`), which were pulled from Docker Hub and are no longer available there, to Confluent's actively maintained images (`confluentinc/cp-zookeeper`, `confluentinc/cp-kafka`). Topics are now created automatically on first use (`KAFKA_AUTO_CREATE_TOPICS_ENABLE=true`) instead of via the Bitnami-specific `KAFKA_CREATE_TOPICS` variable.

## Executing Docker Compose

```bash
Visual Studio Code -> Activity Bar -> Explorer -> right click on docker-compose.yml -> Compose up
```
## Checking Running Containers

```bash
# Open a new Terminal
docker ps

# It should show two running containers:
# - kafka_busline_zuerich-zookeeper-1
# - kafka_busline_zuerich-kafka-1
```

## Starting the Producers

```bash
# Open a new Terminal to start the 1st producer (busline_01) ...
python busdata1.py

# Open a new Terminal to start the 2nd producer (busline_02) ...
python busdata2.py

# Open a new Terminal to start the 3rd producer (busline_03) ...
python busdata3.py
```

## Starting the Consumer

```bash
# Open a new Terminal to start the consumer ...
python app.py
```
## Showing the Web Application

```bash
# To open the app in the browser, follow the link shown in the terminal, for example:
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5001
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 301-459-861
```
