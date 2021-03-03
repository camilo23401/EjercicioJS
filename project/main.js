const axios = require("axios");
const http = require("http");
const fs = require("fs");
const fsp = require("fs").promises;

const servidor = http
  .createServer(function (req, res) {
    switch (req.url) {
      case "/api/proveedores":
        fs.readFile(
          "./project/index.html",
          async function (error, content) {
            if (error) {
              res.writeHead(500);
              res.end("Error");
            } else {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(content, "utf-8");
              await llenarTablaProveedor(res);
            }
          }
        )
        break;
      case "/api/clientes":
        fs.readFile(
          "./project/index.html",
          async function (error, content) {
            if (error) {
              res.writeHead(500);
              res.end("Error");
            } else {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(content, "utf-8");
              await llenarTablaCliente(res);
            }
          }
        )
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

async function llenarTablaCliente(res) {
  const clientes = await promiseClientes();
  const tabla = tablaModificada(clientes,res,"clie");
  return tabla;
}

async function llenarTablaProveedor(res) {
  const proveedores = await promiseProveedores();
  const tabla = tablaModificada(proveedores,res,"prov");
  return tabla;
}

function tablaModificada(datos,res,tipo) {
  //let tabla = "";
  if(tipo==="prov"){
    res.write("<h1 class='text-center'>Listado de proveedores</h1>")
  }
  else if(tipo==="clie"){
    res.write("<h1 class='text-center'>Listado de clientes</h1>")
  }
  res.write("<table data-toggle='table' class='table table-striped'>")  
  res.write("<thead>")
  res.write("<tr>")
  res.write('<th scope="col">ID</th>')
  res.write('<th scope="col">Nombre de compañia</th>')  
  res.write('<th scope="col">Nombre de contacto</th>')  
  res.write("</tr>")
  res.write("</thead>")
  res.write("<tbody>")
  if(tipo === "prov")
  {
    for (i in datos) {
      let idcliente = datos[i].idproveedor;
      let nombreCompania = datos[i].nombrecompania;
      let nombreContacto = datos[i].nombrecontacto;
      res.write("<tr>")
      res.write("<td>")
      res.write(idcliente)
      res.write("</td>")
      res.write("<td>")
      res.write(nombreCompania)
      res.write("</td>")
      res.write("<td>")
      res.write(nombreContacto)
      res.write("</td>")
      res.write("</tr>")
    }
    res.write("</tbody>")
    res.write("</table>")
    res.end()
  }
  else if(tipo === "clie")
  {
    for (i in datos) {
      let idcliente = datos[i].idCliente;
      let nombreCompania = datos[i].NombreCompania;
      let nombreContacto = datos[i].NombreContacto;
      res.write("<tr>")
      res.write("<td>")
      res.write(idcliente)
      res.write("</td>")
      res.write("<td>")
      res.write(nombreCompania)
      res.write("</td>")
      res.write("<td>")
      res.write(nombreContacto)
      res.write("</td>")
      res.write("</tr>")
    }
    res.write("</tbody>")
    res.write("</table>")
    res.end()
  }
  
}
