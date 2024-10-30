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

function getUniqueCategory(data){
    let category=data.map(item=>item.category);
    return [...new Set(category)];
}

app.get("/",async(req,res)=>{
    try {
        const result = await axios.get(apiUrl+"/products");
        const category = getUniqueCategory(result.data);
        //console.log(testimony);
        //console.log("result : ",result.data);
        res.render("index.ejs",{data:result.data, category:category});
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
                displayed="men's clothing";
                break;
            case "jewelry":
                displayed="jewelry";
                break;
            case "electronics":
                displayed="electronics";
                break;
            case "woman's clothing":
                displayed="woman's clothing";
                break;
            default:
                console.log();
                break;
        }
        console.log("req.body.name : "+req.body.choice);
        console.log("displayed : "+displayed);
        if(displayed=""){
            result = await axios.get(apiUrl+"/products");    
        }else{
            result = await axios.get(apiUrl+"/products/category/"+displayed);
        }
        const category = getUniqueCategory(await axios.get(apiUrl+"/products").data);
        console.log("category :"+category);
        console.log("result :"+result.data)
        res.render("display.ejs",{data:result.data, category:category});
    } catch (error) {
        console.log("error : ",error);
        res.render("display.ejs", {data:error.response});
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });  