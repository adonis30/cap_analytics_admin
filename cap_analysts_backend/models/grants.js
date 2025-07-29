import mongoose from "mongoose";

const { Schema, model, models } = mongoose;


// grant Schema

const GrantsSchema = new Schema ({
    title: { type: String, required: true},
    description: { type: String, required: true},
    awardingOrg: { type: String, required: true},
    orgURL: { type: String, required: true},
    amount: {type: String, required: true},
    eligibility: {type: String, required: true},
    duration: { type: String, required: true},
    expiredingDate: { type: Date, required: true},
});

const Grants = models.Grants || model("Grants", GrantsSchema);

export default Grants;

