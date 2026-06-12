import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const CargoSchema = new mongoose.Schema({
  trackingCode: { type: String, required: true },
  cargoType: { type: String, enum: ['avia', 'avto'], required: true },
  weight: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  yuanPrice: { type: Number, required: true },
  yuanRate: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['ombor', 'yolda', 'keldi'], default: 'ombor' }, // Yangi status
  shippedDate: { type: String, default: '' }, // Yo'lga chiqqan sana
  arrivedDate: { type: String, default: '' }, // Yetib kelgan sana
  date: { type: Date, default: Date.now }
});

const Cargo = mongoose.models.Cargo || mongoose.model('Cargo', CargoSchema);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();

    // 1. Ma'lumotlarni olish
    if (req.method === 'GET') {
      const items = await Cargo.find().sort({ date: -1 });
      return res.status(200).json(items);
    }

    // 2. Yangi ma'lumot qo'shish
    if (req.method === 'POST') {
      const newItem = new Cargo(req.body);
      await newItem.save();
      return res.status(201).json(newItem);
    }

    // 3. Tahrirlash (PUT) - YANGI QO'SHILDI
    if (req.method === 'PUT') {
      const { id } = req.query;
      const updatedItem = await Cargo.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(updatedItem);
    }

    // 4. O'chirish
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Cargo.findByIdAndDelete(id);
      return res.status(200).json({ message: "O'chirildi" });
    }

    return res.status(405).json({ message: 'Metod ruxsat etilmagan' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}