import { Frame } from "w3ts/handles/frame";
import { CharacteristicView, ITalentView } from "../Interfaces/ITalentView";

const cachedViews: Record<string, ITalentView> = {};

export function GenerateBasicTalentView(cfg: IBasicTalentViewConfig, parent: Frame, index: string): ITalentView {

    if (index in cachedViews) return cachedViews[index];

    const linkIntersection = Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "LinkIntersection", parent.handle, "", 0));
    const links = [
        Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "LeftLink", parent.handle, "", 0)),
        Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "UpLink", parent.handle, "", 0)),
        Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "RightLink", parent.handle, "", 0)),
        Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "DownLink", parent.handle, "", 0)),
        linkIntersection
    ];

    const highlight = Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "AvailableImage", parent.handle, "", 0));
    const buttonMain = new Frame("ScoreScreenBottomButtonTemplate", parent, 0, 0);
    const buttonImage = Frame.fromName("ScoreScreenButtonBackdrop", 0);
    const toolBox = new Frame("ListBoxWar3", buttonMain, 0, 0);
    const titleText = Frame.fromHandle(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", toolBox.handle, "StandardInfoTextTemplate", 0));
    const descText = Frame.fromHandle(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", toolBox.handle, "StandardInfoTextTemplate", 0));
    const titleDescSpace = Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "LineBreak", toolBox.handle, "", 0));
    const rankImage = Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "Counter", buttonMain.handle, "", 0));
    const rankText = Frame.fromHandle(BlzCreateFrameByType("TEXT", "FaceFrameTooltip", buttonMain.handle, "", 0));
    const toolRank = Frame.fromHandle(BlzCreateFrameByType("TEXT", "FaceFrameTooltip", toolBox.handle, "", 0));
    

    buttonMain.setTooltip(toolBox);
    BlzFrameSetTextAlignment(rankText.handle, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE);
    BlzFrameSetTextAlignment(toolRank.handle, TEXT_JUSTIFY_TOP, TEXT_JUSTIFY_RIGHT);

    buttonMain.setPoint(FramePoint.C, parent, FramePoint.C, 0, 0)
        .setSize(cfg.buttonWidth, cfg.buttonHeight)
        .setLevel(2);

    toolBox
        .setPoint(FramePoint.TL, parent, FramePoint.TR, 0, 0)
        .setSize(cfg.tooltip.width, cfg.tooltip.height);

    titleText
        .clearPoints()
        .setPoint(FramePoint.TL, toolBox, FramePoint.TL, cfg.tooltip.title.x + cfg.tooltip.title.paddingHorizontal, cfg.tooltip.title.y - cfg.tooltip.title.paddingVertical)
        // .setPoint(FramePoint.TR, toolBox, FramePoint.TR, cfg.tooltip.title.x - cfg.tooltip.title.paddingHorizontal, cfg.tooltip.title.y - cfg.tooltip.title.paddingVertical)
        .setSize(toolBox.width - cfg.tooltip.title.paddingHorizontal * 2, 0)
        .text = "Title";

    titleDescSpace
        .clearPoints()
        .setPoint(FramePoint.T, titleText, FramePoint.B, 0, 0)
        .setSize(toolBox.width, cfg.tooltip.characteristics.heightSpace)
        .setTexture("UI/Widgets/EscMenu/Human/blank-background.blp", 0, true);

    let descTextX = cfg.tooltip.description.x + cfg.tooltip.description.paddingHorizontal;
    let descTextY = cfg.tooltip.description.y - cfg.tooltip.description.paddingVertical;
    descText
        .clearPoints()
        .setPoint(FramePoint.TL, titleDescSpace, FramePoint.BL, descTextX, descTextY)
        // .setPoint(FramePoint.TR, titleDescSpace, FramePoint.BR, cfg.tooltip.description.x - cfg.tooltip.description.paddingHorizontal, cfg.tooltip.description.y - cfg.tooltip.description.paddingVertical)
        .setSize(toolBox.width - cfg.tooltip.description.paddingHorizontal * 2, 0)
        .setHeight(0)
        .text = cfg.tooltip.defaultText;

    rankImage
        .setPoint(FramePoint.BR, buttonMain, FramePoint.BR, cfg.rank.x, cfg.rank.y)
        .setSize(cfg.rank.size.width, cfg.rank.size.height)
        .setTexture(cfg.rank.texture, 0, true);
    
    rankText
        .clearPoints()
        .setPoint(FramePoint.TL, rankImage, FramePoint.TL, 0, 0)
        .setPoint(FramePoint.BR, rankImage, FramePoint.BR, 0, 0)
        .setSize(0.01, 0.012)
        .setScale(cfg.rank.textScale)
        .text = "0";
    BlzFrameSetTextAlignment(rankText.handle, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE);
    
    highlight
        .setPoint(FramePoint.C, buttonMain, FramePoint.C, 0, 0)
        .setSize(cfg.highlight.width, cfg.highlight.height)
        .setTexture(cfg.highlight.texture, 0, true);

    buttonImage
        .setTexture(cfg.buttonTexture, 0, true);
    
    toolRank
        .clearPoints()
        .setPoint(FramePoint.T, toolBox, FramePoint.T, 0.0, -0.015)
        .setSize(cfg.tooltip.width - 0.03, cfg.tooltip.height - 0.03)
        .text = "Rank 1/3";

    for (let link of links) {
        link
            .setPoint(FramePoint.C, buttonMain, FramePoint.C, 0, 0)
            .setSize(cfg.link.width, cfg.link.width)
            .setTexture(cfg.link.inactiveTexture, 0, true)
            .setLevel(1)
            .visible = false;
    }

    let renderView = (hideCharacteristics: boolean) => {
        print("Render view", hideCharacteristics);
        if (hideCharacteristics)
            titleDescSpace
                .setPoint(FramePoint.T, titleText, FramePoint.B, 0, cfg.tooltip.characteristics.height - cfg.tooltip.characteristics.y);
        else
            titleDescSpace
                .setPoint(FramePoint.T, titleText, FramePoint.B, 0, 0);
        descText
            .setPoint(FramePoint.TL, titleDescSpace, FramePoint.BL, descTextX, descTextY);
    }

    const retVal: ITalentView = {
        button: {
            main: buttonMain,
            image: buttonImage
        },
        tooltip: {
            box: toolBox,
            titleText: titleText,
            descriptionText: descText,
            rank: toolRank,
            titleDescSpace,
            characteristicFactory: (i: string) => GetTalentCharacteristicView(i, cachedViews[index], cfg.tooltip.characteristics),
            renderView: (hideCharacteristics: boolean) => renderView(hideCharacteristics)
        },
        rank: {
            image: rankImage,
            text: rankText
        },
        highlight: highlight,
        links: {
            left: links[0],
            up: links[1],
            right: links[2],
            down: links[3],
        },
        linkIntersection,
        characteristicViews: {}
    }
    cachedViews[index] = retVal;
    return retVal;
}

let abc = 0;

function GetTalentCharacteristicView(
    key: string,
    view: {
        tooltip: { titleDescSpace: Frame },
        characteristicViews: Record<string, CharacteristicView>
    },
    cfg: {
        x: number,
        y: number,
        width: number
        height: number,
        textScale: number,
}): { image: Frame, text: Frame } {
    
    if (key in view.characteristicViews) return view.characteristicViews[key];
    
    const index = Number(key);
    const image =
        Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "TooltipCharacteristicImage", view.tooltip.titleDescSpace.handle, "", index))
        .clearPoints();
    const text =
        Frame.fromHandle(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", view.tooltip.titleDescSpace.handle, "StandardInfoTextTemplate", index))
        .clearPoints();

    if (index == 0) {
        image.setPoint(FramePoint.TL, view.tooltip.titleDescSpace, FramePoint.TL, cfg.x, cfg.y);
    } else {
        const prev = GetTalentCharacteristicView((index - 1).toString(), view, cfg);
        image.setPoint(FramePoint.L, prev.text, FramePoint.R, 0.001, 0);
    }

    image.setSize(cfg.width, cfg.height);
    text
        .setPoint(FramePoint.L, image, FramePoint.R, 0.001, 0)
        .setSize(0, cfg.height)
        .setScale(cfg.textScale);
    BlzFrameSetTextAlignment(text.handle, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE);    
    
    const retVal = {
        image,
        text
    }
    view.characteristicViews[key] = retVal;
    return retVal;
}

export interface IBasicTalentViewConfig {
    buttonWidth: number,
    buttonHeight: number,
    buttonTexture: string,
    tooltip: {
        width: number,
        height: number,
        title: {
            x: number,
            y: number,
            paddingHorizontal: number,
            paddingVertical: number,
        },
        description: {
            x: number,
            y: number,
            paddingHorizontal: number,
            paddingVertical: number,
        },
        defaultText: string,
        characteristics: {
            heightSpace: number,
            x: number,
            y: number,
            width: number
            height: number,
            textScale: number,
        }
    },
    rank: {
        x: number,
        y: number,
        size: {
            width: number,
            height: number
        },
        texture: string,
        textScale: number,
    },
    highlight: {
        width: number,
        height: number,
        texture: string
    },
    link: {
        width: number,
        activeTexture: string,
        inactiveTexture: string,
    },
}

const FramePoint = {
    C: FRAMEPOINT_CENTER,
    T: FRAMEPOINT_TOP,
    B: FRAMEPOINT_BOTTOM,
    TL: FRAMEPOINT_TOPLEFT,
    TR: FRAMEPOINT_TOPRIGHT,
    BL: FRAMEPOINT_BOTTOMLEFT,
    BR: FRAMEPOINT_BOTTOMRIGHT,
    L: FRAMEPOINT_LEFT,
    R: FRAMEPOINT_RIGHT,
}