import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sefmed_super_secure_jwt_token_pharma_2026_x89a';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'REGIONAL_MANAGER' | 'AREA_MANAGER' | 'MEDICAL_REP' | 'CHEMIST';
  employeeCode?: string;
  territoryId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const roleHeader = req.headers['x-user-role'] as string;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, error: 'INVALID_OR_EXPIRED_JWT_TOKEN' });
    }
  }

  // Fallback for role switching simulation & development
  if (roleHeader) {
    req.user = {
      id: roleHeader === 'SUPER_ADMIN' ? 'usr-admin-01' : 'usr-mr-01',
      email: roleHeader === 'SUPER_ADMIN' ? 'admin@sefmed.com' : 'vikram.mr@sefmed.com',
      name: roleHeader === 'SUPER_ADMIN' ? 'Rajesh Sharma (Admin)' : 'Vikram Mehta (MR)',
      role: roleHeader as any,
      employeeCode: roleHeader === 'SUPER_ADMIN' ? 'EMP-HQ-001' : 'EMP-MUM-104'
    };
    return next();
  }

  // Default guest for development/demo
  req.user = {
    id: 'usr-guest',
    email: 'guest@sefmed.com',
    name: 'Guest User',
    role: 'MEDICAL_REP'
  };
  return next();
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN_ACCESS: Employee real-time location telemetry and route replay are strictly restricted to Super Admin only.'
    });
  }
  next();
}

export function requireManagerOrAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !['SUPER_ADMIN', 'REGIONAL_MANAGER', 'AREA_MANAGER'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN_ACCESS: Management privilege required for this operation.'
    });
  }
  next();
}