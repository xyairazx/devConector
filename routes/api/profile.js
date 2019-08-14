const express = require("express");
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const ProfileModel = require("../../models/Profile");
const UserModel = require("../../models/User");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id }).populate(
      "user",
      ["firstName", "lastName", "avatar"]
    );
    console.log(profile);
    if (!profile) {
      return res.status(400).json({ msg: "There in no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is require")
        .not()
        .isEmpty(),
      check("skills", "Skills is require")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    let profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await ProfileModel.findOne({ user: req.user.id });
      //update
      if (profile) {
        profile = await ProfileModel.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/allProfiles", async (req, res) => {
  try {
    const profiles = await ProfileModel.find().populate("user", [
      "firstName",
      "lastName",
      "avatar"
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.params.user_id
    }).populate("user", ["firstName", "lastName", "avatar"]);

    if (!profile)
      return res.status(400).json({ msg: "There is no profile for this user" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.put('/experience',
  [auth,
     [
      check("title", "Title is requierd").not().isEmpty(),
      check("company", "Company is requierd").not().isEmpty(),
      check("from", "From date is requierd").not().isEmpty(),

    ]],
  async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
          return res.status(400).json({error: error.array()});
      }

      const{
          title,
          company,
          location,
          from,
          to,
          current,
          description
      }=req.body;

      const newExp ={
        title,
        company,
        location,
        from,
        to,
        current,
        description
      }
    try {
        const profile = await ProfileModel.findOne({user : req.user.id});

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

router.delete("/experience/:exp_id", auth,async (req, res) => {
    try {
      const profile = await ProfileModel.findOne({user :req.user.id});

      const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex,1);

      await profile.save();

      res.json(profile);
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  });


  router.put('/education',[auth,
     [
      check("school", "School is requierd").not().isEmpty(),
      check("degree", "degree is requierd").not().isEmpty(),
      check("fieldofstudy", "field of study is requierd").not().isEmpty(),
      check("from", "From date is requierd").not().isEmpty(),
    ]],
        async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
          return res.status(400).json({error: error.array()});
      }

      const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      }=req.body;

      const newEduc ={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      }
    try {
        const profile = await ProfileModel.findOne({user : req.user.id});

        profile.education.unshift(newEduc);

        await profile.save();

        res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

  router.delete('/education/:educ_id',auth, async (req,res)=>{
      try {
          const profile = await ProfileModel.findOne({user : req.user.id});

          const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.educ_id);

          profile.education.splice(removeIndex,1);

          await profile.save();

          res.json(profile);

      } catch (err) {
          console.error(err.message);
          res.status(500).json('server error')
      }
  })

  router.get('/github/:username',(req,res)=>{
      try {
          const options ={
              uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=
              ${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
              method:'GET',
              headers:{'user-agent':'node.js'}
          };
          request(options,(error,response,body)=>{
              if (error) console.error(error);

              if(response.statusCode !=='200'){
                 return res.status(404).json({msg: 'no github account'});
              }

              res.json(JSON.parse(body));
          });
      } catch (err) {
          res.status(500).json('server error')
      };
  });
module.exports = router;
