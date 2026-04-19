import bcrypt from "bcrypt";
import { AppDataSource } from "./data.source";
import { Review } from "./entities/Review";
import { CartItem } from "./entities/CartItem";
import { Cart } from "./entities/Cart";
import { OrderItem } from "./entities/OrderItem";
import { Order, OrderStatus, PaymentMethod } from "./entities/Order";
import { Product } from "./entities/Product";
import { User, UserRole } from "./entities/User";
import { Category } from "./entities/Category";
import { ProductType } from "./entities/ProductType";
import { SubCategory } from "./entities/SubCategory";

async function seed() {
  await AppDataSource.initialize();
  console.log("Database connected");

  // ─── Clear in reverse FK order ────────────────────────────────────────────
  // await AppDataSource.getRepository(Complaint).delete({});
  // await AppDataSource.getRepository(Review).delete({});
  // await AppDataSource.getRepository(CartItem).delete({});
  // await AppDataSource.getRepository(Cart).delete({});
  // await AppDataSource.getRepository(OrderItem).delete({});
  // await AppDataSource.getRepository(Order).delete({});
  // await AppDataSource.getRepository(Product).delete({});
  // await AppDataSource.getRepository(SubCategory).delete({});
  // await AppDataSource.getRepository(Category).delete({});
  // await AppDataSource.getRepository(ProductType).delete({});
  // await AppDataSource.getRepository(User).delete({});
  // console.log("Cleared existing data");

  // ─── USERS (21 entries) ───────────────────────────────────────────────────
  const userRepo = AppDataSource.getRepository(User);
  const hash = (p: string) => bcrypt.hash(p, 10);

  const users = await userRepo.save([
    userRepo.create({
      name: "admin",
      email: "admin@shop.com",
      passwordHash: await hash("Admin@1234"),
      role: UserRole.ADMIN,
      isLocked: false,
    }),
    userRepo.create({
      name: "alice",
      email: "alice@example.com",
      passwordHash: await hash("Alice@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "bob",
      email: "bob@example.com",
      passwordHash: await hash("Bob@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "charlie",
      email: "charlie@ex.com",
      passwordHash: await hash("Charlie@1234"),
      role: UserRole.USER,
      isLocked: true,
    }),
    userRepo.create({
      name: "diana",
      email: "diana@ex.com",
      passwordHash: await hash("Diana@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "ethan",
      email: "ethan@ex.com",
      passwordHash: await hash("Ethan@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "fiona",
      email: "fiona@ex.com",
      passwordHash: await hash("Fiona@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "george",
      email: "george@ex.com",
      passwordHash: await hash("George@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "hannah",
      email: "hannah@ex.com",
      passwordHash: await hash("Hannah@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "ivan",
      email: "ivan@ex.com",
      passwordHash: await hash("Ivan@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "julia",
      email: "julia@ex.com",
      passwordHash: await hash("Julia@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "kevin",
      email: "kevin@ex.com",
      passwordHash: await hash("Kevin@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "laura",
      email: "laura@ex.com",
      passwordHash: await hash("Laura@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "mike",
      email: "mike@ex.com",
      passwordHash: await hash("Mike@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "nina",
      email: "nina@ex.com",
      passwordHash: await hash("Nina@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "oscar",
      email: "oscar@ex.com",
      passwordHash: await hash("Oscar@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "paula",
      email: "paula@ex.com",
      passwordHash: await hash("Paula@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "quinn",
      email: "quinn@ex.com",
      passwordHash: await hash("Quinn@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "rachel",
      email: "rachel@ex.com",
      passwordHash: await hash("Rachel@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "sam",
      email: "sam@ex.com",
      passwordHash: await hash("Sam@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
    userRepo.create({
      name: "tina",
      email: "tina@ex.com",
      passwordHash: await hash("Tina@1234"),
      role: UserRole.USER,
      isLocked: false,
    }),
  ]);
  console.log(`Seeded ${users.length} users`);

  // ─── TAXONOMY ─────────────────────────────────────────────────────────────
  const typeRepo = AppDataSource.getRepository(ProductType);
  const catRepo = AppDataSource.getRepository(Category);
  const subCatRepo = AppDataSource.getRepository(SubCategory);

  const electronics = await typeRepo.save(
    typeRepo.create({ name: "Electronics" }),
  );
  const furniture = await typeRepo.save(typeRepo.create({ name: "Furniture" }));
  const stationery = await typeRepo.save(
    typeRepo.create({ name: "Stationery" }),
  );
  const clothing = await typeRepo.save(typeRepo.create({ name: "Clothing" }));
  const sports = await typeRepo.save(
    typeRepo.create({ name: "Sports & Fitness" }),
  );

  const compPeripherals = await catRepo.save(
    catRepo.create({ name: "Computer Peripherals", productType: electronics }),
  );
  const phones = await catRepo.save(
    catRepo.create({ name: "Phones", productType: electronics }),
  );
  const audio = await catRepo.save(
    catRepo.create({ name: "Audio", productType: electronics }),
  );
  const laptopsCat = await catRepo.save(
    catRepo.create({ name: "Laptops & Computers", productType: electronics }),
  );
  const officeFurniture = await catRepo.save(
    catRepo.create({ name: "Office Furniture", productType: furniture }),
  );
  const homeFurniture = await catRepo.save(
    catRepo.create({ name: "Home Furniture", productType: furniture }),
  );
  const writingSupplies = await catRepo.save(
    catRepo.create({ name: "Writing Supplies", productType: stationery }),
  );
  const kidsSection = await catRepo.save(
    catRepo.create({ name: "Kids", productType: stationery }),
  );
  const artSupplies = await catRepo.save(
    catRepo.create({ name: "Art Supplies", productType: stationery }),
  );
  const menswear = await catRepo.save(
    catRepo.create({ name: "Menswear", productType: clothing }),
  );
  const womenswear = await catRepo.save(
    catRepo.create({ name: "Womenswear", productType: clothing }),
  );
  const gymEquipment = await catRepo.save(
    catRepo.create({ name: "Gym Equipment", productType: sports }),
  );
  const outdoorGear = await catRepo.save(
    catRepo.create({ name: "Outdoor Gear", productType: sports }),
  );

  const keyboards = await subCatRepo.save(
    subCatRepo.create({ name: "Keyboards", category: compPeripherals }),
  );
  const mice = await subCatRepo.save(
    subCatRepo.create({ name: "Mice", category: compPeripherals }),
  );
  const monitors = await subCatRepo.save(
    subCatRepo.create({ name: "Monitors", category: compPeripherals }),
  );
  const webcams = await subCatRepo.save(
    subCatRepo.create({ name: "Webcams", category: compPeripherals }),
  );
  const smartphones = await subCatRepo.save(
    subCatRepo.create({ name: "Smartphones", category: phones }),
  );
  const headphones = await subCatRepo.save(
    subCatRepo.create({ name: "Headphones", category: audio }),
  );
  const speakers = await subCatRepo.save(
    subCatRepo.create({ name: "Speakers", category: audio }),
  );
  const gamingLaptops = await subCatRepo.save(
    subCatRepo.create({ name: "Gaming Laptops", category: laptopsCat }),
  );
  const desks = await subCatRepo.save(
    subCatRepo.create({ name: "Desks", category: officeFurniture }),
  );
  const chairs = await subCatRepo.save(
    subCatRepo.create({ name: "Chairs", category: officeFurniture }),
  );
  const tables = await subCatRepo.save(
    subCatRepo.create({ name: "Tables", category: homeFurniture }),
  );
  const sofas = await subCatRepo.save(
    subCatRepo.create({ name: "Sofas", category: homeFurniture }),
  );
  const pens = await subCatRepo.save(
    subCatRepo.create({ name: "Pens", category: writingSupplies }),
  );
  const notebooks = await subCatRepo.save(
    subCatRepo.create({ name: "Notebooks", category: writingSupplies }),
  );
  const textbooks = await subCatRepo.save(
    subCatRepo.create({ name: "Textbooks", category: kidsSection }),
  );
  const canvases = await subCatRepo.save(
    subCatRepo.create({ name: "Canvases", category: artSupplies }),
  );
  const tshirts = await subCatRepo.save(
    subCatRepo.create({ name: "T-Shirts", category: menswear }),
  );
  const dresses = await subCatRepo.save(
    subCatRepo.create({ name: "Dresses", category: womenswear }),
  );
  const dumbbells = await subCatRepo.save(
    subCatRepo.create({ name: "Dumbbells", category: gymEquipment }),
  );
  const tents = await subCatRepo.save(
    subCatRepo.create({ name: "Tents", category: outdoorGear }),
  );

  console.log("Seeded taxonomy");

  // ─── PRODUCTS (60 entries) ────────────────────────────────────────────────
  const productRepo = AppDataSource.getRepository(Product);
  const p = (
    name: string,
    desc: string,
    price: number,
    stock: number,
    sub: SubCategory,
  ) =>
    productRepo.create({
      name,
      description: desc,
      price,
      stock,
      imagePath: null,
      isActive: true,
      subCategory: sub,
    });

  const products = await productRepo.save([
    // Keyboards (4)
    p(
      "Anker Multimedia Keyboard",
      "Full-size USB keyboard with multimedia hotkeys and quiet keys.",
      29.99,
      120,
      keyboards,
    ),
    p(
      "Logitech MX Keys",
      "Advanced wireless keyboard with smart illumination and multi-device support.",
      109.99,
      45,
      keyboards,
    ),
    p(
      "Keychron K2 Mechanical Keyboard",
      "Compact 75% wireless mechanical keyboard compatible with Mac and Windows.",
      89.99,
      60,
      keyboards,
    ),
    p(
      "Corsair K95 RGB Platinum",
      "Premium mechanical gaming keyboard with Cherry MX Speed switches and full RGB.",
      199.99,
      30,
      keyboards,
    ),

    // Mice (3)
    p(
      "Logitech MX Master 3",
      "High-precision wireless mouse with ultra-fast scroll wheel and ergonomic design.",
      99.99,
      80,
      mice,
    ),
    p(
      "Razer DeathAdder V3",
      "Lightweight ergonomic gaming mouse with 30K DPI optical sensor.",
      69.99,
      35,
      mice,
    ),
    p(
      "Microsoft Arc Mouse",
      "Slim, arc-shaped wireless mouse that snaps flat for easy portability.",
      79.99,
      50,
      mice,
    ),

    // Monitors (3)
    p(
      "LG 27UK850 4K Monitor",
      "27-inch 4K UHD IPS monitor with USB-C and HDR support.",
      449.99,
      20,
      monitors,
    ),
    p(
      "Dell S2421HGF Gaming Monitor",
      "24-inch FHD gaming monitor with 144Hz refresh and AMD FreeSync.",
      229.99,
      25,
      monitors,
    ),
    p(
      "Samsung 32 Curved Monitor",
      "32-inch curved VA panel monitor with 1800R curvature and eye-saver mode.",
      329.99,
      18,
      monitors,
    ),

    // Webcams (2)
    p(
      "Logitech C920 HD Pro",
      "1080p HD webcam with stereo audio and automatic light correction.",
      79.99,
      55,
      webcams,
    ),
    p(
      "Razer Kiyo Pro",
      "Streaming webcam with adaptive light sensor and uncompressed 1080p at 60fps.",
      159.99,
      22,
      webcams,
    ),

    // Smartphones (3)
    p(
      "Samsung Galaxy S24",
      "Flagship Android with AI features, 200MP camera, and Snapdragon processor.",
      899.99,
      25,
      smartphones,
    ),
    p(
      "Google Pixel 8",
      "Pure Android with Tensor G3 chip and best-in-class computational photography.",
      699.99,
      18,
      smartphones,
    ),
    p(
      "OnePlus 12",
      "Flagship killer with Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W charging.",
      649.99,
      30,
      smartphones,
    ),

    // Headphones (3)
    p(
      "Sony WH-1000XM5",
      "Industry-leading noise-cancelling headphones with 30-hour battery life.",
      349.99,
      40,
      headphones,
    ),
    p(
      "JBL Tune 770NC",
      "Wireless over-ear headphones with adaptive noise cancelling and Pure Bass sound.",
      99.99,
      55,
      headphones,
    ),
    p(
      "Bose QuietComfort 45",
      "Premium noise-cancelling headphones with TriPort acoustic architecture.",
      329.99,
      28,
      headphones,
    ),

    // Speakers (2)
    p(
      "JBL Charge 5",
      "Portable waterproof Bluetooth speaker with 20 hours of battery life.",
      149.99,
      60,
      speakers,
    ),
    p(
      "Sonos One",
      "Smart speaker with Amazon Alexa and Google Assistant built-in.",
      219.99,
      35,
      speakers,
    ),

    // Gaming Laptops (3)
    p(
      "ASUS ROG Zephyrus G14",
      "14-inch gaming laptop with AMD Ryzen 9, RTX 4060, and 2K 165Hz display.",
      1299.99,
      12,
      gamingLaptops,
    ),
    p(
      "Lenovo Legion 5 Pro",
      "16-inch gaming laptop with Ryzen 7, RTX 4070, and 165Hz IPS display.",
      1199.99,
      10,
      gamingLaptops,
    ),
    p(
      "MSI Raider GE78 HX",
      "17-inch flagship gaming laptop with Intel i9 HX and RTX 4080.",
      2499.99,
      6,
      gamingLaptops,
    ),

    // Desks (3)
    p(
      "FlexiSpot Standing Desk",
      "Electric height-adjustable standing desk with memory presets. 140x70cm.",
      449.99,
      12,
      desks,
    ),
    p(
      "IKEA MICKE Desk",
      "Compact computer desk with built-in cable management. 105x50cm.",
      89.99,
      30,
      desks,
    ),
    p(
      "Autonomous SmartDesk Pro",
      "Premium motorised standing desk with four programmable height presets.",
      599.99,
      8,
      desks,
    ),

    // Chairs (3)
    p(
      "Herman Miller Aeron",
      "Iconic ergonomic office chair with PostureFit SL support and breathable mesh.",
      1499.99,
      8,
      chairs,
    ),
    p(
      "Autonomous ErgoChair Pro",
      "Fully adjustable ergonomic chair with lumbar support and breathable mesh back.",
      499.99,
      20,
      chairs,
    ),
    p(
      "DXRacer Formula Series",
      "Racing-style gaming chair with adjustable armrests and lumbar/neck pillows.",
      299.99,
      25,
      chairs,
    ),

    // Tables (3) — includes "table" keyword for spec search example
    p(
      "Wooden Dining Table",
      "Solid oak dining table seating 6. Classic design for home dining rooms.",
      599.99,
      10,
      tables,
    ),
    p(
      "Marble Coffee Table",
      "Modern coffee table with genuine marble top and steel frame legs.",
      299.99,
      15,
      tables,
    ),
    p(
      "IKEA LACK Side Table",
      "Simple side table in birch effect with a shelf underneath.",
      19.99,
      80,
      tables,
    ),

    // Sofas (2)
    p(
      "IKEA KIVIK Sofa",
      "3-seat sofa with deep seats and durable cover. Available in multiple colours.",
      799.99,
      7,
      sofas,
    ),
    p(
      "Chesterfield 3-Seater",
      "Classic rolled arm Chesterfield sofa in genuine leather. Deep button tufting.",
      1299.99,
      4,
      sofas,
    ),

    // Pens (3)
    p(
      "Pilot G2 Gel Pen Pack",
      "10-pack of smooth-writing retractable gel pens. 0.7mm tip, black ink.",
      12.99,
      200,
      pens,
    ),
    p(
      "Staedtler Triplus Fineliner Set",
      "20-colour fineliner set with 0.3mm tip. Ideal for notes and planning.",
      18.99,
      150,
      pens,
    ),
    p(
      "Parker Jotter Ballpoint",
      "Iconic stainless steel ballpoint pen with medium point blue refill.",
      24.99,
      90,
      pens,
    ),

    // Notebooks (3)
    p(
      "Leuchtturm1917 A5 Notebook",
      "Hardcover dotted notebook with numbered pages and two bookmarks. 249 pages.",
      24.99,
      90,
      notebooks,
    ),
    p(
      "Moleskine Classic Notebook",
      "Iconic ruled hardcover notebook. A5 size, 240 pages, elastic closure.",
      19.99,
      110,
      notebooks,
    ),
    p(
      "Rhodia Webnotebook A5",
      "Fountain-pen-friendly dotted notebook with 90g ivory paper.",
      22.99,
      70,
      notebooks,
    ),

    // Textbooks (3) — "Multiplication Table Book" matches spec search example
    p(
      "Multiplication Table Book",
      "Fun and colourful multiplication table workbook for kids aged 6-10.",
      8.99,
      75,
      textbooks,
    ),
    p(
      "Primary Science Textbook Gr 3",
      "Illustrated science textbook covering basic biology and physics for grade 3.",
      14.99,
      60,
      textbooks,
    ),
    p(
      "English Grammar Workbook",
      "Comprehensive grammar and vocabulary workbook for primary school students.",
      11.99,
      85,
      textbooks,
    ),

    // Canvases (2)
    p(
      "Stretched Canvas 30x40cm",
      "Professional artist stretched canvas with triple-primed surface. 280gsm.",
      9.99,
      120,
      canvases,
    ),
    p(
      "Canvas Board Set of 10",
      "Pack of 10 canvas boards in assorted sizes. Acid-free surface.",
      14.99,
      80,
      canvases,
    ),

    // T-Shirts (3)
    p(
      "Plain White Crew Neck Tee",
      "100% organic cotton crew-neck t-shirt in classic white. Machine washable.",
      14.99,
      200,
      tshirts,
    ),
    p(
      "Graphic Print Oversized Tee",
      "Oversized unisex fit graphic tee. 220gsm combed cotton. Drop shoulder.",
      24.99,
      150,
      tshirts,
    ),
    p(
      "Polo Shirt Classic Fit",
      "Classic piqué polo shirt with embroidered logo. Available in 6 colours.",
      34.99,
      100,
      tshirts,
    ),

    // Dresses (3)
    p(
      "Floral Wrap Dress",
      "Lightweight chiffon wrap dress with floral print. Adjustable tie waist.",
      39.99,
      60,
      dresses,
    ),
    p(
      "Midi Bodycon Dress",
      "Stretch jersey midi bodycon dress with round neck. Office or evening.",
      44.99,
      45,
      dresses,
    ),
    p(
      "Linen Shirt Dress",
      "Relaxed-fit linen-blend shirt dress with button front and patch pockets.",
      49.99,
      50,
      dresses,
    ),

    // Dumbbells (3)
    p(
      "Adjustable Dumbbell Set 2-20kg",
      "Space-saving adjustable dumbbell set with quick-lock weight selector.",
      149.99,
      30,
      dumbbells,
    ),
    p(
      "Rubber Hex Dumbbell 10kg Pair",
      "Pair of 10kg rubber hex dumbbells with chrome handles. Anti-roll design.",
      49.99,
      40,
      dumbbells,
    ),
    p(
      "Cast Iron Dumbbell 5kg Pair",
      "Classic solid cast iron dumbbells with knurled grip handles. 5kg each.",
      22.99,
      60,
      dumbbells,
    ),

    // Tents (3)
    p(
      "Coleman Sundome 4-Person Tent",
      "Easy set-up dome tent for 4 people with weather-resistant rainfly.",
      89.99,
      20,
      tents,
    ),
    p(
      "Vango Soul 200 Backpacking Tent",
      "Ultralight 2-person tent with 1500mm HH flysheet. Ideal for wild camping.",
      139.99,
      15,
      tents,
    ),
    p(
      "Eureka Copper Canyon Cabin Tent",
      "Spacious 6-person cabin tent with 6ft 6in centre height and full rainfly.",
      179.99,
      10,
      tents,
    ),
  ]);
  console.log(`Seeded ${products.length} products`);

  // ─── CARTS & CART ITEMS ───────────────────────────────────────────────────
  const cartRepo = AppDataSource.getRepository(Cart);
  const cartItemRepo = AppDataSource.getRepository(CartItem);
  const customers = users.filter((u) => u.role === UserRole.USER);

  for (let i = 0; i < Math.min(customers.length, 20); i++) {
    const cart = await cartRepo.save(cartRepo.create({ user: customers[i] }));
    const prod1 = products[i % products.length];
    const prod2 = products[(i + 5) % products.length];
    await cartItemRepo.save(
      cartItemRepo.create({ cart, product: prod1, quantity: 1 + (i % 3) }),
    );
    if (prod2.product_id !== prod1.product_id) {
      await cartItemRepo.save(
        cartItemRepo.create({ cart, product: prod2, quantity: 1 + (i % 2) }),
      );
    }
  }
  console.log("Seeded 20 carts");

  // ─── ORDERS & ORDER ITEMS (20 orders) ────────────────────────────────────
  const orderRepo = AppDataSource.getRepository(Order);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  const paymentMethods = Object.values(PaymentMethod);
  const orderStatuses = Object.values(OrderStatus);

  for (let i = 0; i < 20; i++) {
    const user = customers[i % customers.length];
    const prod1 = products[i % products.length];
    const prod2 = products[(i + 4) % products.length];
    const qty1 = 1 + (i % 3);
    const qty2 = 1 + (i % 2);
    const total = Number(
      (Number(prod1.price) * qty1 + Number(prod2.price) * qty2).toFixed(2),
    );

    const order = await orderRepo.save(
      orderRepo.create({
        user,
        paymentMethod: paymentMethods[i % paymentMethods.length],
        totalAmount: total,
        status: orderStatuses[i % orderStatuses.length],
      }),
    );

    await orderItemRepo.save([
      orderItemRepo.create({
        order,
        product: prod1,
        quantity: qty1,
        priceAtPurchase: Number(prod1.price),
        productName: prod1.name,
      }),
      orderItemRepo.create({
        order,
        product: prod2,
        quantity: qty2,
        priceAtPurchase: Number(prod2.price),
        productName: prod2.name,
      }),
    ]);
  }
  console.log("Seeded 20 orders");

  // ─── REVIEWS (20 entries) ─────────────────────────────────────────────────
  const reviewRepo = AppDataSource.getRepository(Review);
  const comments = [
    "Absolutely love this product! Exceeded my expectations.",
    "Good quality for the price. Would recommend.",
    "Decent product but delivery took longer than expected.",
    "Works perfectly. Very happy with the purchase.",
    "Build quality feels premium. Worth every rupee.",
    "Not bad but could be better. Average experience.",
    "Fantastic! Will definitely buy again.",
    "Exactly as described. No complaints.",
    "A bit overpriced but quality is good.",
    "Outstanding product. Best purchase this month.",
    "Solid build, easy to use. Five stars.",
    "Great value for money. Highly recommended.",
    "Product arrived well packaged and in perfect condition.",
    "Does exactly what it says. No frills, no fuss.",
    "Slightly disappointed with the colour but works great.",
    "Super fast shipping and exactly what I needed.",
    "Premium feel. My colleagues are all jealous.",
    "Good, but I wish it came in more colours.",
    "Exceptional quality. Will buy the full range.",
    "Comfortable and durable. Very satisfied.",
  ];

  for (let i = 0; i < 20; i++) {
    const user = customers[i % customers.length];
    const product = products[i % products.length];
    await reviewRepo.save(
      reviewRepo.create({
        user,
        product,
        rating: 1 + (i % 5),
        comment: comments[i],
      }),
    );
  }
  console.log("Seeded 20 reviews");

  console.log("\n✓ Seed complete!");
  console.log("─────────────────────────────────────────────");
  console.log("Admin    → admin@shop.com      / Admin@1234");
  console.log("Customer → alice@example.com   / Alice@1234");
  console.log("Locked   → charlie@ex.com      / Charlie@1234");
  console.log("─────────────────────────────────────────────");

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
