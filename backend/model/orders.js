import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    items: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true }, // Store price as a number
            description: { type: String },
            image: { type: String },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    orderId: { type: String, required: true, unique: true }, // Unique order ID
   
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);

export default Order;