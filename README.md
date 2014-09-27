dashsta
=======

Super awesome realtime dashboard


funderingar
=======
Back-end
	En json-fil per datasource
		En fråga per jsonfil
		Resultatet av varje fråga/datasource/jsonfil sparas som en tabell i en in-memory sqlite-databas,
		vilket gör att man kan kombinera resultatet av alla datasources med vanlig sql, men att det fortfarande
		går superfort.

	En trigger kan köras på förutbestämda tidpunkter, eller intervallmässigt (var 10e minut etc)

	Stöd för csv,odbc,xml etc.

Front-end

	Portal/Första fliken
		Visa alla tillgängliga Dashboards som boxar
		Mer frekvent använda Bashboards blir en större box och hamnar först, typ som ett wordcloud

	View/Visning av Dashboard
		Rutsystem (boxes/containers) som automatiskt fyller skärmen på nått smart sätt
		Widgets som anpassar sig efter sin box, större box = större storlek på text

	System/Systemstatus
		% använt minne just nu
		Lista aktiverade/inaktiverade datakällsmoduler

	Status/Triggerstatus
		Lista alla triggers, först aktiva, sedan inaktiva
		Visa senast körtid, nästa körtid, genomsnittlig tidsåtgång och förutspådd progress om körningen är igån

