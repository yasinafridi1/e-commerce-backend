import Category from "../models/CategoryModel";
import ContactUs from "../models/ContactUsModel";
import Product from "../models/ProductModel";
import User from "../models/UserModel";

const dbInit = () => {
  // User.sync({ alter: true });
  // Category.sync({ alter: true });
  // Product.sync({ force: true });
  // ContactUs.sync({ force: true });
};

export default dbInit;
