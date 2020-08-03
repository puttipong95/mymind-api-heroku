const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load model
const Activity = require("../../models/Activity");
const User = require("../../models/User");

// Load Validation
const validateActivityInput = require("../../validation/activity");

// @route Get /api/activities/test
// @desc Test posts route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Activity Work" }));

// @route Post /api/activities
// @desc add posts route
// @access Private
router.post(
  "",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateActivityInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    const newActivity = new Activity({
      user_id: req.user.id,
      subject: req.body.subject,
      type: req.body.type,
      goal: req.body.goal,
      date: req.body.date,
      duration: req.body.duration,
    });

    newActivity.save().then((activity) => res.json(activity));
  }
);

// @route Get /api/activities
// @desc Get posts
// @access Public
router.get("/", (req, res) => {
  Activity.find()
    .sort({ date: -1 })
    .then((activity) => res.json(activity))
    .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
});

// @route Get /api/activities/:id
// @desc Get post by id
// @access Public
router.get("/:id", (req, res) => {
  Activity.findById(req.params.id)
    .sort({ date: -1 })
    .then((activity) => res.json(activity))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No post found with id" })
    );
});

// @route Put /api/activities/:id
// @desc Update activity by id
// @access Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateActivityInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }

    Activity.findById(req.params.id)
      .then((activity) => {
        activity_user_id = activity.user_id;
        user_id = req.user.id;
        if (activity_user_id == user_id) {
          // Update
          activityFlied = {};
          activityFlied.user_id = req.user.id;
          activityFlied.subject = req.body.subject;
          activityFlied.type = req.body.type;
          activityFlied.goal = req.body.goal;
          activityFlied.date = req.body.date;
          activityFlied.duration = req.body.duration;

          activityData = Activity.findByIdAndUpdate(
            req.params.id,
            { $set: { subject: "Naomi" } },
            { new: true },
            (err, doc) => {
              if (err) {
                res.send("Something wrong when updating data!");
              }
              res.send(doc);
            }
          );
          return res.json(activityData);
        } else {
          res.json({ success: false, message: "User invalid!" });
        }
      })
      .catch((err) =>
        res.status(404).json({ postnotfound: "No activity found" })
      );
  }
);

// @route    Post api/profile
// @decs     Create or update user profile
// @access   Private
router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    // Build project object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social network
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({
        user: req.user.id,
      });

      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          {
            user: req.user.id,
          },
          {
            $set: profileFields,
          },
          {
            new: true,
          }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route Delete /api/activities/:id
// @desc Delete post by id
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Activity.findById(req.params.id)
      .then((activity) => {
        activity_user_id = activity.user_id;
        user_id = req.user.id;
        if (activity_user_id == user_id) {
          // Delete
          activity.remove().then(() => res.json({ success: true }));
        } else {
          res.json({ success: false, message: "User invalid!" });
        }
      })
      .catch((err) =>
        res.status(404).json({ postnotfound: "No activity found" })
      );
  }
);

module.exports = router;
