const dbData = {
    "config": {
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "123456",
        "database": "test_db"
    },
    "tables": [
        {
            "name": "users",
            "columns": [
                {
                    "name": "id",
                    "type": "int",
                    "primary": true,
                    "nullable": false,
                    "comment": "用户ID"
                },
                {
                    "name": "username",
                    "type": "varchar",
                    "length": 255,
                    "nullable": false,
                    "unique": true,
                    "comment": "用户名"
                },
                {
                    "name": "created_at",
                    "type": "timestamp",
                    "default": "CURRENT_TIMESTAMP",
                    "comment": "创建时间"
                }
            ],
            "indices": [
                {
                    "name": "idx_username",
                    "columns": ["username"],
                    "unique": true
                }
            ]
        }
    ]
}




const diffDb = {
    "config": {
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "123456",
        "database": "test_db"
    },
    "tables": [
        {
            "name": "project",
            "columns": [
                {
                    "name": "id",
                    "type": "varchar",
                    "primary": true,
                    "length": 32,
                    "nullable": false,
                    "comment": "用户ID"
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 255,
                    "nullable": false,
                    "unique": true,
                    "comment": "用户名"
                }
            ]
        },
        {
            "name": "users",
            "columns": [
                {
                    "name": "id",
                    "type": "int",
                    "primary": true,
                    "nullable": false,
                    "comment": "用户ID"
                },
                {
                    "name": "username",
                    "type": "varchar",
                    "length": 255,
                    "nullable": false,
                    "unique": true,
                    "comment": "用户名"
                }
            ],
            "indices": [
                {
                    "name": "idx_username",
                    "columns": ["username"],
                    "unique": true
                }
            ]
        }
    ]
}