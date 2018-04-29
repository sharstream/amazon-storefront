// bamazonManager.js main application

let inquirer = require("inquirer");

let connection = require("./connection.js");
function runSearch() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('connected');
        console.log("connected as id " + connection.threadId);
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: "Which action you want to perform?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add New Product",
                    "Add to Inventory"
                ]
            }
        ]).then(function (answers) {
            switch (answers.choice) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewInventory();
                    break;
                case "Add New Product":
                    inquirer.prompt([
                        {
                            name: "product",
                            type: "input",
                            message: "Enter the product name?"
                        },
                        {
                            name: "department",
                            type: "list",
                            message: "Select which department this product belongs?",
                            choices: [
                                "Amazon Fresh",
                                "Echo & Alexa",
                                "Electronic, Computer & Office",
                                "Home, Garden $ Tools",
                                "Toys, Kids & Baby"
                            ]
                        },
                        {
                            name: "price",
                            type: "input",
                            message: "How much cost this product?"
                        },
                        {
                            name: "stock_quantity",
                            type: "input",
                            message: "How many?"
                        }
                    ]).then( (answers) => {
                        addProduct(answers.product, answers.department, answers.price, answers.stock_quantity);
                        connection.end();
                    });
                    
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                default:
                    console.log('Sorry, we are out of choice.');
            }
            connection.end();
        });
    });
}

runSearch();

function viewProducts() {
    connection.query(`SELECT * FROM products`, function (err, res) {
        if (err) {
            throw err;
        }
        console.log("-------------View Products for Sale---------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("--------------------------------------------------");
    });
};

function viewInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5;', function (err, res) {
        if (err) {
            throw err;
        }
        console.log("-------------View Low Inventory---------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].year + " | " + res[i].stock_quantity);
        }
        console.log("----------------------------------------------");
    });
};

function addProduct(product_name, department_name, price, stock_quantity){
    let sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
    connection.query(sql, [product_name, department_name, price, stock_quantity], (err, res) => {
        if (err) throw err;
        console.log("1 record inserted");
    });
}

function addInventory() {
    let sql = "";
    connection.query(sql, () => {

    });
}