docker build -t sf-nest .   

docker run -p 5000:3000 sf-nest


docker run -d -p 5000:3000 -e DB_USER=root -e DB_PASSWORD=123456 -e DB_HOST=192.168.31.156 -e DB_PORT=3306 -e DB_NAME=development_platform sf-nest



docker save node:22.12-alpine -o D:\mod\node-22.12-alpine.tar

docker load -i D:\mod\node-22.12-alpine.tar






USE mysql;

SELECT Host,User FROM user;

UPDATE user SET Host= '%' WHERE User= 'root' LIMIT 1;

flush PRIVILEGES;


sk-f460809557bd460aaa833d7a31b172f9




{
  "id": 111,
  "name": "首页导航",
  "unitName": "单位A",
  "unitCode": "UNIT_A",
  "bindProjectType": "nb",
   "projectUrl":"http://www.baiddu.com",
  "children": [
    {
      "id": 112,
      "name": "产品中心",
      "unitName": "单位A",
      "unitCode": "UNIT_A",
      "bindProjectType": "nb",
      "projectUrl":"http://www.baiddu.com",
      "parentId": 111,
      "children": [
        {
          "id": 113,
          "name": "产品A",
          "url": "/products/a",
          "bindUrlType": "fe",
          "bindNav": 112
        }
      ]
    }
  ]
}