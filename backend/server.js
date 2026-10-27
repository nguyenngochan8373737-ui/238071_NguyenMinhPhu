require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gender: String,
  dateOfBirth: String,
  department: String,
  position: String,
  email: { type: String, required: true },
  phone: String,
  hireDate: String,
  status: String
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "HR Backend is running" });
});

app.get("/api/employees", async (req, res) => {
  try {
    const search = req.query.search;
    const filter = search ? {
      $or: [
        { employeeId: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } }
      ]
    } : {};
    res.json(await Employee.find(filter));
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách nhân viên" });
  }
});

app.get("/api/employees/:id", async (req, res) => {
  try {
    const conditions = [{ employeeId: req.params.id }];
    if (mongoose.isValidObjectId(req.params.id)) {
      conditions.push({ _id: req.params.id });
    }
    const employee = await Employee.findOne({ $or: conditions });
    if (!employee) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: "Mã nhân viên, họ tên và email là bắt buộc" });
    }
    const employee = await Employee.create(req.body);
    res.status(201).json({ message: "Thêm thành công", employee });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Mã nhân viên đã tồn tại" });
    res.status(400).json({ message: "Không thể thêm nhân viên", error: err.message });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    const conditions = [{ employeeId: req.params.id }];
    if (mongoose.isValidObjectId(req.params.id)) conditions.push({ _id: req.params.id });
    const employee = await Employee.findOneAndUpdate(
      { $or: conditions }, req.body, { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json({ message: "Cập nhật thành công", employee });
  } catch (err) {
    res.status(400).json({ message: "Không thể cập nhật", error: err.message });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  try {
    const conditions = [{ employeeId: req.params.id }];
    if (mongoose.isValidObjectId(req.params.id)) conditions.push({ _id: req.params.id });
    const employee = await Employee.findOneAndDelete({ $or: conditions });
    if (!employee) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa nhân viên" });
  }
});

async function start() {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("YOUR_MONGODB_CONNECTION_STRING")) {
      throw new Error("Hãy cấu hình MONGODB_URI trong file .env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "238071_NguyenMinhPhu"
    });

    console.log("MongoDB Atlas connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Backend startup error:", err.message);
    process.exit(1);
  }
}

start();
