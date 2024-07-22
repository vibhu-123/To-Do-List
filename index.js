import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  database : "permalist",
  port : 5432,
  host : "localhost",
  password : "vipul123",
  user : "postgres"
});

db.connect();

var items = [
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },
];

async function getItems(){
  items = [];
  let result = await db.query("SELECT * from items");
  result.rows.forEach((item)=>{
    items.push(item);
  });
  return items;
  
}

let date = new Date();
let day = date.getDay();
let today;
if(day == 0 || day == 6){
  today = "weekend";
}
else if(day == 1)
  today = "Monday";
else if(day == 2)
  today = "Tuesday";
else if(day == 3)
  today = "Wednesday";
else if(day == 4)
  today = "Friday";
else
  console.log("Error in current day");


app.get("/", async (req, res) => {
  let currentItems = await getItems();
  res.render("index.ejs", {
    listTitle: today, 
    listItems: currentItems
  });
});  

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let id = Number(req.body.updatedItemId);
  let item = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [item, id]);

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  let id = req.body.deleteItemId;
  await db.query("DELETE from items where id = ($1)", [id]);
  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
