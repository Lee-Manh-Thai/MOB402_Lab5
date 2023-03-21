const express = require("express");
const expressHbs = require("express-handlebars");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`The Web server on port ${PORT}`);
});

// #config HBS
app.engine(
  "hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("upload", {
    layout: "main",
  });
});

// EXERCISE 4 - LIMITS FILE SIZE
//      config Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "./uploads";

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    cb(null, path);
  },
  filename: (req, file, cb) => {
    let time = Date.now();
    cb(null, file.originalname.split(".").join("-" + time + "."));
  },
});

const uploadOne = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
}).single("avatar");

app.post("/upload_one", (req, res) => {

  uploadOne(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.render("upload", {
        layout: "main",
        notify: "Kích thước File lớn hơn 1MB",
      });
    } else if (err) {
      return res.render("upload", {
        layout: "main",
        notify: "File không xác định",
      });
    }

    const file = req.file;
    if (!file) {
      return res.render("upload", {
        layout: "main",
        notify: "Hãy chọn File cần upload",
      });
    }

    console.log(req.file);
    return res.render("upload", {
      layout: "main",
      notify: "Thành công",
    });
  });

});

// EXERCISE 5
//      config Multer
const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "./uploads_img";

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    cb(null, path);
  },
  filename: (req, file, cb) => {
    let time = Date.now();
    let fileName = file.originalname.split(".");
    let newFile = fileName[0] + "-" + time + ".jpeg";
    cb(null, newFile);
  },
});

const uploadMany = multer({
  storage: storageImage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype.includes("image/")) {
      return cb(null, true);
    } else {
      return cb(new Error("Chỉ có thể Upload Files ảnh"));
    }
  },
}).array("avatars", 3);

app.post("/upload_many", (req, res) => {

  uploadMany(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.render("upload", {
        layout: "main",
        notifies: "Tối đa 3 Files",
      });
    } else if (err) {
      return res.render("upload", {
        layout: "main",
        notifies: "Files không xác định",
      });
    }

    const files = req.files;
    if (files.length == 0) {
      return res.render("upload", {
        layout: "main",
        notifies: "Hãy chọn các Files cần upload",
      });
    }

    console.log(req.files);
    return res.render("upload", {
      layout: "main",
      notifies: "Thành công",
    });
  });

});
