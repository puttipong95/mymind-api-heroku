const express = require("express");
const router = express.Router();

// Load Chart model
const Chart = require("../../models/Chart");

// @route   GET api/charts/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Charts Works" }));

// @route   POST api/charts
// @desc    Add chart
// @access  Public
router.post("/", (req, res) => {
  const newChart = new Chart({
    code: req.body.code,
    name: req.body.name,
    statusChart: req.body.statusChart,
    province: req.body.province,
    map: req.body.map,
    orther: req.body.orther,
    status: req.body.status,
  });

  newChart
    .save()
    .then((chart) => res.json(chart))
    .catch((err) => console.log(err));
});

// @route   GET api/charts
// @desc    Return charts
// @access  Public
router.get("/", (req, res) => {
  Chart.find()
    .then((charts) => res.json(charts))
    .catch((err) => res.status(404).json({ error: err }));
});

// @route   GET api/charts/:id
// @desc    Return a chart
// @access  Public
router.get("/:id", (req, res) => {
  Chart.findById(req.params.id)
    .then((chart) => res.json(chart))
    .catch((err) => res.status(404).json({ error: err }));
});

// @route   GET api/charts/:name/:province/:code
// @desc    Return a chart
// @access  Public
router.get("/:name/:province/:code", (req, res) => {
  Chart.find({
    name: req.params.name,
    province: req.params.province,
    code: req.params.code,
  }).then((chart) => res.json(chart));
});

// @route    Post api/charts
// @decs     update chart
// @access   Public
router.put("/edit/:id", async (req, res) => {
  const { code, name, statusChart, province, orther, map, status } = req.body;

  // Build project object
  const chartFields = {};

  chartFields.code = code;
  chartFields.name = name;
  chartFields.statusChart = statusChart;
  chartFields.province = province;
  chartFields.orther = orther;
  chartFields.map = map;
  chartFields.status = status;

  chart = await Chart.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: chartFields,
    },
    {
      new: true,
    }
  ).catch((err) => res.send(err));

  return res.json(chart);
});

// @route   GET api/charts
// @desc    Delete chart
// @access  Public
router.delete("/:id", (req, res) => {
  Chart.findById(req.params.id)
    .then((activity) => {
      activity.remove().then(() => res.json({ success: true }));
    })
    .catch((err) => res.status(404).json({ error: err }));
});

module.exports = router;
