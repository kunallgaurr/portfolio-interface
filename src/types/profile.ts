export type YearMonth = `${number}-${number}`;

export type Basics = {
	name: string;
	pronouns: string;
	headline: string;
	location: string;
	linkedin: string;
	summary: string;
};

export type EmploymentType = "Full-time" | "Internship";

export type WorkMode = "Remote" | "On-site" | "Hybrid";

export type Experience = {
	title: string;
	company: string;
	type: EmploymentType;
	start: YearMonth;
	end: YearMonth | null;
	location: string;
	workMode: WorkMode;
	highlights: string[];
};

export type Education = {
	institution: string;
	degree: string;
	field?: string;
	start: YearMonth;
	end: YearMonth;
};

export type Skills = Record<string, string[]>;

export type ProfileStats = {
	connections: string;
	followers: number;
};

export type Profile = {
	basics: Basics;
	experience: Experience[];
	education: Education[];
	skills: Skills;
	stats: ProfileStats;
};
