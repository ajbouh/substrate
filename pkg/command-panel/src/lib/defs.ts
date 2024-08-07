export type FieldDef = {
	description: string;
	name: string;
	type: string;
};
export type FieldDefs = Record<string, FieldDef>;
export type Def = {
	description: string;
	parameters: FieldDefs;
	returns: FieldDefs;
};
export type DefIndex = Record<string, Def>;

type Args = Record<string, any>;

export type Commands = {
	index: Promise<DefIndex>;
	run: (command: string, args: Args) => Promise<any>;
};
