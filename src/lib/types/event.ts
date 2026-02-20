export type EventLocation = {
	id?: number;
	name?: string;
	address?: string;
	[key: string]: any;
};

export type EventData = {
	name: string;
	short_description: string;
	description: string;
};

export type EventRule = {
	id_event_rule: number;
	text: string;
	position: number;
};

export type EventProgram = {
	id_event_program: number;
	text: string;
	position: number;
};


export type EventItem = {
	id_event: number;
	event_date: string;
	start_time: string;
	end_time: string;
	max_members: number;
	location: EventLocation;
	cost: string;
	event_data: Record<string, EventData>;
	event_rules: Record<string, EventRule[]>;
	event_program: Record<string, EventProgram[]>;
	registered: boolean;
	members: number;
};