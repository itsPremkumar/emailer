export type RowIn = {
Name?: string | null;
Department?: string | null;
Email?: string | null;
};


export type Person = {
name: string;
department: string;
email: string;
};


export type SendResult = {
person: Person;
success: boolean;
error?: string;
};