migration.up = function(db) {
	db.createTable("photo",
		{
		    "columns": {
		        "getById": "function"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "photo"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("photo");
};
