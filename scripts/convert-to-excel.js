const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// مسار ملف البيانات
const dataPath = path.join(__dirname, './data/aleppo.pledges.json');
const outputPath = path.join(__dirname, './output/end.xlsx');

// إنشاء مجلد الإخراج إذا لم يكن موجوداً
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertToExcel() {
  try {
    console.log('🔄 start convert to excel...');
    
    // قراءة ملف البيانات
    console.log('📖 read data file...');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    
    // تحليل البيانات
    let pledges;
    try {
      // محاولة تحليل كـ JSON array
      pledges = JSON.parse(rawData);
      
      // إذا لم يكن array، تحويل إلى array
      if (!Array.isArray(pledges)) {
        pledges = [pledges];
      }
    } catch (error) {
      console.error('❌ error in parsing data file:', error.message);
      return;
    }
    
    console.log(`📊 found ${pledges.length} pledges`);
    
    // إنشاء workbook جديد
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('pledges');
    
    // إضافة headers
    console.log('📝 add headers...');
    worksheet.addRow([
      'number',
      'name',
      'phone number',
      'amount',
      'payment method',
      'pledge status',
      'created at',
      'updated at'
    ]);
    
    // تنسيق headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { 
      bold: true, 
      color: { argb: 'FFFFFFFF' },
      size: 12
    };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2E7D32' } // dark green
    };
    headerRow.alignment = { 
      horizontal: 'center', 
      vertical: 'middle' 
    };
    
    // add data
    console.log('📊 add data...');
    pledges.forEach((pledge, index) => {
      const row = worksheet.addRow([
        index + 1,
        pledge.fullName || 'غير محدد',
        pledge.phoneNumber || 'غير محدد',
        pledge.amount || 0,
        pledge.paymentMethod === 'received' ? 'مستلم' : 
        pledge.paymentMethod === 'pledged' ? 'متعهد' : 'غير محدد',
        pledge.pledgeStatus === 'confirmed' ? 'مؤكد' : 
        pledge.pledgeStatus === 'pending' ? 'معلق' : 'مرفوض',
        pledge.createdAt ? new Date(pledge.createdAt.$date || pledge.createdAt).toLocaleDateString('ar-SA') : 'غير محدد',
        pledge.updatedAt ? new Date(pledge.updatedAt.$date || pledge.updatedAt).toLocaleDateString('ar-SA') : 'غير محدد'
      ]);
      
      // تنسيق الصفوف
      row.alignment = { 
        horizontal: 'center', 
        vertical: 'middle' 
      };
      
      // تلوين الصفوف بالتناوب
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8F9FA' } // رمادي فاتح
        };
      }
    });
    
    // تنسيق الأعمدة
    console.log('🎨 format columns...');
    worksheet.columns.forEach((column, index) => {
      column.width = index === 0 ? 8 : index === 1 ? 20 : index === 2 ? 15 : index === 3 ? 12 : 15;
    });
    
    // add borders
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    // add statistics in separate worksheet
    console.log('📈 add statistics...');
    const statsWorksheet = workbook.addWorksheet('الإحصائيات');
    
    // حساب الإحصائيات
    const totalPledges = pledges.length;
    const confirmedPledges = pledges.filter(p => p.pledgeStatus === 'confirmed').length;
    const pendingPledges = pledges.filter(p => p.pledgeStatus === 'pending').length;
    const rejectedPledges = pledges.filter(p => p.pledgeStatus === 'rejected').length;
    const totalAmount = pledges.reduce((sum, p) => sum + (p.amount || 0), 0);
    const receivedAmount = pledges
      .filter(p => p.paymentMethod === 'received' && p.pledgeStatus === 'confirmed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // إضافة الإحصائيات
    statsWorksheet.addRow(['الإحصائيات', 'القيمة']);
    statsWorksheet.addRow(['إجمالي التبرعات', totalPledges]);
    statsWorksheet.addRow(['التبرعات المؤكدة', confirmedPledges]);
    statsWorksheet.addRow(['التبرعات المعلقة', pendingPledges]);
    statsWorksheet.addRow(['التبرعات المرفوضة', rejectedPledges]);
    statsWorksheet.addRow(['إجمالي المبلغ', totalAmount.toLocaleString()]);
    statsWorksheet.addRow(['المبلغ المستلم', receivedAmount.toLocaleString()]);
    statsWorksheet.addRow(['المبلغ المتبقي', (totalAmount - receivedAmount).toLocaleString()]);
    
    // تنسيق ورقة الإحصائيات
    statsWorksheet.columns.forEach(column => {
      column.width = 20;
    });
    
    // حفظ الملف
    console.log('💾 حفظ الملف...');
    await workbook.xlsx.writeFile(outputPath);
    
    console.log('✅ تم تحويل البيانات بنجاح!');
    console.log(`📁 الملف محفوظ في: ${outputPath}`);
    console.log(`📊 إجمالي التبرعات: ${totalPledges}`);
    console.log(`💰 إجمالي المبلغ: ${totalAmount.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ خطأ في تحويل البيانات:', error.message);
    console.error(error.stack);
  }
}

// تشغيل السكربت
convertToExcel();
