import ProductMongo from "../dao/product.mongo.js";

class ProductController {
  constructor() {
    this.productService = new ProductMongo();
  }

  loadProducts = async (req, res) => {
    try {
      let query = {};
      let order = {
        limit: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
      };
      if (parseInt(req.query.stock))
        query.stock = { $gte: parseInt(req.query.stock) };
      if (req.query.category) query.category = req.query.category;
      if (parseInt(req.query.sort) == 1 || parseInt(req.query.sort) == -1)
        order.sort = { price: parseInt(req.query.sort) };
      order.lean = true;
      const products = await this.productService.getProducts(query, order);
      res.send({ status: "success", payload: products });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  loadProduct = async (req, res) => {
    try {
      const product = await this.productService.findOneProduct(req.params.pid);
      if (product) {
        res.send({ status: "success", payload: product });
      } else {
        res.send({
          status: "error",
          message: "Producto no encontrado en la BDD",
        });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  newProduct = async (req, res) => {
    try{
      const { title, description, code, price, stock, category } = req.body;
      const thumbs = req.body.thumbnails || [];
      if (!(await this.productService.existCode(code))) {
        let newProduct = {
          title,
          description,
          code,
          price,
          status: true,
          stock,
          category,
        };
        if (Object.values(newProduct).every((value) => String(value).trim() !== "" && value !== undefined)){
          newProduct.thumbnails = thumbs;
          const result = await this.productService.createProduct(newProduct);
          if (result) {
            res.send({ status: "success", payload: result });
          } else {
            res.send({ status: "error", message: "Error al guardar producto" });
          }
        } else {
          res.send({ status: "error", message: "Faltan campos obligatorios" });
        }
      } else {
        res.send({ status: "error", message: "El código ingresado ya existe" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  updateProduct = async (req, res) => {
    try{
      const newValues = req.body;
      if (Object.values(newValues).every((value) => String(value).trim() !== "" && value !== undefined)){
        if (await this.productService.updateProduct(req.params.pid, newValues)){
          res.send({ status: "success", payload: newValues });
        } else {
          res.send({ status: "error", message: "Error al actualizar producto" });
        }
      } else {
        res.send({ status: "error", message: "Faltan campos obligatorios" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  deleteProduct = async (req, res) => {
    try{
      let product = await this.productService.findOneProduct(req.params.pid);
      if (product) {
        if(product.status){
          if (await this.productService.deleteProduct(product)) {
            res.send({ status: "success", payload: product });
          } else {
            res.send({ status: "error", message: "Error al eliminar producto" });
          }
        }else{
          res.send({ status: "error", message: "Error, el producto ya se encuentra eliminado previamente"});
        }
      }else {
        res.send({ status: "error", message: "Error no existe el producto" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

}

export default ProductController;
