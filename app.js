const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
var format = require("date-fns/format");
var isMatch = require("date-fns/isMatch");
var isValid = require("date-fns/isValid");
const path = require("path");
let dbpath = path.join(__dirname, "todoApplication.db");
let db;
const intaliseDbandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running http://www.localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};
const todoobjtoresponseObj = (dbobject) => {
  return {
    id: dbobject.id,
    todo: dbobject.todo,
    status: dbobject.status,
    priority: dbobject.priority,
    category: dbobject.category,

    dueDate: dbobject.due_date,
  };
};

let checking = (request, response, next) => {
  switch (true) {
    case request.query["status"] !== undefined:
      if (
        request.query["status"] === "TO DO" ||
        request.query["status"] === "IN PROGRESS" ||
        request.query["status"] === "DONE"
      ) {
        request.status = request.query["status"];
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case request.query["priority"] !== undefined:
      if (
        request.query["priority"] === "HIGH" ||
        request.query["priority"] === "MEDIUM" ||
        request.query["priority"] === "LOW"
      ) {
        request.priority = request.query["priority"];
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;
    case request.query["category"] !== undefined:
      if (
        request.query["category"] === "WORK" ||
        request.query["category"] === "HOME" ||
        request.query["category"] === "LEARNING"
      ) {
        request.category = request.query["category"];
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    default:
      next();
      break;
  }
};
let checkingdate = (request, response, next) => {
  try {
    let duedate2 = format(new Date(request.query["date"]), "yyyy-MM-dd");
    request.date = duedate2;
    next();
  } catch (e) {
    response.status(400);
    response.send("Invalid Due Date");
  }
};
let checking2 = (request, response, next) => {
  switch (true) {
    case request.body["status"] !== undefined:
      if (
        request.body["status"] === "TO DO" ||
        request.body["status"] === "IN PROGRESS" ||
        request.body["status"] === "DONE"
      ) {
        request.status = request.body["status"];

        if (
          request.body["priority"] === "HIGH" ||
          request.body["priority"] === "MEDIUM" ||
          request.body["priority"] === "LOW"
        ) {
          request.priority = request.body["priority"];

          if (
            request.body["category"] === "WORK" ||
            request.body["category"] === "HOME" ||
            request.body["category"] === "LEARNING"
          ) {
            request.category = request.body["category"];

            try {
              let duedate1 = format(
                new Date(request.body["dueDate"]),
                "yyyy-MM-dd"
              );

              request.dueDate = duedate1;
              //request.category = request.body["category"];
              // request.status = request.body["status"];
              // request.priority = request.body["priority"];
              next();
            } catch (e) {
              response.status(400);
              response.send("Invalid Due Date");
            }
          } else {
            response.status(400);
            response.send("Invalid Todo Category");
          }
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
        //request.status = request.body["status"];
        //next();
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
  }
};
let checking3 = (request, response, next) => {
  switch (true) {
    case request.body["todo"] !== undefined:
      request.todo = request.body["todo"];
      next();
      break;
    case request.body["status"] !== undefined:
      if (
        request.body["status"] === "TO DO" ||
        request.body["status"] === "IN PROGRESS" ||
        request.body["status"] === "DONE"
      ) {
        request.status = request.body["status"];
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case request.body["priority"] !== undefined:
      if (
        request.body["priority"] === "HIGH" ||
        request.body["priority"] === "MEDIUM" ||
        request.body["priority"] === "LOW"
      ) {
        request.priority = request.body["priority"];
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;
    case request.body["category"] !== undefined:
      if (
        request.body["category"] === "WORK" ||
        request.body["category"] === "HOME" ||
        request.body["category"] === "LEARNING"
      ) {
        request.category = request.body["category"];
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    case request.body["dueDate"] !== undefined:
      try {
        let duedate2 = format(new Date(request.body["dueDate"]), "yyyy-MM-dd");

        request.dueDate = duedate2;
        next();
      } catch (e) {
        response.status(400);
        response.send("Invalid Due Date");
      }
      break;
  }
};
//Api1
app.get("/todos/", checking, async (request, response) => {
  let { search_q = "" } = request.query;
  let { status = "", priority = "", category = "" } = request;
  console.log(status);
  let getQuery = `select * from todo
   where 
   todo like '%${search_q}%' and 
   status like '%${status}%' and 
   priority  like '%${priority}%' and 
   category like '%${category}%' ;`;
  let result1 = await db.all(getQuery);
  response.send(result1.map((eachres) => todoobjtoresponseObj(eachres)));
});
//API2
app.get("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let getIdQuery = `select * from todo where id='${todoId}';`;
  let res2 = await db.get(getIdQuery);
  response.send(todoobjtoresponseObj(res2));
});
//API3
app.get("/agenda/", checkingdate, async (request, response) => {
  let { date } = request;
  let getdaQuery = `select * from todo where due_date='${date}';`;
  let res3 = await db.all(getdaQuery);
  response.send(res3.map((eachday) => todoobjtoresponseObj(eachday)));
});

//API4
app.post("/todos/", checking2, async (request, response) => {
  let { id, todo } = request.body;
  let { category, priority, status, dueDate } = request;
  let todonewQuery = `insert into todo
    (id,todo,category,priority,status,due_date)
    values('${id}',
    '${todo}',
    '${category}',
    '${priority}',
    '${status}',
    '${dueDate}');`;
  await db.run(todonewQuery);
  console.log(todo);
  response.send("Todo Successfully Added");
});
//API5
app.put("/todos/:todoId/", checking3, async (request, response) => {
  let { todoId } = request.params;
  let requestbody = request.body;
  let updateCol = "";
  switch (true) {
    case requestbody.status !== undefined:
      updateCol = "Status";
      break;
    case requestbody.priority !== undefined:
      updateCol = "Priority";
      break;
    case requestbody.todo !== undefined:
      updateCol = "Todo";
      break;
    case requestbody.category !== undefined:
      updateCol = "Category";
      break;
    case requestbody.dueDate !== undefined:
      updateCol = "Due Date";
      break;
  }
  let pretodoQuery = `select * from todo where id='${todoId}';`;
  const pretodo = await db.get(pretodoQuery);
  let {
    todo = pretodo.todo,
    category = pretodo.category,
    priority = pretodo.priority,
    status = pretodo.status,
    dueDate = pretodo.due_date,
  } = request;

  let updtoda = `update todo set
   todo='${todo}',
    category='${category}',
    priority='${priority}',
    status='${status}', 
    due_date='${dueDate}'
  where id='${todoId}';`;

  await db.run(updtoda);

  response.send(`${updateCol} Updated`);
});
//API6
app.delete("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let delQuery = `delete from todo where id='${todoId}';`;
  await db.run(delQuery);
  response.send("Todo Deleted");
});

intaliseDbandServer();
module.exports = app;
