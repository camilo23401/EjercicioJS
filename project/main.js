const axios = require("axios");
const http = require("http");
const fs = require("fs");
const fsp = require("fs").promises

const servidor = http
  .createServer(async function (req, res) {
    switch (req.url) {
      case "/api/proveedores":
        llenarTablaProveedor().then((_) =>
          fs.readFile(
            "./project/indexModificado.html",
            function (error, content) {
              if (error) {
                res.writeHead(500);
                res.end("Error");
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(content, "utf-8");
                res.end();
              }
            }
          )
        );
        break;
      case "/api/clientes":
        llenarTablaCliente().then((_) =>
          fs.readFile(
            "./project/indexModificado.html",
            function (error, content) {
              if (error) {
                res.writeHead(500);
                res.end("Error");
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content, "utf-8");
              }
            }
          )
        );
        break;
      default:
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Pagina default");
    }
  })
  .listen(8081);

const promiseClientes = async () => {
  try {
    const resp = await axios.get(
      "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json"
    );
    return resp.data;
  } catch (err) {
    console.error(err);
  }
};

const promiseProveedores = async () => {
  try {
    const resp = await axios.get(
      "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json"
    );
    return resp.data;
  } catch (err) {
    console.error(err);
  }
};

async function llenarTablaCliente() {
  promiseClientes().then((data) => {
    const tablaModificada = async () => {
      let tabla = "";
      for (i in data) {
        let idcliente = data[i].idCliente;
        let nombreCompania = data[i].NombreCompania;
        let nombreContacto = data[i].NombreContacto;

        let aux =
          "<tr> " +
          "<td> " +
          idcliente +
          " </td> " +
          "<td> " +
          nombreCompania +
          " </td> " +
          "<td> " +
          nombreContacto +
          " </td> " +
          " </tr>";
        tabla += aux;
      }
      return tabla;
    };
    tablaModificada().then((tabla) => {
      fs.readFile("./project/index.html", "utf-8", function (err, data) {
        if (err) {
          return console.log(err);
        }
        var modificado = data.replace(/auxiliarFSNOD/g, tabla);
        var modificado2 = modificado.replace(/identificador/g, "Id de cliente");
        var modificado3 = modificado2.replace(/titulo/, "Clientes");

        fs.writeFile(
          "./project/indexModificado.html",
          modificado3,
          "utf8",
          function (err) {
            if (err) console.log(err);
          }
        );
      });
    });
  });
}

async function llenarTablaProveedor() {
  promiseProveedores().then((data) => {
    const tablaModificada = async () => {
      let tabla = "";
      for (i in data) {
        let idcliente = data[i].idproveedor;
        let nombreCompania = data[i].nombrecompania;
        let nombreContacto = data[i].nombrecontacto;

        let aux =
          "<tr> " +
          "<td> " +
          idcliente +
          " </td> " +
          "<td> " +
          nombreCompania +
          " </td> " +
          "<td> " +
          nombreContacto +
          " </td> " +
          " </tr>";
        tabla += aux;
      }
      return tabla;
    };
    tablaModificada().then((tabla) => {
      fsp.readFile("./project/index.html", "utf-8", function (err, data) {
        if (err) {
          return console.log(err);
        }
        else{}
        var modificado = data.replace(/auxiliarFSNOD/g, tabla);
        var modificado2 = modificado.replace(
          /identificador/g,
          "Id del proveedor"
        );
        var modificado3 = modificado2.replace(/titulo/, "Proveedores");
        fs.writeFile(
          "./project/indexModificado.html",
          modificado3,
          "utf8",
          function (err) {
            if (err) console.log(err);
            else console.log(modificado3)
          }
        );
        return modificado3;
      }).then(resp => console.log(resp));
    });
  });
;
}
