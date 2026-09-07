import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());
// Vercel rewrites can invoke this handler with either /api/... or the stripped /... path.
app.use((req, res, next) => {
  if (
    !req.url.startsWith("/api/") &&
    /^\/(auth|complaints|admin|staff|notifications|feedback|announcements)(\/|\?|$)/.test(
      req.url,
    )
  )
    req.url = "/api" + req.url;
  next();
});
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    studentId: String,
    employeeId: String,
    department: String,
    password: String,
    role: {
      type: String,
      enum: ["student", "admin", "staff"],
      default: "student",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const fileSchema = new mongoose.Schema(
  { filename: String, mimetype: String, size: Number, data: Buffer },
  { _id: true },
);
const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true },
    title: String,
    description: String,
    category: String,
    department: String,
    priority: { type: String, default: "Medium" },
    status: { type: String, default: "PENDING" },
    location: String,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachments: [fileSchema],
    resolutionProof: fileSchema,
    comments: [
      {
        author: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: Date,
    closedAt: Date,
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema),
  Complaint = mongoose.model("Complaint", complaintSchema);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (r, f, c) => c(null, /image|pdf|document/.test(f.mimetype)),
});
function fileRecord(file) {
  return file
    ? {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        data: file.buffer,
      }
    : null;
}
const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const Announcement = mongoose.model("Announcement", announcementSchema);
const auth =
  (roles = []) =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const p = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      req.user = await User.findById(p.id).select("-password");
      if (roles.length && !roles.includes(req.user.role))
        return res.status(403).json({ message: "Forbidden" });
      next();
    } catch (e) {
      res.status(401).json({ message: "Please sign in" });
    }
  };
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, studentId, department } = req.body;
    if (!name || !email || !password || !studentId || !department)
      return res
        .status(400)
        .json({
          message:
            "Name, email, student ID, department, and password are required",
        });
    const user = await User.create({
      name,
      email,
      phone,
      studentId,
      department,
      role: "student",
      password: await bcrypt.hash(password, 10),
    });
    res.json({
      token: jwt.sign({ id: user.id }, process.env.JWT_SECRET || "dev-secret"),
      user: { ...user.toObject(), password: undefined },
    });
  } catch (e) {
    res
      .status(400)
      .json({
        message: e.code === 11000 ? "Email already registered" : e.message,
      });
  }
});
app.post("/api/admin/students", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, phone, studentId, department } = req.body;
    if (!name || !email || !password || !studentId || !department)
      return res
        .status(400)
        .json({
          message:
            "Name, email, password, student ID, and department are required",
        });
    const user = await User.create({
      name,
      email,
      phone,
      studentId,
      department,
      role: "student",
      password: await bcrypt.hash(password, 10),
    });
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (e) {
    res
      .status(400)
      .json({
        message: e.code === 11000 ? "Email already registered" : e.message,
      });
  }
});
app.get("/api/admin/students", auth(["admin"]), async (req, res) =>
  res.json(
    await User.find({ role: "student" }).select("-password").sort("-createdAt"),
  ),
);
app.delete("/api/admin/students/:id", auth(["admin"]), async (req, res) => {
  const user = await User.findOneAndDelete({
    _id: req.params.id,
    role: "student",
  });
  if (!user) return res.status(404).json({ message: "Student not found" });
  res.json({ ok: true });
});
app.post("/api/auth/login", async (req, res) => {
  const u = await User.findOne({ email: req.body.email });
  if (!u || !(await bcrypt.compare(req.body.password, u.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({
    token: jwt.sign({ id: u.id }, process.env.JWT_SECRET || "dev-secret"),
    user: { ...u.toObject(), password: undefined },
  });
});
app.get("/api/auth/me", auth(), (req, res) => res.json(req.user));
app.post(
  "/api/complaints",
  auth(["student"]),
  upload.array("attachments", 3),
  async (req, res) => {
    const n = await Complaint.countDocuments();
    const c = await Complaint.create({
      ...req.body,
      complaintId: `CMP-${new Date().getFullYear()}-${String(n + 1).padStart(5, "0")}`,
      submittedBy: req.user._id,
      attachments: (req.files || []).map(fileRecord),
    });
    res.status(201).json(c);
  },
);
app.get("/api/complaints/my", auth(["student"]), async (req, res) =>
  res.json(
    await Complaint.find({ submittedBy: req.user._id })
      .sort("-createdAt")
      .populate("assignedTo", "name"),
  ),
);
app.get("/api/complaints/:id", auth(), async (req, res) =>
  res.json(
    await Complaint.findOne({
      $or: [{ _id: req.params.id }, { complaintId: req.params.id }],
    }).populate("submittedBy assignedTo", "name email department"),
  ),
);
app.get("/api/complaints/:id/attachments/:fileId", auth(), async (req, res) => {
  const c = await Complaint.findOne({
    $or: [{ _id: req.params.id }, { complaintId: req.params.id }],
  }).populate("submittedBy assignedTo", "_id");
  if (!c) return res.status(404).json({ message: "Complaint not found" });
  const allowed =
    req.user.role === "admin" ||
    String(c.submittedBy?._id) === String(req.user._id) ||
    String(c.assignedTo?._id) === String(req.user._id);
  if (!allowed) return res.status(403).json({ message: "Forbidden" });
  const file = c.attachments.id(req.params.fileId);
  if (!file) return res.status(404).json({ message: "Attachment not found" });
  res.set("Content-Type", file.mimetype);
  res.set("Content-Disposition", `inline; filename="${file.filename}"`);
  res.send(file.data);
});
app.get("/api/admin/complaints", auth(["admin"]), async (req, res) =>
  res.json(
    await Complaint.find()
      .sort("-createdAt")
      .populate("submittedBy assignedTo", "name email department"),
  ),
);
app.put("/api/admin/complaints/:id", auth(["admin"]), async (req, res) =>
  res.json(
    await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  ),
);
app.delete("/api/admin/complaints/:id", auth(["admin"]), async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
app.get("/api/staff/complaints", auth(["staff"]), async (req, res) =>
  res.json(
    await Complaint.find({ assignedTo: req.user._id }).sort("-createdAt"),
  ),
);
app.put("/api/staff/complaints/:id", auth(["staff"]), async (req, res) =>
  res.json(
    await Complaint.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user._id },
      { $set: req.body },
      { new: true },
    ),
  ),
);
app.post("/api/complaints/:id/comments", auth(), async (req, res) =>
  res.json(
    await Complaint.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { author: req.user.name, text: req.body.text } } },
      { new: true },
    ),
  ),
);
app.get("/api/admin/statistics", auth(["admin"]), async (req, res) => {
  const all = await Complaint.find();
  const count = (s) => all.filter((x) => x.status === s).length;
  res.json({
    total: all.length,
    pending: count("PENDING"),
    inProgress: count("IN PROGRESS"),
    resolved: count("RESOLVED"),
    closed: count("CLOSED"),
    rejected: count("REJECTED"),
  });
});
app.get("/api/admin/stats", auth(["admin"]), async (req, res) => {
  const all = await Complaint.find();
  res.json({
    total: all.length,
    pending: all.filter((x) => x.status === "PENDING").length,
    inProgress: all.filter(
      (x) => x.status === "IN_PROGRESS" || x.status === "IN PROGRESS",
    ).length,
    resolved: all.filter((x) => x.status === "RESOLVED").length,
  });
});
app.get("/api/complaints/stats", auth(["student"]), async (req, res) => {
  const all = await Complaint.find({ submittedBy: req.user._id });
  res.json({
    total: all.length,
    pending: all.filter((x) => x.status === "PENDING").length,
    inProgress: all.filter(
      (x) => x.status === "IN_PROGRESS" || x.status === "IN PROGRESS",
    ).length,
    resolved: all.filter((x) => x.status === "RESOLVED").length,
  });
});
app.get("/api/announcements", auth(), async (req, res) =>
  res.json(
    await Announcement.find({ isActive: true })
      .sort("-createdAt")
      .limit(20)
      .select("-createdBy"),
  ),
);
app.post("/api/admin/announcements", auth(["admin"]), async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message)
    return res.status(400).json({ message: "Title and message are required" });
  res
    .status(201)
    .json(
      await Announcement.create({ title, message, createdBy: req.user._id }),
    );
});
app.delete(
  "/api/admin/announcements/:id",
  auth(["admin"]),
  async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  },
);
let connection;
let databaseReady = false;
async function connectDatabase() {
  if (connection) return connection;
  connection = mongoose.connect(
    process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/resolvex",
  );
  return connection;
}
export { app, connectDatabase };
app.get("/api/health", (req, res) =>
  res
    .status(databaseReady ? 200 : 503)
    .json({
      ok: databaseReady,
      database: databaseReady ? "connected" : "unavailable",
    }),
);
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 5000);
  const listener = app.listen(port, () =>
    console.log(`ResolveX API listening on http://localhost:${port}`),
  );
  listener.on("error", (error) => {
    if (error.code === "EADDRINUSE")
      console.warn(
        `ResolveX API could not bind port ${port}; another local API is already running.`,
      );
    else console.error("ResolveX API listener error:", error);
  });
  connectDatabase()
    .then(() => {
      databaseReady = true;
      console.log("MongoDB connected");
    })
    .catch((error) =>
      console.error("MongoDB connection failed:", error.message),
    );
}
