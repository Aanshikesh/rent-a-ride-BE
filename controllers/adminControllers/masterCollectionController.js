import mongoose, { disconnect } from "mongoose";
import MasterData from '../../models/masterDataModel.js'
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from "../../utils/error.js";

const dummyData = [

   // delhi
{ id: uuidv4(), district: 'Delhi', location: 'connaught place : metro station', type: 'location' },
{ id: uuidv4(), district: 'Delhi', location: 'dwarka sector 21 : metro station', type: 'location' },
{ id: uuidv4(), district: 'Delhi', location: 'karol bagh : skoda service', type: 'location' },
{ id: uuidv4(), district: 'Delhi', location: 'saket : volkswagen service', type: 'location' },
{ id: uuidv4(), district: 'Delhi', location: 'anand vihar : railway station', type: 'location' },

// noida
{ id: uuidv4(), district: 'Noida', location: 'sector 18 : metro station', type: 'location' },
{ id: uuidv4(), district: 'Noida', location: 'sector 62 : skoda service', type: 'location' },
{ id: uuidv4(), district: 'Noida', location: 'sector 63 : volkswagen service', type: 'location' },
{ id: uuidv4(), district: 'Noida', location: 'jewar : airport', type: 'location' },

// ghaziabad
{ id: uuidv4(), district: 'Ghaziabad', location: 'kaushambi : metro station', type: 'location' },
{ id: uuidv4(), district: 'Ghaziabad', location: 'vaishali : metro station', type: 'location' },
{ id: uuidv4(), district: 'Ghaziabad', location: 'indirapuram : skoda service', type: 'location' },
{ id: uuidv4(), district: 'Ghaziabad', location: 'mohan nagar : volkswagen service', type: 'location' },

// lucknow
{ id: uuidv4(), district: 'Lucknow', location: 'charbagh : railway station', type: 'location' },
{ id: uuidv4(), district: 'Lucknow', location: 'amausi : airport', type: 'location' },
{ id: uuidv4(), district: 'Lucknow', location: 'gomti nagar : skoda service', type: 'location' },
{ id: uuidv4(), district: 'Lucknow', location: 'alambagh : metro station', type: 'location' },

// kanpur
{ id: uuidv4(), district: 'Kanpur', location: 'kanpur central : railway station', type: 'location' },
{ id: uuidv4(), district: 'Kanpur', location: 'kalyanpur : metro station', type: 'location' },
{ id: uuidv4(), district: 'Kanpur', location: 'govind nagar : skoda service', type: 'location' },

// agra
{ id: uuidv4(), district: 'Agra', location: 'agra cantt : railway station', type: 'location' },
{ id: uuidv4(), district: 'Agra', location: 'kheria : airport', type: 'location' },
{ id: uuidv4(), district: 'Agra', location: 'sikandra : volkswagen service', type: 'location' },

// varanasi
{ id: uuidv4(), district: 'Varanasi', location: 'varanasi junction : railway station', type: 'location' },
{ id: uuidv4(), district: 'Varanasi', location: 'lal bahadur shastri : airport', type: 'location' },
{ id: uuidv4(), district: 'Varanasi', location: 'sigra : skoda service', type: 'location' },

    

    //cars


    //alto
    { id: uuidv4(), model: 'Alto 800', variant: 'manual', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'Alto 800', variant: 'automatic', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'SKODA SLAVIA PETROL AT', variant: 'automatic', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'NISSAN MAGNITE PETROL MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'SKODA KUSHAQ Petrol MT', variant: 'manual', type: 'car' , brand:'skoda' },
    { id: uuidv4(), model: 'SKODA KUSHAQ Petrol AT', variant: 'automatic', type: 'car' , brand:'skoda' },
    { id: uuidv4(), model: 'MG HECTOR Petrol MT', variant: 'manual', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR Petrol AT', variant: 'automatic', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR Diesel MT', variant: 'manual', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'NISSAN TERRANO Diesel MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'NISSAN KICKS Petrol MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'NISSAN KICKS Petrol AT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'VW TAIGUN Petrol MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'NISSAN MAGNITE Petrol MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'HYUNDAI ALCAZAR Diesel AT', variant: 'automatic', type: 'car' , brand:'hyundai' },
    { id: uuidv4(), model: 'CITROEN C3 Petrol MT', variant: 'automatic', type: 'car' , brand:'citroen' },
    { id: uuidv4(), model: 'ISUZU MUX Diesel AT', variant: 'automatic', type: 'car' , brand:'isuzu' },
    { id: uuidv4(), model: 'MG HECTOR PLUS Petrol MT', variant: 'manual', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR PLUS Petrol AT', variant: 'automatic', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR PLUS Diesel MT', variant: 'manual', type: 'car' , brand:'mg' },


    { id: uuidv4(), model: 'MARUTI SWIFT Petrol AT', variant: 'automatic', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'DATSUN REDI GO Petrol MT', variant: 'manual', type: 'car' , brand:'DATSUN' },
    { id: uuidv4(), model: 'DATSUN REDI GO Petrol AT', variant: 'automatic', type: 'car' , brand:'DATSUN' },
    { id: uuidv4(), model: 'NISSAN MICRA Petrol MT', variant: 'automatic', type: 'car' , brand:'NISSAN' },
    { id: uuidv4(), model: 'VW AMEO Diesel MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'SKODA RAPID Petrol MT', variant: 'manual', type: 'car' , brand:'skoda' },
    { id: uuidv4(), model: 'MARUTI DZIRE Petrol MT', variant: 'manual', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'VW VENTO Petrol MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW VENTO Petrol AT', variant: 'automatic', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW VENTO Diesel AT', variant: 'automatic', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW POLO Petrol MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW POLO Petrol AT', variant: 'automatic', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW POLO Diesel MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    

    

  ];
  
  // Function to insert dummy data into the database
 export const insertDummyData = async (req, res, next) => {
    try {
        // Insert the dummy data into the collection
        await MasterData.insertMany(dummyData);
        res.status(200).json({ message: 'Dummy data inserted successfully.' });
        console.log('Dummy data inserted successfully.');
    } catch (error) {
        console.error('Error inserting dummy data:', error);
        // if data already exists, still return success
        if (error.code === 11000) {
          return res.status(200).json({ message: 'Dummy data already exists or inserted.' });
        }
        next(errorHandler(500, 'Error inserting dummy data'));
    }
  };

//app product modal data fetching from db
  export const getCarModelData = async (req,res,next)=> {
    try{
            const availableVehicleModels  = await MasterData.find()
            if(!availableVehicleModels){
                return next(errorHandler(404,"no model found"))
            }
            res.status(201).json(availableVehicleModels)
    }
    catch(error){
        next(errorHandler(500,{'could not get model Data':error}))
    }
  }
  

  


