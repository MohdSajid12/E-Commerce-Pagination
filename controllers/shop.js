
const Product = require('../models/product');
const Cart = require('../models/cart');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = req.query.page;
  console.log(page);
  Product.findAll({limit:2,offset:2*page})
    .then(products => {
      res.json(products)
  //   res.render('shop/product-list', {
    //     prods: products,
    //     pageTitle: 'All Products',
    //     path: '/products'
    //   });
     })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// exports.getIndex = (req, res, next) => {
//   const page = req.query.page;

//   Product.findAll()
//   .skip((page-1)*ITEMS_PER_PAGE)
//   .limit(ITEMS_PER_PAGE)
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };
// exports.getIndex = (req, res, next) => {
//     const page = req.query.page;
//     console.log(page);
//     Product.findandCountAll({limit:2,offset:2*page})
//       .then(products => {
//         res.json(products)
//         // res.render('shop/index', {
//         //   prods: products,
//         //   pageTitle: 'Shop',
//         //   path: '/',
//         //   currentPage: page,
//         //   hasNextPage: ITEMS_PER_PAGE* page < totalItems,
//         //   hasPreviousPage: page > 1,
//         //   nextPage: page +1,
//         //  PreviousPage: page - 1,
//         //  lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
//         // });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };
  exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product.count()
    .then((numProducts) => {
      totalItems = numProducts;
      console.log(totalItems);
      return Product.findAll({offset:(page-1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE})
    })
      .then(products => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE* page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page +1,
         PreviousPage: page - 1,
         lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.status(200).json({success : true, products: products  });
          
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({success : true,message: "Successfuly added to the cart"})
    })
    .catch(err =>{
      res.status(500).json({success : false,message : "error occured"})
    });
    // .then(() => {
    //   res.redirect('/cart');
    // })
    // .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};