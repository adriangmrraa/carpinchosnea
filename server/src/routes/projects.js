const express = require('express');
const { resolveUser } = require('../utils/user');

const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { search = '', sort = 'recent', page = 1, pageSize = 12, authorId } = req.query;
    const p = parseInt(page) || 1, ps = parseInt(pageSize) || 12;

    // Direct implementation since dao is complex
    const db = require('../db/lowdb').db;
    await db.read();
    let items = (db.data?.projects || []).slice();

    if (authorId) items = items.filter(x => x.authorId === String(authorId));

    if (search) {
      const s = String(search).toLowerCase();
      items = items.filter(x =>
        (x.title||"").toLowerCase().includes(s) ||
        (x.summary||"").toLowerCase().includes(s) ||
        (x.author?.username||"").toLowerCase().includes(s)
      );
    }

    // score calculado rápido
    const votes = db.data?.votes || [];
    const scoreMap = votes.reduce((acc,v)=>{
      acc[v.projectId]=(acc[v.projectId]||0)+(Number(v.value)||0); return acc;
    }, {});
    items = items.map(x => ({ ...x, score: scoreMap[x.id]||0 }));

    if (sort === "top") items.sort((a,b)=>(b.score||0)-(a.score||0));
    else items.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));

    const total = items.length;
    const start = (p-1)*ps;
    const pageItems = items.slice(start, start+ps);

    return res.json({ items: pageItems, page: p, pageSize: ps, total });
  } catch (e) {
    console.error("[list_projects]", e);
    return res.status(500).json({ message: "list_projects_failed" });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const { title="", summary="", body="" } = req.body || {};
    const { id: userId, username } = resolveUser(req);

    const db = require('../db/lowdb').db;
    await db.read();
    if (!db.data) db.data = {};
    db.data.projects ||= [];
    db.data.votes ||= [];

    const project = {
      id: "p_" + require('nanoid').nanoid(8),
      title: String(title),
      summary: String(summary),
      body: String(body),
      authorId: userId,
      author: { id: userId, username },
      createdAt: new Date().toISOString()
    };

    db.data.projects.push(project);
    await db.write();

    return res.json(project);
  } catch (e) {
    console.error("[create_project]", e);
    return res.status(500).json({ message: "create_project_failed" });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = resolveUser(req);

    const db = require('../db/lowdb').db;
    await db.read();
    const project = db.data?.projects?.find(p => p.id === id);
    if (!project) return res.status(404).json({ message: "project_not_found" });

    // score and myVote
    const votes = db.data?.votes || [];
    const score = votes.filter(v => v.projectId === id).reduce((acc, v) => acc + Number(v.value||0), 0);
    const myVote = votes.find(v => v.userId === userId && v.projectId === id)?.value || 0;

    return res.json({ ...project, score, myVote });
  } catch (e) {
    console.error("[get_project]", e);
    return res.status(500).json({ message: "get_project_failed" });
  }
});

module.exports = router;