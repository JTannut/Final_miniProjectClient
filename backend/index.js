
const express = require('express'),
    app = express(),
    passport = require('passport'),
    port = process.env.PORT || 80,
    cors = require('cors'),
    cookie = require('cookie')

const bcrypt = require('bcrypt')

const db = require('./database.js')
let admin = db.admin
let bodyParser = require('body-parser');
require('./passport.js')

const router = require('express').Router(),
    jwt = require('jsonwebtoken')

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))


let product = {
    list: [
        {id: 1, name: "Thai Tea",cost: "35"},
        {id: 2, name: "Green Tea",cost: "40"},
        {id: 3, name: "Coco",cost: "45"},
        {id: 4, name: "Mocca",cost: "45"},
        {id: 5, name: "Lemon Soda",cost: "45"},
        {id: 6, name: "Black Wanila",cost: "45"}

    ]
}
///////product/////
router.route('/product')
    .get((req, res) => res.json(product))
    .post((req, res) => {
        let id = (product.list.length)?product.list[product.list.length-1].id+1:1
        let name = req.body.name
        let cost = req.body.cost


        product = { list: [ ...product.list, {id, name, cost}] }
        res.json(product)

    })

    router.route('/product/:pd_id')
    
    .get((req, res) => {
        let ID = product.list.findIndex( item => (item.id === +req.params.pd_id))
        if(ID >= 0)
        {
           res.json(product.list[ID])
        }
        else
           res.json({status: "Fail, get not found!"})
    })
    .put((req, res) => {

        let ID = product.list.findIndex( item => ( item.id === +req.params.pd_id))
    
        if(ID >= 0)
        {

            product.list[ID].name = req.body.name
            product.list[ID].cost = req.body.cost
            res.json(product)
            
        }
        else
        {
            res.json({status: "Fail, Student not found!"})
        }

           
    }) 
    .delete((req, res) => {

        let ID = product.list.findIndex( item => ( item.id === +req.params.pd_id))

        
        if(ID >= 0)
        {
            product.list = product.list.filter( item => item.id !== +req.params.pd_id )
            res.json(product)
            
        }
        else
        {
            
            res.json({status: "Fail, Student not found!"})
        }
            

    })



router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Login: ', req.body, user, err, info)
        if (err) return next(err)
        if (user) {
            const token = jwt.sign(user, db.SECRET, {
                expiresIn: (req.body.tick !=="" ? '7d' : '1d' )
            })
            // req.cookie.token = token
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 60 * 60,
                    sameSite: "strict",
                    path: "/",
                })
            );
            res.statusCode = 200
            return res.json({ user, token })
        } else
            return res.status(422).json(info)
    })(req, res, next)
})

///////////////////
router.get('/foo',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
            return res.json({ message: 'Foo' })
    });

/////////////////
router.get('/logout', (req, res) => { 
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            sameSite: "strict",
            path: "/",
        })
    );
    res.statusCode = 200
    return res.json({ message: 'Logout successful' })
})

/* GET user profile. */
router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.user)
    });

router.post('/register',
    async (req, res) => {
        try {
            const SALT_ROUND = 10
            const { username, email, password } = req.body 
            if (!username || !email || !password)
                return res.json( {message: "Cannot register with empty string"})
            if (db.checkExistingUser(username) !== db.NOT_FOUND)
                return res.json({ message: "Duplicated user" })

            let id = (admin.admin.length) ? admin.admin[admin.admin.length - 1].id + 1 : 1
            hash = await bcrypt.hash(password, SALT_ROUND)
            admin.admin.push({ id, username, password: hash, email })
            res.status(200).json({ message: "Register success" })
        } catch {
            res.status(422).json({ message: "Cannot register" })
        }
    })

router.get('/alluser', (req,res) => res.json(db.admin.admin))

router.get('/', (req, res, next) => {
    res.send('Respond without authentication');
});

// Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.status || 500
    res.status(statusCode);
    res.json({
        error: {
            status: statusCode,
            message: err.message,
        }
    });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))

