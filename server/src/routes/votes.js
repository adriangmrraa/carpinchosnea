const express = require('express');
const { resolveUser } = require('../utils/user');

const router = express.Router();

// POST /api/projects/:id/vote
router.post('/:id/vote', async (req, res) => {
  try {
    const projectId = String(req.params.id);
    const { id: userId } = resolveUser(req);
    let value = Number(req.body?.value);
    if (![ -1, 0, 1 ].includes(value)) return res.status(400).json({ message: "invalid_vote_value" });

    const db = require('../db/lowdb').db;
    await db.read();
    db.data ||= {}; db.data.projects ||= []; db.data.votes ||= [];

    const project = db.data.projects.find(p => p.id === projectId);
    if (!project) return res.status(404).json({ message: "project_not_found" });

    const idx = db.data.votes.findIndex(v => v.userId === userId && v.projectId === projectId);
    if (idx >= 0) {
      if (db.data.votes[idx].value === value) {
        // mismo voto → devolver estado actual
      } else {
        db.data.votes[idx].value = value;
      }
    } else {
      db.data.votes.push({ id: `${userId}_${projectId}`, userId, projectId, value });
    }

    // score
    const score = db.data.votes
      .filter(v => v.projectId === projectId)
      .reduce((acc, v) => acc + Number(v.value||0), 0);

    await db.write();
    return res.json({ score: Number(score||0), myVote: Number(value||0) });
  } catch (e) {
    console.error("[vote]", e);
    return res.status(500).json({ message: "vote_failed" });
  }
});

module.exports = router;