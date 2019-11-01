const express = require("express");

const projects = require("../data/helpers/projectModel");
const actions = require("../data/helpers/actionModel");

const router = express.Router();

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
  if (!req.body) {
    res.status(400).json({ message: "action data not found" });
  } else if (!req.body.project_id) {
    res.status(400).json({ message: "project id is required" });
  } else if (!req.body.description) {
    res.status(400).json({ message: "description is required" });
  } else if (!req.body.notes) {
    res.status(400).json({ message: "notes is required" });
  }
  next();
}

function validateActionId(req, res, next) {
  const { id } = req.params;
  actions
    .get(id)
    .then(actionID => {
      console.log("action id validation success", actionID);
      if (actionID) {
        next();
      } else {
        res.status(400).json({ message: "action id not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "failed validation request" });
    });
}

// use getProjectActions() to get project id ?
function validateExistingProjectId(req, res, next) {
  const { id } = req.body.project_id;
  projects
    .get(id)
    .then(projectId => {
      console.log("project id exists", projectId);
      if (projectId) {
        next();
      } else {
        res.status(400).json({ message: "project id does not exist" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "failed validation request" });
    });
}

module.exports = router;
