import { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { IPledge, Pledge } from '../models/Pledge';
import { logSecurityEvent } from '../utils/logger';
import { maskPII, sanitizeText } from '../utils/maskPII';
import { emitPledgeUpdated, emitStatsUpdate } from '../socket';
import ExcelJS from 'exceljs';

// Validation rules for pledge submission
export const validatePledgeSubmission = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Donor name must be between 2 and 100 characters')
    .customSanitizer(sanitizeText),
  body('phoneNumber')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be at least 1'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters')
    .customSanitizer(sanitizeText),
];

// Validation rules for pledge updates
export const validatePledgeUpdate = [
  body('pledgeStatus')
    .optional()
    .isIn(['pending', 'confirmed', 'rejected'])
    .withMessage('Invalid pledge status'),
  body('paymentMethod')
    .optional()
    .isIn(['received', 'pledged'])
    .withMessage('Invalid payment method'),
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .customSanitizer(sanitizeText),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters')
    .customSanitizer(sanitizeText),
  body('amount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Amount must be at least 1')
];

// Submit new pledge
export const submitPledge = async (
  req: Request<{}, any, any>,
  res: Response<any>
): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logSecurityEvent('pledge_submission', undefined, req.ip, {
        errors: errors.array(),
        data: req.body
      });

      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const pledgeData: any = req.body;

    // Create new pledge
    const pledge: IPledge = await Pledge.create(pledgeData);

    // Log pledge submission
    logSecurityEvent('pledge_submission', undefined, req.ip, {
      pledgeId: pledge._id,
      amount: pledge.amount,
      hasContact: !!(pledge.phoneNumber)
    });
    // Send socket notification if pledge is confirmed
    if (pledge.pledgeStatus === 'confirmed') {
      try {
        const io = global.io;
        if (io) {
          emitPledgeUpdated(io, {
            _id: pledge._id,
            fullName: pledge.fullName,
            amount: pledge.amount,
            pledgeStatus: pledge.pledgeStatus,
            createdAt: pledge.createdAt
          });
          await emitStatsUpdate(io);
          console.log(`Socket notification sent for confirmed pledge: ${pledge._id}`);
        }
      } catch (socketError) {
        console.error('Failed to send socket notification:', socketError);
        // Don't fail the request if socket fails
      }
    }

    res.status(201).json({
      success: true,
      data: {
        _id: pledge._id,
        fullName: pledge.fullName,
        email: pledge.email,
        phoneNumber: pledge.phoneNumber,
        amount: pledge.amount,
        message: pledge.message,
        pledgeStatus: pledge.pledgeStatus,
        paymentMethod: pledge.paymentMethod,
        createdAt: pledge.createdAt
      },
      message: 'Pledge submitted successfully'
    });

  } catch (error) {
    logSecurityEvent('pledge_submission', undefined, req.ip, {
      error: error instanceof Error ? error.message : 'Unknown error',
      data: req.body
    });

    res.status(500).json({
      success: false,
      error: 'Failed to submit pledge'
    });
  }
};

// Get pledges (admin only)
export const getPledges = async (req: Request, res: Response<any>): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const pledgeStatus = req.query.pledgeStatus as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // Build filter
    const filter: any = {};
    if (pledgeStatus) {
      filter.pledgeStatus = pledgeStatus;
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get pledges, total count, and top 5 donations
    const [pledges, total, topDonations] = await Promise.all([
      Pledge.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Pledge.countDocuments(filter),
      Pledge.find({ pledgeStatus: 'confirmed' })
        .sort({ amount: -1 })
        .limit(5)
        .select('fullName amount createdAt message')
        .lean()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: pledges.map(pledge => ({
        _id: pledge._id,
        fullName: pledge.fullName,
        email: pledge.email,
        phoneNumber: pledge.phoneNumber,
        amount: pledge.amount,
        message: pledge.message,
        pledgeStatus: pledge.pledgeStatus,
        paymentMethod: pledge.paymentMethod,
        createdAt: pledge.createdAt
      })),
      topDonations: topDonations.map(donation => ({
        fullName: donation.fullName,
        amount: donation.amount,
        createdAt: donation.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get pledges error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pledges'
    });
  }
};

// Get pledge by ID (admin only)
export const getPledgeById = async (
  req: Request<{ id: string }>,
  res: Response<any>
): Promise<void> => {
  try {
    const { id } = req.params;

    const pledge = await Pledge.findById(id);
    if (!pledge) {
      res.status(404).json({
        success: false,
        error: 'Pledge not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        _id: pledge._id,
        fullName: pledge.fullName,
        email: pledge.email,
        phoneNumber: pledge.phoneNumber,
        amount: pledge.amount,
        message: pledge.message,
        pledgeStatus: pledge.pledgeStatus,
        paymentMethod: pledge.paymentMethod,
        createdAt: pledge.createdAt,
        updatedAt: pledge.updatedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pledge'
    });
  }
};

// Update pledge (admin only)
export const updatePledge = async (
  req: Request<{ id: string }, any, Partial<any & { status: string }>>,
  res: Response<any>
): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    const pledge = await Pledge.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!pledge) {
      res.status(404).json({ success: false, error: 'Pledge not found' });
      return;
    }

    // Log pledge update
    logSecurityEvent('pledge_update', req.user?._id, req.ip, {
      pledgeId: pledge._id,
      updatedFields: Object.keys(updateData),
      newStatus: pledge.pledgeStatus
    });

    // Send socket notification if pledge is confirmed
    if (pledge.pledgeStatus === 'confirmed') {
      try {
        // Get the io instance from the request
        const io = global.io;

        if (io) {
          // Emit pledge updated event to admin room
          emitPledgeUpdated(io, {
            _id: pledge._id,
            fullName: pledge.fullName,
            amount: pledge.amount,
            pledgeStatus: pledge.pledgeStatus,
            createdAt: pledge.createdAt
          });

          // Emit stats update to public room
          await emitStatsUpdate(io);

          console.log(`Socket notification sent for confirmed pledge: ${pledge._id}`);
        }
      } catch (socketError) {
        console.error('Failed to send socket notification:', socketError);
        // Don't fail the request if socket fails
      }
    }

    res.json({
      success: true,
      data: {
        _id: pledge._id,
        fullName: pledge.fullName,
        email: pledge.email,
        phoneNumber: pledge.phoneNumber,
        amount: pledge.amount,
        message: pledge.message,
        pledgeStatus: pledge.pledgeStatus,
        paymentMethod: pledge.paymentMethod,
        createdAt: pledge.createdAt,
        updatedAt: pledge.updatedAt
      },
      message: 'Pledge updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update pledge'
    });
  }
};

// Erase PII from pledge (admin only)
export const erasePledgePII = async (
  req: Request<{ id: string }>,
  res: Response<any>
): Promise<void> => {
  try {
    const { id } = req.params;

    const pledge = await Pledge.findByIdAndUpdate(
      id,
      {
        $unset: {
          fullName: 1,
          email: 1,
          message: 1
        },
        $set: {
          phoneNumber: '[ERASED]'
        }
      },
      { new: true, runValidators: false }
    );

    if (!pledge) {
      res.status(404).json({ success: false, error: 'Pledge not found' });
      return;
    }
    // Send socket notification if pledge is confirmed
    if (pledge.pledgeStatus === 'confirmed') {
      try {
        const io = global.io;
        if (io) {
          emitPledgeUpdated(io, {
            _id: pledge._id,
            fullName: pledge.fullName,
            amount: pledge.amount,
            pledgeStatus: pledge.pledgeStatus,
            createdAt: pledge.createdAt
          });
          await emitStatsUpdate(io);
          console.log(`Socket notification sent for confirmed pledge: ${pledge._id}`);
        }
      } catch (socketError) {
        console.error('Failed to send socket notification:', socketError);
        // Don't fail the request if socket fails
      }
    }

    // Log PII erasure
    logSecurityEvent('pledge_deletion', req.user?._id, req.ip, {
      pledgeId: pledge._id,
      action: 'pii_erased'
    });

    res.json({ success: true, message: 'PII erased successfully' });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to erase PII' });
  }
};

// Get public pledges (for real-time feed)
export const getPublicPledges = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    // Get pledges and top 5 donations
    const [pledges, topDonations] = await Promise.all([
      Pledge.find({ pledgeStatus: 'confirmed' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('fullName amount createdAt message')
        .lean(),
      Pledge.find({ pledgeStatus: 'confirmed' })
        .sort({ amount: -1 })
        .limit(5)
        // .select('fullName amount createdAt message')
        .lean()
    ]);
    console.log(pledges);

    const maskedPledges = pledges.map(pledge => maskPII(pledge));
    const maskedTopDonations = topDonations.map(donation => maskPII(donation));

    res.json({
      success: true,
      data: maskedPledges,
      topDonations: maskedTopDonations
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch public pledges' });
  }
};

// Get pledge statistics
export const getPledgeStats = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const [totalCount, totalAmount, pledgeStatusCounts, paymentMethodCounts] = await Promise.all([
      Pledge.countDocuments({ pledgeStatus: 'confirmed' }),
      Pledge.aggregate([
        { $match: { pledgeStatus: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Pledge.aggregate([
        { $group: { _id: '$pledgeStatus', count: { $sum: 1 } } }
      ]),
      Pledge.aggregate([
        { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
      ])
    ]);

    const totalAmountValue = totalAmount.length > 0 ? totalAmount[0].total : 0;
    const pledgeStatusCountsObj = pledgeStatusCounts.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const paymentMethodCountsObj = paymentMethodCounts.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalCount,
        totalAmount: totalAmountValue,
        pledgeStatusCounts: pledgeStatusCountsObj,
        paymentMethodCounts: paymentMethodCountsObj
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pledge statistics' });
  }
};

export const excelPledge = async (req: Request, res: Response<any>): Promise<void> => {
  try {
    // Get all pledges
    const pledges = await Pledge.find({}).sort({ createdAt: -1 });
    
    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('التبرعات');
    
    // Add headers
    worksheet.addRow([
      'الرقم',
      'الاسم',
      'البريد الإلكتروني',
      'رقم الهاتف',
      'المبلغ',
      'الرسالة',
      'حالة التبرع',
      'طريقة الدفع',
      'تاريخ الإنشاء'
    ]);
    
    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add data rows
    pledges.forEach((pledge, index) => {
      worksheet.addRow([
        index + 1,
        pledge.fullName || 'غير محدد',
        pledge.email || 'غير محدد',
        pledge.phoneNumber || 'غير محدد',
        pledge.amount,
        pledge.message || 'لا توجد رسالة',
        pledge.pledgeStatus === 'confirmed' ? 'مؤكد' : 
        pledge.pledgeStatus === 'pending' ? 'معلق' : 'مرفوض',
        pledge.paymentMethod === 'received' ? 'مستلم' : 'متعهد',
        pledge.createdAt ? new Date(pledge.createdAt as Date).toLocaleDateString('ar-SA') : 'غير محدد'
      ]);
    });
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="التبرعات.xlsx"');
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'فشل في تصدير البيانات إلى Excel' 
    });
  }
};