
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
        <div class="bg-warning row g-0">
            <div class="col-md-4">
                <img src="${this.img}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${this.nombre}</h5>
                    <p class="card-text">Cantidad: <button class="btn btn-dark" id="minus-${this.id}">-</button>${this.cantidad}<button class="btn btn-dark" id="plus-${this.id}">+</button> </p>
                    <p class="card-text">Precio: $${this.precio}</p>
                    <button class="btn btn-danger" id="eliminar-${this.id}"><img class="btn_eliminar " src="./assets/img/cross.png" alt=""></button>
                </div>
            </div>
        </div>
    </div>`
  }

  descripcionHTML() {
    return `
    <div class="bg-warning card d-flex" style="width: 18rem;">
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

  async cargarComidas() {
    try {
      const response = await fetch('comidas.json');
      const data = await response.json();

      data.forEach(comidaData => {
        const comida = new Comida(comidaData);
        this.agregarComida(comida);
      });

      this.mostrarComida();
    } catch (error) {
      // No se necesita console.error aquí
    }
  }



  mostrarComida() {
    let lista_menu = document.getElementById("lista_menu");
    this.listaDeComidas.forEach(comida => {
      lista_menu.innerHTML += comida.descripcionHTML()
    })

    this.listaDeComidas.forEach(comida => {
      let btn = document.getElementById(`ap-${comida.id}`)
      btn.addEventListener("click", (event) => {
        event.preventDefault()
        pedido.agregarComida(comida)
        pedido.guardarEnStorage()
        pedido.mostrarComida()
        Toastify({
          text: "!Comida añadida!",
          duration: 3000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "green",
          },
          onClick: function () { } // Callback after click
        }).showToast();

      })
    })

  }
}



const pedido = new Pedido()
pedido.cargarStorage()
pedido.mostrarComida()
pedido.finalizarPedido()



const CC = new ControladorComida();
CC.cargarComidas();

CC.mostrarComida()







