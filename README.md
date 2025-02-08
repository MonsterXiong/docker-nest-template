docker build -t sf-nest .   

docker run -p 5000:3000 sf-nest

docker run -d --restart always --name nest-app -p 5000:3000 -e DB_USER=root -e DB_PASSWORD=123456 -e DB_HOST=192.168.8.12 -e DB_PORT=3306 -e DB_NAME=development_platform sf-nest

docker save sf-nest -o D:\mod\sf-nest.tar 

docker load -i D:\mod\sf-nest.tar 


USE mysql;

SELECT Host,User FROM user;

UPDATE user SET Host= '%' WHERE User= 'root' LIMIT 1;

flush PRIVILEGES;

sk-f460809557bd460aaa833d7a31b172f9