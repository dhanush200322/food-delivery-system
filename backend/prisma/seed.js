"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    console.log('Seeding database...');
    // 1. Users
    const passwordHash = await bcrypt_1.default.hash('Admin@123!', 10);
    const customerPasswordHash = await bcrypt_1.default.hash('Customer@123!', 10);
    const admin = await prisma_1.default.user.upsert({
        where: { email: 'admin@fooddelivery.local' },
        update: {},
        create: {
            name: 'Food Delivery Admin',
            email: 'admin@fooddelivery.local',
            passwordHash,
            role: 'ADMIN',
            phone: '1234567890'
        },
    });
    const customer = await prisma_1.default.user.upsert({
        where: { email: 'customer@fooddelivery.local' },
        update: {},
        create: {
            name: 'Demo Customer',
            email: 'customer@fooddelivery.local',
            passwordHash: customerPasswordHash,
            role: 'CUSTOMER',
            phone: '0987654321'
        },
    });
    console.log('Created Users:', admin.email, customer.email);
    // 2. Categories
    const categoryNames = ['Pizza', 'Burgers', 'Fast Food', 'Desserts', 'Beverages', 'Healthy Meals'];
    const categories = {};
    for (const name of categoryNames) {
        const category = await prisma_1.default.category.upsert({
            where: { name },
            update: {},
            create: { name, description: `Delicious ${name}` }
        });
        categories[name] = category.id;
    }
    console.log('Created Categories:', categoryNames.length);
    // 3. Restaurants
    const restaurantsData = [
        { name: 'Urban Crust', cuisineType: 'Italian / Pizza', rating: 4.8, deliveryTime: '25-35 mins', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop' },
        { name: 'Burger District', cuisineType: 'American / Burgers', rating: 4.5, deliveryTime: '20-30 mins', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop' },
        { name: 'Spice Route', cuisineType: 'Indian', rating: 4.7, deliveryTime: '30-40 mins', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop' },
        { name: 'Green Bowl', cuisineType: 'Healthy', rating: 4.9, deliveryTime: '25-35 mins', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop' },
        { name: 'Wok & Flame', cuisineType: 'Asian', rating: 4.6, deliveryTime: '35-45 mins', imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=400&fit=crop' },
        { name: 'Sweet Theory', cuisineType: 'Desserts', rating: 4.9, deliveryTime: '20-30 mins', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop' },
        { name: 'Coastal Kitchen', cuisineType: 'Seafood', rating: 4.4, deliveryTime: '35-45 mins', imageUrl: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=600&h=400&fit=crop' },
        { name: 'Brew & Bite', cuisineType: 'Cafe / Beverages', rating: 4.5, deliveryTime: '20-30 mins', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop' },
    ];
    const restaurants = {};
    for (const r of restaurantsData) {
        const existing = await prisma_1.default.restaurant.findFirst({ where: { name: r.name } });
        if (existing) {
            restaurants[r.name] = existing.id;
        }
        else {
            const created = await prisma_1.default.restaurant.create({
                data: { ...r, description: `The best ${r.cuisineType} in town.` }
            });
            restaurants[r.name] = created.id;
        }
    }
    console.log('Created Restaurants:', restaurantsData.length);
    // 4. Foods (at least 40)
    const foodsData = [
        // Urban Crust (Pizza)
        { restaurant: 'Urban Crust', category: 'Pizza', name: 'Truffle Mushroom Pizza', price: 499, rating: 4.8, popularity: 95 },
        { restaurant: 'Urban Crust', category: 'Pizza', name: 'Smoky BBQ Chicken Pizza', price: 549, rating: 4.6, popularity: 88 },
        { restaurant: 'Urban Crust', category: 'Pizza', name: 'Classic Margherita', price: 299, rating: 4.5, popularity: 99 },
        { restaurant: 'Urban Crust', category: 'Pizza', name: 'Pepperoni Paradise', price: 449, rating: 4.7, popularity: 92 },
        { restaurant: 'Urban Crust', category: 'Pizza', name: 'Four Cheese Feast', price: 399, rating: 4.9, popularity: 85 },
        // Burger District
        { restaurant: 'Burger District', category: 'Burgers', name: 'Classic Smash Burger', price: 199, rating: 4.6, popularity: 90 },
        { restaurant: 'Burger District', category: 'Burgers', name: 'Spicy Crispy Chicken Burger', price: 249, rating: 4.8, popularity: 94 },
        { restaurant: 'Burger District', category: 'Burgers', name: 'Double Trouble Beef Burger', price: 349, rating: 4.9, popularity: 88 },
        { restaurant: 'Burger District', category: 'Burgers', name: 'Veggie Supreme Burger', price: 149, rating: 4.3, popularity: 70 },
        { restaurant: 'Burger District', category: 'Burgers', name: 'Peri Peri Paneer Burger', price: 179, rating: 4.5, popularity: 82 },
        { restaurant: 'Burger District', category: 'Fast Food', name: 'Loaded Cheesy Fries', price: 129, rating: 4.7, popularity: 95 },
        // Spice Route
        { restaurant: 'Spice Route', category: 'Healthy Meals', name: 'Butter Chicken Bowl', price: 299, rating: 4.9, popularity: 98 },
        { restaurant: 'Spice Route', category: 'Healthy Meals', name: 'Paneer Tikka Masala Bowl', price: 249, rating: 4.7, popularity: 89 },
        { restaurant: 'Spice Route', category: 'Healthy Meals', name: 'Dal Makhani with Naan', price: 199, rating: 4.8, popularity: 91 },
        { restaurant: 'Spice Route', category: 'Fast Food', name: 'Chicken Tikka Wrap', price: 179, rating: 4.6, popularity: 85 },
        { restaurant: 'Spice Route', category: 'Desserts', name: 'Gulab Jamun (2 pcs)', price: 99, rating: 4.9, popularity: 80 },
        // Green Bowl
        { restaurant: 'Green Bowl', category: 'Healthy Meals', name: 'Grilled Protein Bowl', price: 349, rating: 4.8, popularity: 87 },
        { restaurant: 'Green Bowl', category: 'Healthy Meals', name: 'Quinoa & Avocado Salad', price: 299, rating: 4.7, popularity: 82 },
        { restaurant: 'Green Bowl', category: 'Healthy Meals', name: 'Tofu Buddha Bowl', price: 279, rating: 4.6, popularity: 75 },
        { restaurant: 'Green Bowl', category: 'Healthy Meals', name: 'Mediterranean Grain Bowl', price: 329, rating: 4.8, popularity: 80 },
        { restaurant: 'Green Bowl', category: 'Beverages', name: 'Detox Green Juice', price: 149, rating: 4.5, popularity: 65 },
        // Wok & Flame
        { restaurant: 'Wok & Flame', category: 'Fast Food', name: 'Thai Basil Noodles', price: 249, rating: 4.6, popularity: 88 },
        { restaurant: 'Wok & Flame', category: 'Fast Food', name: 'Spicy Chili Garlic Rice', price: 229, rating: 4.5, popularity: 84 },
        { restaurant: 'Wok & Flame', category: 'Fast Food', name: 'Chicken Dim Sum (6 pcs)', price: 199, rating: 4.8, popularity: 92 },
        { restaurant: 'Wok & Flame', category: 'Healthy Meals', name: 'Stir Fried Asian Greens', price: 179, rating: 4.4, popularity: 60 },
        { restaurant: 'Wok & Flame', category: 'Fast Food', name: 'Kung Pao Chicken', price: 289, rating: 4.7, popularity: 86 },
        // Sweet Theory
        { restaurant: 'Sweet Theory', category: 'Desserts', name: 'Mango Cheesecake', price: 249, rating: 4.9, popularity: 95 },
        { restaurant: 'Sweet Theory', category: 'Desserts', name: 'Dark Chocolate Lava Cake', price: 199, rating: 4.8, popularity: 98 },
        { restaurant: 'Sweet Theory', category: 'Desserts', name: 'Red Velvet Pastry', price: 179, rating: 4.7, popularity: 90 },
        { restaurant: 'Sweet Theory', category: 'Desserts', name: 'Tiramisu Cup', price: 229, rating: 4.9, popularity: 88 },
        { restaurant: 'Sweet Theory', category: 'Beverages', name: 'Thick Cold Coffee', price: 129, rating: 4.6, popularity: 92 },
        // Coastal Kitchen
        { restaurant: 'Coastal Kitchen', category: 'Healthy Meals', name: 'Grilled Salmon Platter', price: 599, rating: 4.7, popularity: 70 },
        { restaurant: 'Coastal Kitchen', category: 'Fast Food', name: 'Crispy Calamari Rings', price: 349, rating: 4.5, popularity: 65 },
        { restaurant: 'Coastal Kitchen', category: 'Healthy Meals', name: 'Lemon Butter Garlic Prawns', price: 449, rating: 4.8, popularity: 75 },
        { restaurant: 'Coastal Kitchen', category: 'Fast Food', name: 'Fish and Chips', price: 299, rating: 4.6, popularity: 80 },
        // Brew & Bite
        { restaurant: 'Brew & Bite', category: 'Beverages', name: 'Cold Brew Latte', price: 179, rating: 4.8, popularity: 88 },
        { restaurant: 'Brew & Bite', category: 'Beverages', name: 'Iced Caramel Macchiato', price: 199, rating: 4.9, popularity: 95 },
        { restaurant: 'Brew & Bite', category: 'Beverages', name: 'Peach Iced Tea', price: 129, rating: 4.6, popularity: 82 },
        { restaurant: 'Brew & Bite', category: 'Fast Food', name: 'Grilled Cheese Sandwich', price: 149, rating: 4.5, popularity: 85 },
        { restaurant: 'Brew & Bite', category: 'Desserts', name: 'Blueberry Muffin', price: 99, rating: 4.4, popularity: 75 }
    ];
    let foodsCreated = 0;
    for (const food of foodsData) {
        const rId = restaurants[food.restaurant];
        const cId = categories[food.category];
        if (rId && cId) {
            const existing = await prisma_1.default.food.findFirst({ where: { name: food.name, restaurantId: rId } });
            if (!existing) {
                await prisma_1.default.food.create({
                    data: {
                        name: food.name,
                        restaurantId: rId,
                        categoryId: cId,
                        description: `Delicious ${food.name}`,
                        price: food.price,
                        rating: food.rating,
                        popularity: food.popularity,
                        imageUrl: 'https://placehold.co/400x300/eeeeee/31343c?text=' + encodeURIComponent(food.name)
                    }
                });
                foodsCreated++;
            }
        }
    }
    console.log(`Created/Verified Foods: ${foodsData.length}`);
    // 5. Promotions
    const promotionsData = [
        { title: 'Flat 20% Off First Order', discountPercentage: 20, isActive: true, days: 30 },
        { title: 'Weekend Feast', discountAmount: 150, isActive: true, days: 7 },
        { title: 'Free Delivery Friday', discountAmount: 50, isActive: true, days: 2 },
        { title: 'Healthy Bowl Week', discountPercentage: 15, isActive: true, days: 14 },
        { title: 'Dessert Add-On Offer', discountAmount: 75, isActive: true, days: 20 },
    ];
    for (const promo of promotionsData) {
        const existing = await prisma_1.default.promotion.findFirst({ where: { title: promo.title } });
        if (!existing) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + promo.days);
            await prisma_1.default.promotion.create({
                data: {
                    title: promo.title,
                    description: promo.title + ' for you!',
                    discountPercentage: promo.discountPercentage || null,
                    discountAmount: promo.discountAmount || null,
                    isActive: promo.isActive,
                    startDate,
                    endDate,
                    imageUrl: 'https://placehold.co/600x200/eeeeee/31343c?text=' + encodeURIComponent(promo.title)
                }
            });
        }
    }
    console.log('Created/Verified Promotions.');
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
