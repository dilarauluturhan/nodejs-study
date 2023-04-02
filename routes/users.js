const express = require("express");
const router = express.Router();
const db = require("../data/db");

// detay sayfası hazırlayacağımız zaman kullandığımız bir routes yapısı
router.use("/products/:id", async function (req, res) {
    // async - await
    try {
        const [product,] = await db.execute("select * from products where id=?", [req.params.id]);

        res.render("products-detail", {
            product: product[0]
        });

    } catch (err) {
        console.log(err);
    }

    // geriye döndürecek olduğum bir product bilgisi oluşturucam
    // kullanıcının göndermiş olduğu id bilgisine göre bunu döndürücem
    // nasıl döndürücem? res.render'a product ekleyerek...
    // const product = data.find(p => p.id == req.params.id);

    // res.render("products-detail", product)
    // res.send("products details " + req.params.id);
});

// app.use("/products/7", function(req, res){
//     res.send("products 7");
// });

// en spesifik olanı en yukarı alacağız
// / olanı en yukarı alırsak sadece homepage'i görürüz
// res.render'a object olarak data yazdığımda sayfaya eklemiş oldum
router.use("/products", async function (req, res) {
    // async - await
    try {
        const [products,] = await db.execute("select * from products");

        res.render("products", {
            products: products
        });

    } catch (err) {
        console.log(err);
    }
});

// url'den / geldiğinde çağırılacak olan fonksiyon
router.use("/", async function (req, res) {
    // async - await
    try {
        const [products,] = await db.execute("select * from products");

        res.render("index", {
            products: products
        });

    } catch (err) {
        console.log(err);
    }

});

module.exports = router;