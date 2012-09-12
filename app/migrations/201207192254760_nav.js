migration.up = function(db) {
	db.createTable("nav",
		{
		    "columns": {
		        "sections": "array,",
		        "currentSection": ""
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "nav"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("nav");
};
