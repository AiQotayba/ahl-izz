import mongoose, { Schema } from 'mongoose';
// import { ISecurityLog } from '@donation-hub/types';

const securityLogSchema = new Schema<any>({
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: [
      'login_attempt',
      'login_success',
      'login_failure',
      'token_refresh',
      'token_invalid',
      'pledge_submission',
      'pledge_update',
      'pledge_deletion',
      'admin_action',
      'rate_limit_exceeded',
      'suspicious_activity',
      'unauthorized_access'
    ]
  },
  actor: {
    type: String,
    trim: true
  },
  ip: {
    type: String,
    required: [true, 'IP address is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: false // We use custom timestamp field
});

// Indexes for performance and querying
securityLogSchema.index({ eventType: 1 });
securityLogSchema.index({ timestamp: -1 });
securityLogSchema.index({ ip: 1 });
securityLogSchema.index({ actor: 1 });

// TTL index to automatically delete old logs after 1 year
securityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

export const SecurityLog = mongoose.model<any>('SecurityLog', securityLogSchema);

