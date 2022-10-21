"use strict";

const app = require("express").Router();
let SessionService = require("../../services/SessionService");
const db = require("../../models/index");

const role = 1;

const TerminateDb = db.sequelize.define("terminate_configuration", {
  message: {
    type: db.Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  countdown: {
    type: db.Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
});

app.get(
  "/admin/terminate",
  SessionService.verifySessionMiddleware(role, "admin"),
  async function (req, res, next) {
    TerminateDb.findOne({
      where: {
        id: 0,
      },
    })
      .then((data) => {
        return res.render("admin/Terminate_Handler", {
          get_page_name: () => "Terminate_Handler",
          _base_url: "/admin/terminate",
          countdown: data.countdown,
          message: data.message,
        });
      })
      .catch((error) => {
        console.error("Failed to retrieve data : ", error);
      });
  }
);
app.get("/terminate-data", async function (req, res, next) {
  TerminateDb.findOne({
    where: {
      id: 0,
    },
  })
    .then((data) => {
      return res.send({
        success: true,
        message: "countdown data fetched successfully",
        payload: {
          countdown: data.countdown,
          message: data.message,
        },
      });
    })
    .catch((error) => {
      console.error("Failed to retrieve data : ", error);
    });
});

app.post(
  "/admin/edit-terminate-payload",
  SessionService.verifySessionMiddleware(role, "admin"),
  async function (req, res) {
    const { countdown, message } = req.body;
    console.log("hello", !countdown && !message);
    if (!countdown && !message)
      return res.status(404).json({
        success: false,
        message: "either countdown or message is required",
      });
    // const y = await TerminateDb.find;
    TerminateDb.update(
      {
        ...req.body,
      },
      {
        where: {
          id: 0,
        },
      }
    )
      .then((data) => {
        return res.redirect("/admin/terminate");
      })
      .catch((error) => {
        console.error("Failed to retrieve data : ", error);
      });
  }
);

module.exports = app;
