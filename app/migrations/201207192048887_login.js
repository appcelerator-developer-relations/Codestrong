migration.up = function(db) {
	db.createTable("login",
		{
		    "columns": {
		        "onFocus": "function",
		        "onBlur": "function"
		    },
		    "defaults": {},
		    "adapter": {
		        "type": "sql",
		        "tablename": "login"
		    }
		}
	);
};

migration.down = function(db) {
	db.dropTable("login");
};
