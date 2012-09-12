migration.up = function(db) {
	db.createTable("user",
		{
		    "columns": {
		        "getUserById": "function"
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
