import { Unit } from "w3ts";
import { TalentData } from "../Models/Talent";

export interface ITalentBuilder {
    NextRank: (next: TalentData) => ITalentBuilder
}
