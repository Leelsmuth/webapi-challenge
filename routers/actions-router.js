const express = require("express");

const projects = require("../data/helpers/projectModel");
const actions = require("../data/helpers/actionModel");

const router = express.Router();

// GET to /actions

router.get("/", (req, res) => {
  actions
    .get()
    .then(getActions => {
      // getprojs
      // compare projs
      // return those in both lists
      res.status(200).json(getActions);
    })
    .catch(error => {
      res.status(500).json({ message: "failed to get actions" });
    });
});

// GET w/ dynamic id to actions/:id

router.get("/:id", validateActionId, (req, res) => {
  const { id } = req.params;

  actions
    .get(id)
    .then(getAction => {
      res.status(200).json(getAction);
    })
    .catch(error => {
      res.status(500).json({ message: "failed to get action" });
    });
});

// POST to /actions

router.post(
  "/",
  validateActions,
  validateDescLength,
  validateExistingProjectId,
  (req, res) => {
    const body = req.body;
    actions
      .insert(body)
      .then(success => {
        res.status(200).json(success);
      })
      .catch(error => {
        res.status(500).json({ message: "failed to add action" + error });
      });
  }
);

// PUT to /actions/:id

router.put(
  "/:id",
  validateActions,
  validateActionId,
  validateDescLength,
  validateExistingProjectId,
  (req, res) => {
    const { id } = req.params;
    const body = req.body;
    actions
      .update(id, body)
      .then(success =>
        res.status(200).json({ message: `action updated for id ${id}` })
      )
      .catch(error =>
        res.status(500).json({ message: "failed to update action" })
      );
  }
);

// DELETE to /actions/:id

router.delete("/:id", validateActionId, (req, res) => {
  const { id } = req.params;
  actions
    .remove(id)
    .then(count =>
      res.status(200).json({ message: `action deleted for id ${id}` })
    )
    .catch(error =>
      res.status(500).json({ message: "failed to delete action" })
    );
});

// middleware functions
// Required Fields:

// project_id (must be id of existing project)
// description (up to 128 characters long)
// notes

function validateDescLength(req, res, next) {
  const { description } = req.body;
  if (description.length > 128) {
    res
      .status(400)
      .json({ message: "description length can only be up to 128 characters" });
  } else {
    next();
  }
}

function validateActions(req, res, next) {
  let user = req.body;

  if (!user) {
    res.status(400).json({ message: "action data not found" });
  } else if (!user.project_id) {
    res.status(400).json({ message: "project id is required" });
  } else if (!user.description) {
    res.status(400).json({ message: "description is required" });
  } else if (!user.notes) {
    res.status(400).json({ message: "notes is required" });
  }
  next();
}

function validateActionId(req, res, next) {
  const { id } = req.params;
  actions
    .get(id)
    .then(actionID => {
      if (actionID) {
        next();
      } else {
        res.status(400).json({ message: "action id not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "failed validation request" });
    });
}

// use getProjectActions() to get project id ?
function validateExistingProjectId(req, res, next) {
  const { id } = req.body.project_id;
  projects
    .get(id)
    .then(projectId => {
      if (projectId) {
        next();
      } else {
        res.status(400).json({ message: "project id does not exist" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "failed validation request" });
    });
}

module.exports = router;
