const { ConnectionClosedEvent } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    topic: {type: String, required: [true, 'topic is required']},
    title: {type: String, required: [true, 'title is required']},
    host: {type: Schema.Types.ObjectId, ref:'User'},
    content: {type: String, required: [true, 'content is required']},
    where: {type: String, required: [true, 'location is required']},
    when: {type: String, required: [true, 'start time is required']},
    start: {type: String, required: [true, 'start time is required']},
    end: {type: String, required: [true, 'end time is required']},
    imageURL: {type: String, required: [true, 'image link is required']}
},
{timestamps: true}
);

connectionSchema.statics.getTopics = (connections) => {
    let topics = [];
    for(let i = 0; i < connections.length; i++) {
        if(!topics.includes(connections[i].topic)) {
            topics.push(connections[i].topic);
        }
    }
    return topics;
}

//collection name is connections in the database
module.exports = mongoose.model('Connection', connectionSchema);
