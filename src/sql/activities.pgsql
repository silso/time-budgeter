DROP TABLE "Activities", "Activity Components";

CREATE TABLE "Activities" (
	id integer NOT NULL PRIMARY KEY,
	name text NOT NULL,
	value numeric NOT NULL,
	description text NOT NULL,
	fundamental boolean NOT NULL,
	deleted boolean NOT NULL
);

CREATE TABLE "Activity Components" (
	parent integer NOT NULL REFERENCES "Activities"(id),
	child integer NOT NULL REFERENCES "Activities"(id),
	weight numeric NOT NULL,
	deleted boolean NOT NULL,
	PRIMARY KEY(parent, child)
);

INSERT INTO "Activities"
VALUES (0, 'test activity', 1, 'des', true, false);
