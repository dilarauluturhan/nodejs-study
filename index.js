/*
Node.js bir derleyicidir.(compiler)
Node.js sayesinde Javascript ile Server tarafında proje yazıp çıktı alabiliriz.
Node.js ile doğrudan veritabanına bağlantı yapabiliriz.

request(talep) - response(yanıt) -> server
uygulamaya talep gelir ve talep sonucu response gönderirim
talebi alacak olan server'ı oluşturmalıyım

request, res.end()'le biter ve bunu belli bir port altında hizmete açmam gerekir
server.listen(3000, () => {
    //mesaj
});

res.write() -> yanıt göndermek için

node dosyaİsmi ile o anki halini çalıştırabilirim.

bu kısmı özetleyecek olursak req metoduyla talep ettiğim özelliklerin, res metoduyla yanıtladığım özelliklerin çıktısı alınır.

fs ile dosya oluşturma, okuma, isim değiştirme ve silmeye yarar.

Express.js, node.js ile web sunucusuna gelen istekleri yönetmek, düzenlemek ve yayınlamak için kullanılır.

Bir web proglama dilinde statik dosyalar proje içerisinde direkt yayına alınmaz.
Mesela img etiketiyle jpeg'i direkt yayınlayamam. Bunu projeye bildirmem gerekiyor.
Sebebi ise güvenlik açısından.
Statik klasörlerimi(image,css,javascript gibi) public isimli dosyaya ekliyorum.
https://expressjs.com/en/starter/static-files.html
app.use(express.static('public')) kullanıcaz, bu durumda artık public klasörü erişime açılıyor

*/

/**********************************************************************/
// npm init --yes -> package.json dosyası gelir
// npm i express -> express.js için
// npm install -> node_modules klasörü için
// npm i nodemon -g -> sayfamdaki değişikliği aktif olarak görmek için(nodemon "dosyaAdi")
// npm list -> projenin paketleri listelenir
// npm list -g -> projenin global paketleri sıralanır
// npm i ejs -> HTML sayfasına dinamik bir veri göndermek için
// npm i bootstrap -> bootstrap kütüphanesini ekledik
// npm i mysql2
/**********************************************************************/

/*

// http server'ı
// require, kütüphaneyi projeye dahil eder
var http = require("http");

// File System
// Dosyayla çalışırken bu modülü kullanıyoruz
var fs = require("fs");

// server oluşturuyorum
var server = http.createServer((req, res) => {

    if (req.url == "/") {

        // index.html'i oku
        // içeriği callback fonk. ile çağıralım
        // okuma işlemi bittikten sonra birinci parametrede bir hata,ikinci parametrede de veri gelir, buna html dedim
        fs.readFile("index.html", (err, html) => {
            res.write(html);
            res.end();
            // res.write("<h1>Homepage</h1>"); // response'a içerik yazıyorum
        });

    } else if (req.url == "/products") {
        fs.readFile("products.html",  (err, html) => {
            res.write(html);
            res.end();
            // res.write("<h1>Products</h1>");
        })

    } else {
        fs.readFile("404.html", (err, html) => {
            res.write(html);
            res.end();
            // res.write("<h1>Page not found</h1>");
        })

    }

});

server.listen(3000, () => {
    console.log("Node.js server at port 3000")
});

*/

// express'i projeme dahil ettim,
const express = require("express");
// ve app'e atadım.
// send yerine render yazıyoruz
const app = express();

const db = require("./data/db");

// EJS'yi tanımladım
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.static('node_modules')); // node_modules'ü erişime açtım


// data'yı products'a göndermek istiyorum
// listeyi bu şekilde yazmak yerine kalıcı bir veritabanında saklamamız gerekiyor bunun için MySQL kullanıyoruz.
const data = [
    { id: 1, name: "MacBook 2021", price: 30000, imageUrl: "1.jpg", isHome: true },
    { id: 2, name: "MacBook 2022", price: 40000, imageUrl: "2.jpg", isHome: false },
    { id: 3, name: "MacBook 2023", price: 50000, imageUrl: "3.jpg", isHome: true }
]

// detay sayfası hazırlayacağımız zaman kullandığımız bir routes yapısı
app.use("/products/:id", function (req, res) {

    // geriye döndürecek olduğum bir product bilgisi oluşturucam
    // kullanıcının göndermiş olduğu id bilgisine göre bunu döndürücem
    // nasıl döndürücem? res.render'a product ekleyerek...
    const product = data.find(p => p.id == req.params.id);

    res.render("products-detail", product)
    // res.send("products details " + req.params.id);
});

// app.use("/products/7", function(req, res){
//     res.send("products 7");
// });

// en spesifik olanı en yukarı alacağız
// / olanı en yukarı alırsak sadece homepage'i görürüz
// res.render'a object olarak data yazdığımda sayfaya eklemiş oldum
app.use("/products", function (req, res) {
    res.render("products", {
        products: data
    });
});

// url'den / geldiğinde çağırılacak olan fonksiyon
app.use("/", function (req, res) {
    db.execute("select * from products")
        .then(result => {
            console.log(result[0]);

            res.render("index", {
                products: result[0]
            });
        })
        .catch(err => console.log(err));


});

app.listen(3000, () => {
    console.log("Listening on port 3000")
});
