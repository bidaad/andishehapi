export { }
const mongoose = require('mongoose');

export interface Resource {
    title: String
    engTitle: String
}

export interface ResourceAccess {
    resource: Resource
    read: Boolean
    write: Boolean
    delete: Boolean
}

const AccessGroup = mongoose.model("AccessGroup", {
    title: String,
    resourceAccesses: [Object],
}, "accessGroups");


module.exports = AccessGroup;