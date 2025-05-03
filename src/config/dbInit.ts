import Category from "../models/CategoryModel";
import ContactUs from "../models/ContactUsModel";
import Product from "../models/ProductModel";
import User from "../models/UserModel";

const dbInit = () => {
  // User.sync({ force: true });
  // Category.sync({ force: true });
  // Product.sync({ force: true });
  // ContactUs.sync({ force: true });
};

export default dbInit;
