migration.up = function(db) {
	db.createTable("Animation",
		{
		    "columns": {
		        "zoom": "function"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "Animation"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("Animation");
};
