import { TalentData } from "../Models/Talent";
import { ITalentBuilder } from "./ITalentBuilder";

export interface ITalentTreeBuilder {
    title: string;
    talentPoints: number;
    backgroundImage: string;

    AddTalent(x: number, y: number, talentData: TalentData): ITalentBuilder;
    AddMultirankTalent(x: number, y: number, maxRank: number, talentDataBuilder: (level: number) => TalentData): ITalentTreeBuilder;
    SetColumnsRows(columns: number, rows: number): void;
}