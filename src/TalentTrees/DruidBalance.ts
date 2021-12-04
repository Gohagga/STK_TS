import { ITalentTreeBuilder } from "UI/STK/Interfaces/ITalentTreeBuilder";
import { ActivationEvent, Talent } from "UI/STK/Models/Talent";
import { TalentTree } from "../UI/STK/Models/TalentTree";

export class DruidBalance extends TalentTree {

    get talentPoints(): number {
        return this.ownerPlayer.getState(PLAYER_STATE_RESOURCE_LUMBER);
    }
    set talentPoints(value: number) {
        this.ownerPlayer.setState(PLAYER_STATE_RESOURCE_LUMBER, value)
    }

    // // Overriden stub methods ==================================================
    // GetTalentPoints(nothing returns integer
    //     return GetPlayerState(this.ownerPlayer, PLAYER_STATE_RESOURCE_LUMBER)
    // }

    // SetTalentPoints(integer points {
    //     SetPlayerState(this.ownerPlayer, PLAYER_STATE_RESOURCE_LUMBER, points)
    //     // STK_UpdateTalentViews(this.ownerPlayer)
    // }

    // GetTitle(nothing returns string
    //     return this.title
    // }
    // =========================================================================

    public Initialize(builder: ITalentTreeBuilder): void {

        builder.SetColumnsRows(4, 7)
        builder.title = "Balance";
        builder.talentPoints = 6;
        builder.backgroundImage = "balancebg.blp";

        // The tree should be built with talents here
        // ==============================================

        // Improved Wrath <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Rank 1
        builder.AddTalent(0, 6, {
            Name: "Improved Wrath",
            Description: "Reduces the cast time of your Wrath spell by 0.1 sec.",
            Icon: "spell_nature_abolishmagic",
            OnActivate: (e) => this.Activate_CallSheep(e),

        }).NextRank({
            // Rank 2
            Name: "Improved Wrath",
            Description: "Reduces the cast time of your Wrath spell by 0.2 sec.",
            Icon: "spell_nature_abolishmagic",
            OnActivate: (e: ActivationEvent) => this.Activate_CallSheep(e),

        }).NextRank({
            // Rank 3
            Name: "Improved Wrath",
            Description: "Reduces the cast time of your Wrath spell by 0.3 sec.",
            Icon: "spell_nature_abolishmagic",
            OnActivate: (e: ActivationEvent) => this.Activate_CallSheep(e),

        }).NextRank({
            // Rank 4
            Name: "Improved Wrath",
            Description: "Reduces the cast time of your Wrath spell by 0.4 sec.",
            Icon: "spell_nature_abolishmagic",
            OnActivate: (e: ActivationEvent) => this.Activate_CallSheep(e),

        }).NextRank({
            // Rank 5
            Name: "Improved Wrath",
            Description: "Reduces the cast time of your Wrath spell by 0.5 sec.",
            Icon: "spell_nature_abolishmagic",
            OnActivate: (e: ActivationEvent) => this.Activate_CallSheep(e),
        });

        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Nature's Grasp <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(1, 6, {

            Name: "Nature's Grasp",
            Description: "While active, any time an enemy strikes the caster they have a 35% chance to become afflicted by Entangling Roots (Rank 1).  Only useable outdoors.  1 charge.  Lasts 45 sec.",
            Icon: "spell_nature_natureswrath",
            OnActivate: (e) => this.Activate_CallFlyingSheep(e),
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Improved Nature's Grasp <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(2, 6, 4, lvl => {
            const entangleChanceBonus = [15, 30, 45, 65];
            return {
                Name: "Improved Nature's Grasp",
                Description: `Increases the chance for your Nature's Grasp to entangle an enemy by ${entangleChanceBonus[lvl-1]}%.`,
                Icon: "spell_nature_natureswrath",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
                Dependency: { left: 1 },
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Improved Entangling Roots <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(0, 5, 3, lvl => {
            const chance = [40, 70, 100];
            return {
                Name: "Improved Entangling Roots",
                Description: `Gives you a ${chance[lvl-1]}% chance to avoid interruption caused by damage while casting Entangling Roots.`,
                Icon: "EntanglingRoots",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Improved Moonfire <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(1, 5, 5, lvl => {
            return {
                Name: "Improved Moonfire",
                Description: `Increases the damage and critical strike chance of your Moonfire spell by ${lvl * 2}%.`,
                Icon: "Starfall",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Natural Weapons <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(2, 5, 5, lvl => {
            return {
                Name: "Natural Weapons",
                Description: `Increases the damage you deal with physical attacks in all forms by ${lvl * 2}%.`,
                Icon: "AdvancedStrengthOfTheMoon",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Natural Shapeshifter <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(3, 5, 3, lvl => {
            return {
                Name: "Natural Shapeshifter",
                Description: `Reduces the mana cost of all shapeshifting by ${lvl * 10}%.`,
                Icon: "WispSplode",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Improved Thorns <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(0, 4, 3, lvl => {
            return {
                Name: "Improved Thorns",
                Description: `Increases damage caused by your Thorns spell by ${lvl * 25}%.`,
                Icon: "Thorns",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        // Link >>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(1, 4, {
            Name: "Link",
            Description: "Links",
            Dependency: { up: 5 },
            IsLink: true
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        // Omen of Clarity <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(2, 4, {
            Name: "Omen of Clarity",
            Description: "Imbues the Druid with natural energy.  Each of the Druid's melee attacks has a chance of causing the caster to enter a Clearcasting state.  The Clearcasting state reduces the Mana, Rage or Energy cost of your next damage or healing spell or offensive ability by 100%.  Lasts 10 min.",
            Icon: "CrystalBall",
            OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            Dependency: { up: 5 },
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Nature's Reach <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(3, 4, 2, lvl => {
            return {
                Name: "Nature's Reach",
                Description: `Increases the range of your Wrath, Entangling Roots, Faerie Fire, Moonfire, Starfire, and Hurricane spells by ${lvl * 10}%.`,
                Icon: "spell_nature_naturetouchgrow",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Vengeance <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(1, 3, 5, lvl => {
            return {
                Name: "Vengeance",
                Description: `Increases the critical strike damage bonus of your Starfire, Moonfire, and Wrath spells by ${lvl * 20}%.`,
                Icon: "Purge",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
                Dependency: { up: 1 },
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Improved Starfire <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(2, 3, 5, lvl => {
            return {
                Name: "Improved Starfire",
                Description: `Reduces the cast time of Starfire by ${lvl * 0.1} sec and has a 3% chance to stun the target for 3 sec.`,
                Icon: "spell_arcane_starfire",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Nature's Grace <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(1, 2, {
            Name: "Nature's Grace",
            Description: "All spell criticals grace you with a blessing of nature, reducing the casting time of your next spell by 0.5 sec.",
            Icon: "NaturesBlessing",
            OnActivate: (e) => this.Activate_CallFlyingSheep(e),
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Moonglow <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(2, 2, 3, lvl => {
            return {
                Name: "Moonglow",
                Description: `Reduces the Mana cost of your Moonfire, Starfire, Wrath, Healing Touch, Regrowth and Rejuvenation spells by ${lvl * 3}%.`,
                Icon: "Sentinel",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Moonfury <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddMultirankTalent(1, 1, 5, lvl => {
            return {
                Name: "Moonfury",
                Description: `Increases the damage done by your Starfire, Moonfire and Wrath spells by ${lvl * 2}%.`,
                Icon: "spell_nature_moonglow",
                OnActivate: (e) => this.Activate_CallFlyingSheep(e),
                Dependency: { up: 1 },
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Moonkin Form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(1, 0, {
            Name: "Moonkin Form",
            Description: "Transforms the Druid into Moonkin Form.  While in this form the armor contribution from items is increased by 360% and all party members within 30 yards have their spell critical chance increased by 3%.  The Moonkin can only cast Balance spells while shapeshifted.\n\nThe act of shapeshifting frees the caster of Polymorph and Movement Impairing effects.",
            Icon: "spell_nature_forceofnature",
            OnActivate: (e) => this.Activate_CallFlyingSheep(e),
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        // Only need to this if some talents start with certain rank
        // this.SaveTalentRankState()
    }


    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Can use these methods inside Activate/Deactivate/Allocate/Deallocate/Requirements functions

    // Returns unit that owns the talent tree
    // static GetEventUnit(nothing returns unit
    // thistype.GetEventUnit()

    // Returns talent object that is being resolved
    // static GetEventTalent(nothing returns STKTalent_Talent
    // thistype.GetEventTalent()

    // Returns rank of the talent that is being activated
    // static GetEventRank(nothing returns integer
    // thistype.GetEventRank()

    // Returns "this"
    // static GetEventTalentTree(nothing returns TalentTree
    // thistype.GetEventTalentTree()

    // Needs to be called within Requirements function to disable the talent
    // static SetTalentRequirementsResult(string requirements {
    // thistype.SetTalentRequirementsResult("8 litres of milk",

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    Activate_CallSheep(e: ActivationEvent): void {
        // let u = thistype.GetEventUnit()
        // CreateUnit(GetOwningPlayer(u), 'nshe', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    }

    Activate_CallFlyingSheep(e: ActivationEvent) {
        // local unit u = thistype.GetEventUnit()
        // CreateUnit(GetOwningPlayer(u), 'nshf', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    }

    // static Activate_GainApprentice(nothing {
    //     local unit u = thistype.GetEventUnit()
    //     CreateUnit(GetOwningPlayer(u), 'hpea', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    // }

    // static Activate_Gain2Guards(nothing {
    //     local unit u = thistype.GetEventUnit()
    //     CreateUnit(GetOwningPlayer(u), 'hfoo', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //     CreateUnit(GetOwningPlayer(u), 'hfoo', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    // }

    // static Activate_ComingOfTheLambs(nothing {
    //     local unit u = thistype.GetEventUnit()
    //     local integer i = thistype.GetEventRank()
    //     loop
    //         exitwhen i <= 0
    //         CreateUnit(GetOwningPlayer(u), 'nshe', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //         CreateUnit(GetOwningPlayer(u), 'nshf', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //         i = i - 1
    //     endloop
    // }

    // static Activate_CallOfTheWilds(nothing {
    //     local unit u = thistype.GetEventUnit()
    //     local integer i = 0
    //     loop
    //         exitwhen i > 5
    //         CreateUnit(Player(PLAYER_NEUTRAL_AGGRESSIVE), 'nwlt', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //         i = i + 1
    //     endloop
    // }

    // static IsEnumUnitSheepFilter(nothing returns boolean
    //     return GetUnitTypeId(GetFilterUnit()) == 'nshe' or GetUnitTypeId(GetFilterUnit()) == 'nshf'
    // }

    // Requirement_CallOfTheWilds() {
    //     local unit u = thistype.GetEventUnit()
    //     local group g = CreateGroup()
    //     GroupEnumUnitsInRange(g, GetUnitX(u), GetUnitY(u), 5000, Filter((e) => this.IsEnumUnitSheepFilter))
    //     if (CountUnitsInGroup(g) < 8) then
    //         thistype.SetTalentRequirementsResult("8 nearby sheep",
    //     }
    // }
}