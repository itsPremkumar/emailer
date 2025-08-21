import validator from 'validator';
import { Person, RowIn } from './types';
import * as XLSX from 'xlsx';
import { normalize } from './utils';


export function loadPeopleFromXlsx(filePath: string): Person[] {
const wb = XLSX.readFile(filePath, { cellDates: false });
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json<RowIn>(ws, { defval: null });


const people: Person[] = [];


for (const r of rows) {
const name = (r.Name ?? '').toString();
const dept = (r.Department ?? '').toString();
const email = (r.Email ?? '').toString();


if (!name || !dept || !email) continue; // skip incomplete rows


const person: Person = {
name: normalize(name),
department: normalize(dept),
email: email.trim(),
};


// basic email validation (strict):
if (!validator.isEmail(person.email)) continue;


people.push(person);
}


return people;
}


export function filterByDepartment(people: Person[], targetDept: string): Person[] {
const targetNorm = normalize(targetDept).toLowerCase();
return people.filter((p) => normalize(p.department).toLowerCase() === targetNorm);
}


