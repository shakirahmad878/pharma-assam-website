import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sefmed_super_secure_jwt_token_pharma_2026_x89a';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

// Enterprise User Accounts Database
const DEMO_USERS = [
  {
    id: 'usr-nlcl-0001',
    email: 'samsuj.ceo@pappudacompany.com',
    password: 'password123',
    name: 'Samsuj Sadiol',
    role: 'SUPER_ADMIN',
    employeeCode: 'NLCL-0001',
    phone: '6900700102',
    designation: 'Chief Executive Officer (CEO)',
    reportingManager: 'Board of Directors',
    territory: 'Silchar Regional HQ'
  },
  {
    id: 'usr-nlcl-0002',
    email: 'shakir.hr@pappudacompany.com',
    password: 'password123',
    name: 'Shakir Ahmad Barbhuiya',
    role: 'SUPER_ADMIN',
    employeeCode: 'NLCL-0002',
    phone: '9101494287',
    designation: 'HR Manager',
    reportingManager: 'CEO',
    territory: 'Silchar Corporate HQ'
  },
  {
    id: 'usr-nlcl-0003',
    email: 'bodrud.rsm@pappudacompany.com',
    password: 'password123',
    name: 'Bodrud Jaman Sadiol',
    role: 'REGIONAL_MANAGER',
    employeeCode: 'NLCL-0003',
    phone: '8099139305',
    designation: 'Regional Sales Manager',
    reportingManager: 'CEO',
    territory: 'Silchar Regional HQ'
  },
  {
    id: 'usr-nlcl-0004',
    email: 'pranjal.mr@pappudacompany.com',
    password: 'password123',
    name: 'Pranjal Malakar',
    role: 'MEDICAL_REP',
    employeeCode: 'NLCL-0004',
    phone: '9864378424',
    designation: 'Medical Representative',
    reportingManager: 'Bodrud Jaman Sadiol',
    territory: 'Karimganj HQ'
  },
  {
    id: 'usr-nlcl-0005',
    email: 'satyam.mr@pappudacompany.com',
    password: 'password123',
    name: 'Satyam',
    role: 'MEDICAL_REP',
    employeeCode: 'NLCL-0005',
    phone: '9394831412',
    designation: 'Medical Representative',
    reportingManager: 'Bodrud Jaman Sadiol',
    territory: 'Silchar HQ'
  }
];

router.post('/login', (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid email or password format' });
  }

  const { email, password } = parsed.data;
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials. Use shakir.hr@pappudacompany.com with password: password123' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employeeCode: user.employeeCode,
      territory: user.territory
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employeeCode: user.employeeCode,
      territory: user.territory
    }
  });
});

export default router;
