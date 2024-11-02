import e from "express";
import axios from "axios";
import ejs from "ejs";
import bodyParser from "body-parser";
import multer from "multer";

const port =3000;
const app=e();

const apiUrl="https://fakestoreapi.com"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images'); // Set the destination directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

app.use(e.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const category = await axios.get(apiUrl+"/products/categories");
const testimonyUrl="./JSON/testimonial.json"


//display
app.get("/",async(req,res)=>{
    try {
        const result = await axios.get(apiUrl+"/products");
        res.render("index.ejs",{data:result.data, category:category.data});
    } catch (error) {
        console.log("error : ",error);
        res.render("index.ejs", {data:error.response});
    }
})

app.get("/aboutUs",async(req,res)=>{
    const result = await axios.get(apiUrl+"/products");
        //const category = getUniqueCategory(result.data);
        res.render("aboutus.ejs",{data:result.data, category:category.data});
})


//product
app.get("/product",async(req,res)=>{
    let result = await axios.get(apiUrl+"/products");
    res.render("display.ejs",{data:result.data, category:category.data});
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
            case "jewelery":
                displayed="/category/jewelery";
                break;
            case "electronics":
                displayed="/category/electronics";
                break;
            case "women's clothing":
                displayed="/category/women's clothing";
                break;
            default:
                console.log();
                break;
        }
        
        result = await axios.get(apiUrl+"/products"+displayed);
        //console.log("req.body.choice :"+req.body.choice+", displayed :"+displayed);
        //console.log(category.data);
        //console.log(result.data);
        res.render("display.ejs",{data:result.data, category:category.data});
    } catch (error) {
        //console.log("req.body.choice :"+req.body.choice);
        console.log("error : ",error);
        res.render("display.ejs", {data:error.response});
    }
})

app.get("/input",(req,res)=>{
    let headingText="Add New Product";
    res.render("input.ejs",{category:category.data, head:headingText});
}
)

app.post("/submit",upload.single('image'),async(req,res)=>{
    const postData= await axios.post(apiUrl+"/products",{ data:{
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        image:req.file,
        category:req.body.category,
    }})
    res.redirect("/");
})

app.post("/detail",async(req,res)=>{
    let index=req.body.index;
    let data= await axios.get(apiUrl+"/products/"+index);
    console.log(data);
    res.render("details.ejs",{data:data.data, category:category.data});
})


//user
app.get("/login",async(req,res)=>{
    let txt="Please Log In"
    res.render("login.ejs",{category:category.data, text:txt});
})

app.post("/login",async(req,res)=>{
    const user = await axios.get(apiUrl+"/users")
    let username=req.body.username;
    let password=req.body.password;
    let auth=false;
    let index=-1;
    let txt="Please Log In";
    let name;
    //console.log(user.data.id);
    txt=checkUsernameandPassword(username,password,user.data);
    res.render("login.ejs",{txt:txt, category:category.data});

    /*for(var i=0;i<user.data.length;i++)
    {
        if(username===user.data[i].username)
        {
            if(password===user.data[i].password){
                auth=true;
                index=i;
                console.log("login successfully to user :"+user.data[i].name.firstname+" "+user.data[i].name.lastname)
            }else{
                console.log("incorrect password");
                txt="Incorrect Password";
                res.render("login.ejs",{category:category.data, text:txt})
            }
        }else{
            console
        }
    }*/
});

function checkUsernameandPassword(user,password,data){
    let result;
    for(var i=0;i<data.length;i++)
    {
        if(user===data[i].username)
        {
            console.log("checking user "+user+" to "+ data[i].username);
            if(password===data[i].password)
            {
                //console.log("checking pass "+password+" to "+ data[i].password);
                result=`Welcome ${data[i].name.firstname} ${data[i].name.lastname}`;
                break;
            }else{
                //console.log("wrong password");
                result="Wrong Password"
                break;
            }
        }else{
            result="No User Found!"
        }
    }
    return result;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });