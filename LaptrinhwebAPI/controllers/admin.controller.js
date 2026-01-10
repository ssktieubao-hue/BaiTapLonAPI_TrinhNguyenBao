import adminService from '../services/admin.service.js';

export const getCurrentCustomers = async (req, res) => {
  try {
    const data = await adminService.getCurrentCustomers();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Lỗi admin controller:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }


};

export default { getCurrentCustomers };
