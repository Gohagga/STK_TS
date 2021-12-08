import { Unit } from "w3ts/handles/unit";

type TalentDependencies = Partial<Record<'left' | 'up' | 'right' | 'down', number>>;

export type AllocationEvent = {
    unit: Unit,
};
export type ActivationEvent = {
    unit: Unit,
};
export type RequirementsEvent = {
    unit: Unit,
};

export type TalentData = {
    Name?: string;
    Description?: string;
    Icon?: string;
    IconDisabled?: string;
    OnAllocate?: (this: void, event: AllocationEvent) => void;
    OnDeallocate?: (this: void, event: AllocationEvent) => void;
    OnActivate?: (this: void, event: ActivationEvent) => void;
    OnDeactivate?: (this: void, event: ActivationEvent) => void;
    Requirements?: (this: void, event: RequirementsEvent) => [boolean, string?];
    Dependency?: TalentDependencies;
    Characteristics?: {Image?: string, Text?: string}[]
    StartingLevel?: number;
    Cost?: number;
    IsLink?: boolean;
    Tag?: any;
}

export class Talent {
    
    public readonly name: string = "";
    public readonly description: string = "";
    public iconEnabled: string = "";
    public iconDisabled: string = "";

    public readonly onAllocate: ((this: void, event: AllocationEvent) => void) | null = null;
    public readonly onDeallocate: ((this: void, event: AllocationEvent) => void) | null = null
    public readonly onActivate: ((this: void, event: ActivationEvent) => void) | null = null
    public readonly onDeactivate: ((this: void, event: ActivationEvent) => void) | null = null
    public readonly requirements: ((this: void, event: RequirementsEvent) => [boolean, string?]) | null = null

    public cost: number = 0;
    public dependency: TalentDependencies = {};
    public characteristics: {Image?: string, Text?: string}[] = [];
    public isLink: boolean = false;
    public isFinalDescription: boolean = false;

    private _nextRank?: Talent;
    private _previousRank?: Talent;
    private _maxRank: number = 1;
    public tag: any;

    constructor(data?: TalentData) {
        if (data) {
            if (data.Name)                      this.name = data.Name;
            if (data.Description)               this.description = data.Description;
            if (data.Icon)              this.iconBtn = data.Icon;
            if (data.IconDisabled)      this.iconDisabled = data.IconDisabled;
            if (data.OnActivate)        this.onActivate = data.OnActivate;
            if (data.OnDeactivate)      this.onDeactivate = data.OnDeactivate;
            if (data.OnAllocate)        this.onAllocate = data.OnAllocate;
            if (data.OnDeallocate)      this.onDeallocate = data.OnDeallocate;

            if (data.Requirements)      this.requirements = data.Requirements;
            if (data.Dependency)        this.dependency = data.Dependency;
            if (data.IsLink)            this.isLink = data.IsLink;
            if (data.Characteristics)   this.characteristics = data.Characteristics;
            if (data.Cost)              this.cost = data.Cost;
            if (data.Tag)               this.tag = data.Tag;
        }
    }

    private set icon(v: string) {
        this.iconEnabled = v;
        [this.iconDisabled] = string.gsub(v, "CommandButtons\\", "CommandButtonsDisabled\\DIS");
        if (this.iconDisabled == v) this.iconDisabled = 'ReplaceableTextures\\CommandButtonsDisabled\\DIS' + v;
    }

    private set iconBtn(v: string) {
        this.iconEnabled = "ReplaceableTextures\\CommandButtons\\BTN" + v
        this.iconDisabled = "ReplaceableTextures\\CommandButtonsDisabled\\DISBTN" + v
    }

    public get nextRank(): Talent | null {
        return this._nextRank || null;
    }

    public get prevRank(): Talent | null {
        return this._previousRank || null;
    }

    public get maxRank(): number {
        return this._maxRank;
    }

    public SetNextRank(talent: Talent): void {
        this._nextRank = talent;
        talent._previousRank = this;
    }

    public SetLastRank(talent: Talent): void {
        if (this._nextRank) {
            this._nextRank.SetLastRank(talent);
            return;
        }
        this.SetNextRank(talent);
    }

    public UpdateMaxRank(): void {

        let maxRank = 1;

        let t: Talent = this;
        while (t._previousRank && t._previousRank.isFinalDescription == false) {
            maxRank++;
            t = t._previousRank;
        }
        let firstTalent = t;

        t = this;
        while (t._nextRank && t._nextRank.isFinalDescription == false) {
            maxRank++;
            t = t._nextRank;
        }

        this._maxRank = maxRank;
        t = firstTalent;
        while (t._nextRank) {
            t = t._nextRank;
            t._maxRank = maxRank;
        }
    }

    private CreateTalentFinalDescription(): Talent {
        let final = new Talent({
            Name: this.name,
            Description: this.description,
            Dependency: this.dependency,
            Cost: 0,
            IsLink: false,
        });

        final.isFinalDescription = true;
        final.iconEnabled = this.iconEnabled;
        final.iconDisabled = this.iconDisabled;

        final._maxRank = this._maxRank;
        return final;
    }

    public SetTalentFinalDescription(): void {
        if (this._nextRank && this._nextRank.isFinalDescription == false) {
            this._nextRank.SetTalentFinalDescription();
            return;
        }

        let final = this.CreateTalentFinalDescription();
        this.SetNextRank(final);
    }

    public RemoveTalentFinalDescription(): void {
        if (this._nextRank && this._nextRank.isFinalDescription) {
            this._nextRank = undefined;
            return;
        } else if (this._nextRank) {
            this._nextRank.RemoveTalentFinalDescription();
        }
    }
}