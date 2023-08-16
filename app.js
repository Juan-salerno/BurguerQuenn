
class Comida {

  constructor({ id, nombre, precio, descripcion, img }) {
    this.id = id
    this.nombre = nombre
    this.precio = precio
    this.cantidad = 1
    this.descripcion = descripcion
    this.img = img
  }

  aumentarCantidad() {
    this.cantidad++
  }

  disminuirCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--
      return true
    }

    return false
  }

  descripcionHTMLCarrito() {
    return `
    <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${this.img}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${this.nombre}</h5>
                    <p class="card-text">Cantidad: <button class="btn btn-dark" id="minus-${this.id}">-</button>${this.cantidad}<button class="btn btn-dark" id="plus-${this.id}">+</button> </p>
                    <p class="card-text">Precio: $${this.precio}</p>
                    <button class="btn btn-danger" id="eliminar-${this.id}">x<i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>
    </div>`
  }

  descripcionHTML() {
    return `
    <div class="card d-flex" style="width: 18rem;">
    <img src="${this.img}"  width="200px" height="200px" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${this.nombre}</h5>
      <p class="card-text">${this.descripcion}</p>
      <p class="card-text">$${this.precio}</p>
      <a href="#" class="btn btn-dark" id="ap-${this.id}">Añadir al carrito</a>
    </div>
  </div>`
  }

}

class Pedido {
  constructor() {
    this.listaDeComidas = []
    this.finalizar_pedido = document.getElementById("finalizar_pedido")
    this.total = document.getElementById("total")
    this.contenedor_comida = document.getElementById("contenedor_comida")
    this.keyStorage = "listaDeComidas"
  }

  cargarStorage() {
    this.listaDeComidas = JSON.parse(localStorage.getItem(this.keyStorage)) || [];
    if (this.listaDeComidas.length > 0) {
      let listaSecundaria = []
      for (let i = 0; i < this.listaDeComidas.length; i++) {
        const elemento = new Comida(this.listaDeComidas[i])
        listaSecundaria.push(elemento)
      }
      this.listaDeComidas = listaSecundaria

    }

  }

  guardarEnStorage() {
    let ListaDeComidasJSON = JSON.stringify(this.listaDeComidas)
    localStorage.setItem(this.keyStorage, ListaDeComidasJSON)
  }

  agregarComida(comidaAgrear) {
    if (this.listaDeComidas.some(comida => comida.id == comidaAgrear.id)) {
      const comida = this.listaDeComidas.find(comida => comida.id == comidaAgrear.id)
      comida.cantidad = comida.cantidad + 1
    }
    else {
      this.listaDeComidas.push(comidaAgrear)
    }
  }

  eliminarComida(comidaEliminar) {
    let comida = this.listaDeComidas.find(comida => comida.id == comidaEliminar.id)
    let indice = this.listaDeComidas.indexOf(comida)
    this.listaDeComidas.splice(indice, 1)
    this.guardarEnStorage()
  }

  limpiarPedido(msn = "") {
    this.contenedor_comida.innerHTML = ""
  }

  mostrarComida() {
    this.limpiarPedido()
    this.listaDeComidas.forEach(comida => {
      contenedor_comida.innerHTML += comida.descripcionHTMLCarrito()
    })

    this.listaDeComidas.forEach(comida => {
      let eliminar_btn = document.getElementById(`eliminar-${comida.id}`)
      let btn_plus = document.getElementById(`plus-${comida.id}`)
      let btn_minus = document.getElementById(`minus-${comida.id}`)
      eliminar_btn.addEventListener("click", () => {
        this.eliminarComida(comida)
        this.guardarEnStorage()
        this.mostrarComida()
      })

      btn_plus.addEventListener("click", () => {
        comida.aumentarCantidad()
        this.mostrarComida()
      }
      )

      btn_minus.addEventListener("click", () => {
        if (comida.disminuirCantidad()) {
          this.mostrarComida()

        }
      }
      )
    })

    total.innerHTML = "Precio Total:$" + this.calcularTotal()

  }
  calcularTotal() {
    return this.listaDeComidas.reduce((acumulador, comida) => acumulador + comida.precio * comida.cantidad, 0)
  }

  finalizarPedido() {
    this.finalizar_pedido.addEventListener("click", () => {
      if (this.listaDeComidas.length > 0) {
        let precioTotal = this.calcularTotal()
        this.listaDeComidas = []
        localStorage.removeItem(this.keyStorage)
        this.limpiarPedido()
        this.contenedor_comida.innerHTML = `<h3 class="text-center">Compra realizada con éxito!</h3>`
        this.total.innerHTML = "total" + "$:" + precioTotal
        
        



      }
      else {
        this.contenedor_comida.innerHTML = '<h3 class="text-center">¡No hay productos para finalizar la compra!</h3>'
      }

    })
  }

}

class ControladorComida {
  constructor() {
    this.listaDeComidas = []
  }

  agregarComida(comida) {
    this.listaDeComidas.push(comida)
  }


  mostrarComida() {
    let lista_menu = document.getElementById("lista_menu");
    this.listaDeComidas.forEach(comida => {
      lista_menu.innerHTML += comida.descripcionHTML()
    })

    this.listaDeComidas.forEach(comida => {
      let btn = document.getElementById(`ap-${comida.id}`)
      btn.addEventListener("click", () => {
        pedido.agregarComida(comida)
        pedido.guardarEnStorage()
        pedido.mostrarComida()
      })

    })

  }
}


const p1 = new Comida({ id: 1, nombre: "hamburguesa con chedar", precio: 600, descripcion: "chedar, doble carne y cebolla", img: "https://assets.unileversolutions.com/recipes-v2/209910.jpg" })
const p2 = new Comida({ id: 2, nombre: "hamburguesa doble chedar", precio: 800, descripcion: "doble chedar, triple carne y baicon", img: "https://www.infobae.com/new-resizer/IGVNt_OwhVuJnBWHh2OknRaxNIY=/1200x900/filters:format(webp):quality(85)/arc-anglerfish-arc2-prod-infobae.s3.amazonaws.com/public/4E7AO7Q6I5BULNYYH3SSO4WP2Y.jpeg" })
const p3 = new Comida({ id: 3, nombre: "hamburguesa especial", precio: 1000, descripcion: "carne, tomate, lechuga y pepino", img: "https://www.saborvenezolanokendall.com/cdn/shop/products/HAMBURGUESAESPECIAL3-min_2400x.jpg?v=1612293532" })
const p4 = new Comida({ id: 4, nombre: "papas fritas comunes", precio: 400, descripcion: "papas fritas comunes", img: "https://www.clarin.com/img/2023/01/24/V6Zed1p80_2000x1500__1.jpg" })
const p5 = new Comida({ id: 5, nombre: "papas fritas con chedar", precio: 500, descripcion: "papas fritas con chedar", img: "https://www.comedera.com/wp-content/uploads/2022/11/papas-fritas-con-queso-cheddar-PG_PFCQCY30320002.jpg" })
const p6 = new Comida({ id: 6, nombre: "papas fritas con crema", precio: 600, descripcion: "papas con crema", img: "https://locosxlaparrilla.com/wp-content/uploads/2015/02/Receta-recetas-locos-x-la-parrilla-locosxlaparrilla-receta-papas-fritas-queso-crema-verdeo-panceta-papas-fritas-queso-crema-2.jpg" })

const pedido = new Pedido()
pedido.cargarStorage()
pedido.mostrarComida()
pedido.finalizarPedido()



const CC = new ControladorComida()

CC.agregarComida(p1)
CC.agregarComida(p2)
CC.agregarComida(p3)
CC.agregarComida(p4)
CC.agregarComida(p5)
CC.agregarComida(p6)

CC.mostrarComida()







