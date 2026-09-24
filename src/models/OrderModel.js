const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const OrderSchema = new Schema({
    cart: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
    order_dt: { type: Date, default: Date.now },
    status: { type: String, default: 'pending', required: true },
    typeOfPayment: { type: String },
    amount: { type: Number },
    orderNotes: { type: String },
    deliveryPreference: { type: String },
 
    shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    deliveryInstructions: String,
},
 
    shipment: {
        shiprocket_order_id: String,
        shipment_id: String,
        awb_code: String,
        courier_company_id: String,
        courier_name: String,
        tracking_url: String,
        expected_delivery_date: Date,
        current_status: { type: String, default: 'Order Placed' },
        status_history: [{ status: String, timestamp: Date, location: String }],
    },
    
})
 
module.exports = mongoose.model('Order', OrderSchema)
 