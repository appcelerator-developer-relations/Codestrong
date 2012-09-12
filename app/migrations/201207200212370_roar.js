migration.up = function(db) {
	db.createTable("roar",
		{
		    "columns": {
		        "getAllRoars": "function"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "roar"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("roar");
};
