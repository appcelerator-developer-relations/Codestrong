migration.up = function(db) {
	db.createTable("app",
		{
		    "columns": {
		        "name": "string"
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
