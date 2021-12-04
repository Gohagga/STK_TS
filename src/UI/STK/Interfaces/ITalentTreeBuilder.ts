import { TalentData } from "../Models/Talent";
import { ITalentBuilder } from "./ITalentBuilder";

export interface ITalentTreeBuilder {
    title: string;
    talentPoints: number;
    backgroundImage: string;

    AddTalent(x: number, y: number, talentData: TalentData): ITalentBuilder;
    SetColumnsRows(columns: number, rows: number): void;
}