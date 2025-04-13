# 构建阶段
FROM node:22.12-alpine AS builder

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖(包括开发依赖)
RUN npm install --registry=https://registry.npmmirror.com

# 复制项目源代码
COPY . .

# 构建 NestJS 项目
RUN npm run build

# 确保静态资源被正确复制
# RUN mkdir -p dist/public
# RUN cp -r public/* dist/public/ || true

# 生产阶段
FROM node:22.12-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 文件
COPY package*.json ./

# 只安装生产依赖
RUN npm install --production --registry=https://registry.npmmirror.com

# 安装 PM2 全局
RUN npm install -g pm2 --registry=https://registry.npmmirror.com

# 从构建阶段复制编译后的代码
COPY --from=builder /usr/src/app/dist ./dist

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
