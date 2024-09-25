import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect('mongodb+srv://dewanganvikas192:Fm9rnKKKPW42uABd@cluster0.35soq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connectiono Error : ", error);
    process.exit(1);
  }
};

export default connectDB;
