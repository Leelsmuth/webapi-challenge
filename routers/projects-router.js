const express = require("express");

const projects = require("../data/helpers/projectModel");
const router = express.Router();

// GET to /projects
router.get("/", (req, res) => {
  projects
    .get()
    .then(getProjects => {
      res.status(200).json(getProjects);
    })
    .catch(error => {
      res.status(500).json({ message: "failed to get projects" });
    });
});

// GET w/ dynamic id to projects/:id
router.get("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;

  projects
    .get(id)
    .then(getProject => {
      res.status(200).json(getProject);
    })
    .catch(error => {
      res.status(500).json({ message: "failed to get projects" });
    });
});

// GET w/ dynamic project id and the actions for that particular project
router.get("/actions/:id", (req, res) => {
  const { id } = req.params;
  projects
    .getProjectActions(id)
    .then(projectActions => {
      if (projectActions.length === 0) {
        res.status(404).json({ message: "No actions for that project" });
      }
      res.status(200).json(projectActions);
    })
    .catch(error => {
      res.status(500).json({ message: "failed to get project actions" });
    });
});

router.post("/", validateProject, (req, res) => {
  const body = req.body;
  projects
    .insert(body)
    .then(success => {
      res.status(200).json(success);
    })
    .catch(error => {
      res.status(500).json({ message: "failed to add project" });
    });
});

router.put("/:id", validateProject, validateProjectId, (req, res) => {
  const { id } = req.params;
  const body = req.body;
  projects
    .update(id, body)
    .then(success =>
      res.status(200).json({ message: `project updated for id ${id}` })
    )
    .catch(error =>
      res.status(500).json({ message: "failed to update project" })
    );
});

router.delete("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  projects
    .remove(id)
    .then(count =>
      res.status(200).json({ message: `project deleted for id ${id}` })
    )
    .catch(error =>
      res.status(500).json({ message: "failed to delete project" })
    );
});

// middleware functions
// name and description required
function validateProject(req, res, next) {
  let project = req.body;

  if (!project) {
    res.status(400).json({ message: "project data not found" });
  } else if (!project.name) {
    res.status(400).json({ message: "name is required" });
  } else if (!project.description) {
    res.status(400).json({ message: "description is required" });
  }
  next();
}

function validateProjectId(req, res, next) {
  const { id } = req.params;
  projects
    .get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({ message: "project id not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "failed validation req" });
    });
}

module.exports = router;
