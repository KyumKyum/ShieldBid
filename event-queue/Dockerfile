# Production Stage
FROM openjdk:21-jdk as release

WORKDIR /app

COPY build/libs/event-queue-0.0.1-SNAPSHOT.jar /app/
ENTRYPOINT ["java", "-jar", "event-queue-0.0.1-SNAPSHOT.jar"]
