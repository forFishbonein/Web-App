# ==========================
# 第一阶段：Build Stage
# ==========================
FROM maven:3.8.6-openjdk-8-slim AS builder

WORKDIR /app

# 拷贝 pom.xml 并提前下载依赖（加速后面打包）
COPY pom.xml /app
RUN mvn dependency:go-offline

# 拷贝源码
COPY src /app/src

# 使用 Maven 打包，跳过测试
RUN mvn clean package -DskipTests

# ==========================
# 第二阶段：Runtime Stage
# ==========================
FROM openjdk:8-jre-slim

WORKDIR /app

# 从第一阶段复制打包生成的 JAR 文件到当前镜像
COPY --from=builder /app/target/Backend-0.0.1-SNAPSHOT.jar app.jar

# Spring Boot 默认为 8080 端口，但你在 application.yml 中配成 8081
EXPOSE 8081

# 运行 Spring Boot
CMD ["java", "-jar", "app.jar"]
