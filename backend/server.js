require('dotenv').config(); // Load .env variables first
console.log('MONGODB_URI:', process.env.MONGODB_URI); // Add this line to debug
const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb");

const PORT = 3001;
const cors = require('cors');
app.use(cors());

//for uploading image
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant-menu',           
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => Date.now().toString(),
  },
});

const upload = multer({ storage });
////////////////////////////////////////////////
const bodyParser = require("body-parser");
const { error } = require('console');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
const MongoClient = require("mongodb").MongoClient;

const url = process.env.MONGODB_URI;
// const url = 'mongodb+srv://manish:ramsita@cluster0.2chdzeq.mongodb.net/resturent-db?retryWrites=true&w=majority&appName=Cluster0';

const databasename = "resturent-db";
const JWT_SECRET = process.env.JWT_SECRET;
let dbcon;

// Connect to MongoDB and start the server only after connection
MongoClient.connect(url)
    .then((client) => {
        dbcon = client.db(databasename);
        console.log("Database connected..");

        // Only start server after DB connection established
        app.listen(PORT, function (err) {
            if (err) console.log(err);
            console.log("server listening on PORT...", PORT);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database", err);
        process.exit(1);
    });

// listing all items
router.get('/menu', async (req, res) => {
    try {
        if (!dbcon) {
            return res.status(503).send({ error: "DB not connected" });
        }
        let searchQuery = req.query.search || "";
        console.log("earch query is ......", searchQuery)
        let collection = dbcon.collection("menuItem");
        console.log("collection readyyy......", collection)
        const regx = new RegExp(searchQuery,"i");
        const query = {
            $or:[
                {name:{$regex:regx}},
                {description:{$regex:regx}},
                {category:{$regex:regx}}
            ]
        }
        const results = await collection.find(searchQuery ? query : {}).toArray();
        console.log('list .....' + results.length);
        res.status(200).send(results);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
// listing all today's special items
router.get('/menu/today-special', async (req, res) => {
  try {
    let collection = dbcon.collection('menuItem');
    const results = await collection.find({ category: 'today-special' }).toArray();
    console.log('listitems .....' + results.length);
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
//Listing tables
router.get('/tables', async(req,res)=>{
    try{
        let tables =dbcon.collection('tables');
        const collectedTables = await tables.find({}).toArray();
        res.status(200).send(collectedTables);
    }catch(err){
        res.status(500).send({error:err.message})
    }
})
//booking tables
router.post('/bookings', async(req,res)=>{
    try{
    const bookingData = req.body;
    if(!bookingData || !bookingData.name || !bookingData.phonenumber || !bookingData.date ||! bookingData.entrytime || !bookingData.exittime||!bookingData.guest)
    {
        return res.status(400).send("incomplete booking data");
    }
    //saving booking data
    let bookingCollection = dbcon.collection('bookings')
    const bookedData = await bookingCollection.insertOne(bookingData)
    //updating table status to booked
    if(bookingData.table){
        const tableCollection = dbcon.collection('tables')
         await tableCollection.updateOne({tableNo:bookingData.table},
        {$set:{status:'booked'}}
    )};
    res.status(200).send({message:"table booked successfully",data:bookedData})
}catch(err){
    res.status(500).send({message:err.message})
}
})
//logic for singup
router.post("/signup", async(req,res)=>{
    const {name,email,password} = req.body;
    try{
        const users = dbcon.collection("users");
        const userExit = await users.findOne({email});
        if (userExit){
            return res.status(400).json({error:"user alredy exits"});
        };
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser  = {name,email,password:hashedPassword,status:"active"};
        await users.insertOne(newUser);
        res.status(201).json({message:"singup successfully"})
    }
    catch(err){
        res.status(200).json({error:err.message})
    };
});
//logic for login
router.post("/login", async(req,res)=>{
    const {email,password} = req.body
    try{
        const users = dbcon.collection("users");
        const user = await users.findOne({email});
        if(!user){
            return res.status(400).json({error:"user not found"})
        };
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ error: "Invalid password" });
        };
        const token = jwt.sign({id:user._id,email: user.email }, JWT_SECRET,{expiresIn:"1d"});
        
         res.status(200).json({ message: "Login successful", token, user: { name: user.name, email: user.email } });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//adding cart logic
router.post("/add-to-cart", async(req,res)=>{
      const token = req.headers.authorization?.split(" ")[1]
      const {item} = req.body;
      try{
        if(!token) return res.status(401).json({error:"unauthorized"});
        //decode token
        const decoded = jwt.verify(token,JWT_SECRET)
        const userEmail = decoded.email;
        const carts = dbcon.collection("carts");
        const userCart = await carts.findOne({userEmail});
        if(userCart){
            const itemIndex =userCart.items.findIndex(i => i.itemId === item.itemId);
            if(itemIndex > -1){
                userCart.items[itemIndex].quantity +=1;
            }else{
                userCart.items.push({...item, quantity:1})
            }
            await carts.updateOne({userEmail},
                {$set:{items:userCart.items}}
            );
        }else{
            await carts.insertOne({
                userEmail,
                items:[{...item, quantity:1}]
            });
        }
         res.status(200).json({ message: "Item added to cart" });
    } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logic for adding favorite items
router.post("/add-to-fav", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { item } = req.body;

  try {
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    const favCollection = dbcon.collection("favorite");
    const userfav = await favCollection.findOne({ userEmail });

    if (userfav && userfav.items) {
      const itemExists = userfav.items.some(i => i.itemId === item.itemId);
      if (itemExists) {
        return res.status(200).json({ message: "Item already in favorites" });
      } else {
        userfav.items.push(item);
        await favCollection.updateOne(
          { userEmail },
          { $set: { items: userfav.items } }
        );
      }
    } else {
      // First-time favorite list
      await favCollection.insertOne({
        userEmail,
        items: [item]
      });
    }

    res.status(200).json({ message: "Item added to favorite" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//listing user cart items
router.get("/cart-items",async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).json({error:"unauthorized"})
            //decoding jwt tokens
        const decoded = jwt.verify(token,JWT_SECRET);
        const userEmail = decoded.email;
        let cart = dbcon.collection("carts")
        const userCart = await cart.findOne({userEmail})
        if(!userCart) return res.status(200).json({items:[]})
        res.status(200).json({items:userCart.items})
    }catch(err){
        res.status(500).json({error:err.message})
    }
});
///update cart items increse decrese
router.put("/update-cart", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { itemId, newQuantity } = req.body;
  try {
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;
    const cart = dbcon.collection("carts");
    const userCart = await cart.findOne({ userEmail });
    if (!userCart) return res.status(404).json({ error: "Cart not found" });
    const updatedItems = userCart.items.map((item) =>
      item.itemId === itemId ? { ...item, quantity: newQuantity } : item
    );
    await cart.updateOne({ userEmail }, { $set: { items: updatedItems } });
    res.status(200).json({ message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
///delete cart items 
router.delete("/remove-cart-item", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { itemId } = req.body;
  try {
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;
    const cart = dbcon.collection("carts");
    const userCart = await cart.findOne({ userEmail });
    if (!userCart) return res.status(404).json({ error: "Cart not found" });
    const updatedItems = userCart.items.filter(item => item.itemId !== itemId);
    await cart.updateOne({ userEmail }, { $set: { items: updatedItems } });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/// updating userprofile
router.put("/update-profile", upload.single('profileImage'), async(req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;
    const { address, phone } = req.body;
    let updateFields = { address, phone };
    if (req.file) {
      // Save relative path to DB, e.g., '/images/filename.jpg'
      updateFields.profileImage = req.file.path;
    }
    const users = dbcon.collection("users");
    await users.updateOne({ email: userEmail }, { $set: updateFields });
    res.status(200).json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// getting cuurent user login profile
router.get("/profile",async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).json({error:"Unauthorized"})
        const decoded = jwt.verify(token,JWT_SECRET);
        const userEmail = decoded.email;

        const users = dbcon.collection("users");
        const user = await users.findOne({email:userEmail})
     // Return only required fields
        const { name, email, phone, address, profileImage } = user;
        res.status(200).json({ name, email, phone, address, profileImage });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});
/// logic to get profile on update profile
router.get("/user-info", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;
    const users = dbcon.collection("users");
    const user = await users.findOne({ email: userEmail }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//getting all fav items
router.get("/fav-items", async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    try{
        if(!token) return res.status(401).json({error:"Unauthorized"});
        const decoded = jwt.verify(token,JWT_SECRET);
        const userEmail = decoded.email;
        const favItems = dbcon.collection("favorite")
        const userFav = await favItems.findOne({userEmail});
        if(!userFav) return res.status(404).json({items:[], message:"Favorite item not found"})
        res.status(200).json({items:userFav.items})
    } catch (err) {
    res.status(500).json({ error: err.message });
     }
});
///order information storing on database
router.post("/order-detail", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  const { customerInfo, payment, orderItems, summary } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;
    const orderCollection = dbcon.collection("order");
    const cartCollection = dbcon.collection("carts");
    const newOrder = {
      email: userEmail,
      customerInfo,
      payment,
      orderItems,
      summary,
      createdAt: new Date(),
      status: "pending"
    };
    const result = await orderCollection.insertOne(newOrder);
    // ✅ Corrected field name from `email` to `userEmail`
    await cartCollection.deleteOne({ userEmail: userEmail });
    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.insertedId
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});
///logic for order history
router.get("/order-history", async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  try{
    if(!token) return res.status(401).json({message:"Unauthorized"})
    const decoded = jwt.verify(token,JWT_SECRET);
    const userEmail = decoded.email;

    const orderCollection = dbcon.collection("order");
    const orders = await orderCollection.find({email:userEmail}).toArray()

    res.status(200).json({orders})
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
////for admin apis
//dashbord apis
router.get("/dashboard",async(req,res)=>{
  try{
    const orderColl = dbcon.collection("order")
    const userColl = dbcon.collection('users')
    const totalOrder = await orderColl.countDocuments();
    const totalUser = await userColl.countDocuments();
    const menuColl = dbcon.collection("menuItem");
    const todaySpecial = await menuColl.findOne({category:"today-special"});
    const deliveredOrder = await orderColl.find({status:"delivered"}).toArray();
    const pendingOrder =await orderColl.find({status:"pending"}).toArray();
    const cancelledOrder = await orderColl.find({status:"cancelled"}).toArray();
    const deliverOrderPercent = (deliveredOrder.length/totalOrder)*100;
    const pendingOrderPerecent = (pendingOrder.length/totalOrder)*100;
    const cancelledOrderPercent = (cancelledOrder.length/totalOrder)*100;
    const totalSales = await deliveredOrder.reduce((sum,order)=>sum+(order.summary?.total || 0),0)
    res.status(200).json({
      orders:totalOrder,
      users:totalUser,
      sales:totalSales,
      special:todaySpecial,
      deliverPercent:deliverOrderPercent,
      pendingPercent:pendingOrderPerecent,
      cancelledPercent:cancelledOrderPercent
    })
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
//listing all  orders
router.get("/allorder", async (req, res) => {
  try {
    const orderCollection = dbcon.collection("order");

    const result = await orderCollection.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "email",         // order.email
          foreignField: "email",       // users.email
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          status: 1,
          summary: 1,
          orderItems: 1,
          createdAt: 1,
          "userDetails.phone": 1,
          "userDetails.name": 1,
          email: 1,
          customerInfo: 1
        }
      }
    ]).toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});// deleting order data
router.delete("/del-order/:id",async(req,res)=>{
  const orderId = req.params.id;
  if(!ObjectId.isValid(orderId)) return res.status(400).json({error:"invalid orderId"})
    try{
      const orderColl = dbcon.collection("order")
      const deleteOrder = await orderColl.deleteOne({_id: new ObjectId(orderId)})
      if(deleteOrder.deletedCount===0) return res.status(404).json("order not found")
      res.status(200).json({messege:"order delted successfully"})
    }catch(err){
      console.error('Error deleting order:', err);
    res.status(500).json({error:err.message})
    }
})
// viewing order per user
router.get("/order/:id", async (req, res) => {
  const orderId = req.params.id;
  if (!ObjectId.isValid(orderId)) return res.status(400).json({ error: "Invalid order ID" });

  try {
    const orderCollection = dbcon.collection("order");
    const order = await orderCollection.findOne({ _id: new ObjectId(orderId) });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

///getting usersdata
router.get("/allusers",async(req,res)=>{
  try{
    const userColl = dbcon.collection("users");
    const user = await userColl.find({},{projection:{name:1,email:1,phone:1,address:1,status:1}}).toArray()
    res.status(200).json(user)
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
// deleting user data
router.delete("/del-user/:id",async(req,res)=>{
  const userId = req.params.id;
  if(!ObjectId.isValid(userId)) return res.status(400).json({error:"invalid userid"})
  try{
    const userColl = dbcon.collection("users");
    const user = await userColl.deleteOne({_id: new ObjectId(userId)})
    if(user.deletedCount===0){
      return res.status(404).json("user not found")
    }
    res.status(200).json("user deleted successfully")
  }catch(err){
    console.error('Error deleting order:', err);
    res.status(500).json({error:err.message})
  }
})
/// blocking user
router.put("/block-user/:id",async(req,res)=>{
  const userId = req.params.id
  if(!ObjectId.isValid(userId)) return res.status(400).json({error:"invalid id"})
  try{
    const users = dbcon.collection("users")
    const user = await users.findOne({_id: new ObjectId(userId)})
    if(!user) return res.status(400).json({error:"user not found"})
    const newStatus = user.status==="active"?"blocked":"active"
    await users.updateOne({
      _id:new ObjectId(userId)},{
        $set:{status:newStatus}
      }
    )
     res.json({ message: `User is now ${newStatus}`, status: newStatus });
  }catch(err){
    console.error("Failed to update user status:", err);
    res.status(500).json({ error: "Server error while updating user" });
  }
})
// editing users data
router.get("/user-info/:id",async(req,res)=>{
  const userId = req.params.id;
  if(!ObjectId.isValid(userId)) return res.status(400).json({error:"invalid user"})
  try{
    const usercoll = dbcon.collection("users")
    const user = await usercoll.findOne({_id:new ObjectId(userId)})
    res.status(200).json({
      name:user.name,
      mobile:user.phone,
      address:user.address
    })
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
//putting updated data
router.put("/update-user-info/:id",async(req,res)=>{
  const userId = req.params.id;
  if(!ObjectId.isValid(userId)) return res.status(400).json({error:"invalid id"})
  const {name,mobile,address,newPassword} = req.body
  try{
    const userColl = dbcon.collection("users")
    const updateFields ={
      name:name,
      phone:mobile,
      address:address
    }
    if(newPassword && newPassword.trim("")!==""){
      const hashedPassword =  await bcrypt.hash(newPassword,10)
      updateFields.password=hashedPassword
    }
     await userColl.updateOne(
      {_id: new ObjectId(userId)},
      {$set:updateFields}
    )
    if(updateFields.matchedCount===0){
      res.status(400).json({error:"user Not found"})
    }
    if(updateFields.modifiedCount===0){
      res.status(400).json({error:"no changes made"})
    }
  res.status(200).json({ message: "User info updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error while updating user" });
  }
})
//getting menu data
router.get("/menu-items",async(req,res)=>{
  try{
    const menuColl = dbcon.collection('menuItem');
    const menu = await menuColl.find({}).toArray()
    res.status(200).json(menu)
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
//getting menu data for edit
router.get("/menu/:id",async(req,res)=>{
  const itemId = req.params.id;
  if (!ObjectId.isValid(itemId)) {
    return res.status(400).json({ error: "Invalid item ID" });
  }
  try{
    const menuColl = dbcon.collection('menuItem');
    const item = await menuColl.findOne({_id: new ObjectId(itemId)})
    res.status(200).json({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      availability: item.availability,
    })
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
// posting edited data
router.put("/menu/edit/:id",upload.single("image"),async(req,res)=>{
  const itemId = req.params.id
  const {name,price,description,category}= req.body
  const updateData = {
    name,
    category,
    price: parseFloat(price),
    description,
  };

  if (req.file) {
    updateData.image = req.file.path;
  }
try {
    await dbcon.collection("menuItem").updateOne(
      { _id: new ObjectId(itemId) },
      { $set: updateData }
    );
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update item" });
  } 
})
//deleting menu data
router.delete("/del-menu/:id",async(req,res)=>{
  const menuId = req.params.id
  if (!ObjectId.isValid(menuId)) {
    return res.status(400).json({ error: "Invalid menu ID" });
  }
  try {
    const menuColl = dbcon.collection("menuItem");
    const menu = await menuColl.deleteOne({_id: new ObjectId(menuId)})
    if(menu.deletedCount ===0){
      return res.status(404).json({ error: 'Items  not found' });
    }
    res.status(200).json({message:"items successfully deleted"})
  }catch(err){
    console.error('Error deleting order:', err);
    res.status(500).json({error:err.message})
  }
})
//adding menu data
router.post("/menu/add", upload.single("image"), async (req, res) => {
  const { name, category, price, description } = req.body;

 const imageUrl = req.file?.path || req.file?.url; // safer to check both

    if (!imageUrl) {
      return res.status(400).json({ error: "Image upload failed or missing" });
    }
    console.log("Saving image URL to DB:", imageUrl);

  try {
    const menuColl = dbcon.collection("menuItem");
    await menuColl.insertOne({
      name,
      price: parseInt(price),
      description,
      category,
      image: imageUrl,   
      availability: true,
    });

    res.status(201).json({ message: "Menu item added successfully" });
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// deleting table booking data
router.delete("/del-booking/:id",async(req,res)=>{
  const bookingId = req.params.id
  if(!ObjectId.isValid(bookingId)) return res.status(400).json({error:"invalid booking id"});
  try{
    const bookingColl = dbcon.collection("bookings")
    const bookings = await bookingColl.deleteOne({_id: new ObjectId(bookingId)})
    if(bookings.deletedCount===0){
      return res.status(404).json({error:"booking not found"});
    }
    res.status(200).json({messege:"item deleted successfully"})
  }catch(err){
    console.log("error deleting bookings",err);
    res.status(500).json({error:err.message})
  }
})
// getting table bookiongs data
router.get("/bookings", async (req, res) => {
  try {
    const bookingColl = dbcon.collection("bookings");
    const tableColl = dbcon.collection("tables");

    const bookings = await bookingColl.find({}).toArray();
    const tables = await tableColl.find({}).toArray();

    const combined = bookings.map((booking) => {
      const tableInfo = tables.find((t) => t.tableNo === booking.table);
      return {
        ...booking,
        tableInfo: tableInfo || null,
      };
    });

    res.status(200).json(combined);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//getting booking data for edit
router.get('/editbooking/:id',async(req,res)=>{
  const bookingsId = req.params.id
  if(!ObjectId.isValid(bookingsId)) return res.status(400).json({ error: "Invalid booking ID" });
  try{
    const bookingColl = dbcon.collection("bookings")
    const booking = await bookingColl.findOne({_id: new ObjectId(bookingsId)})
    res.status(200).json({
      name:booking.name,
      phonenumber:booking.phonenumber,
      date:booking.date,
      entrytime:booking.entrytime,
      exittime:booking.exittime,
      guest:booking.guest,
      table:booking.table
    })
  }catch(err){
    res.status(500).json({error:err.message})
  }

})
/// putting uopdated booking data
router.put("/editbooking/:id", async (req, res) => {
  const bookingId = req.params.id;

  if (!ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  const { name, phonenumber, date, entrytime, exittime, guest, table } = req.body;

  if (!name || !phonenumber || !date || !entrytime || !exittime || !guest || !table) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const updateData = {
    name,
    phonenumber,
    date,
    entrytime,
    exittime,
    guest,
    table: parseInt(table),
  };

  try {
    const bookingColl = dbcon.collection("bookings");
    const result = await bookingColl.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Booking not found or no change" });
    }

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (err) {
    console.error("Update failed:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/// creating admin
router.post("/createadmin",async(req,res)=>{
  const {name,number,password}= req.body;
  try{
    const admincollection = dbcon.collection("admin");
    const adminExit = await admincollection.findOne({number});
    if(adminExit) return res.status(400).json({error:"account alredy exits"});
    const hashingPass = await bcrypt.hash(password,10);
    const newAdmin = {name,number,password:hashingPass};
    await admincollection.insertOne(newAdmin)
    res.status(201).json({message:"admin created successfully"})
  }catch(err){
    res.status(500).json({error:err.message})
  }
});
///admin login
router.post("/adminlogin",async(req,res)=>{
  const {number,password}=req.body;
  try{
    const admincollection = dbcon.collection("admin");
    const admin = await admincollection.findOne({number});
    if(!admin) return res.status(400).json({error:"admin not found"});
    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch) return res.status(400).json({error:"invalid password"});
    const token = jwt.sign({id:admin._id,number:admin.number},JWT_SECRET,{expiresIn:"9h"});
    res.status(200).json({message:"login successful", token,admin:{number:admin.number}});
  }catch(err){
    res.status(500).json({error:err.message})
  }
})
app.use('/api', router);

