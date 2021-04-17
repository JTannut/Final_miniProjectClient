const bcrypt = require('bcrypt')

let admin = {
    admin: [
        { id: 1, username: 'Tannut', password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiI2MTM1NTEyMDE2IiwiZW1haWwiOiI2MTM1NTEyMDE2IiwiaWF0IjoxNjE4NDgxODYxLCJleHAiOjE2MTkwODY2NjF9.9kj15K1xSk9A62kZOdNPqIppYv8zgCika_bn5yxKHO8', email: 's6135512016@phuket.psu.ac.th' },
        
    ]
}
let product = {
    product: [
        { id: 1, name: "Thai Tea", cost:"35"}
    ]
}
let cart= {
    cart: [
        {id: 1, name: "Thai Tea", cost:"35"}
    ]
}

const SECRET = 'your_jwt_secret'
const NOT_FOUND = -1
exports.cart = cart
exports.admin = admin 
exports.product = product
exports.SECRET = SECRET
exports.NOT_FOUND = NOT_FOUND

exports.setadmin = function(_admin) { 
  admin = _admin;
}

// === validate username/password ===
exports.isValidUser = async (username, password) => { 
    const index = admin.admin.findIndex(item => item.username === username) 
    return await bcrypt.compare(password, admin.admin[index].password)
}

// return -1 if user is not existing
exports.checkExistingUser = (username) => {
    return admin.admin.findIndex(item => item.username === username)
}