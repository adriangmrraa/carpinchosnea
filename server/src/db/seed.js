const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const minimist = require('minimist');
const { users, generateProjects, generateVotes } = require('./seed-data');

const argv = minimist(process.argv.slice(2));
const reset = argv.reset;

const file = path.join(__dirname, 'data.json');
const adapter = new JSONFile(file);
const defaultData = {
  users: [],
  projects: [],
  votes: [],
  _meta: { seededAt: null, version: 1 }
};
const db = new Low(adapter, defaultData);

async function seed() {
  await db.read();

  if (reset || !db.data._meta.seededAt) {
    console.log(reset ? 'Resetting database...' : 'Seeding database...');

    const projects = generateProjects();
    const votes = generateVotes(projects, users);

    db.data = {
      users: [...users],
      projects: [...projects],
      votes: [...votes],
      _meta: {
        seededAt: new Date().toISOString(),
        version: 1
      }
    };

    await db.write();
    console.log('Database seeded successfully.');
  } else {
    console.log('Database already seeded. Use --reset to reseed.');
  }
}

seed().catch(console.error);