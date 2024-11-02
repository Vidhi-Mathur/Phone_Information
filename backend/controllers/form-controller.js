const Form = require("../models/form-model");
const ExcelJS = require("exceljs")

exports.createForm = async(req, res, next) => {
    try {
        const { formType, name, countryCode, phone } = req.body;
        await Form.create({ 
            formType,
            name,
            countryCode, 
            phone 
        })
        res.status(200).json({ message: "Information stored successfully" })
    }
    catch(err){
        next(err)
    }
}

exports.getExcelSheet = async(req, res, next) => {
    try {
        const formsData = await Form.findAll(); 
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Forms Data');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Form Type', key: 'formType', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Country Code', key: 'countryCode', width: 10 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
        ];
        formsData.forEach((form) => worksheet.addRow(form.toJSON()));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=forms_data.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } 
    catch(err){
        next(err)
    }
}