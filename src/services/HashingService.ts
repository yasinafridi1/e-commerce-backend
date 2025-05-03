import bcrypt from "bcrypt";

class HashingService {
  /**
   * Hash the provided data using HMAC SHA256
   * @param {string} data - The data to hash
   * @returns {string} - The hashed value
   */
  static async generateHash(data: string): Promise<string> {
    const hashedValue = await bcrypt.hash(data, 10);
    return hashedValue;
  }

  /**
   * Compare plain data with a hashed value
   * @param {string} data - The plain data to compare
   * @param {string} hashedData - The hashed value to compare against
   * @returns -  true or false
   */
  static async compareHashed(
    data: string,
    hashedData: string
  ): Promise<boolean> {
    const compared = await bcrypt.compare(data, hashedData);
    return compared;
  }
}

export default HashingService;
