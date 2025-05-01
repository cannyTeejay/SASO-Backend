// User authentication and role validation
const authenticateUser = async (email, password) => {
  // Verify credentials and return user with role
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  return {
    id: user._id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    role: user.role
  };
};

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      throw new Error(`Unauthorized - Requires ${requiredRole} role`);
    }
    next();
  };
};
