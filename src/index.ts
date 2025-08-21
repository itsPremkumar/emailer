import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { filterByDepartment, loadPeopleFromXlsx } from './excel';
import { sendBulk } from './email';
import { Person } from './types';
import { prompt, logHr, dedupeBy } from './utils';

async function main() {
  // Predefined message configuration
  const defaultConfig = {
    // Use relative path to recipients.xlsx inside project root
    file: 'recipients.xlsx',

    dept: 'Computer Science',
    subject: 'message for testing promotion',
    message: 'prem now you rereived message?'
  };

  const argv = await yargs(hideBin(process.argv))
    .option('file', { type: 'string', describe: 'Path to Excel .xlsx file', default: defaultConfig.file })
    .option('dept', { type: 'string', describe: 'Target department', default: defaultConfig.dept })
    .option('subject', { type: 'string', describe: 'Email subject', default: defaultConfig.subject })
    .option('message', { type: 'string', describe: 'Email message (plain text)', default: defaultConfig.message })
    .strict(false)
    .parse();

  const file = argv.file;
  const dept = argv.dept;
  const subject = argv.subject;
  const message = argv.message;

  console.log('Using configuration:');
  console.log(`File: ${file}`);
  console.log(`Department: ${dept}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);

  if (!file || !dept || !subject || !message) {
    throw new Error('file, dept, subject, and message are required.');
  }

  logHr('Reading Excel');
  const peopleAll = loadPeopleFromXlsx(file);
  const peopleUnique = dedupeBy(peopleAll, (p) => p.email.toLowerCase());

  if (peopleUnique.length === 0) {
    console.error('No valid rows found in the Excel file (need Name, Department, Email with valid email).');
    process.exit(1);
  }

  const targets = filterByDepartment(peopleUnique, dept);
  if (targets.length === 0) {
    console.error(`No recipients found for department: "${dept}". Check spelling/case.`);
    process.exit(2);
  }

  logHr('Targeted Recipients');
  for (const t of targets) {
    console.log(`${t.name} <${t.email}> – ${t.department}`);
  }
  console.log(`\nTotal targeted: ${targets.length}`);

  logHr('Sending Emails');
  const results = await sendBulk(targets, subject, message);

  const successes = results.filter((r) => r.success);
  const failures = results.filter((r) => !r.success);

  console.log(`\n✅ Sent: ${successes.length}`);
  console.log(`❌ Failed: ${failures.length}`);

  if (failures.length > 0) {
    console.log('\n--- Failures ---');
    for (const f of failures) {
      console.log(`${f.person.email}: ${f.error}`);
    }
  }
}

main().catch(console.error);
