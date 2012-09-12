migration.up = function(db) {
	db.createTable("boxloader",
		{
		    "columns": {
		        "show": "function",
		        "destroy": "function"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "boxloader"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("boxloader");
};
