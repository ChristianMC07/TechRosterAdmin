export interface Technology {
    _id?: string;
    name: string;
    description: string;
    difficulty: number;
    courses: Course[];
}

export interface Course {
    _id?: string;
    code: string;
    name: string;
}

export interface ComponentProps {
    technologies: Technology[];
}