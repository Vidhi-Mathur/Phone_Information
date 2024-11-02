const express = require("express")
const router = express.Router()
const { createForm, getExcelSheet } = require("../controllers/form-controller")

//POST /
router.post("/", createForm)

//GET /excel - Generate excel sheet
router.get("/excel", getExcelSheet)

module.exports = router