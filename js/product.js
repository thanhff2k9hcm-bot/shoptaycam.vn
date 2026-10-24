class Product {
  id;
  name;
  price;
  originalPrice;
  category;
  platform;
  isHot;
  image;

  constructor(id, name, price, originalPrice, category, platform, isHot, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.originalPrice = originalPrice;
    this.category = category;
    this.platform = platform;
    this.isHot = isHot;
    this.image = image;
  }

  getInfo() {
    return `${this.name} - ${this.price} VND`;
  }
}

const productsData = [
  new Product(
    1,
    "Tay Cầm Flydigi APEX 5",
    1672000,
    2090000,
    "khong-day",
    "pc",
    true,
    "https://shoptaycam.com/wp-content/uploads/2025/06/bandicam-2025-09-21-13-50-41-156.jpg",
  ),
  new Product(
    2,
    "Tay Cầm Sony DualSense PS5",
    1790000,
    1790000,
    "khong-day",
    "console",
    true,
    "https://shoptaycam.com/wp-content/uploads/2025/02/bandicam-2026-03-16-17-20-07-680.jpg",
  ),
  new Product(
    3,
    "Tay Cầm Xbox Wireless Controller",
    1450000,
    1450000,
    "khong-day",
    "pc",
    true,
    "https://shoptaycam.com/wp-content/uploads/2025/09/bandicam-2025-12-11-17-26-17-270-300x300.jpg",
  ),
  new Product(
    4,
    "Tay Cầm Rapoo V600S",
    392000,
    490000,
    "co-day",
    "pc",
    true,
    "https://shoptaycam.com/wp-content/uploads/2024/10/unnamed-file-300x300.jpg",
  ),
  new Product(
    5,
    "Tay Cầm GameSir T4 Kaleid RGB",
    712000,
    890000,
    "co-day",
    "pc",
    false,
    "https://shoptaycam.com/wp-content/uploads/2025/05/bandicam-2025-06-23-17-04-28-448-300x300.jpg",
  ),
  new Product(
    6,
    "Tay Cầm Logitech F310",
    380000,
    380000,
    "co-day",
    "pc",
    false,
    "https://shoptaycam.com/wp-content/uploads/2026/04/bandicam-2026-04-27-14-59-19-547-300x300.jpg",
  ),
  new Product(
    7,
    "Tay Cầm Flydigi Vader 3 Pro",
    1000000,
    1250000,
    "khong-day",
    "pc",
    false,
    "https://shoptaycam.com/wp-content/uploads/2026/09/bandicam-2026-09-17-16-51-06-187.jpg",
  ),
  new Product(
    8,
    "Tay Cầm 8BitDo Ultimate Bluetooth",
    1150000,
    1150000,
    "khong-day",
    "pc",
    false,
    "https://shoptaycam.com/wp-content/uploads/2026/09/bandicam-2026-09-17-22-06-06-813.jpg",
  ),
  new Product(
    9,
    "Tay Cầm Razer Wolverine V2",
    1760000,
    2200000,
    "co-day",
    "console",
    false,
    "https://shoptaycam.com/wp-content/uploads/2025/07/bandicam-2025-10-02-14-45-29-139-300x300.jpg",
  ),
  new Product(
    10,
    "Tay Cầm ASUS ROG Raikiri Pro",
    3490000,
    3490000,
    "khong-day",
    "pc",
    false,
    "https://shoptaycam.com/wp-content/uploads/2025/02/bandicam-2025-06-18-17-50-32-406-300x300.jpg",
  ),
  new Product(
    11,
    "Tay Cầm Nintendo Switch Pro Controller",
    1550000,
    1550000,
    "khong-day",
    "console",
    false,
    "https://shoptaycam.com/wp-content/uploads/2025/02/bandicam-2025-06-18-17-50-31-486-300x300.jpg",
  ),
  new Product(
    12,
    "Tay Cầm PXN 9613 V2",
    440000,
    550000,
    "khong-day",
    "pc",
    false,
    "https://shoptaycam.com/wp-content/uploads/2025/02/bandicam-2026-04-06-03-26-31-307-300x300.jpg",
  ),
];

window.productsData = productsData;
