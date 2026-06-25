/**
 * Generate a 6-digit numeric OTP string.
 * @returns {string} e.g. "482917"
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = generateOtp;
