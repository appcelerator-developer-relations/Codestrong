migration.up = function(db) {
	db.createTable("app",
		{
		    "columns": {
		        "name": "string",
		        "test": "function"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "app"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("app");
};
