const express = require("express")
const { redirect } = require("express/lib/response")
const mysql = require("mysql")
const BodyParser = require("body-parser")

const app = express()

const http = require("http")
const server = http.createServer(app)
const {Server} = require("socket.io")
const io = new Server(server)

app.use(BodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")
app.set("views", "views")

const db = mysql.createConnection({
    host: "localhost",
    database: "lat1_nodejs",
    user: "root",
    password: ""
})

db.connect((err) => {
    if(err) throw err
    console.log("DB Connected")

    // untuk get data siswa
    app.get("/", (req, res) => {
        const sql = "SELECT * FROM user"
        db.query(sql, (err, result) => {
            const users = JSON.parse(JSON.stringify(result))
            res.render("index", {users: users, title: "Daftar Murid"})
        })    
    })

    // untuk post data siswa
    app.post("/tambah", (req, res) => {
        const insertSql = `INSERT INTO user (nama, kelas) VALUES ('${req.body.nama}', '${req.body.kelas}');`
        db.query(insertSql, (err, result) => {
            if (err) throw err
            res.redirect("/")
        })
    })

    // untuk menuju halaman livechat
    app.get("/live-chat", (req, res) => {
        res.render("live-chat", { title : "Live Chat Siswa" })
    })
    
})


io.on("connection", (socket) => {
    socket.on("msg", (data) => {
        const {id, msg} = data
        socket.broadcast.emit("msg", id, msg)
        // console.log("data => ", data)
        // socket.broadcast.emit("msg", data)
    })
})


server.listen(8000, () => {
    console.log("Server ready...")
})