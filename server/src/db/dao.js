const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const file = path.join(__dirname, 'data.json');
const adapter = new JSONFile(file);
const defaultData = {
  users: [],
  projects: [],
  votes: [],
  _meta: { seededAt: null, version: 1 }
};
const db = new Low(adapter, defaultData);

async function initDb() {
  await db.read();
  if (!db.data._meta) {
    db.data = defaultData;
    await db.write();
  }
}

async function getUserByUsername(username) {
  await db.read();
  return db.data.users.find(u => u.username === username);
}

async function createOrGetUser(username) {
  let user = await getUserByUsername(username);
  if (!user) {
    user = {
      id: `u_${uuidv4()}`,
      username: username.trim(),
      createdAt: new Date().toISOString()
    };
    db.data.users.push(user);
    await db.write();
  }
  return user;
}

async function listProjects({ search = '', sort = 'recent', page = 1, pageSize = 10, userId = null }) {
  await db.read();
  let projects = [...db.data.projects];

  // Filter by search
  if (search) {
    const lowerSearch = search.toLowerCase();
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(lowerSearch) ||
      p.author.username.toLowerCase().includes(lowerSearch)
    );
  }

  // Add author and score
  projects = projects.map(p => {
    const author = db.data.users.find(u => u.id === p.authorId);
    const score = computeScore(p.id);
    const myVote = userId ? getVoteValue(userId, p.id) : null;
    return { ...p, author, score, myVote };
  });

  // Sort
  if (sort === 'top') {
    projects.sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Paginate
  const total = projects.length;
  const start = (page - 1) * pageSize;
  const items = projects.slice(start, start + pageSize);

  return { items, page, pageSize, total };
}

async function getProjectById(id, userId = null) {
  await db.read();
  const project = db.data.projects.find(p => p.id === id);
  if (!project) return null;

  const author = db.data.users.find(u => u.id === project.authorId);
  const score = computeScore(id);
  const myVote = userId ? getVoteValue(userId, id) : null;
  return { ...project, author, score, myVote };
}

async function createProject({ title, summary, body, authorId }) {
  // Validate
  title = title.trim();
  summary = summary.trim();
  body = body.trim();
  if (!title || title.length > 120 || !summary || summary.length > 300) {
    throw new Error('Invalid project data');
  }

  // Check duplicate title by same author
  await db.read();
  const existing = db.data.projects.find(p => p.authorId === authorId && p.title === title);
  if (existing) {
    throw new Error('Duplicate title by same author');
  }

  const project = {
    id: `p_${uuidv4()}`,
    title,
    summary,
    body,
    authorId,
    createdAt: new Date().toISOString()
  };
  db.data.projects.push(project);
  await db.write();
  return project;
}

function getVoteValue(userId, projectId) {
  const vote = db.data.votes.find(v => v.userId === userId && v.projectId === projectId);
  return vote ? vote.value : 0;
}

async function getVote({ userId, projectId }) {
  await db.read();
  return db.data.votes.find(v => v.userId === userId && v.projectId === projectId);
}

async function setVote({ userId, projectId, value }) {
  if (![1, -1, 0].includes(value)) throw new Error('Invalid vote value');

  // Check if author
  await db.read();
  const project = db.data.projects.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found');
  if (project.authorId === userId) throw new Error('Cannot vote on own project');

  let vote = db.data.votes.find(v => v.userId === userId && v.projectId === projectId);
  if (value === 0) {
    if (vote) {
      db.data.votes = db.data.votes.filter(v => v !== vote);
    }
  } else {
    if (vote) {
      vote.value = value;
    } else {
      vote = {
        id: `v_${uuidv4()}`,
        userId,
        projectId,
        value
      };
      db.data.votes.push(vote);
    }
  }
  await db.write();
  return { score: computeScore(projectId), myVote: value };
}

function computeScore(projectId) {
  const votes = db.data.votes.filter(v => v.projectId === projectId);
  return votes.reduce((sum, v) => sum + v.value, 0);
}

async function getUserById(id) {
  await db.read();
  return db.data.users.find(u => u.id === id);
}

module.exports = {
  initDb,
  getUserByUsername,
  createOrGetUser,
  getUserById,
  listProjects,
  getProjectById,
  createProject,
  getVote,
  setVote,
  computeScore
};