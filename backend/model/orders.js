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
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true, match: /.+\@.+\..+/ }, // Simple email validation
        street: { type: String, required: true },
        postalCode: { type: String, required: true },
        city: { type: String, required: true }
    },
    orderId: { type: String, required: true, unique: true }, // Unique order ID
   
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);

export default Order;