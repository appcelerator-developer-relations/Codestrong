migration.up = function(db) {
	db.createTable("post",
		{
		    "columns": {
		        "onFocus": "function",
		        "onBlur": "function"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "post"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("post");
};
