migration.up = function(db) {
	db.createTable("user",
		{
		    "columns": {
		        "username": "string",
		        "password": "string"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "user"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("user");
};
