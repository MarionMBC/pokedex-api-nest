import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//Mongo le agrega la S

@Schema()
export class Pokemon extends Document {
    //id: nombgo ya me lo da
    
    @Prop(
        {
            unique: true,
            index: true
        }
    )
    name:string;
    @Prop(
        {
            unique: true,
            index: true
        }
    )
    no: number;
}   


export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
