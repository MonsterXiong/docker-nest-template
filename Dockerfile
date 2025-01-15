# 使用 Node.js 官方镜像
FROM node:22.12-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装 PM2 全局
RUN npm install -g pm2 --registry=https://registry.npmmirror.com

# 安装项目依赖
RUN npm install --production

# 复制项目文件
COPY . .

# 构建 NestJS 项目
RUN npm run build

# 设置默认环境变量
ENV DB_HOST=localhost \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=123456 \
    DB_NAME=test

# 暴露应用端口
EXPOSE 3000


# 使用 PM2 启动应用
CMD ["pm2-runtime", "start", "dist/main.js", "--name", "nest-app"]
