import e from "express";
import axios from "axios";
import ejs from "ejs";
import bodyParser from "body-parser";

const port =3000;
const app=e();

const apiUrl="https://fakestoreapi.com"


app.use(e.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const testimonyUrl="./JSON/testimonial.json"

app.get("/",async(req,res)=>{
    try {
        const result = await axios.get(apiUrl+"/products");
        const category = await axios.get(apiUrl+"/products/categories");
        //console.log(category.data);
        //console.log("result : ",result.data);
        res.render("index.ejs",{data:result.data, category:category.data});
    } catch (error) {
        console.log("error : ",error);
        res.render("index.ejs", {data:error.response});
    }
})

app.get("/aboutUs",async(req,res)=>{
    const result = await axios.get(apiUrl+"/products");
        const category = getUniqueCategory(result.data);
        res.render("aboutus.ejs",{data:result.data, category:category});
})

app.post("/product",async(req,res)=>{
    try {
        let displayed;
        let result;
        switch (req.body.choice) {
            case "All Product":
                displayed="";
                break;
            case "men's clothing":
                displayed="/category/men's clothing";
                break;
            case "jewelry":
                displayed="/category/jewelry";
                break;
            case "electronics":
                displayed="/category/electronics";
                break;
            case "woman's clothing":
                displayed="/category/woman's clothing";
                break;
            default:
                console.log();
                break;
        }
        
        result = await axios.get(apiUrl+"/products"+displayed);
        const category = await axios.get(apiUrl+"/products/categories");
        console.log(category.data);
        res.render("display.ejs",{data:result.data, category:category.data});
    } catch (error) {
        console.log("error : ",error);
        res.render("display.ejs", {data:error.response});
    }
})

app.get("/login",async(req,res)=>{
    const category = await axios.get(apiUrl+"/products/categories");
    console.log(category.data);
    res.render("login.ejs",{category:category.data});
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });  