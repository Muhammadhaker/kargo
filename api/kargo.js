import mongoose from 'mongoose';

// MongoDB-ga xavfsiz ulanish funksiyasi
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Kargo tovar modeli sxemasi
const CargoSchema = new mongoose.Schema({
  trackingCode: { type: String, required: true },
  cargoType: { type: String, enum: ['avia', 'avto'], required: true },
  weight: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  yuanPrice: { type: Number, required: true },
  yuanRate: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  date: { type: Date, default: Date.now }
});

const Cargo = mongoose.models.Cargo || mongoose.model('Cargo', CargoSchema);

export default async function handler(req, res) {
  // Brauzer so'rovlari bloklanib qolmasligi uchun CORS sozlamalari
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();

    // 1. Bazadagi barcha yuklarni sanasi bo'yicha saralab olish
    if (req.method === 'GET') {
      const items = await Cargo.find().sort({ date: -1 });
      return res.status(200).json(items);
    }

    // 2. Yangi yuk buyurtmasini bazaga yozish
    if (req.method === 'POST') {
      const newItem = new Cargo(req.body);
      await newItem.save();
      return res.status(201).json(newItem);
    }

    // 3. ID bo'yicha yukni bazadan o'chirish
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Cargo.findByIdAndDelete(id);
      return res.status(200).json({ message: "Muvaffaqiyatli o'chirildi" });
    }

    return res.status(405).json({ message: 'Metod ruxsat etilmagan' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}