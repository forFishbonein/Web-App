# ==========================
# Stage 1: Build Stage
# ==========================
FROM maven:3.8.6-openjdk-8-slim AS builder
WORKDIR /app

# 1. Copy the parent pom.xml
COPY ./pom.xml ./

# 2. Copy the pom.xml files of each submodule (to cache dependencies for go-offline)
COPY gym-common/pom.xml  ./gym-common/
COPY gym-pojo/pom.xml    ./gym-pojo/
COPY gym-server/pom.xml  ./gym-server/

# 3. Download dependencies first
RUN mvn dependency:go-offline

# 4. Then copy all the source code
COPY . .

# 5. Compile and package
RUN mvn clean package -DskipTests

# ==========================
# Stage 2: Runtime Stage
# ==========================
FROM openjdk:8-jre-slim
WORKDIR /app

# Key: Make sure to specify the correct name of the Jar file
COPY --from=builder /app/gym-server/target/gym-server-1.0-SNAPSHOT.jar /app/app.jar

EXPOSE 8080
CMD ["java","-jar","/app/app.jar"]