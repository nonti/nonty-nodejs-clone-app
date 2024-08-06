import * as mongoose from 'mongoose';
import { model } from 'mongoose';

const itemSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Types.ObjectId, ref: 'restuarants', required: true },
  category_id: { type: mongoose.Types.ObjectId, ref: 'categories', required: true },
  name: { type: String, required: true },
  description: {type: String, required: true},
  cover: { type: String, required: true },
  price: {type: Number, required: true},
  veg: {type: Boolean, required: true, default: false},
  status: {type: Boolean, required: true, default: false},
  created_at: { type: Date, required: true, default: new Date() },
  updated_at: { type: Date, required: true, default: new Date() },
});

export default model('items', itemSchema);
