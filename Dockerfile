# 使用 Node.js 官方镜像
FROM node:22

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建 NestJS 项目
RUN npm run build

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main"]